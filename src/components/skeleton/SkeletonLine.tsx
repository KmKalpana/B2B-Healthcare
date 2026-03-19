import React from 'react';
import '../../styles/SkeletonLine.css';

interface SkeletonProps {
  variant: 'line' | 'title' | 'button' | 'button-group' | 'card' | 'avatar';
  count?: number;
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLine: React.FC<SkeletonProps> = ({
  variant = 'line',
  count = 1,
  width,
  height,
  className = ''
}) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div
          key={i}
          className={`
            skeleton 
            skeleton-${variant}
            ${className}
          `}
          style={{ 
            width: width, 
            height: height,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </>
  );
};

export default SkeletonLine;
