import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { 
  signInAnonymouslyAsync,
  signUpWithEmailAsync,
  signInWithEmailAsync,
  signInWithGoogleAsync,
  signOutAsync,
  setUser,
  setAuthLoading,
} from '../store/slices/authSlice';
import { AuthService } from '../firebase/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated, isAnonymous } = useAppSelector((state) => state.auth);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    return dispatch(signUpWithEmailAsync({ email, password, displayName }));
  };

  const signInWithEmail = async (email: string, password: string) => {
    return dispatch(signInWithEmailAsync({ email, password }));
  };

  const signInAnonymously = async () => {
    return dispatch(signInAnonymouslyAsync());
  };

  const signInWithGoogle = async () => {
    return dispatch(signInWithGoogleAsync());
  };

  const signOut = async () => {
    return dispatch(signOutAsync());
  };

  const getUserDisplayName = () => {
    return AuthService.getUserDisplayName();
  };

  const getUserId = () => {
    return AuthService.getUserId();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAnonymous,
    signUpWithEmail,
    signInWithEmail,
    signInAnonymously,
    signInWithGoogle,
    signOut,
    getUserDisplayName,
    getUserId,
  };
};
