import { 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';

export class AuthService {
  // Sign in anonymously (for users who don't want to create an account)
  static async signInAnonymously(): Promise<User> {
    try {
      const result = await signInAnonymously(auth);
      console.log('Signed in anonymously:', result.user.uid);
      return result.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
    return onAuthStateChanged(auth, callback);
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
