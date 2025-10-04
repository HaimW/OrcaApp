# 🔥 Firebase Integration - מסד נתונים בענן

## מה זה Firebase?
- מסד נתונים בענן של Google
- בחינם עד 1GB נתונים
- סנכרון אוטומטי בין מכשירים
- עבודה offline + sync כשחוזרים online

## התקנה:

### 1. הוספת Firebase לפרויקט
```bash
npm install firebase
```

### 2. יצירת קובץ Firebase Config
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "orca-dive-log.firebaseapp.com",
  projectId: "orca-dive-log",
  storageBucket: "orca-dive-log.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

### 3. Firebase Hooks
```javascript
// src/hooks/useFirestore.js
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = () => {
  // שמירת צלילה
  const addDiveEntry = async (entry) => {
    try {
      await addDoc(collection(db, 'diveEntries'), entry);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  // קבלת כל הצלילות
  const getDiveEntries = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'diveEntries'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  };

  // עדכון צלילה
  const updateDiveEntry = async (id, entry) => {
    try {
      await updateDoc(doc(db, 'diveEntries', id), entry);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  // מחיקת צלילה
  const deleteDiveEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'diveEntries', id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return { addDiveEntry, getDiveEntries, updateDiveEntry, deleteDiveEntry };
};
```

### 4. עדכון Redux Store
```javascript
// src/store/slices/diveEntriesSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useFirestore } from '../../hooks/useFirestore';

// Async actions
export const fetchDiveEntries = createAsyncThunk(
  'diveEntries/fetchAll',
  async () => {
    const { getDiveEntries } = useFirestore();
    return await getDiveEntries();
  }
);

export const saveDiveEntry = createAsyncThunk(
  'diveEntries/save',
  async (entry) => {
    const { addDiveEntry } = useFirestore();
    await addDiveEntry(entry);
    return entry;
  }
);
```

## יתרונות Firebase:
- ✅ סנכרון בין כל המכשירים
- ✅ גיבוי אוטומטי בענן
- ✅ עבודה offline
- ✅ אבטחה מתקדמת
- ✅ בחינם עד 1GB
- ✅ מהיר מאוד
- ✅ ניתן להוסיף authentication (התחברות משתמשים)

## הגדרה:
1. לך ל-https://console.firebase.google.com
2. צור פרויקט חדש
3. הוסף Web App
4. העתק את ה-config
5. הפעל Firestore Database
