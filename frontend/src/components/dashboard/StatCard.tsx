import { LucideIcon } from 'lucide-react';
import { Card } from '../ui';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  const colors = {
    blue: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      icon: 'text-primary-500',
    },
    green: {
      bg: 'bg-accent-50',
      text: 'text-accent-700',
      icon: 'text-accent-500',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      icon: 'text-yellow-500',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-500',
    },
  };

  return (
    <Card className="hover:shadow-industrial-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-2">{title}</p>
          <p className={`text-3xl font-bold font-display ${colors[color].text} mb-2`}>{value}</p>
          {trend && (
            <p className={`text-xs font-mono font-bold ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded ${colors[color].bg} bg-opacity-10 border border-opacity-20`}>
          <Icon className={colors[color].icon} size={24} />
        </div>
      </div>
    </Card>
  );
}
