import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformBadge } from '../common/Badge';
import { dashboardMetricsMap } from '../../mock/initialData';
import { formatCompactNumber } from '../../utils/helpers';
import { SocialPlatform, DateFilterRange } from '../../types';
import {
  Users,
  UserPlus,
  Send,
  TrendingUp,
  Building2,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  MoreHorizontal,
  LineChart,
  ChevronDown,
  Check,
} from 'lucide-react';

// ── Platform multiplier so per-channel numbers differ from "all channels" ──
const PLATFORM_FACTOR: Record<string, number> = {
  all: 1,
  instagram: 0.38,
  facebook: 0.28,
  linkedin: 0.18,
  tiktok: 0.10,
  youtube: 0.06,
};

type Granularity = 'Day' | 'Week' | 'Month' | 'Quarter';

// ── Generate impression time-series points for a given date range + granularity ──
function generateImpressionSeries(
  totalImpressions: number,
  dateFilter: string,
  platformFactor: number,
  granularity: Granularity
): { label: string; value: number }[] {
  const base = Math.round(totalImpressions * platformFactor);
  const now = new Date();

  const daysBack: Record<string, number> = {
    today: 1, yesterday: 1, '7days': 7, '30days': 30, '90days': 90, custom: 30,
  };
  const totalDays = daysBack[dateFilter] ?? 30;

  let points: number;
  let labelFn: (i: number) => string;

  if (granularity === 'Day') {
    if (dateFilter === 'today' || dateFilter === 'yesterday') {
      points = 24;
      const offset = dateFilter === 'yesterday' ? 1 : 0;
      labelFn = (i) => {
        const h = i % 12 === 0 ? 12 : i % 12;
        return `${h}${i < 12 ? 'am' : 'pm'}`;
      };
      void offset;
    } else {
      points = Math.min(totalDays, 30);
      labelFn = (i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (points - 1 - i));
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }).replace(',', "'");
      };
    }
  } else if (granularity === 'Week') {
    points = Math.max(2, Math.ceil(totalDays / 7));
    labelFn = (i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (totalDays - 1 - i * 7));
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }).replace(',', "'");
    };
  } else if (granularity === 'Month') {
    points = Math.max(2, Math.ceil(totalDays / 30));
    labelFn = (i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (points - 1 - i));
      return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(',', " '");
    };
  } else {
    points = Math.max(2, Math.ceil(totalDays / 90));
    labelFn = (i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (points - 1 - i) * 3);
      return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}`;
    };
  }

  // Shape: mostly-flat baseline with a sharp organic spike near the end
  const shape = Array.from({ length: points }, (_, i) => {
    const t = i / Math.max(points - 1, 1);
    const spike = Math.exp(-0.5 * Math.pow((t - 0.75) / 0.06, 2));
    const noise = 0.04 + Math.abs(Math.sin(i * 2.3 + 1) * 0.03 + Math.cos(i * 1.7) * 0.02);
    return noise + spike;
  });

  const shapeSum = shape.reduce((a, b) => a + b, 0);

  return shape.map((w, i) => ({
    label: labelFn(i),
    value: Math.round((w / shapeSum) * base),
  }));
}

// ── Smooth cubic bezier path (Catmull-Rom → bezier) ─────────────────────
function catmullRomToBezier(
  pts: { x: number; y: number }[],
  tension = 0.3
): string {
  if (pts.length < 2) return '';
  const d: string[] = [`M ${pts[0].x},${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
  }
  return d.join(' ');
}

