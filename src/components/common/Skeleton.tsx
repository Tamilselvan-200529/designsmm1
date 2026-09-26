import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius,
  className = ''
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: borderRadius || undefined
      }}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <Skeleton width="220px" height="32px" />
        <Skeleton width="180px" height="36px" />
      </div>
      <div className="dashboard-grid-summary">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card flex flex-col gap-3">
            <Skeleton width="60%" height="14px" />
            <Skeleton width="40%" height="28px" />
            <Skeleton width="50%" height="12px" />
          </div>
        ))}
      </div>
      <div className="dashboard-two-col">
        <div className="card flex flex-col gap-4">
          <Skeleton width="160px" height="20px" />
          <Skeleton width="100%" height="60px" />
          <Skeleton width="100%" height="60px" />
          <Skeleton width="100%" height="60px" />
        </div>
        <div className="card flex flex-col gap-4">
          <Skeleton width="140px" height="20px" />
          <Skeleton width="100%" height="48px" />
          <Skeleton width="100%" height="48px" />
        </div>
      </div>
    </div>
  );
};
