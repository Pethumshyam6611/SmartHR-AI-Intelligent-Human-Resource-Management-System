export default function Jobs() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Postings</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Active Job Openings</h3>
        <p className="text-gray-600 mb-4">
          This page will display all job postings and allow HR to create/edit jobs.
        </p>
        <button className="btn-primary">Post New Job</button>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Job List</h3>
        <p className="text-gray-600">Job postings will be displayed here.</p>
      </div>
    </div>
  );
}
