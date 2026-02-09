import { 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './config';

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string;
}

const USERS_STORAGE_KEY = 'orca_users';

const persistUserLocally = (user: User): void => {
  if (!user.email) {
    return;
  }

  const nowIso = new Date().toISOString();

  try {
    const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as StoredUser[];
    const existingUser = existingUsers.find(storedUser => storedUser.uid === user.uid);

    const updatedUser: StoredUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      createdAt: existingUser?.createdAt || user.metadata.creationTime || nowIso,
      lastLoginAt: nowIso,
    };

    const updatedUsers = [
      updatedUser,
      ...existingUsers.filter(storedUser => storedUser.uid !== user.uid),
    ];

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.warn('Failed to persist user list locally:', error);
  }
};

export class AuthService {
  // Sign in anonymously (for users who don't want to create an account)
  static async signInAnonymously(): Promise<User> {
    try {
      console.log('Attempting anonymous sign in...');
      const result = await signInAnonymously(auth);
      console.log('Signed in anonymously:', result.user.uid);
      return result.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }

  // Sign up with email and password
  static async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    try {
      console.log('Creating user account...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(result.user, {
        displayName: displayName
      });

      persistUserLocally(result.user);
      
      console.log('User created successfully:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('Error creating user account:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      console.log('Signing in with email...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      persistUserLocally(result.user);
      console.log('Signed in successfully:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      persistUserLocally(result.user);
      console.log('Signed in with Google:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    console.log('Setting up auth state listener');
    return onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      callback(user);
    });
  }

  // Check if user is anonymous
  static isAnonymous(): boolean {
    const user = auth.currentUser;
    return user ? user.isAnonymous : false;
  }

  // Get user display name or fallback
  static getUserDisplayName(): string {
    const user = auth.currentUser;
    if (!user) return 'אורח';
    if (user.isAnonymous) return 'משתמש אנונימי';
    return user.displayName || user.email || 'משתמש';
  }

  // Get user ID for Firestore queries
  static getUserId(): string | null {
    const user = auth.currentUser;
    return user ? user.uid : null;
  }
}
