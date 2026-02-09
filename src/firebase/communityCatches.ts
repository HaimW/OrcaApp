import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from './config';
import { CommunityCatchPost } from '../types';

const COLLECTION_NAME = 'communityCatches';

const toPost = (id: string, data: any): CommunityCatchPost => ({
  id,
  userId: data.userId,
  userName: data.userName || 'Spearo',
  species: data.species,
  weightKg: data.weightKg,
  location: data.location,
  catchDate: data.catchDate,
  notes: data.notes || '',
  createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
});

export class CommunityCatchesService {
  static async addPost(post: Omit<CommunityCatchPost, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  static async getPosts(): Promise<CommunityCatchPost[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => toPost(doc.id, doc.data()));
  }

  static subscribeToPosts(callback: (posts: CommunityCatchPost[]) => void): () => void {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => toPost(doc.id, doc.data()));
      callback(posts);
    });
  }

  static subscribeToUserPosts(userId: string, callback: (posts: CommunityCatchPost[]) => void): () => void {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => toPost(doc.id, doc.data()));
      callback(posts);
    });
  }
}
