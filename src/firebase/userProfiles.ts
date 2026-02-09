import {
  collection,
  doc,
  getDoc,
  getDocsFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';

export type AppUserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AppUserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface FirestoreUserProfile {
  uid?: string;
  email?: string;
  displayName?: string;
  role?: AppUserRole;
  isActive?: boolean;
  createdAt?: Timestamp | string;
  lastLoginAt?: Timestamp | string;
}

const USERS_COLLECTION = 'users';

const normalizeDate = (value?: Timestamp | string): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toDate().toISOString();
};

const normalizeProfile = (uid: string, data: FirestoreUserProfile): UserProfile | null => {
  if (!data.email) {
    return null;
  }

  return {
    uid,
    email: data.email,
    displayName: data.displayName || data.email.split('@')[0],
    role: data.role === 'admin' ? 'admin' : 'user',
    isActive: data.isActive !== false,
    createdAt: normalizeDate(data.createdAt) || new Date().toISOString(),
    lastLoginAt: normalizeDate(data.lastLoginAt),
  };
};

export class UserProfilesService {
  static async upsertCurrentUser(user: User): Promise<void> {
    if (!user.email) {
      return;
    }

    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const isNewUser = !userDocSnapshot.exists();

    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        lastLoginAt: serverTimestamp(),
        ...(isNewUser
          ? {
              role: 'user',
              isActive: true,
            }
          : {}),
      },
      { merge: true }
    );
  }

  static subscribeToCurrentUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
    return onSnapshot(doc(db, USERS_COLLECTION, uid), (docSnapshot) => {
      if (!docSnapshot.exists()) {
        callback(null);
        return;
      }

      callback(normalizeProfile(docSnapshot.id, docSnapshot.data() as FirestoreUserProfile));
    });
  }

  static subscribeToAllProfiles(callback: (profiles: UserProfile[]) => void): () => void {
    const usersQuery = query(collection(db, USERS_COLLECTION));

    return onSnapshot(usersQuery, (snapshot) => {
      const profiles = snapshot.docs
        .map((docSnapshot) => normalizeProfile(docSnapshot.id, docSnapshot.data() as FirestoreUserProfile))
        .filter((profile): profile is UserProfile => profile !== null)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      callback(profiles);
    });
  }

  static async fetchAllProfilesFromServer(): Promise<UserProfile[]> {
    const snapshot = await getDocsFromServer(collection(db, USERS_COLLECTION));

    return snapshot.docs
      .map((docSnapshot) => normalizeProfile(docSnapshot.id, docSnapshot.data() as FirestoreUserProfile))
      .filter((profile): profile is UserProfile => profile !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  static async updateUserStatus(uid: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateUserRole(uid: string, role: AppUserRole): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      role,
      updatedAt: serverTimestamp(),
    });
  }
}
