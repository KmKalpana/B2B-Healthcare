import React from 'react';
import '../styles/statsIcon.css';

interface StatIconProps {
  type: 'total' | 'active' | 'discharged' | 'critical' | 'recovered' | 'admitted' | 'emergency' | 'archived';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatIcon: React.FC<StatIconProps> = ({ 
  type, 
  size = 'md', 
  className = '' 
}) => {
  const icons: Record<string, string> = {
    total: '👥',
    active: '🩺',
    discharged: '🏥', 
    critical: '🚨',
    recovered: '✅',
    admitted: '🏨',
    emergency: '⚡',
    archived: '📁'
  };

  const icon = icons[type] || '📊';

  return (
    <div className={`stat-icon stat-icon-${size} ${className}`}>
      <span>{icon}</span>
    </div>
  );
};

export default StatIcon;
