import { Search, X } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
}

export function SearchBar({ onSearch, onChange, className = '', ...props }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setValue('');
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <Search size={20} className="text-text-tertiary" />
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {value && (
        <button onClick={handleClear} className="p-1 hover:bg-surface-dark rounded-full transition-colors">
          <X size={18} className="text-text-tertiary" />
        </button>
      )}
    </div>
  );
}
