import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, LoginCredentials, RegisterData, UserPreferences } from '../../types/user';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'orca_users';
const CURRENT_USER_KEY = 'orca_current_user';

// Helper functions for localStorage
const loadUsersFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const loadCurrentUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveCurrentUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const initialState: AuthState = {
  currentUser: loadCurrentUserFromStorage(),
  isAuthenticated: !!loadCurrentUserFromStorage(),
  users: loadUsersFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    registerUser: (state, action: PayloadAction<RegisterData>) => {
      const { username, email, fullName, password } = action.payload;
      
      // Check if user already exists
      const existingUser = state.users.find(
        user => user.username === username || user.email === email
      );
      
      if (existingUser) {
        state.error = existingUser.username === username 
          ? 'שם המשתמש כבר קיים במערכת'
          : 'כתובת האימייל כבר רשומה במערכת';
        return;
      }

      const newUser: User = {
        id: uuidv4(),
        username,
        email,
        fullName,
        createdAt: new Date().toISOString(),
        role: username === 'admin' ? 'admin' : 'user', // Auto-admin for username 'admin'
        preferences: {
          language: 'he',
          units: 'metric',
          theme: 'light',
          notifications: {
            diveReminders: true,
            weatherAlerts: true,
            safetyTips: true,
          },
        },
      };

      state.users.push(newUser);
      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      saveUsersToStorage(state.users);
      saveCurrentUserToStorage(newUser);
    },

    loginUser: (state, action: PayloadAction<LoginCredentials>) => {
      const { username, password } = action.payload;
      
      const user = state.users.find(u => u.username === username);
      
      if (!user) {
        state.error = 'שם משתמש או סיסמה שגויים';
        return;
      }

      // In a real app, you would verify the password hash
      // For demo purposes, we'll just check if password is not empty
      if (!password) {
        state.error = 'נדרשת סיסמה';
        return;
      }

      state.currentUser = user;
      state.isAuthenticated = true;
      state.error = null;

      saveCurrentUserToStorage(user);
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;

      saveCurrentUserToStorage(null);
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.currentUser) return;

      const updatedUser = { ...state.currentUser, ...action.payload };
      
      // Update in users array
      const userIndex = state.users.findIndex(u => u.id === state.currentUser!.id);
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }

      state.currentUser = updatedUser;

      // Save to localStorage
      saveUsersToStorage(state.users);
      saveCurrentUserToStorage(updatedUser);
    },

    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (!state.currentUser) return;

      const updatedPreferences = {
        ...state.currentUser.preferences,
        ...action.payload,
      };

      const updatedUser = {
        ...state.currentUser,
        preferences: updatedPreferences,
      };

      // Update in users array
      const userIndex = state.users.findIndex(u => u.id === state.currentUser!.id);
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }

      state.currentUser = updatedUser;

      // Save to localStorage
      saveUsersToStorage(state.users);
      saveCurrentUserToStorage(updatedUser);
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  updateUserPreferences,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
