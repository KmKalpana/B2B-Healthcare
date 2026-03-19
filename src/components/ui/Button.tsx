import React from 'react';
import '../../styles/Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        btn btn-${variant} btn-${size} 
        ${disabled ? 'btn-disabled' : ''} 
        ${className}
      `}
    >
      <span className="btn-text">{children}</span>
    </button>
  );
}
