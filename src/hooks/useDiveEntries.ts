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

    if (user?.isAnonymous) {
      // For anonymous users, listen to all entries
      unsubscribe = FirebaseService.subscribeToAllDiveEntries((entries) => {
        dispatch(setDiveEntries(entries));
      });
    } else if (user?.uid) {
      // For authenticated users, listen to their entries only
      unsubscribe = FirebaseService.subscribeToUserDiveEntries(user.uid, (entries) => {
        dispatch(setDiveEntries(entries));
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch, isAuthenticated, user?.uid, user?.isAnonymous]);

  const addEntry = async (entry: Omit<DiveEntry, 'id'>) => {
    return dispatch(addDiveEntryAsync(entry));
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
