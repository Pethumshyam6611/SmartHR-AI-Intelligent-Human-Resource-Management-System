import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui';
import { LeaveApprovalStage, Role } from '@/types';
import {
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  GitBranch,
} from 'lucide-react';

interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  currentStage: LeaveApprovalStage;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
  departmentHeadComments?: string;
  hrReviewComments?: string;
  employee?: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
  };
}

const STAGE_LABELS: Record<LeaveApprovalStage, string> = {
  DEPARTMENT_HEAD_REVIEW: 'Department Head Review',
  HR_REVIEW: 'HR Review',
  COMPLETED: 'Completed',
};

export default function Leaves() {
  const { user } = useAuthStore();
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [applyForm, setApplyForm] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const role = user?.role;
  const canReviewLeaves =
    role === Role.ADMIN || role === Role.HR_MANAGER || role === Role.DEPARTMENT_HEAD;
  const canFinalReview = role === Role.ADMIN || role === Role.HR_MANAGER;
  const isDepartmentHead = role === Role.DEPARTMENT_HEAD;

  useEffect(() => {
    fetchLeaves();
  }, [role]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const endpoint = canReviewLeaves ? '/leaves' : '/leaves/my-leaves';
      const response = await api.get(endpoint);
      setLeaves(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applyForm.startDate || !applyForm.endDate || !applyForm.reason) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/leaves', applyForm);
      toast.success('Leave application submitted successfully');
      setIsApplyModalOpen(false);
      setApplyForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const submitReview = async (action: 'approve' | 'reject') => {
    if (!selectedLeave) return;

    setSubmitting(true);
    try {
      await api.put(`/leaves/${selectedLeave.id}/${action}`, { reviewComments: reviewComment });
      toast.success(action === 'approve' ? 'Leave updated successfully' : 'Leave rejected successfully');
      setIsReviewModalOpen(false);
      setReviewComment('');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} leave`);
    } finally {
      setSubmitting(false);
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SICK: 'Sick Leave',
      CASUAL: 'Casual Leave',
      VACATION: 'Vacation',
      UNPAID: 'Unpaid Leave',
    };
    return labels[type] || type;
  };

  const getStageLabel = (stage: LeaveApprovalStage) => STAGE_LABELS[stage] || stage;

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="chip-success"><CheckCircle size={12} /> Approved</span>;
      case 'REJECTED':
        return <span className="chip-error"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="chip-warning"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const canReviewRecord = (leave: LeaveRecord) => {
    if (!canReviewLeaves || leave.status !== 'PENDING') return false;
    if (isDepartmentHead) return leave.currentStage === LeaveApprovalStage.DEPARTMENT_HEAD_REVIEW;
    if (canFinalReview) return leave.currentStage === LeaveApprovalStage.HR_REVIEW;
    return false;
  };

  const filteredLeaves = useMemo(
    () => (filterStatus === 'ALL' ? leaves : leaves.filter((leave) => leave.status === filterStatus)),
    [filterStatus, leaves]
  );

  const getDayCount = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const pendingCount = leaves.filter((leave) => leave.status === 'PENDING').length;
  const approvedCount = leaves.filter((leave) => leave.status === 'APPROVED').length;
  const rejectedCount = leaves.filter((leave) => leave.status === 'REJECTED').length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Leave Management</h1>
          <p className="text-text-secondary">
            {canReviewLeaves
              ? 'Review department and HR leave approvals in sequence'
              : 'Apply for leave and track your approval progress'}
          </p>
        </div>
        <button onClick={() => setIsApplyModalOpen(true)} className="btn-primary">
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-500/10 rounded">
              <AlertCircle size={24} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-bold text-white">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded">
              <XCircle size={24} className="text-red-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Rejected</p>
              <p className="text-2xl font-bold text-white">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter size={18} className="text-text-tertiary" />
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-dark-2 text-text-secondary hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-glow text-primary-400 text-lg">Loading leaves...</div>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
            <p className="text-text-secondary">No leave records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  {canReviewLeaves && <th>Employee</th>}
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Applied</th>
                  {canReviewLeaves && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    {canReviewLeaves && (
                      <td>
                        <div>
                          <p className="font-medium text-text-primary">
                            {leave.employee?.firstName} {leave.employee?.lastName}
                          </p>
                          <p className="text-xs text-text-tertiary">{leave.employee?.department}</p>
                        </div>
                      </td>
                    )}
                    <td><span className="chip-primary">{getLeaveTypeLabel(leave.leaveType)}</span></td>
                    <td className="font-mono text-sm">
                      <div>{new Date(leave.startDate).toLocaleDateString()}</div>
                      <div className="text-text-tertiary">to {new Date(leave.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="font-bold text-primary-400">{getDayCount(leave.startDate, leave.endDate)}</td>
                    <td>
                      <span className="chip-warning">
                        <GitBranch size={12} />
                        {getStageLabel(leave.currentStage)}
                      </span>
                    </td>
                    <td>{getStatusChip(leave.status)}</td>
                    <td className="font-mono text-sm text-text-tertiary">
                      {new Date(leave.appliedAt).toLocaleDateString()}
                    </td>
                    {canReviewLeaves && (
                      <td>
                        {canReviewRecord(leave) ? (
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setReviewComment('');
                              setIsReviewModalOpen(true);
                            }}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-text-tertiary text-sm">View only</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        size="md"
      >
        <form onSubmit={handleApplySubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">Leave Type</label>
              <select
                value={applyForm.leaveType}
                onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value })}
                className="input-field"
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="VACATION">Vacation</option>
                <option value="UNPAID">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  value={applyForm.startDate}
                  onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  value={applyForm.endDate}
                  onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                  className="input-field"
                  min={applyForm.startDate}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Reason</label>
              <textarea
                value={applyForm.reason}
                onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder="Provide a reason for your leave request..."
                required
              />
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded p-4 text-sm text-primary-400">
              Approval flow: Department Head review first, then HR review, then final employee notification.
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn-ghost flex-1" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Review Leave Request"
        size="md"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3 space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-text-tertiary text-xs uppercase tracking-wider">Employee</span>
                <span className="text-text-primary font-medium">
                  {selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-tertiary text-xs uppercase tracking-wider">Department</span>
                <span className="text-text-primary">{selectedLeave.employee?.department}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-tertiary text-xs uppercase tracking-wider">Current Stage</span>
                <span className="chip-warning">{getStageLabel(selectedLeave.currentStage)}</span>
              </div>
              <div>
                <span className="text-text-tertiary text-xs uppercase tracking-wider block mb-1">Reason</span>
                <p className="text-text-primary text-sm">{selectedLeave.reason}</p>
              </div>
            </div>

            <div>
              <label className="label">Review Comments</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Add comments about your decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => submitReview('reject')}
                className="btn-base bg-red-600 text-white border-2 border-red-700 hover:bg-red-700 flex-1"
                disabled={submitting}
              >
                <XCircle size={18} />
                {submitting ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => submitReview('approve')}
                className="btn-base bg-emerald-600 text-white border-2 border-emerald-700 hover:bg-emerald-700 flex-1"
                disabled={submitting}
              >
                <CheckCircle size={18} />
                {submitting ? 'Processing...' : 'Approve'}
              </button>
            </div>

            {(selectedLeave.departmentHeadComments || selectedLeave.hrReviewComments || selectedLeave.reviewComments) && (
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3 text-sm text-text-secondary space-y-2">
                <p className="text-text-primary font-medium">Existing comments</p>
                {selectedLeave.departmentHeadComments && <p>Department head: {selectedLeave.departmentHeadComments}</p>}
                {selectedLeave.hrReviewComments && <p>HR: {selectedLeave.hrReviewComments}</p>}
                {!selectedLeave.hrReviewComments && selectedLeave.reviewComments && <p>Final: {selectedLeave.reviewComments}</p>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
