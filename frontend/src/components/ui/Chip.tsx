import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, variant = 'default', onRemove, className = '' }: ChipProps) {
  const variants = {
    default: 'chip',
    primary: 'chip-primary',
    success: 'chip-success',
    warning: 'chip-warning',
    error: 'chip-error',
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
