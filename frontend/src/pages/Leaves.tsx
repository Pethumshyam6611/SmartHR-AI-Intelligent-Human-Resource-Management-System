export default function Leaves() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leave Management</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Apply for Leave</h3>
        <p className="text-gray-600 mb-4">
          This page will include leave application form with AI-powered recommendations.
        </p>
        <button className="btn-primary">Apply for Leave</button>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Leave History</h3>
        <p className="text-gray-600">Your leave requests will be displayed here.</p>
      </div>
    </div>
  );
}
