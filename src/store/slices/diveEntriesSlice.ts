import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiveEntry, AppState } from '../../types';

const initialState: AppState = {
  diveEntries: [],
  currentEntry: undefined,
  isLoading: false,
  error: undefined,
};

// Load from localStorage on initialization
const loadFromStorage = (): DiveEntry[] => {
  try {
    const stored = localStorage.getItem('orca-dive-entries');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

// Save to localStorage
const saveToStorage = (entries: DiveEntry[]) => {
  try {
    localStorage.setItem('orca-dive-entries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const diveEntriesSlice = createSlice({
  name: 'diveEntries',
  initialState: {
    ...initialState,
    diveEntries: loadFromStorage(),
  },
  reducers: {
    addDiveEntry: (state, action: PayloadAction<DiveEntry>) => {
      state.diveEntries.unshift(action.payload);
      saveToStorage(state.diveEntries);
    },
    
    updateDiveEntry: (state, action: PayloadAction<DiveEntry>) => {
      const index = state.diveEntries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.diveEntries[index] = action.payload;
        saveToStorage(state.diveEntries);
      }
    },
    
    deleteDiveEntry: (state, action: PayloadAction<string>) => {
      state.diveEntries = state.diveEntries.filter(entry => entry.id !== action.payload);
      saveToStorage(state.diveEntries);
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
    
    clearEntries: (state) => {
      state.diveEntries = [];
      localStorage.removeItem('orca-dive-entries');
    },
    
    importEntries: (state, action: PayloadAction<DiveEntry[]>) => {
      state.diveEntries = action.payload;
      saveToStorage(state.diveEntries);
    },
  },
});

export const {
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

