import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { 
  signInAnonymouslyAsync,
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
    dispatch(setAuthLoading(true));
    
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

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
    signInAnonymously,
    signInWithGoogle,
    signOut,
    getUserDisplayName,
    getUserId,
  };
};
