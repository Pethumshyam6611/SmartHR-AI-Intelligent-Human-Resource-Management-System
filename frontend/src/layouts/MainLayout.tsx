import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { SearchBar, Avatar, Badge } from '@/components/ui';
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
import { useState } from 'react';

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

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  const notifications = [
    { id: 1, title: 'Leave request approved', time: '2h ago', unread: true },
    { id: 2, title: 'New job application received', time: '5h ago', unread: true },
    { id: 3, title: 'Payroll generated for December', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar - Google Workspace Style */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 bg-surface-light border-r border-border shadow-google-sm`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-google-4 py-google-4 border-b border-border">
            <div className="flex items-center gap-google-3">
              <div className="w-10 h-10 rounded-google bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-text-primary">SmartHR AI</h2>
                <p className="text-xs text-text-tertiary">Intelligent HR</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-google-3 py-google-4 space-y-1 overflow-y-auto">
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
                    className={`flex items-center gap-google-3 px-google-3 py-2.5 rounded-google transition-all ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-text-primary hover:bg-surface-dark'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-google-3 border-t border-border">
            <div className="flex items-center gap-google-3 p-google-2 rounded-google hover:bg-surface-dark transition-colors">
              <Avatar
                name={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.employee?.firstName} {user?.employee?.lastName}
                </p>
                <p className="text-xs text-text-tertiary truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar - Google Workspace Style */}
        <header className="bg-surface-light border-b border-border sticky top-0 z-30 shadow-google-sm">
          <div className="px-google-4 py-google-3 flex items-center gap-google-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden btn-icon"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar placeholder="Search employees, leaves, jobs..." />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-google-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="btn-icon relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1">{unreadCount}</Badge>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-surface-light rounded-google-lg shadow-google-xl z-50 overflow-hidden">
                      <div className="p-google-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-medium text-text-primary">Notifications</h3>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="btn-icon"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            className={`w-full p-google-4 text-left hover:bg-surface-dark transition-colors border-b border-border last:border-0 ${
                              notif.unread ? 'bg-primary-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-google-3">
                              <div className="flex-1">
                                <p className="text-sm text-text-primary">{notif.title}</p>
                                <p className="text-xs text-text-tertiary mt-1">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-1" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-google-3 border-t border-border">
                        <button className="btn-text w-full text-sm">View all notifications</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Settings */}
              <Link to="/settings" className="btn-icon">
                <Settings size={20} />
              </Link>

              {/* Profile Menu */}
              <div className="hidden sm:flex items-center gap-google-3 pl-google-3 ml-google-3 border-l border-border">
                <Avatar
                  name={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
                  size="sm"
                />
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="btn-icon text-google-red hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-google-6 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
