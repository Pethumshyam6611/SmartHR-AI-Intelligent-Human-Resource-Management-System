import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  LoginRequest,
  LoginResponse,
  ClockInRequest,
  ClockOutRequest,
  Attendance,
  Leave,
  User,
} from '@/types';

const API_URL = __DEV__
  ? 'http://10.0.2.2:5000/api' // Android emulator
  : 'https://api.smarthr.com/api'; // Production

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await AsyncStorage.multiRemove(['auth_token', 'user_data']);
        }
        return Promise.reject(error);
      },
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Attendance
  async clockIn(data: ClockInRequest): Promise<Attendance> {
    const response = await this.client.post('/attendance/clock-in', data);
    return response.data;
  }

  async clockOut(data: ClockOutRequest): Promise<Attendance> {
    const response = await this.client.post('/attendance/clock-out', data);
    return response.data;
  }

  async getMyAttendance(startDate?: string, endDate?: string): Promise<Attendance[]> {
    const response = await this.client.get('/attendance/my-attendance', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async getTodayAttendance(): Promise<Attendance | null> {
    const response = await this.client.get('/attendance/today');
    return response.data;
  }

  // Leaves
  async getMyLeaves(): Promise<Leave[]> {
    const response = await this.client.get('/leaves/my-leaves');
    return response.data;
  }

  async applyLeave(data: Partial<Leave>): Promise<Leave> {
    const response = await this.client.post('/leaves', data);
    return response.data;
  }
}

export default new ApiService();
