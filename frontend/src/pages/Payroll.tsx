export default function Payroll() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payroll Management</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Salary Information</h3>
        <p className="text-gray-600 mb-4">
          This page will display payroll records and allow downloading salary slips.
        </p>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Payroll History</h3>
        <p className="text-gray-600">Monthly payroll records will be displayed here.</p>
      </div>
    </div>
  );
}
