import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { AuthService } from '../../firebase/auth';

// Serializable user data for Redux store
interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  isLoading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
  isAnonymous: boolean;
}

// Helper function to convert Firebase User to serializable object
const userToSerializable = (user: User | null): SerializableUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
};

const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true while checking auth state
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

export const signUpWithEmailAsync = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      const user = await AuthService.signUpWithEmail(email, password, displayName);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create account');
    }
  }
);

export const signInWithEmailAsync = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithEmail(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign in');
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
      console.log('setUser called with:', action.payload ? 'User' : 'null');
      state.user = userToSerializable(action.payload);
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
        state.user = userToSerializable(action.payload);
        state.isAuthenticated = true;
        state.isAnonymous = true;
      })
      .addCase(signInAnonymouslyAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign up with email
    builder
      .addCase(signUpWithEmailAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(signUpWithEmailAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = userToSerializable(action.payload);
        state.isAuthenticated = true;
        state.isAnonymous = false;
      })
      .addCase(signUpWithEmailAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with email
    builder
      .addCase(signInWithEmailAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(signInWithEmailAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = userToSerializable(action.payload);
        state.isAuthenticated = true;
        state.isAnonymous = false;
      })
      .addCase(signInWithEmailAsync.rejected, (state, action) => {
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
        state.user = userToSerializable(action.payload);
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

export type { SerializableUser };

export default authSlice.reducer;