import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { Card, CardHeader } from '@/components/ui';
import api from '@/services/api';
import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  openJobs: number;
}

interface RecentLeave {
  id: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  employee?: {
    firstName: string;
    lastName: string;
    department: string;
  };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    openJobs: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState<RecentLeave[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';
  const isManager = isAdmin || user?.role === 'DEPARTMENT_HEAD';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data in parallel
      const promises: Promise<any>[] = [api.get('/jobs')];

      if (isManager) {
        promises.push(api.get('/employees'));
        promises.push(api.get('/leaves'));
        promises.push(api.get('/attendance/summary/today'));
      } else {
        promises.push(api.get('/leaves/my-leaves'));
      }

      const results = await Promise.allSettled(promises);

      // Jobs
      const jobsResult = results[0];
      const jobsData = jobsResult.status === 'fulfilled' ? jobsResult.value.data : [];
      const openJobs = Array.isArray(jobsData) ? jobsData.filter((j: any) => j.status === 'OPEN').length : 0;

      if (isManager) {
        // Employees
        const empResult = results[1];
        const employeesData = empResult.status === 'fulfilled' ? empResult.value.data : [];
        const totalEmployees = Array.isArray(employeesData) ? employeesData.length : 0;

        // Leaves
        const leavesResult = results[2];
        const leavesData = leavesResult.status === 'fulfilled' ? leavesResult.value.data : [];
        const pendingLeaves = Array.isArray(leavesData)
          ? leavesData.filter((l: any) => l.status === 'PENDING').length
          : 0;

        const attendanceSummaryResult = results[3];
        const attendanceSummary = attendanceSummaryResult.status === 'fulfilled' ? attendanceSummaryResult.value.data : null;
        const presentToday = attendanceSummary?.presentToday ?? 0;

        setStats({
          totalEmployees: attendanceSummary?.totalEmployees ?? totalEmployees,
          presentToday,
          pendingLeaves,
          openJobs,
        });

        if (Array.isArray(leavesData)) {
          setRecentLeaves(leavesData.slice(0, 5));
        }
      } else {
        // Employee view
        const leavesResult = results[1];
        const leavesData = leavesResult.status === 'fulfilled' ? leavesResult.value.data : [];
        const pendingLeaves = Array.isArray(leavesData)
          ? leavesData.filter((l: any) => l.status === 'PENDING').length
          : 0;

        setStats({
          totalEmployees: 0,
          presentToday: 0,
          pendingLeaves,
          openJobs,
        });

        if (Array.isArray(leavesData)) {
          setRecentLeaves(leavesData.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
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

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SICK: 'Sick Leave',
      CASUAL: 'Casual Leave',
      VACATION: 'Vacation',
      UNPAID: 'Unpaid Leave',
    };
    return labels[type] || type;
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'chip-success';
      case 'REJECTED':
        return 'chip-error';
      default:
        return 'chip-warning';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      {isManager && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={UserCheck}
            color="green"
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={Calendar}
            color="yellow"
          />
          <StatCard
            title="Open Jobs"
            value={stats.openJobs}
            icon={Briefcase}
            color="red"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Leaves and Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <CardHeader
            title="Recent Leave Requests"
            subtitle={isManager ? 'All employee leave requests' : 'Your recent leave requests'}
            action={
              <button className="btn-text text-sm" onClick={() => navigate('/leaves')}>
                View All
              </button>
            }
          />
          <div className="space-y-3">
            {recentLeaves.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={32} className="mx-auto text-text-tertiary opacity-30 mb-2" />
                <p className="text-text-secondary text-sm">No leave requests yet</p>
              </div>
            ) : (
              recentLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center gap-3 p-3 rounded bg-surface-dark-2/50 hover:bg-surface-dark-2 transition-colors">
                  <FileText size={18} className="text-text-tertiary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">
                      {isManager && leave.employee
                        ? `${leave.employee.firstName} ${leave.employee.lastName}`
                        : getLeaveTypeLabel(leave.leaveType)}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {isManager ? getLeaveTypeLabel(leave.leaveType) + ' • ' : ''}
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={getStatusChip(leave.status)}>{leave.status}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Pending Approvals (Admin/HR only) */}
        {isManager ? (
          <Card>
            <CardHeader
              title="Pending Approvals"
              subtitle="Requires your attention"
              action={
                stats.pendingLeaves > 0 ? (
                  <span className="chip-error">{stats.pendingLeaves}</span>
                ) : null
              }
            />
            <div className="space-y-3">
              {recentLeaves.filter(l => l.status === 'PENDING').length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle size={32} className="mx-auto text-text-tertiary opacity-30 mb-2" />
                  <p className="text-text-secondary text-sm">No pending approvals</p>
                </div>
              ) : (
                recentLeaves
                  .filter(l => l.status === 'PENDING')
                  .map((leave) => (
                    <button
                      key={leave.id}
                      className="flex items-center gap-3 p-3 rounded bg-surface-dark-2/50 hover:bg-surface-dark-2 transition-colors w-full"
                      onClick={() => navigate('/leaves')}
                    >
                      <FileText size={20} className="text-text-tertiary" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-text-primary text-sm">
                          {leave.employee?.firstName} {leave.employee?.lastName} — {getLeaveTypeLabel(leave.leaveType)}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="chip-warning">Pending</span>
                    </button>
                  ))
              )}
            </div>
            {stats.pendingLeaves > 0 && (
              <button className="btn-text w-full mt-4" onClick={() => navigate('/leaves')}>
                View All Requests
              </button>
            )}
          </Card>
        ) : (
          <Card>
            <CardHeader title="Your Summary" subtitle="Personal HR overview" />
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded bg-surface-dark-2/50">
                <div className="p-2 bg-primary-500/10 rounded">
                  <Calendar size={20} className="text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Pending Leave Requests</p>
                  <p className="text-xs text-text-secondary">Waiting for approval</p>
                </div>
                <span className="text-2xl font-bold text-primary-400">{stats.pendingLeaves}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded bg-surface-dark-2/50">
                <div className="p-2 bg-emerald-500/10 rounded">
                  <Briefcase size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Open Job Positions</p>
                  <p className="text-xs text-text-secondary">Browse opportunities</p>
                </div>
                <span className="text-2xl font-bold text-emerald-400">{stats.openJobs}</span>
              </div>
              <button className="btn-primary w-full" onClick={() => navigate('/attendance')}>
                <Clock size={18} />
                Go to Attendance
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
