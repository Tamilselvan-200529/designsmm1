import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-solid' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;
  const loadingClass = loading ? 'btn-loading' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
    </button>
  );
};
