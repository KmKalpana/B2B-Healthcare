import Skeleton from './SkeletonLine';
import "../../styles/charts.css";

export default function ChartSkeleton() {
  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <div className="chart-skeleton-frame">
          <div className="skeleton-line skeleton-x-axis"></div>
          <div className="skeleton-line skeleton-y-axis"></div>
          <div className="chart-bars-container">
            {[1,2,3,4,5,6,7,8].map((bar, index) => (
              <div 
                key={index} 
                className="skeleton-bar"
                style={{ 
                  '--bar-height': `${20 + index * 8}px`,
                  '--bar-delay': `${index * 0.1}s`
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="skeleton-labels">
            {[1,2,3,4,5,6,7,8].map((label, index) => (
              <Skeleton 
                key={index} 
                variant="line" 
                width="30px" 
                height="16px"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
