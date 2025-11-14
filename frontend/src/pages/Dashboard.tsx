import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardHeader } from '@/components/ui';
import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const stats = {
    totalEmployees: 245,
    presentToday: 198,
    pendingLeaves: 12,
    openJobs: 8,
  };

  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Clock in for today',
      icon: Clock,
      color: 'blue' as const,
      onClick: () => navigate('/attendance'),
    },
    {
      title: 'Apply for Leave',
      description: 'Request time off',
      icon: Calendar,
      color: 'green' as const,
      onClick: () => navigate('/leaves'),
    },
    {
      title: 'View Payroll',
      description: 'Check salary details',
      icon: DollarSign,
      color: 'yellow' as const,
      onClick: () => navigate('/payroll'),
    },
    {
      title: 'Job Postings',
      description: 'Browse opportunities',
      icon: Briefcase,
      color: 'red' as const,
      onClick: () => navigate('/jobs'),
    },
  ];

  const recentActivities = [
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'approved leave request',
      time: '2 hours ago',
    },
    {
      id: '2',
      user: 'John Doe',
      action: 'clocked in',
      time: '3 hours ago',
    },
    {
      id: '3',
      user: 'Admin User',
      action: 'posted a new job opening',
      time: '5 hours ago',
    },
    {
      id: '4',
      user: 'HR Manager',
      action: 'generated monthly payroll',
      time: '1 day ago',
    },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  return (
    <div className="space-y-google-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium text-text-primary">
          Welcome back, {user?.employee?.firstName || 'User'}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's happening with your HR system today.
        </p>
      </div>

      {/* Stats Grid */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-google-4">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            color="blue"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={UserCheck}
            color="green"
            trend={{ value: 2.1, isPositive: true }}
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={Calendar}
            color="yellow"
            trend={{ value: 12.5, isPositive: false }}
          />
          <StatCard
            title="Open Jobs"
            value={stats.openJobs}
            icon={Briefcase}
            color="red"
            trend={{ value: 33.3, isPositive: true }}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-google-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-google-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-google-6">
        {/* Attendance Overview Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Attendance Overview"
              subtitle="Weekly attendance statistics"
              action={
                <button className="btn-text text-sm">
                  View Details
                </button>
              }
            />
            <div className="h-64 flex items-center justify-center text-text-tertiary">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto mb-2 opacity-30" />
                <p>Chart will be implemented with Recharts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Upcoming Events & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-google-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader title="Upcoming Events" subtitle="This week's schedule" />
          <div className="space-y-google-3">
            <div className="flex items-start gap-google-3 p-google-3 rounded-google bg-primary-50">
              <div className="p-2 bg-primary-500 text-white rounded-google text-center min-w-[48px]">
                <div className="text-xs font-medium">DEC</div>
                <div className="text-lg font-bold">18</div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">Team Meeting</h4>
                <p className="text-sm text-text-secondary">10:00 AM - Conference Room A</p>
              </div>
            </div>
            <div className="flex items-start gap-google-3 p-google-3 rounded-google bg-accent-50">
              <div className="p-2 bg-accent-500 text-white rounded-google text-center min-w-[48px]">
                <div className="text-xs font-medium">DEC</div>
                <div className="text-lg font-bold">20</div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">Performance Review</h4>
                <p className="text-sm text-text-secondary">2:00 PM - HR Office</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Approvals (Admin/HR only) */}
        {isAdmin && (
          <Card>
            <CardHeader
              title="Pending Approvals"
              subtitle="Requires your attention"
              action={
                <span className="chip-error">
                  {stats.pendingLeaves}
                </span>
              }
            />
            <div className="space-y-google-3">
              <button className="list-item w-full">
                <FileText size={20} className="text-text-tertiary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-text-primary">John Doe - Sick Leave</p>
                  <p className="text-sm text-text-secondary">Dec 18-20, 2024</p>
                </div>
                <span className="chip-warning">Pending</span>
              </button>
              <button className="list-item w-full">
                <FileText size={20} className="text-text-tertiary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-text-primary">Jane Smith - Vacation</p>
                  <p className="text-sm text-text-secondary">Dec 25-30, 2024</p>
                </div>
                <span className="chip-warning">Pending</span>
              </button>
            </div>
            <button className="btn-text w-full mt-google-4">
              View All Requests
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
