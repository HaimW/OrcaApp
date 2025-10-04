import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration - Real config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA_Km-ls6o_ES1yChEOBQrcqdOMH9_7vPU",
  authDomain: "orcaapp-54de4.firebaseapp.com",
  projectId: "orcaapp-54de4",
  storageBucket: "orcaapp-54de4.firebasestorage.app",
  messagingSenderId: "223505290661",
  appId: "1:223505290661:web:4698446b1c612ca74c444c",
  measurementId: "G-YZ01ES5350"
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
