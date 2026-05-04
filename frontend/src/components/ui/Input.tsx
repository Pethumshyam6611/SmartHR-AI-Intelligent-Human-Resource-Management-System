import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  floating?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, floating = false, className = '', ...props }, ref) => {
    // Floating label logic removed for Industrial theme consistency - preferring standard labels
    // Reuse input-field which handles the look
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{label}</label>}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-tertiary mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, rows = 4, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`input-field resize-none ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-tertiary mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{label}</label>}
        <select
          ref={ref}
          className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-tertiary mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
