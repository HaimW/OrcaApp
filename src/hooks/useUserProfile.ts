import { useEffect, useState } from 'react';
import { useAppSelector } from './useAppSelector';
import { UserProfile, UserProfilesService } from '../firebase/userProfiles';

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || user.isAnonymous) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);

    const unsubscribe = UserProfilesService.subscribeToCurrentUserProfile(user.uid, (nextProfile) => {
      setProfile(nextProfile);
      setIsProfileLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user?.uid, user?.isAnonymous]);

  return {
    profile,
    isProfileLoading,
    isAdmin: profile?.role === 'admin' && profile.isActive,
    isActive: profile?.isActive ?? false,
  };
};