// ── Impression Area Chart ──────────────────────────────────────────────────
interface ImpressionChartProps {
  series: { label: string; value: number }[];
  totalImpressions: number;
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

const ImpressionChart: React.FC<ImpressionChartProps> = ({
  series,
  totalImpressions,
  granularity,
  onGranularityChange,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredData, setHoveredData] = useState<{ value: number; label: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const W = 600;
  const H = 220;
  const PAD = { top: 20, right: 20, bottom: 40, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...series.map(d => d.value), 1);

  // Nice Y-axis ceiling
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const niceMax = Math.ceil(maxVal / magnitude) * magnitude;
  const yMax = Math.max(niceMax, 100);

  // Y ticks evenly spaced
  const tickStep = Math.ceil(yMax / 5 / magnitude) * magnitude || 100;
  const yTicks: number[] = [];
  for (let t = 0; t <= yMax + tickStep / 2; t += tickStep) {
    yTicks.push(t);
    if (t >= yMax) break;
  }

  const px = (i: number) =>
    PAD.left + (series.length <= 1 ? chartW / 2 : (i / (series.length - 1)) * chartW);
  const py = (v: number) => PAD.top + chartH - (v / yMax) * chartH;

  // Smooth bezier paths
  const svgPts = series.map((d, i) => ({ x: px(i), y: py(d.value) }));
  const linePath = catmullRomToBezier(svgPts);
  const areaPath = linePath
    ? `${linePath} L ${px(series.length - 1)},${PAD.top + chartH} L ${px(0)},${PAD.top + chartH} Z`
    : '';

  // X-axis label positions
  const xLabelIndices = new Set<number>([
    0,
    Math.floor(series.length * 0.25),
    Math.floor(series.length * 0.5),
    Math.floor(series.length * 0.75),
    series.length - 1,
  ]);

  const granularityOptions: Granularity[] = ['Day', 'Week', 'Month', 'Quarter'];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || series.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX - PAD.left;
    const idx = Math.max(0, Math.min(
      series.length - 1,
      Math.round((mouseX / chartW) * (series.length - 1))
    ));
    setHovered(idx);
    setHoveredData({ value: series[idx].value, label: series[idx].label });
  };

  const tooltipX = hovered !== null ? px(hovered) : 0;
  const tooltipY = hovered !== null ? py(series[hovered]?.value ?? 0) : 0;
  const tipW = 108;
  const tipH = 40;
  const tipX = Math.min(Math.max(tooltipX - tipW / 2, PAD.left), W - PAD.right - tipW);
  const tipY = tooltipY - tipH - 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Chart header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        {/* Title + info icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Post Impressions
          </h2>
          <span
            title="Total number of times your posts were displayed to users"
            style={{ color: 'var(--text-muted)', cursor: 'help', display: 'flex', alignItems: 'center' }}
          >
            <HelpCircle size={14} />
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Granularity dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 10px', borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
              }}
            >
              <LineChart size={14} />
              {granularity}
              <ChevronDown size={13} />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 200,
                backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                minWidth: '130px', overflow: 'hidden',
              }}>
                {granularityOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { onGranularityChange(opt); setDropdownOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '9px 14px', border: 'none',
                      backgroundColor: granularity === opt ? 'rgba(37,99,235,0.05)' : 'transparent',
                      cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                      color: 'var(--text-primary)', textAlign: 'left',
                    }}
                  >
                    {opt}
                    {granularity === opt && <Check size={14} color="#2563eb" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export icon */}
          <button
            title="Export chart"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px', borderRadius: '6px',
              border: '1px solid var(--border-subtle)', backgroundColor: '#ffffff',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <ExternalLink size={14} />
          </button>

          {/* More options */}
          <button
            title="More options"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px', borderRadius: '6px',
              border: '1px solid var(--border-subtle)', backgroundColor: '#ffffff',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* SVG Area Chart */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setHovered(null); setHoveredData(null); }}
        >
          <defs>
            <linearGradient id="impressionGradV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#22c55e" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Rotated Y-axis label */}
          <text
            x={14}
            y={PAD.top + chartH / 2}
            fontSize="9.5"
            fill="#94a3b8"
            textAnchor="middle"
            transform={`rotate(-90, 14, ${PAD.top + chartH / 2})`}
            fontWeight={500}
          >
            Number of Impressions
          </text>

          {/* Y-axis grid lines + tick labels */}
          {yTicks.map((tick) => {
            const y = py(tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke={tick === 0 ? '#cbd5e1' : '#e2e8f0'}
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 8}
                  y={y + 4}
                  fontSize="10"
                  fill="#94a3b8"
                  textAnchor="end"
                >
                  {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}K` : tick}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#impressionGradV2)" />}

          {/* Smooth line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover vertical line + dot */}
          {hovered !== null && (
            <>
              <line
                x1={tooltipX} y1={PAD.top}
                x2={tooltipX} y2={PAD.top + chartH}
                stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3"
              />
              <circle cx={tooltipX} cy={tooltipY} r="6" fill="#22c55e" opacity="0.18" />
              <circle cx={tooltipX} cy={tooltipY} r="4" fill="#22c55e" />
              <circle cx={tooltipX} cy={tooltipY} r="2" fill="#ffffff" />
            </>
          )}

          {/* Tooltip box */}
          {hovered !== null && hoveredData && (
            <g>
              <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="5" fill="#1e293b" />
              <text x={tipX + tipW / 2} y={tipY + 14} fontSize="9" fill="#94a3b8" textAnchor="middle">
                {hoveredData.label}
              </text>
              <text x={tipX + tipW / 2} y={tipY + 30} fontSize="11" fill="#ffffff" textAnchor="middle" fontWeight="700">
                {formatCompactNumber(hoveredData.value)} impressions
              </text>
            </g>
          )}

          {/* Invisible hover targets */}
          {series.map((_, i) => {
            const segW = series.length > 1 ? chartW / (series.length - 1) : chartW;
            return (
              <rect
                key={i}
                x={px(i) - segW / 2}
                y={PAD.top}
                width={segW}
                height={chartH}
                fill="transparent"
                style={{ cursor: 'crosshair' }}
              />
            );
          })}

          {/* X-axis labels */}
          {series.map((d, i) => {
            if (!xLabelIndices.has(i)) return null;
            return (
              <text
                key={`lbl-${i}`}
                x={px(i)}
                y={H - 6}
                fontSize="10"
                fill="#94a3b8"
                textAnchor={i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle'}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Summary legend */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', paddingTop: '10px',
      }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          backgroundColor: '#22c55e', flexShrink: 0, display: 'inline-block',
        }} />
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700 }}>
          {formatCompactNumber(totalImpressions)}
        </span>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>
          Impressions
        </span>
      </div>
    </div>
  );
};

// ── Main View ──────────────────────────────────────────────────────────────
export const AnalyticsView: React.FC = () => {
  const { currentBrand, organization, dateFilter, setDateFilter, posts } = useApp();

  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [granularity, setGranularity] = useState<Granularity>('Day');

  const brandMetricsMap = dashboardMetricsMap[currentBrand.id] || dashboardMetricsMap['brand-restaurant'];
  const metrics = brandMetricsMap[dateFilter] || brandMetricsMap['30days'];

  const platformFactor = PLATFORM_FACTOR[activePlatform] ?? 1;

  const dateFilterOptions: { id: DateFilterRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'custom', label: 'Custom' },
  ];

  const platformTabs = [
    { id: 'all', label: 'All Channels' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
  ];

  // ── Derived metrics (platform-adjusted) ──
  const totalFollowers = Math.round(metrics.followers * platformFactor);
  const newFollowers = Math.round(metrics.followers * (metrics.followerGrowth / 100) * platformFactor);
  const totalPosts = activePlatform === 'all'
    ? metrics.publishedPosts
    : Math.max(1, Math.round(metrics.publishedPosts * platformFactor * 2));
  const totalImpressions = Math.round(metrics.impressions * platformFactor);

  // ── Top Post ──
  const publishedPosts = posts.filter(p => p.status === 'published');
  const filteredPosts = activePlatform === 'all'
    ? publishedPosts
    : publishedPosts.filter(p => p.platforms.includes(activePlatform as SocialPlatform));

  const topPost = useMemo(() => {
    if (filteredPosts.length === 0) return null;
    return [...filteredPosts].sort((a, b) => {
      const engA = (a.metrics?.likes || 0) + (a.metrics?.comments || 0) + (a.metrics?.shares || 0);
      const engB = (b.metrics?.likes || 0) + (b.metrics?.comments || 0) + (b.metrics?.shares || 0);
      return engB - engA;
    })[0];
  }, [filteredPosts]);

  // ── Chart series (responds to date, platform, and granularity) ──
  const impressionSeries = useMemo(
    () => generateImpressionSeries(metrics.impressions, dateFilter, platformFactor, granularity),
    [metrics.impressions, dateFilter, platformFactor, granularity]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ── Breadcrumb ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500
      }}>
        <Building2 size={13} />
        <span>{organization.name}</span>
        <ChevronRight size={12} />
        <span style={{ color: currentBrand?.color || 'var(--color-primary)', fontWeight: 600 }}>
          {currentBrand?.name}
        </span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Analytics & Insights</span>
      </div>

      {/* ── Page Header + Date Filters ── */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Analytics & Insights</h1>
          <p className="text-body">Track your channel performance for the selected period and platform.</p>
        </div>

        <div className="page-actions">
          <div className="calendar-view-toggle">
            {dateFilterOptions.map(opt => (
              <button
                key={opt.id}
                className={`calendar-view-btn ${dateFilter === opt.id ? 'active' : ''}`}
                onClick={() => setDateFilter(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Channel Filter Tabs ── */}
      <div className="card" style={{ padding: '0 20px', backgroundColor: '#ffffff' }}>
        <div className="tabs">
          {platformTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-item ${activePlatform === tab.id ? 'active' : ''}`}
              onClick={() => setActivePlatform(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Four Metric Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
      }}
        className="analytics-metric-grid"
      >
        {/* 1 — Total Followers */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Followers
            </span>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: 'rgba(37,99,235,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={15} color="#2563eb" />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {formatCompactNumber(totalFollowers)}
          </div>
          {activePlatform !== 'all' && (
            <div style={{ marginTop: '2px' }}>
              <PlatformBadge platform={activePlatform as SocialPlatform} showName />
            </div>
          )}
        </div>

        {/* 2 — New Followers */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              New Followers
            </span>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: 'rgba(22,163,74,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <UserPlus size={15} color="#16a34a" />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
            +{formatCompactNumber(newFollowers)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {metrics.followerGrowth}% growth this period
          </div>
        </div>

        {/* 3 — Total Posts */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Posts
            </span>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: 'rgba(124,58,237,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Send size={15} color="#7c3aed" />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalPosts}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Published this period
          </div>
        </div>

        {/* 4 — Top Post */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Top Post
            </span>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: 'rgba(245,158,11,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingUp size={15} color="#d97706" />
            </span>
          </div>

          {topPost ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
              {topPost.mediaUrls?.[0] && (
                <img
                  src={topPost.mediaUrls[0]}
                  alt=""
                  style={{
                    width: '44px', height: '44px', borderRadius: '6px',
                    objectFit: 'cover', flexShrink: 0,
                    border: '1px solid var(--border-subtle)'
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '12.5px', color: 'var(--text-primary)',
                  margin: '0 0 5px 0',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  lineHeight: 1.4, fontWeight: 500
                }}>
                  {topPost.content}
                </p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {topPost.platforms.slice(0, 2).map(p => (
                    <PlatformBadge key={p} platform={p} showName={false} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', flex: 1, display: 'flex', alignItems: 'center' }}>
              No published posts for this filter.
            </div>
          )}
        </div>
      </div>

      {/* ── Post Impressions Chart ── */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <ImpressionChart
          series={impressionSeries}
          totalImpressions={totalImpressions}
          granularity={granularity}
          onGranularityChange={setGranularity}
        />
      </div>

      {/* Responsive overrides injected inline */}
      <style>{`
        @media (max-width: 900px) {
          .analytics-metric-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          .analytics-metric-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
