import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number; // positive or negative percent
  trendLabel?: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  trendLabel = 'vs previous period',
  icon
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <div className="metric-icon-wrap">
          {icon}
        </div>
      </div>

      <div className="metric-value">
        {value}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5" style={{ marginTop: '2px' }}>
          <span className={`metric-trend ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
            {isPositive && <ArrowUpRight size={13} />}
            {isNegative && <ArrowDownRight size={13} />}
            {!isPositive && !isNegative && <Minus size={13} />}
            {isPositive ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-caption" style={{ fontSize: '11px' }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
