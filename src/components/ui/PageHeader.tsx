import React from 'react';
import Button from './Button';
import '../../styles/PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttons: {
    label: string;
    variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    onClick: () => void;
  }[];
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  buttons,
  className = ''
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="header-left">
        <div className="header-title">{title}</div>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-buttons">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            variant={btn.variant}
            size={btn.size || 'md'}
            onClick={btn.onClick}
            className="header-btn"
          >
            <span>{btn.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;
