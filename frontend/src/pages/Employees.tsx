export default function Employees() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Employee Directory</h3>
        <p className="text-gray-600 mb-4">
          This page will display all employees and allow HR/Admin to manage employee records.
        </p>
        <button className="btn-primary">Add New Employee</button>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Employee List</h3>
        <p className="text-gray-600">Employee records will be displayed here.</p>
      </div>
    </div>
  );
}
