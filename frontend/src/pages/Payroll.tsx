import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui';
import {
  DollarSign,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  workingDays: number;
  presentDays: number;
  overtimeHours: number;
  generatedAt: string;
  pdfPath?: string;
  employee?: {
    firstName: string;
    lastName: string;
    position: string;
  };
}

interface EmployeeOption {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
}

export default function Payroll() {
  const { user } = useAuthStore();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

  useEffect(() => {
    fetchPayrolls();
    if (isAdmin) fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/payroll/all' : '/payroll/my-payroll';
      const response = await api.get(endpoint);
      setPayrolls(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch payroll');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateForm.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/payroll/generate', generateForm);
      toast.success('Payroll generated successfully!');
      setIsGenerateModalOpen(false);
      setGenerateForm({
        employeeId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      fetchPayrolls();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (payrollId: string) => {
    try {
      const response = await api.get(`/payroll/${payrollId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${payrollId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Salary slip downloaded!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download salary slip');
    }
  };

  const openDetail = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const totalEarnings = payrolls.reduce((sum, p) => sum + Number(p.netSalary), 0);
  const totalOvertime = payrolls.reduce((sum, p) => sum + Number(p.overtimePay), 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Payroll Management</h1>
          <p className="text-text-secondary">
            {isAdmin ? 'Generate and manage employee payroll' : 'View your salary records and download slips'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsGenerateModalOpen(true)} className="btn-primary">
            <Zap size={18} />
            Generate Payroll
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/10 rounded">
              <DollarSign size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Total Earnings</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalEarnings)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded">
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Total Overtime Pay</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalOvertime)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-500/10 rounded">
              <FileText size={24} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase tracking-wider">Pay Slips</p>
              <p className="text-2xl font-bold text-white">{payrolls.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="text-primary-500" size={24} />
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Payroll History</h3>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-glow text-primary-400 text-lg">Loading payroll...</div>
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto mb-4 text-text-tertiary opacity-30" />
            <p className="text-text-secondary">No payroll records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Base Salary</th>
                  <th>Overtime</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Working Days</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => (
                  <tr key={payroll.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary-400" />
                        <span className="font-medium">
                          {monthNames[payroll.month - 1]} {payroll.year}
                        </span>
                      </div>
                    </td>
                    <td className="font-mono">{formatCurrency(Number(payroll.baseSalary))}</td>
                    <td>
                      {Number(payroll.overtimePay) > 0 ? (
                        <span className="chip-success">+{formatCurrency(Number(payroll.overtimePay))}</span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td>
                      {Number(payroll.deductions) > 0 ? (
                        <span className="chip-error">-{formatCurrency(Number(payroll.deductions))}</span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="font-bold text-primary-400 font-mono">
                      {formatCurrency(Number(payroll.netSalary))}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-text-tertiary" />
                        <span>{payroll.presentDays}/{payroll.workingDays}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(payroll)}
                          className="btn-icon text-primary-400 hover:text-primary-300"
                          title="View details"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(payroll.id)}
                          className="btn-icon text-emerald-400 hover:text-emerald-300"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Payroll Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Payroll"
        size="md"
      >
        <form onSubmit={handleGenerate}>
          <div className="space-y-4">
            <div>
              <label className="label">Employee</label>
              <select
                value={generateForm.employeeId}
                onChange={(e) => setGenerateForm({ ...generateForm, employeeId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} — {emp.position} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Month</label>
                <select
                  value={generateForm.month}
                  onChange={(e) => setGenerateForm({ ...generateForm, month: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {monthNames.map((name, i) => (
                    <option key={i} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <input
                  type="number"
                  value={generateForm.year}
                  onChange={(e) => setGenerateForm({ ...generateForm, year: parseInt(e.target.value) })}
                  className="input-field"
                  min={2020}
                  max={2030}
                />
              </div>
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded p-4">
              <p className="text-sm text-primary-400">
                <strong>Note:</strong> Payroll will be calculated based on the employee's base salary,
                attendance records (present days, overtime hours), and any applicable deductions for the selected period.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="btn-ghost flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Generating...' : 'Generate Payroll'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Payroll Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Payroll Details"
        size="md"
      >
        {selectedPayroll && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {monthNames[selectedPayroll.month - 1]} {selectedPayroll.year}
              </h3>
              <p className="text-text-secondary text-sm">Salary Breakdown</p>
            </div>

            <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Working Days</span>
                <span className="text-white font-mono">{selectedPayroll.workingDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Present Days</span>
                <span className="text-white font-mono">{selectedPayroll.presentDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Overtime Hours</span>
                <span className="text-white font-mono">{selectedPayroll.overtimeHours}h</span>
              </div>
            </div>

            <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Base Salary</span>
                <span className="text-white font-mono">{formatCurrency(Number(selectedPayroll.baseSalary))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Overtime Pay</span>
                <span className="text-emerald-400 font-mono">+{formatCurrency(Number(selectedPayroll.overtimePay))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Allowances</span>
                <span className="text-emerald-400 font-mono">+{formatCurrency(Number(selectedPayroll.allowances))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Deductions</span>
                <span className="text-red-400 font-mono">-{formatCurrency(Number(selectedPayroll.deductions))}</span>
              </div>
              <div className="border-t border-surface-dark-3 pt-3 flex justify-between">
                <span className="text-white font-bold uppercase tracking-wider">Net Salary</span>
                <span className="text-primary-400 font-bold font-mono text-lg">
                  {formatCurrency(Number(selectedPayroll.netSalary))}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDownload(selectedPayroll.id)}
              className="btn-primary w-full"
            >
              <Download size={18} />
              Download PDF Salary Slip
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
