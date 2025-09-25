export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
  role: UserRole;
  preferences: UserPreferences;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface AdminStats {
  totalUsers: number;
  totalDives: number;
  totalFish: number;
  activeUsersLastWeek: number;
  popularLocations: Array<{ location: string; count: number }>;
  userActivity: Array<{ date: string; count: number }>;
}

export interface UserPreferences {
  language: 'he' | 'en';
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  defaultLocation?: string;
  notifications: {
    diveReminders: boolean;
    weatherAlerts: boolean;
    safetyTips: boolean;
  };
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}
