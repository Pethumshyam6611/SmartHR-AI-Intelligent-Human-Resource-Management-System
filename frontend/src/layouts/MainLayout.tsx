import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AIAssistant } from '@/components/ui';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  Users,
  LogOut,
  Menu,
  Bell,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', href: '/attendance', icon: Clock },
    { name: 'Leaves', href: '/leaves', icon: Calendar },
    { name: 'Payroll', href: '/payroll', icon: DollarSign },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Applications', href: '/applications', icon: FileText, adminOnly: true },
    { name: 'Employees', href: '/employees', icon: Users, adminOnly: true },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      // Silently fail - notifications are non-critical
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-surface-dark-1">
      {/* Sidebar - Industrial Style */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 bg-surface-dark border-r border-surface-dark-2`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-surface-dark-2">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded bg-primary-600 flex items-center justify-center shadow-neon">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg tracking-tight group-hover:text-primary-400 transition-colors">SmartHR</span>
                <span className="text-[10px] text-text-tertiary uppercase tracking-widest">Enterprise</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-all group ${isActive
                      ? 'bg-primary-600/10 text-primary-400 border-l-2 border-primary-500'
                      : 'text-text-secondary hover:bg-surface-dark-2 hover:text-text-primary border-l-2 border-transparent'
                      }`}
                  >
                    <Icon size={18} className={`${isActive ? 'text-primary-400' : 'text-text-tertiary group-hover:text-text-primary'}`} />
                    <span className="text-sm font-medium tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-4 border-t border-surface-dark-2 bg-surface-dark-1/50">
            <div className="flex items-center gap-3 p-2 rounded hover:bg-surface-dark-2 transition-colors cursor-pointer group">
              <Avatar
                name={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
                size="md"
                className="ring-2 ring-surface-dark-2 group-hover:ring-primary-500 transition-all"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">
                  {user?.employee?.firstName} {user?.employee?.lastName}
                </p>
                <p className="text-[10px] text-primary-400 uppercase tracking-wider truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <header className="bg-surface-dark-1 border-b border-surface-dark-2 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden btn-icon"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs or Page Title could go here */}
            <div className="hidden md:block">
              <h1 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search Bar */}
            <div className="hidden md:block w-96 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              </div>
              <input
                type="text"
                placeholder="SEARCH SYSTEM..."
                className="w-full bg-surface-dark-2 border border-surface-dark-3 text-sm text-text-primary px-4 py-2 pl-8 rounded focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-text-tertiary font-mono"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="btn-icon relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-surface-dark-1 border border-surface-dark-2 rounded-lg shadow-industrial-lg z-50 overflow-hidden">
                      <div className="p-4 border-b border-surface-dark-2 flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">System Alerts</h3>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="btn-icon p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-text-tertiary text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => handleMarkAsRead(notif.id)}
                              className={`w-full p-4 text-left hover:bg-surface-dark-2 transition-colors border-b border-surface-dark-2 last:border-0 ${!notif.isRead ? 'bg-primary-500/5' : ''
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-text-primary">{notif.title}</p>
                                  <p className="text-xs text-text-secondary mt-0.5">{notif.message}</p>
                                  <p className="text-xs text-text-tertiary mt-1 font-mono">{getTimeAgo(notif.createdAt)}</p>
                                </div>
                                {!notif.isRead && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-surface-dark-2 bg-surface-dark-2/30">
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary-400 hover:text-primary-300 w-full text-center uppercase tracking-wider font-bold"
                          >
                            Mark all as read
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Profile / Settings */}
              <Link to="/profile" className="btn-icon" title="Profile">
                <Settings size={20} />
              </Link>

              <div className="w-px h-6 bg-surface-dark-3 mx-1" />

              {/* Logout */}
              <button
                onClick={logout}
                className="btn-icon text-red-400 hover:bg-red-500/10 hover:text-red-500"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
          {/* Content Background Glow */}
          <div className="fixed top-20 right-20 w-96 h-96 bg-primary-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="fixed bottom-20 left-20 w-96 h-96 bg-secondary-900/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
}
