import React from 'react';
import '../../styles/StatsCardSkeleton.css';

interface StatsCardSkeletonProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StatsCardSkeleton: React.FC<StatsCardSkeletonProps> = ({
  count = 3,
  size = 'md'
}) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className={`stats-card-skeleton stats-card-skeleton--${size}`}>
          <div className="stat-icon-skeleton"></div>
          <div className="stat-content-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-number"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsCardSkeleton;
