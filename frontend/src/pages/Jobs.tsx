import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui';
import {
  Briefcase,
  Plus,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  Search,
  X,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  location?: string;
  status: string;
  postedAt: string;
  closedAt?: string;
  applications?: { id: string }[];
}

export default function Jobs() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryRange: '',
    location: '',
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.description || !formData.requirements) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, formData);
        toast.success('Job updated successfully!');
      } else {
        await api.post('/jobs', formData);
        toast.success('Job posted successfully!');
      }
      setIsFormModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted successfully!');
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleCloseJob = async (job: Job) => {
    try {
      await api.put(`/jobs/${job.id}`, { ...job, status: 'CLOSED' });
      toast.success('Job closed successfully!');
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to close job');
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements,
      salaryRange: job.salaryRange || '',
      location: job.location || '',
    });
    setIsFormModalOpen(true);
  };

  const openDetailModal = async (id: string) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setSelectedJob(response.data);
      setIsDetailModalOpen(true);
    } catch (error: any) {
      toast.error('Failed to fetch job details');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryRange: '',
      location: '',
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      (job.location && job.location.toLowerCase().includes(query))
    );
  });

  const getTimeSince = (dateStr: string) => {
    const now = new Date();
    const posted = new Date(dateStr);
    const days = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Job Postings</h1>
          <p className="text-text-secondary">
            {isAdmin ? 'Manage job openings and recruitment' : 'Browse available job opportunities'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} />
            Post New Job
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/10 rounded">
              <Briefcase size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Open Positions</p>
              <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'OPEN').length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-500/10 rounded">
              <Users size={24} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Total Postings</p>
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
          <input
            type="text"
            placeholder="Search jobs by title, department, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-pulse-glow text-primary-400 text-lg">Loading jobs...</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
          <p className="text-text-secondary">
            {searchQuery ? 'No jobs matching your search' : 'No job postings yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card hover:bg-surface-dark-2 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-text-secondary text-sm">{job.department}</p>
                </div>
                <span className={`${job.status === 'OPEN' ? 'chip-success' : 'chip-error'}`}>
                  {job.status}
                </span>
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                {job.location && (
                  <div className="flex items-center gap-1 text-text-tertiary text-sm">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-1 text-text-tertiary text-sm">
                    <DollarSign size={14} />
                    {job.salaryRange}
                  </div>
                )}
                <div className="flex items-center gap-1 text-text-tertiary text-sm">
                  <Clock size={14} />
                  {getTimeSince(job.postedAt)}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-surface-dark-2 pt-4">
                <button
                  onClick={() => openDetailModal(job.id)}
                  className="btn-icon text-primary-400 hover:text-primary-300"
                  title="View details"
                >
                  <Eye size={18} />
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditModal(job)}
                      className="btn-icon text-secondary-400 hover:text-secondary-300"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {job.status === 'OPEN' && (
                      <button
                        onClick={() => handleCloseJob(job)}
                        className="btn-icon text-orange-400 hover:text-orange-300"
                        title="Close job"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="btn-icon text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Job Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingJob ? 'Edit Job Posting' : 'Post New Job'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="label">Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Engineering"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div>
                <label className="label">Salary Range</label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  className="input-field"
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder="Describe the role and responsibilities..."
                required
              />
            </div>

            <div>
              <label className="label">Requirements *</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder="List qualifications and required skills..."
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn-ghost flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Job Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                <p className="text-text-secondary">{selectedJob.department}</p>
              </div>
              <span className={`${selectedJob.status === 'OPEN' ? 'chip-success' : 'chip-error'}`}>
                {selectedJob.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {selectedJob.location && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={16} className="text-primary-400" />
                  {selectedJob.location}
                </div>
              )}
              {selectedJob.salaryRange && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <DollarSign size={16} className="text-emerald-400" />
                  {selectedJob.salaryRange}
                </div>
              )}
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock size={16} className="text-secondary-400" />
                Posted {getTimeSince(selectedJob.postedAt)}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</h4>
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                <p className="text-text-primary text-sm whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Requirements</h4>
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                <p className="text-text-primary text-sm whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>
            </div>

            {selectedJob.applications && selectedJob.applications.length > 0 && (
              <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded">
                <p className="text-primary-400 text-sm">
                  <Users size={16} className="inline mr-2" />
                  <strong>{selectedJob.applications.length}</strong> application(s) received
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
