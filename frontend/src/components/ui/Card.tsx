import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  noPadding?: boolean;
  children: ReactNode;
}

export function Card({ hover = false, noPadding = false, children, className = '', ...props }: CardProps) {
  const classes = hover ? 'card-hover' : 'card';
  const paddingClass = noPadding ? 'p-0' : '';

  return (
    <div className={`${classes} ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
