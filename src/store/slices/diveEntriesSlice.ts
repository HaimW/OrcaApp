import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DiveEntry, AppState } from '../../types';
import { FirebaseService } from '../../firebase/firestore';
import { AuthService } from '../../firebase/auth';
import { isUserAdmin } from '../../utils/adminConfig';

const initialState: AppState = {
  diveEntries: [],
  currentEntry: undefined,
  isLoading: false,
  error: undefined,
};

// Async thunks for Firebase operations
export const fetchDiveEntries = createAsyncThunk(
  'diveEntries/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth?: { user?: { email?: string | null } | null } };
      const email = state.auth?.user?.email;

      if (isUserAdmin(email)) {
        return await FirebaseService.getAllDiveEntries();
      }

      const userId = AuthService.getUserId();
      if (!userId) {
        return [] as DiveEntry[];
      }

      const entries = await FirebaseService.getDiveEntriesByUser(userId);
      return entries;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dive entries');
    }
  }
);

export const addDiveEntryAsync = createAsyncThunk(
  'diveEntries/add',
  async (entry: Omit<DiveEntry, 'id'>, { rejectWithValue }) => {
    try {
      console.log('Adding dive entry:', entry);
      const id = await FirebaseService.addDiveEntry(entry);
      console.log('Dive entry added with ID:', id);
      return { ...entry, id } as DiveEntry;
    } catch (error: any) {
      console.error('Error adding dive entry:', error);
      return rejectWithValue(error.message || 'Failed to add dive entry');
    }
  }
);

export const updateDiveEntryAsync = createAsyncThunk(
  'diveEntries/update',
  async (entry: DiveEntry, { rejectWithValue }) => {
    try {
      await FirebaseService.updateDiveEntry(entry.id, entry);
      return entry;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update dive entry');
    }
  }
);

export const deleteDiveEntryAsync = createAsyncThunk(
  'diveEntries/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await FirebaseService.deleteDiveEntry(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete dive entry');
    }
  }
);

export const importDiveEntriesAsync = createAsyncThunk(
  'diveEntries/import',
  async (entries: DiveEntry[], { rejectWithValue }) => {
    try {
      await FirebaseService.importDiveEntries(entries);
      // Fetch all entries after import
      const allEntries = await FirebaseService.getAllDiveEntries();
      return allEntries;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to import dive entries');
    }
  }
);

export const clearAllEntriesAsync = createAsyncThunk(
  'diveEntries/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await FirebaseService.clearAllDiveEntries();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear entries');
    }
  }
);

const diveEntriesSlice = createSlice({
  name: 'diveEntries',
  initialState,
  reducers: {
    setCurrentEntry: (state, action: PayloadAction<DiveEntry | undefined>) => {
      state.currentEntry = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = undefined;
    },

    // For real-time updates from Firebase
    setDiveEntries: (state, action: PayloadAction<DiveEntry[]>) => {
      state.diveEntries = action.payload;
      state.isLoading = false;
    },

    // Add entry from real-time listener
    addDiveEntryRealtime: (state, action: PayloadAction<DiveEntry>) => {
      const exists = state.diveEntries.find(entry => entry.id === action.payload.id);
      if (!exists) {
        state.diveEntries.unshift(action.payload);
      }
    },

    // Update entry from real-time listener
    updateDiveEntryRealtime: (state, action: PayloadAction<DiveEntry>) => {
      const index = state.diveEntries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.diveEntries[index] = action.payload;
      }
    },

    // Remove entry from real-time listener
    removeDiveEntryRealtime: (state, action: PayloadAction<string>) => {
      state.diveEntries = state.diveEntries.filter(entry => entry.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch dive entries
    builder
      .addCase(fetchDiveEntries.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchDiveEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diveEntries = action.payload;
      })
      .addCase(fetchDiveEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add dive entry
    builder
      .addCase(addDiveEntryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(addDiveEntryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Don't add here if using real-time listener
        if (!state.diveEntries.find(entry => entry.id === action.payload.id)) {
          state.diveEntries.unshift(action.payload);
        }
      })
      .addCase(addDiveEntryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update dive entry
    builder
      .addCase(updateDiveEntryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateDiveEntryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.diveEntries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.diveEntries[index] = action.payload;
        }
      })
      .addCase(updateDiveEntryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete dive entry
    builder
      .addCase(deleteDiveEntryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteDiveEntryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diveEntries = state.diveEntries.filter(entry => entry.id !== action.payload);
      })
      .addCase(deleteDiveEntryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Import dive entries
    builder
      .addCase(importDiveEntriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(importDiveEntriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diveEntries = action.payload;
      })
      .addCase(importDiveEntriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clear all entries
    builder
      .addCase(clearAllEntriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(clearAllEntriesAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.diveEntries = [];
      })
      .addCase(clearAllEntriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentEntry,
  setError,
  clearError,
  setDiveEntries,
  addDiveEntryRealtime,
  updateDiveEntryRealtime,
  removeDiveEntryRealtime,
} = diveEntriesSlice.actions;

export default diveEntriesSlice.reducer;
