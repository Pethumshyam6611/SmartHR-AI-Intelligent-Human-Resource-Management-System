import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  floating?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, floating = false, className = '', ...props }, ref) => {
    if (floating && label) {
      return (
        <div className="w-full">
          <div className="input-floating">
            <input
              ref={ref}
              className={`input-google ${error ? 'border-google-red' : ''} ${className}`}
              placeholder=" "
              {...props}
            />
            <label>{label}</label>
          </div>
          {error && <p className="text-xs text-google-red mt-1">{error}</p>}
          {helperText && !error && <p className="text-xs text-text-tertiary mt-1">{helperText}</p>}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
        <input
          ref={ref}
          className={`input-google ${error ? 'border-google-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-google-red mt-1">{error}</p>}
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
        {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`input-google resize-none ${error ? 'border-google-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-google-red mt-1">{error}</p>}
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
        {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
        <select
          ref={ref}
          className={`input-google ${error ? 'border-google-red' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-google-red mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-tertiary mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
