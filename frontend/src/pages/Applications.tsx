import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui';
import {
  FileText,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Mail,
  Phone,
  Briefcase,
  Filter,
} from 'lucide-react';

interface ApplicationRecord {
  id: string;
  jobPostingId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumePath: string;
  coverLetter?: string;
  status: string;
  aiScore?: number;
  aiAnalysis?: string;
  appliedAt: string;
  reviewedAt?: string;
  jobPosting?: {
    title: string;
    department: string;
  };
}

interface JobOption {
  id: string;
  title: string;
  department: string;
  status: string;
}

export default function Applications() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      if (response.data.length > 0) {
        setSelectedJobId(response.data[0].id);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      toast.error('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    setSubmitting(true);
    try {
      await api.put(`/applications/${selectedApp.id}/status`, { status: newStatus });
      toast.success('Application status updated!');
      setIsStatusModalOpen(false);
      if (selectedJobId) fetchApplications(selectedJobId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetailModal = async (id: string) => {
    try {
      const response = await api.get(`/applications/${id}`);
      setSelectedApp(response.data);
      setIsDetailModalOpen(true);
    } catch (error: any) {
      toast.error('Failed to fetch application details');
    }
  };

  const openStatusModal = (app: ApplicationRecord) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setIsStatusModalOpen(true);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="chip-success"><CheckCircle size={12} /> Accepted</span>;
      case 'REJECTED':
        return <span className="chip-error"><XCircle size={12} /> Rejected</span>;
      case 'SHORTLISTED':
        return <span className="chip-primary"><Star size={12} /> Shortlisted</span>;
      case 'UNDER_REVIEW':
        return <span className="chip-warning"><Clock size={12} /> Under Review</span>;
      default:
        return <span className="chip-warning"><Clock size={12} /> Submitted</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-secondary-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    SUBMITTED: applications.filter(a => a.status === 'SUBMITTED').length,
    UNDER_REVIEW: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    SHORTLISTED: applications.filter(a => a.status === 'SHORTLISTED').length,
    ACCEPTED: applications.filter(a => a.status === 'ACCEPTED').length,
    REJECTED: applications.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Job Applications</h1>
        <p className="text-text-secondary">Review and manage candidate applications with AI insights</p>
      </div>

      {/* Job Selector */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <Briefcase size={20} className="text-primary-400" />
          <div className="flex-1">
            <label className="label">Select Job Posting</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="input-field"
            >
              {jobs.length === 0 && <option value="">No jobs available</option>}
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.department} ({job.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="card py-3 px-4">
            <p className="text-text-tertiary text-xs uppercase tracking-wider">{status.replace('_', ' ')}</p>
            <p className="text-xl font-bold text-white">{count}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
            <input
              type="text"
              placeholder="Search by applicant name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Filter size={16} className="text-text-tertiary self-center" />
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-dark-2 text-text-secondary hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-glow text-primary-400 text-lg">Loading applications...</div>
          </div>
        ) : !selectedJobId ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
            <p className="text-text-secondary">Select a job posting to view applications</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
            <p className="text-text-secondary">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>AI Score</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
                          {app.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{app.applicantName}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail size={12} className="text-text-tertiary" />
                          {app.applicantEmail}
                        </div>
                        {app.applicantPhone && (
                          <div className="flex items-center gap-1 text-sm text-text-tertiary">
                            <Phone size={12} />
                            {app.applicantPhone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {app.aiScore != null ? (
                        <span className={`font-bold font-mono text-lg ${getScoreColor(app.aiScore)}`}>
                          {app.aiScore}%
                        </span>
                      ) : (
                        <span className="text-text-tertiary text-sm">N/A</span>
                      )}
                    </td>
                    <td>{getStatusChip(app.status)}</td>
                    <td className="font-mono text-sm text-text-tertiary">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(app.id)}
                          className="btn-icon text-primary-400 hover:text-primary-300"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => openStatusModal(app)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-xl">
                {selectedApp.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedApp.applicantName}</h3>
                <p className="text-text-secondary">{selectedApp.applicantEmail}</p>
                {selectedApp.applicantPhone && (
                  <p className="text-text-tertiary text-sm">{selectedApp.applicantPhone}</p>
                )}
              </div>
            </div>

            {selectedApp.jobPosting && (
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Applied For</p>
                <p className="text-white font-medium">{selectedApp.jobPosting.title}</p>
                <p className="text-text-secondary text-sm">{selectedApp.jobPosting.department}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-text-tertiary text-xs uppercase tracking-wider">Status</p>
                <div className="mt-1">{getStatusChip(selectedApp.status)}</div>
              </div>
              {selectedApp.aiScore != null && (
                <div className="flex-1">
                  <p className="text-text-tertiary text-xs uppercase tracking-wider">AI Match Score</p>
                  <p className={`text-2xl font-bold font-mono ${getScoreColor(selectedApp.aiScore)}`}>
                    {selectedApp.aiScore}%
                  </p>
                </div>
              )}
            </div>

            {selectedApp.coverLetter && (
              <div>
                <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">Cover Letter</p>
                <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                  <p className="text-text-primary text-sm whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                </div>
              </div>
            )}

            {selectedApp.aiAnalysis && (
              <div>
                <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">
                  <Star size={14} className="inline mr-1 text-primary-400" />
                  AI Analysis
                </p>
                <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded">
                  <p className="text-text-primary text-sm whitespace-pre-wrap">{selectedApp.aiAnalysis}</p>
                </div>
              </div>
            )}

            <div className="text-text-tertiary text-sm font-mono">
              Applied on: {new Date(selectedApp.appliedAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Application Status"
        size="sm"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div>
              <p className="text-text-secondary text-sm mb-2">
                Updating status for <strong className="text-white">{selectedApp.applicantName}</strong>
              </p>
            </div>

            <div>
              <label className="label">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field"
              >
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="btn-ghost flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="btn-primary flex-1"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
