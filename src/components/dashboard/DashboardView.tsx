import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from './MetricCard';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { PlatformBadge } from '../common/Badge';
import { DashboardSkeleton } from '../common/Skeleton';
import { dashboardMetricsMap } from '../../mock/initialData';
import { 
  PenSquare, 
  Share2, 
  Send, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Lock,
  Unlock
} from 'lucide-react';
import { DateFilterRange, UserRole } from '../../types';

export const DashboardView: React.FC = () => {
  const { 
    currentBrand, 
    currentMember,
    dateFilter, 
    setDateFilter, 
    openComposer, 
    posts, 
    socialAccounts, 
    openReviewDrawer, 
    approvePost,
    showSkeletonLoading,
    setActiveNav
  } = useApp();

  if (showSkeletonLoading) {
    return <DashboardSkeleton />;
  }

  const brandMetricsMap = dashboardMetricsMap[currentBrand.id] || dashboardMetricsMap['brand-restaurant'];
  const metrics = brandMetricsMap[dateFilter] || brandMetricsMap['30days'];

  // Pending approval posts
  const pendingApprovals = posts
    .filter(p => p.status === 'pending')
    .slice(0, 3);

  const dateFilterOptions: { id: DateFilterRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'custom', label: 'Custom' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header with Date Filter */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Dashboard</h1>
          <p className="text-body">
            Performance overview and publishing status for <strong>{currentBrand.name}</strong>
          </p>
        </div>

        <div className="page-actions">
          {/* Reactive Date Filter Pills */}
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

          <Button
            variant="primary"
            icon={<PenSquare size={15} />}
            onClick={() => openComposer()}
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Active Member Context Banner */}
      {currentMember && (() => {
        const rolePermDesc: Record<UserRole, { summary: string; canPublish: boolean; color: string; bg: string }> = {
          Owner:       { summary: 'Full access — publishing, approvals, team management, billing, and all settings.', canPublish: true,  color: '#4f46e5', bg: 'rgba(99,102,241,0.07)' },
          Admin:       { summary: 'Broad access across brands — can publish, manage team, and handle approvals.', canPublish: true,  color: '#ea580c', bg: 'rgba(234,88,12,0.07)' },
          Manager:     { summary: 'Brand operations — can publish, schedule, and approve or reject content.', canPublish: true,  color: '#2563eb', bg: 'rgba(37,99,235,0.07)' },
          Editor:      { summary: 'Content creation & scheduling. Can submit for approval — publishing requires Manager+.', canPublish: false, color: '#059669', bg: 'rgba(16,185,129,0.07)' },
          Contributor: { summary: 'Draft creation only. Must submit content for approval — no direct publishing access.', canPublish: false, color: '#b45309', bg: 'rgba(202,138,4,0.07)' },
          Analyst:     { summary: 'Read-only analytics access. Can view dashboards and performance reports only.', canPublish: false, color: '#7c3aed', bg: 'rgba(139,92,246,0.07)' },
          Client:      { summary: 'Review and approve/reject content submitted for approval. Selected analytics view.', canPublish: false, color: '#475569', bg: 'rgba(100,116,139,0.07)' },
        };
        const rp = rolePermDesc[currentMember.role];
        return (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px',
            borderRadius: '10px', border: `1px solid ${rp.color}30`,
            backgroundColor: rp.bg, marginBottom: '4px'
          }}>
            <Avatar src={currentMember.avatar} name={currentMember.name} size="md" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{currentMember.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 8px', borderRadius: '4px', backgroundColor: rp.color + '20', color: rp.color }}>
                  {currentMember.role}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>in <strong>{currentBrand.name}</strong></span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{rp.summary}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {rp.canPublish ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#059669' }}>
                  <Unlock size={13} />
                  <span>Can Publish</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
                  <Lock size={13} />
                  <span>Publish Restricted</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Summary Metric Cards */}
      <div className="dashboard-grid-summary">
        <MetricCard
          label="Connected accounts"
          value={socialAccounts.length}
          icon={<Share2 size={16} />}
        />
        <MetricCard
          label="Published posts"
          value={metrics.publishedPosts}
          trend={12.5}
          icon={<Send size={16} />}
        />
        <MetricCard
          label="Scheduled posts"
          value={metrics.scheduledPosts}
          icon={<Calendar size={16} />}
        />
        <MetricCard
          label="Failed posts"
          value={metrics.failedPosts}
          icon={<AlertTriangle size={16} />}
        />
      </div>

      {/* Two Column: Pending Approvals & Recent Activity */}
      <div className="dashboard-two-col">
        {/* Pending Approvals */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Clock size={18} color="#d97706" />
              <h2 className="card-title">Pending approvals</h2>
              {pendingApprovals.length > 0 && (
                <span className="badge badge-pending">{pendingApprovals.length}</span>
              )}
            </div>
            <Button
              variant="link"
              onClick={() => setActiveNav('approvals')}
              style={{ fontSize: '12.5px' }}
            >
              All Approvals →
            </Button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-8 text-center text-muted text-caption">
              No content currently awaiting approval. Everything is up to date.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingApprovals.map(post => (
                <div 
                  key={post.id} 
                  className="p-3 border border-subtle rounded-md flex flex-col gap-2.5"
                  style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-caption">
                      By <strong>{post.author.name}</strong> ({post.author.role})
                    </span>
                    <span className="badge badge-pending">Manager Review</span>
                  </div>

                  <p className="text-body" style={{ fontSize: '13px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-light">
                    <div className="flex gap-1">
                      {post.platforms.map(p => (
                        <PlatformBadge key={p} platform={p} showName={false} />
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openReviewDrawer(post)}
                      >
                        Review
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => approvePost(post.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Audit Stream */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent activity</h2>
          </div>

          <div className="activity-stream">
            <div className="activity-item">
              <div className="activity-icon-wrap" style={{ color: '#16a34a', backgroundColor: '#dcfce7' }}>
                <CheckCircle2 size={15} />
              </div>
              <div className="flex flex-col">
                <span className="activity-text">
                  <strong>Sarah Lee</strong> published "Behind the scenes at Sunrise Valley Farm" to Instagram and Facebook.
                </span>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrap" style={{ color: '#d97706', backgroundColor: '#fef3c7' }}>
                <Clock size={15} />
              </div>
              <div className="flex flex-col">
                <span className="activity-text">
                  <strong>David Kumar</strong> submitted "Weekend Brunch Announcement" for Manager Review.
                </span>
                <span className="activity-time">45 mins ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrap" style={{ color: '#2563eb', backgroundColor: '#dbeafe' }}>
                <Calendar size={15} />
              </div>
              <div className="flex flex-col">
                <span className="activity-text">
                  <strong>Sarah Lee</strong> approved and scheduled "Chef Julian's autumn squash velouté" for tomorrow at 6:30 PM.
                </span>
                <span className="activity-time">Yesterday at 4:30 PM</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrap" style={{ color: '#dc2626', backgroundColor: '#fee2e2' }}>
                <AlertTriangle size={15} />
              </div>
              <div className="flex flex-col">
                <span className="activity-text">
                  <strong>TikTok API connector</strong> reported token expiring in 48 hours. Refresh suggested.
                </span>
                <span className="activity-time">Yesterday at 11:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

