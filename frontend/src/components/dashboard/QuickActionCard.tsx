import { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  color = 'blue',
}: QuickActionCardProps) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-accent-50 text-accent-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <button
      onClick={onClick}
      className="card-google p-google-4 w-full text-left hover:shadow-google-lg transition-all group"
    >
      <div className="flex items-center gap-google-4">
        <div className={`p-3 rounded-google ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <ChevronRight className="text-text-tertiary group-hover:text-primary-500 transition-colors" size={20} />
      </div>
    </button>
  );
}
