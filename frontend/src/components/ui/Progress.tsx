interface ProgressProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
}

export function Progress({ value, className = '', barClassName = '' }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress-bar ${className}`}>
      <div
        className={`progress-bar-fill ${barClassName}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  value?: number; // 0-100, undefined for indeterminate
  className?: string;
}

export function CircularProgress({
  size = 40,
  strokeWidth = 4,
  value,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = value !== undefined ? circumference - (value / 100) * circumference : 0;

  return (
    <div className={`inline-flex ${className}`}>
      <svg
        width={size}
        height={size}
        className={value === undefined ? 'animate-spin' : ''}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="text-primary-500 transition-all duration-300"
        />
      </svg>
    </div>
  );
}
