import { 
  collection, 
  addDoc, 
  getDocs, 
  getDocsFromServer,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './config';
import { DiveEntry } from '../types';

const COLLECTION_NAME = 'diveEntries';

// Helper function to convert Firestore timestamps
const convertTimestamps = (data: any): DiveEntry => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
  };
};

export class FirebaseService {
  // Add a new dive entry
  static async addDiveEntry(entry: Omit<DiveEntry, 'id'>): Promise<string> {
    try {
      console.log('FirebaseService.addDiveEntry called with:', entry);
      
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser ? 'authenticated' : 'not authenticated');
      console.log('User UID:', currentUser?.uid);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const docData = {
        ...entry,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      console.log('Document data to save:', docData);
      console.log('Collection name:', COLLECTION_NAME);
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
      console.log('Dive entry added with ID: ', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding dive entry: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('אין הרשאה לשמור צלילה. אנא בדוק את Firebase Rules.');
      } else if (error.code === 'unavailable') {
        throw new Error('שירות Firebase לא זמין. אנא נסה שוב מאוחר יותר.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('משתמש לא מחובר. אנא התחבר מחדש.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('שגיאה לא ידועה בשמירת הצלילה');
      }
    }
  }

  // Get all dive entries
  static async getAllDiveEntries(): Promise<DiveEntry[]> {
    try {
      console.log('FirebaseService.getAllDiveEntries called');
      console.log('Current user:', auth.currentUser ? 'authenticated' : 'not authenticated');
      console.log('User UID:', auth.currentUser?.uid);
      
      // Try simple query first without orderBy to avoid index issues
      const q = collection(db, COLLECTION_NAME);
      
      console.log('Executing query...');
      const querySnapshot = await getDocsFromServer(q);
      console.log('Query snapshot size:', querySnapshot.size);
      
      const entries: DiveEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document data:', doc.id, data);
        
        // Skip documents that don't have required dive entry fields
        if (!data.date || !data.location) {
          console.warn('Skipping invalid document:', doc.id);
          return;
        }
        
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      
      console.log('Returning entries:', entries.length);
      return entries;
    } catch (error: any) {
      console.error('Error getting dive entries: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  // Update a dive entry
  static async updateDiveEntry(id: string, entry: Partial<DiveEntry>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        ...entry,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);
      console.log('Dive entry updated: ', id);
    } catch (error) {
      console.error('Error updating dive entry: ', error);
      throw error;
    }
  }

  // Delete a dive entry
  static async deleteDiveEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      console.log('Dive entry deleted: ', id);
    } catch (error) {
      console.error('Error deleting dive entry: ', error);
      throw error;
    }
  }

  // Get dive entries by user (when authentication is added)
  static async getDiveEntriesByUser(userId: string): Promise<DiveEntry[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocsFromServer(q);
      const entries: DiveEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      
      return entries;
    } catch (error) {
      console.error('Error getting user dive entries: ', error);
      throw error;
    }
  }

  // Real-time listener for dive entries
  static subscribeToAllDiveEntries(callback: (entries: DiveEntry[]) => void): () => void {
    console.log('Setting up real-time listener for all entries');
    
    // Use simple collection reference to avoid index issues
    const q = collection(db, COLLECTION_NAME);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Real-time listener received snapshot:', querySnapshot.size, 'entries');
      const entries: DiveEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Skip documents that don't have required dive entry fields
        if (!data.date || !data.location) {
          console.warn('Skipping invalid document:', doc.id);
          return;
        }
        
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      callback(entries);
    }, (error) => {
      console.error('Error in real-time listener: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    });
    
    return unsubscribe;
  }

  // Real-time listener for user's dive entries
  static subscribeToUserDiveEntries(userId: string, callback: (entries: DiveEntry[]) => void): () => void {
    console.log('Setting up real-time listener for user:', userId);
    
    // Use simple where query without orderBy to avoid index issues
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Real-time listener received snapshot:', querySnapshot.size, 'entries');
      const entries: DiveEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Skip documents that don't have required dive entry fields
        if (!data.date || !data.location) {
          console.warn('Skipping invalid document:', doc.id);
          return;
        }
        
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      callback(entries);
    }, (error) => {
      console.error('Error in user real-time listener: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Show user-friendly error message
      if (error.code === 'permission-denied') {
        alert('שגיאת הרשאות: אנא בדוק את הגדרות Firebase Rules');
      } else if (error.code === 'unavailable') {
        alert('שירות Firebase לא זמין. אנא נסה שוב מאוחר יותר.');
      }
    });
    
    return unsubscribe;
  }

  // Batch operations for importing data
  static async importDiveEntries(entries: DiveEntry[]): Promise<void> {
    try {
      const promises = entries.map(entry => {
        const { id, ...entryData } = entry;
        return this.addDiveEntry(entryData);
      });
      
      await Promise.all(promises);
      console.log('All dive entries imported successfully');
    } catch (error) {
      console.error('Error importing dive entries: ', error);
      throw error;
    }
  }

  // Clear all dive entries (for development/testing)
  static async clearAllDiveEntries(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('All dive entries cleared');
    } catch (error) {
      console.error('Error clearing dive entries: ', error);
      throw error;
    }
  }
}
