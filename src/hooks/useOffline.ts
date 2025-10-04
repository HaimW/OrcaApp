import { useState, useEffect } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  connectionType: string | null;
}

export const useOffline = () => {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    lastOnline: navigator.onLine ? new Date() : null,
    connectionType: null
  });

  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOnline: true,
        isOffline: false,
        lastOnline: new Date()
      }));
    };

    const handleOffline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOnline: false,
        isOffline: true
      }));
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    const checkConnectionType = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setOfflineState(prev => ({
          ...prev,
          connectionType: connection?.effectiveType || 'unknown'
        }));
      }
    };

    checkConnectionType();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return offlineState;
};
