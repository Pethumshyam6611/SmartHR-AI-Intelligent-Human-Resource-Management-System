import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';
import {
  Activity,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut: string | null;
  workingHours: number | null;
  overtimeHours: number | null;
  date: string;
}

interface EmployeeOption {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
}

interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  activeSessions: number;
}

export default function Attendance() {
  const { user } = useAuthStore();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDayRecord, setSelectedDayRecord] = useState<AttendanceRecord | null>(null);
  const [selectedEmployeeRecords, setSelectedEmployeeRecords] = useState<AttendanceRecord[]>([]);
  const [teamSummary, setTeamSummary] = useState<AttendanceSummary | null>(null);

  const isManager =
    user?.role === Role.ADMIN || user?.role === Role.HR_MANAGER || user?.role === Role.DEPARTMENT_HEAD;

  const targetHours = 8;
  const targetSeconds = targetHours * 60 * 60;

  useEffect(() => {
    checkClockStatus();
    fetchAttendanceHistory();
  }, []);

  useEffect(() => {
    if (!isManager) return;

    fetchEmployeeOptions();
    fetchTeamSummary();
  }, [isManager]);

  useEffect(() => {
    if (!isManager || !selectedEmployeeId) return;
    fetchSelectedEmployeeAttendance();
  }, [isManager, selectedEmployeeId, selectedMonth]);

  useEffect(() => {
    let interval: number | undefined;

    if (isClockedIn && currentAttendance) {
      interval = window.setInterval(() => {
        const clockInTime = new Date(currentAttendance.clockIn).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - clockInTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isClockedIn, currentAttendance]);

  const checkClockStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get('/attendance/my-attendance', {
        params: { startDate: today, endDate: today },
      });
      const activeAttendance = response.data.find((record: AttendanceRecord) => !record.clockOut);

      if (activeAttendance) {
        setIsClockedIn(true);
        setCurrentAttendance(activeAttendance);
      } else {
        setIsClockedIn(false);
        setCurrentAttendance(null);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error('Error checking clock status:', error);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await api.get('/attendance/my-attendance');
      setAttendanceHistory(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const response = await api.get('/employees');
      setEmployeeOptions(response.data);
      if (!selectedEmployeeId && response.data.length > 0) {
        setSelectedEmployeeId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTeamSummary = async () => {
    try {
      const response = await api.get('/attendance/summary/today');
      setTeamSummary(response.data);
    } catch (error) {
      console.error('Error fetching team summary:', error);
    }
  };

  const fetchSelectedEmployeeAttendance = async () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = `${selectedMonth}-01`;
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

    try {
      const response = await api.get(`/attendance/employee/${selectedEmployeeId}`, {
        params: { startDate, endDate },
      });
      setSelectedEmployeeRecords(response.data);
      setSelectedDayRecord(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load employee attendance');
    }
  };

  const withLocation = (kind: 'clock-in' | 'clock-out', position?: GeolocationPosition) => {
    if (kind === 'clock-in') {
      return api.post('/attendance/clock-in', {
        clockInLatitude: position?.coords.latitude,
        clockInLongitude: position?.coords.longitude,
      });
    }

    return api.post('/attendance/clock-out', {
      clockOutLatitude: position?.coords.latitude,
      clockOutLongitude: position?.coords.longitude,
    });
  };

  const handleClockIn = async () => {
    setLoading(true);

    try {
      const response = await new Promise<any>((resolve, reject) => {
        if (!navigator.geolocation) {
          withLocation('clock-in').then(resolve).catch(reject);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => withLocation('clock-in', position).then(resolve).catch(reject),
          () => withLocation('clock-in').then(resolve).catch(reject)
        );
      });

      setIsClockedIn(true);
      setCurrentAttendance(response.data.attendance);
      toast.success('Clocked in successfully');
      fetchAttendanceHistory();
      if (isManager) fetchTeamSummary();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);

    try {
      const response = await new Promise<any>((resolve, reject) => {
        if (!navigator.geolocation) {
          withLocation('clock-out').then(resolve).catch(reject);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => withLocation('clock-out', position).then(resolve).catch(reject),
          () => withLocation('clock-out').then(resolve).catch(reject)
        );
      });

      setIsClockedIn(false);
      setCurrentAttendance(null);
      setElapsedTime(0);
      toast.success(`Clocked out. Worked ${response.data.attendance.workingHours?.toFixed(2)} hours`);
      fetchAttendanceHistory();
      if (isManager) {
        fetchTeamSummary();
        fetchSelectedEmployeeAttendance();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.min(100, (elapsedTime / targetSeconds) * 100);

  const calendarDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const totalDays = new Date(year, month, 0).getDate();
    const recordsByDate = new Map(
      selectedEmployeeRecords.map((record) => [new Date(record.date).toISOString().slice(0, 10), record])
    );

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;
      const isoDate = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      return {
        day,
        isoDate,
        record: recordsByDate.get(isoDate) ?? null,
      };
    });
  }, [selectedEmployeeRecords, selectedMonth]);

  const selectedEmployee = employeeOptions.find((employee) => employee.id === selectedEmployeeId);
  const selectedEmployeeStats = useMemo(() => {
    const workedDays = selectedEmployeeRecords.length;
    const totalHours = selectedEmployeeRecords.reduce((sum, record) => sum + (record.workingHours || 0), 0);
    const overtime = selectedEmployeeRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);

    return {
      workedDays,
      totalHours,
      overtime,
    };
  }, [selectedEmployeeRecords]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Attendance Tracker</h1>
        <p className="text-text-secondary">
          Track live work sessions, daily history, and {isManager ? 'team attendance calendars' : 'your attendance history'}.
        </p>
      </div>

      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-dark-2" />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${isClockedIn ? 'text-primary-500' : 'text-surface-dark-3'}`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-bold font-mono mb-2 ${isClockedIn ? 'text-primary-400' : 'text-text-tertiary'}`}>
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-xs text-text-tertiary uppercase tracking-widest font-bold">
                  {isClockedIn ? 'ACTIVE SESSION' : 'OFFLINE'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Activity className={`${isClockedIn ? 'text-primary-500' : 'text-text-tertiary'}`} size={32} />
              <div>
                <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wider">
                  {isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
                </h2>
                <p className="text-text-secondary text-sm font-mono">
                  Target: {targetHours}h | Progress: {Math.floor(progressPercentage)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                <div className="flex items-center gap-2 text-text-tertiary text-xs uppercase tracking-wider mb-1">
                  <Clock size={14} />
                  Elapsed
                </div>
                <div className="text-xl font-bold text-white font-mono">{formatTime(elapsedTime)}</div>
              </div>
              <div className="bg-surface-dark-2 p-4 rounded border border-surface-dark-3">
                <div className="flex items-center gap-2 text-text-tertiary text-xs uppercase tracking-wider mb-1">
                  <TrendingUp size={14} />
                  Remaining
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {formatTime(Math.max(0, targetSeconds - elapsedTime))}
                </div>
              </div>
            </div>

            {currentAttendance && (
              <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded">
                <div className="flex items-center gap-2 text-primary-400 text-xs uppercase tracking-wider mb-1">
                  <Zap size={14} />
                  Session Started
                </div>
                <div className="text-sm text-text-primary font-mono">
                  {new Date(currentAttendance.clockIn).toLocaleString()}
                </div>
              </div>
            )}

            <button
              onClick={isClockedIn ? handleClockOut : handleClockIn}
              disabled={loading}
              className={`w-full py-4 px-6 rounded font-bold text-lg uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-industrial-sm flex items-center justify-center gap-3 ${
                isClockedIn
                  ? 'bg-secondary-500 text-white hover:shadow-industrial border-2 border-secondary-600'
                  : 'bg-primary-600 text-white hover:shadow-industrial border-2 border-primary-700'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? 'Processing...' : isClockedIn ? <><LogOut size={20} />Clock Out</> : <><LogIn size={20} />Clock In</>}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-secondary-500" size={24} />
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Recent Activity</h3>
        </div>

        {attendanceHistory.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-text-tertiary mb-4" />
            <p className="text-text-secondary">No attendance records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Working Hours</th>
                  <th>Overtime</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="font-mono">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="font-mono text-primary-400">{new Date(record.clockIn).toLocaleTimeString()}</td>
                    <td className="font-mono text-secondary-400">
                      {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
                    </td>
                    <td className="font-bold">{record.workingHours ? `${record.workingHours.toFixed(2)}h` : '-'}</td>
                    <td>
                      {record.overtimeHours && record.overtimeHours > 0 ? (
                        <span className="chip-success">+{record.overtimeHours.toFixed(2)}h</span>
                      ) : (
                        <span className="text-text-tertiary">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isManager && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/10 rounded"><Users size={24} className="text-primary-400" /></div>
                <div>
                  <p className="text-text-secondary text-sm uppercase tracking-wider">Team Members</p>
                  <p className="text-2xl font-bold text-white">{teamSummary?.totalEmployees ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded"><Calendar size={24} className="text-emerald-400" /></div>
                <div>
                  <p className="text-text-secondary text-sm uppercase tracking-wider">Present Today</p>
                  <p className="text-2xl font-bold text-white">{teamSummary?.presentToday ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-500/10 rounded"><Activity size={24} className="text-secondary-400" /></div>
                <div>
                  <p className="text-text-secondary text-sm uppercase tracking-wider">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">{teamSummary?.activeSessions ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Employee Attendance Calendar</h3>
                <p className="text-text-secondary">Select a user to inspect worked days and daily hours.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="input-field min-w-[260px]"
                >
                  {employeeOptions.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} - {employee.department || 'No Department'}
                    </option>
                  ))}
                </select>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-widest text-text-tertiary">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                    <div key={label}>{label}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map(({ day, isoDate, record }) => {
                    const date = new Date(`${isoDate}T00:00:00`);
                    const dayIndex = date.getDay();
                    const columnStart = day === 1 ? ((dayIndex + 6) % 7) + 1 : undefined;

                    return (
                      <button
                        key={isoDate}
                        style={columnStart ? { gridColumnStart: columnStart } : undefined}
                        onClick={() => setSelectedDayRecord(record)}
                        className={`min-h-[104px] rounded border p-3 text-left transition-all ${
                          record
                            ? 'border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/20'
                            : 'border-surface-dark-3 bg-surface-dark-2 hover:bg-surface-dark-3'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-semibold">{day}</span>
                          {record && <span className="chip-success">Worked</span>}
                        </div>
                        <div className="text-xs text-text-secondary space-y-1">
                          {record ? (
                            <>
                              <p>{record.workingHours?.toFixed(2) || '0.00'}h worked</p>
                              <p>{record.overtimeHours?.toFixed(2) || '0.00'}h OT</p>
                            </>
                          ) : (
                            <p>No attendance</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-dark-2 rounded border border-surface-dark-3 p-4">
                  <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Selected Employee</p>
                  <h4 className="text-xl font-bold text-white">
                    {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Choose an employee'}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {selectedEmployee?.position || 'No position'} • {selectedEmployee?.department || 'No department'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
                  <div className="bg-surface-dark-2 rounded border border-surface-dark-3 p-4">
                    <p className="text-text-tertiary text-xs uppercase tracking-wider">Worked Days</p>
                    <p className="text-2xl font-bold text-white mt-1">{selectedEmployeeStats.workedDays}</p>
                  </div>
                  <div className="bg-surface-dark-2 rounded border border-surface-dark-3 p-4">
                    <p className="text-text-tertiary text-xs uppercase tracking-wider">Total Hours</p>
                    <p className="text-2xl font-bold text-white mt-1">{selectedEmployeeStats.totalHours.toFixed(2)}h</p>
                  </div>
                  <div className="bg-surface-dark-2 rounded border border-surface-dark-3 p-4">
                    <p className="text-text-tertiary text-xs uppercase tracking-wider">Overtime</p>
                    <p className="text-2xl font-bold text-white mt-1">{selectedEmployeeStats.overtime.toFixed(2)}h</p>
                  </div>
                </div>

                <div className="bg-surface-dark-2 rounded border border-surface-dark-3 p-4 min-h-[220px]">
                  <p className="text-text-tertiary text-xs uppercase tracking-wider mb-3">Day Detail</p>
                  {selectedDayRecord ? (
                    <div className="space-y-2 text-sm">
                      <p className="text-white font-semibold">{new Date(selectedDayRecord.date).toLocaleDateString()}</p>
                      <p className="text-text-secondary">Clock In: {new Date(selectedDayRecord.clockIn).toLocaleTimeString()}</p>
                      <p className="text-text-secondary">
                        Clock Out: {selectedDayRecord.clockOut ? new Date(selectedDayRecord.clockOut).toLocaleTimeString() : 'Active Session'}
                      </p>
                      <p className="text-text-secondary">Working Hours: {selectedDayRecord.workingHours?.toFixed(2) || '0.00'}h</p>
                      <p className="text-text-secondary">Overtime: {selectedDayRecord.overtimeHours?.toFixed(2) || '0.00'}h</p>
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm">Click a worked day in the calendar to inspect hours and timestamps.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
