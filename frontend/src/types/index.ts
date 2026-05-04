export enum Role {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
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

export enum LeaveApprovalStage {
  DEPARTMENT_HEAD_REVIEW = 'DEPARTMENT_HEAD_REVIEW',
  HR_REVIEW = 'HR_REVIEW',
  COMPLETED = 'COMPLETED',
}

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
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
  dateOfBirth?: string;
  address?: string;
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
  employee?: Employee;
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  currentStage: LeaveApprovalStage;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
  departmentHeadReviewedAt?: string;
  departmentHeadReviewedBy?: string;
  departmentHeadComments?: string;
  hrReviewedAt?: string;
  hrReviewedBy?: string;
  hrReviewComments?: string;
  employee?: Employee;
}

export interface Payroll {
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
  employee?: Employee;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  location?: string;
  status: JobStatus;
  postedAt: string;
  closedAt?: string;
}

export interface Application {
  id: string;
  jobPostingId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumePath: string;
  coverLetter?: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiAnalysis?: string;
  appliedAt: string;
  reviewedAt?: string;
  jobPosting?: JobPosting;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
