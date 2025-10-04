// Local storage service as fallback when Firebase is not available
import { DiveEntry } from '../types';

const STORAGE_KEY = 'orca_dive_entries';

export class LocalStorageService {
  static getDiveEntries(): DiveEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  static saveDiveEntries(entries: DiveEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static addDiveEntry(entry: DiveEntry): void {
    const entries = this.getDiveEntries();
    entries.unshift(entry); // Add to beginning
    this.saveDiveEntries(entries);
  }

  static updateDiveEntry(entry: DiveEntry): void {
    const entries = this.getDiveEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      entries[index] = entry;
      this.saveDiveEntries(entries);
    }
  }

  static deleteDiveEntry(id: string): void {
    const entries = this.getDiveEntries();
    const filtered = entries.filter(e => e.id !== id);
    this.saveDiveEntries(filtered);
  }

  static clearAllEntries(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
