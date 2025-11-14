export enum Role {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum LeaveType {
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  VACATION = 'VACATION',
  UNPAID = 'UNPAID',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  employee?: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  joiningDate: string;
  salary: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut?: string;
  clockInLatitude?: number;
  clockInLongitude?: number;
  clockOutLatitude?: number;
  clockOutLongitude?: number;
  workingHours?: number;
  overtimeHours?: number;
  date: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewComments?: string;
}

export interface ClockInRequest {
  latitude: number;
  longitude: number;
}

export interface ClockOutRequest {
  latitude: number;
  longitude: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
