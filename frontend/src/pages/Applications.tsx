export default function Applications() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">AI-Powered Resume Screening</h3>
        <p className="text-gray-600 mb-4">
          This page will display job applications with AI fit scores and analysis.
        </p>
      </div>
      <div className="mt-6 card">
        <h3 className="text-xl font-semibold mb-4">Recent Applications</h3>
        <p className="text-gray-600">Applications will be displayed here with AI insights.</p>
      </div>
    </div>
  );
}
