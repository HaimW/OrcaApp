import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiveEntry, AppState } from '../../types';

const initialState: AppState = {
  diveEntries: [],
  currentEntry: undefined,
  isLoading: false,
  error: undefined,
};

// Load from localStorage for specific user
const loadFromStorage = (userId?: string): DiveEntry[] => {
  try {
    if (!userId) return [];
    const stored = localStorage.getItem(`orca-dive-entries-${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

// Save to localStorage for specific user
const saveToStorage = (entries: DiveEntry[], userId?: string) => {
  try {
    if (!userId) return;
    localStorage.setItem(`orca-dive-entries-${userId}`, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const diveEntriesSlice = createSlice({
  name: 'diveEntries',
  initialState,
  reducers: {
    loadUserEntries: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.diveEntries = loadFromStorage(userId);
    },

    addDiveEntry: (state, action: PayloadAction<DiveEntry & { userId: string }>) => {
      const { userId, ...entry } = action.payload;
      state.diveEntries.unshift(entry);
      saveToStorage(state.diveEntries, userId);
    },
    
    updateDiveEntry: (state, action: PayloadAction<DiveEntry & { userId: string }>) => {
      const { userId, ...entry } = action.payload;
      const index = state.diveEntries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        state.diveEntries[index] = entry;
        saveToStorage(state.diveEntries, userId);
      }
    },
    
    deleteDiveEntry: (state, action: PayloadAction<{ entryId: string; userId: string }>) => {
      const { entryId, userId } = action.payload;
      state.diveEntries = state.diveEntries.filter(entry => entry.id !== entryId);
      saveToStorage(state.diveEntries, userId);
    },
    
    setCurrentEntry: (state, action: PayloadAction<DiveEntry | undefined>) => {
      state.currentEntry = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    
    clearEntries: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.diveEntries = [];
      localStorage.removeItem(`orca-dive-entries-${userId}`);
    },
    
    importEntries: (state, action: PayloadAction<{ entries: DiveEntry[]; userId: string }>) => {
      const { entries, userId } = action.payload;
      state.diveEntries = entries;
      saveToStorage(state.diveEntries, userId);
    },
  },
});

export const {
  loadUserEntries,
  addDiveEntry,
  updateDiveEntry,
  deleteDiveEntry,
  setCurrentEntry,
  setLoading,
  setError,
  clearEntries,
  importEntries,
} = diveEntriesSlice.actions;

export default diveEntriesSlice.reducer;

