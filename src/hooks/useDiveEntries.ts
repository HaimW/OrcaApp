import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { 
  fetchDiveEntries,
  addDiveEntryAsync,
  updateDiveEntryAsync,
  deleteDiveEntryAsync,
  importDiveEntriesAsync,
  clearAllEntriesAsync,
  setDiveEntries,
  addDiveEntryRealtime,
  updateDiveEntryRealtime,
  removeDiveEntryRealtime,
} from '../store/slices/diveEntriesSlice';
import { FirebaseService } from '../firebase/firestore';
import { LocalStorageService } from '../services/localStorage';
import { AuthService } from '../firebase/auth';
import { DiveEntry } from '../types';

export const useDiveEntries = () => {
  const dispatch = useAppDispatch();
  const { diveEntries, isLoading, error } = useAppSelector((state) => state.diveEntries);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch entries on mount or when user changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDiveEntries());
    }
  }, [dispatch, isAuthenticated, user?.uid]);

  // Set up real-time listener
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe: (() => void) | undefined;

    try {
      console.log('Setting up Firebase listener for user:', user?.uid);
      
      if (user?.uid) {
        // For all users (including anonymous), listen only to their entries
        unsubscribe = FirebaseService.subscribeToUserDiveEntries(user.uid, (entries) => {
          console.log('Firebase listener received entries:', entries.length);
          dispatch(setDiveEntries(entries));
        });
      }
    } catch (error) {
      console.error('Firebase listener failed:', error);
      // Fallback to localStorage
      const entries = LocalStorageService.getDiveEntries();
      dispatch(setDiveEntries(entries));
    }

    return () => {
      if (unsubscribe) {
        console.log('Cleaning up Firebase listener');
        unsubscribe();
      }
    };
  }, [dispatch, isAuthenticated, user?.uid, user?.isAnonymous]);

  const addEntry = async (entry: Omit<DiveEntry, 'id'>) => {
    try {
      // Add userId to entry
      const entryWithUser = {
        ...entry,
        userId: user?.uid || 'anonymous'
      };
      
      console.log('Attempting to add entry to Firebase:', entryWithUser);
      
      // Try Firebase first
      const result = await dispatch(addDiveEntryAsync(entryWithUser));
      
      console.log('Firebase result:', result.type);
      
      // If Firebase fails, use localStorage as fallback
      if (result.type.endsWith('/rejected')) {
        console.log('Firebase failed, using localStorage fallback');
        const newEntry: DiveEntry = {
          ...entryWithUser,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        LocalStorageService.addDiveEntry(newEntry);
        dispatch(addDiveEntryRealtime(newEntry));
        console.log('Entry added successfully to localStorage');
      } else {
        console.log('Entry added successfully to Firebase');
      }
      
      return result;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  };

  const updateEntry = async (entry: DiveEntry) => {
    return dispatch(updateDiveEntryAsync(entry));
  };

  const deleteEntry = async (id: string) => {
    return dispatch(deleteDiveEntryAsync(id));
  };

  const importEntries = async (entries: DiveEntry[]) => {
    return dispatch(importDiveEntriesAsync(entries));
  };

  const clearAllEntries = async () => {
    return dispatch(clearAllEntriesAsync());
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(diveEntries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `orca-dive-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return {
    diveEntries,
    isLoading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    importEntries,
    clearAllEntries,
    exportEntries,
  };
};
