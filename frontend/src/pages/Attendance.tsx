export default function Attendance() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">GPS-Based Clock In/Out</h3>
        <p className="text-gray-600 mb-4">
          This page will implement GPS-based attendance tracking with clock in/out features.
        </p>
        <div className="space-y-2">
          <button className="btn-primary">Clock In</button>
          <button className="btn-secondary ml-2">Clock Out</button>
        </div>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Attendance History</h3>
        <p className="text-gray-600">Attendance records will be displayed here.</p>
      </div>
    </div>
  );
}
