import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { AuthService } from '../../firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
  isAnonymous: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: undefined,
  isAuthenticated: false,
  isAnonymous: false,
};

// Async thunks for authentication
export const signInAnonymouslyAsync = createAsyncThunk(
  'auth/signInAnonymously',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInAnonymously();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign in anonymously');
    }
  }
);

export const signInWithGoogleAsync = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithGoogle();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign in with Google');
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign out');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isAnonymous = action.payload?.isAnonymous || false;
      state.isLoading = false;
    },
    
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setAuthError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    
    clearAuthError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Sign in anonymously
    builder
      .addCase(signInAnonymouslyAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(signInAnonymouslyAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAnonymous = true;
      })
      .addCase(signInAnonymouslyAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with Google
    builder
      .addCase(signInWithGoogleAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(signInWithGoogleAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAnonymous = false;
      })
      .addCase(signInWithGoogleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOutAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAnonymous = false;
      })
      .addCase(signOutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;