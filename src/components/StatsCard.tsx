import React from 'react';
import StatIcon from './StatsIcon';
import '../styles/StatCard.css';

interface StatCardProps {
  type: 'total' | 'active' | 'discharged' | 'critical' | 'recovered' | 'admitted' | 'emergency' | 'archived';
  title: string;
  value: number | string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  type,
  title,
  value,
  size = 'md',
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`stat-card stat-card-${type} ${size} ${className}`}
      onClick={onClick}
    >
      <StatIcon type={type} size={size as any} />
      <h3>{title}</h3>
      <div className="stat-number">{value}</div>
    </div>
  );
};

export default StatCard;
