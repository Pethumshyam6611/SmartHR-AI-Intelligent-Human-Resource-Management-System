import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import {
  Users,
  UserPlus,
  Mail,
  Briefcase,
  Building2,
  Shield,
  Trash2,
  Search,
  UserCheck,
  UserX
} from 'lucide-react';
import { Modal } from '@/components/ui';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nic: string;
  department: string;
  position: string;
  phoneNumber: string;
  address: string;
  salary: number;
  joiningDate: string;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

export default function Employees() {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'EMPLOYEE'
  });
  const [submitting, setSubmitting] = useState(false);

  const canManageEmployees = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER' || user?.role === 'DEPARTMENT_HEAD';
  const canInviteEmployees = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteForm.email) {
      toast.error('Email is required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/invite', inviteForm);

      // Check if we got a registration link (development mode)
      if (response.data.registrationLink) {
        // Copy link to clipboard
        navigator.clipboard.writeText(response.data.registrationLink);

        toast.success(
          `Invitation sent! Registration link copied to clipboard. Paste it in a new tab to complete registration.`,
          { duration: 8000 }
        );

        // Also show in console for easy access
        console.log('📧 Registration Link:', response.data.registrationLink);
      } else {
        toast.success('Invitation sent! The user will receive an email to complete registration.');
      }

      setIsInviteModalOpen(false);
      setInviteForm({ email: '', role: 'EMPLOYEE' });
      // Refresh employee list after a short delay to allow backend processing
      setTimeout(fetchEmployees, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, employeeName: string) => {
    const action = currentStatus === 'ACTIVE' ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${employeeName}? ${currentStatus === 'ACTIVE' ? 'They will not be able to log in.' : 'They will be able to log in again.'}`)) {
      return;
    }

    try {
      await api.patch(`/employees/${id}/toggle-status`);
      toast.success(`Employee ${action}d successfully`);
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} employee`);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchQuery.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      emp.user.email.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'chip-error';
      case 'HR_MANAGER':
        return 'chip-warning';
      case 'DEPARTMENT_HEAD':
        return 'chip-success';
      default:
        return 'chip-primary';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'chip-success';
      case 'PENDING':
        return 'chip-warning';
      case 'INACTIVE':
        return 'chip-error';
      default:
        return 'chip-primary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Employee Management
          </h1>
          <p className="text-text-secondary">
            Manage your organization's workforce
          </p>
        </div>
        {canInviteEmployees && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-primary"
          >
            <UserPlus size={18} />
            Invite Employee
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/10 rounded">
              <Users size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Total Employees</p>
              <p className="text-2xl font-bold text-white">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-white">
                {employees.filter(e => e.user.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-500/10 rounded">
              <Mail size={24} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-white">
                {employees.filter(e => e.user.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                placeholder="Search employees by name, email, department, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-glow text-primary-400 text-lg">Loading employees...</div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
            <p className="text-text-secondary">
              {searchQuery ? 'No employees found matching your search' : 'No employees yet'}
            </p>
            {canInviteEmployees && !searchQuery && (
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="btn-primary mt-4"
              >
                <UserPlus size={18} />
                Invite First Employee
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Status</th>
                  {canManageEmployees && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-text-tertiary">{employee.nic}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-text-tertiary" />
                        <span>{employee.user.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-text-tertiary" />
                        <span>{employee.department}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-text-tertiary" />
                        <span>{employee.position}</span>
                      </div>
                    </td>
                    <td>
                      <span className={getRoleBadgeColor(employee.user.role)}>
                        {employee.user.role}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeColor(employee.user.status)}>
                        {employee.user.status}
                      </span>
                    </td>
                    {canManageEmployees && (
                      <td>
                        <div className="flex items-center gap-2">
                          {employee.user.status !== 'PENDING' && (
                            <button
                              onClick={() => handleToggleStatus(employee.id, employee.user.status, `${employee.firstName} ${employee.lastName}`)}
                              className={`btn-icon ${employee.user.status === 'ACTIVE'
                                  ? 'text-orange-400 hover:text-orange-300'
                                  : 'text-green-400 hover:text-green-300'
                                }`}
                              title={employee.user.status === 'ACTIVE' ? 'Deactivate employee' : 'Activate employee'}
                            >
                              {employee.user.status === 'ACTIVE' ? (
                                <UserX size={18} />
                              ) : (
                                <UserCheck size={18} />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="btn-icon text-red-400 hover:text-red-300"
                            title="Delete employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Employee Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Employee"
        size="md"
      >
        <form onSubmit={handleInviteSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="input-field"
                placeholder="employee@example.com"
                required
              />
              <p className="text-sm text-text-tertiary mt-2">
                An invitation email will be sent to this address
              </p>
            </div>

            <div>
              <label className="label">Role</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="input-field"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="DEPARTMENT_HEAD">Department Head</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <p className="text-sm text-text-tertiary mt-2">
                Select the role for this employee
              </p>
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded p-4">
              <p className="text-sm text-primary-400">
                <strong>Note:</strong> The invited user will receive an email with a registration link.
                They will need to complete their profile by providing their personal details, NIC, and setting a password.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="btn-ghost flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
