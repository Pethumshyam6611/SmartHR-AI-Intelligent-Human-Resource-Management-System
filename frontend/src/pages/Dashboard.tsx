import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-primary-600">--</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Present Today</h3>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Leaves</h3>
          <p className="text-3xl font-bold text-yellow-600">--</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Open Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
      </div>
      <div className="mt-6 card">
        <p className="text-gray-600">
          Welcome, {user?.employee?.firstName || 'User'}! Dashboard features will be implemented.
        </p>
      </div>
    </div>
  );
}
