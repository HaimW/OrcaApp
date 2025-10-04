import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
// החלף את הערכים האלה בערכים האמיתיים מ-Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC7XxXxXxXxXxXxXxXxXxXxXxXxXxX", // החלף עם ה-API Key שלך
  authDomain: "orca-dive-log.firebaseapp.com", // החלף עם הדומיין שלך
  projectId: "orca-dive-log", // החלף עם ה-Project ID שלך
  storageBucket: "orca-dive-log.appspot.com", // החלף עם ה-Storage Bucket שלך
  messagingSenderId: "123456789012", // החלף עם ה-Sender ID שלך
  appId: "1:123456789012:web:abcdefghijklmnop123456" // החלף עם ה-App ID שלך
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Development mode - uncomment for local testing
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

export default app;
