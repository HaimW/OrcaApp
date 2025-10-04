import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
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
      const docData = {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
      console.log('Dive entry added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding dive entry: ', error);
      throw error;
    }
  }

  // Get all dive entries
  static async getAllDiveEntries(): Promise<DiveEntry[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
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
      console.error('Error getting dive entries: ', error);
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
      
      const querySnapshot = await getDocs(q);
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
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: DiveEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      callback(entries);
    }, (error) => {
      console.error('Error in real-time listener: ', error);
    });
    
    return unsubscribe;
  }

  // Real-time listener for user's dive entries
  static subscribeToUserDiveEntries(userId: string, callback: (entries: DiveEntry[]) => void): () => void {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: DiveEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push(convertTimestamps({
          id: doc.id,
          ...data,
        }));
      });
      callback(entries);
    }, (error) => {
      console.error('Error in user real-time listener: ', error);
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
