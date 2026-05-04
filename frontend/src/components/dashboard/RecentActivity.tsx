import { Card, CardHeader, Avatar } from '../ui';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader title="Recent Activity" subtitle="Latest updates from your team" />
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-surface-dark rounded transition-colors">
            <Avatar name={activity.user} src={activity.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-text-tertiary">
                <Clock size={12} />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-text-secondary py-4">No recent activity</p>
        )}
      </div>
    </Card>
  );
}
