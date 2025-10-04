import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { analytics } from '../services/analytics';

export const useAnalytics = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      const pageName = window.location.pathname;
      analytics.trackPageView(pageName, user?.uid || undefined);
    };

    // Track initial page view
    trackPageView();

    // Track navigation changes
    const handlePopState = () => {
      trackPageView();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user?.uid]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, {
      ...properties,
      userId: user?.uid
    });
  };

  const trackDiveEntry = (action: 'created' | 'updated' | 'deleted', entryId: string) => {
    switch (action) {
      case 'created':
        analytics.trackDiveEntryCreated(entryId, user?.uid);
        break;
      case 'updated':
        analytics.trackDiveEntryUpdated(entryId, user?.uid);
        break;
      case 'deleted':
        analytics.trackDiveEntryDeleted(entryId, user?.uid);
        break;
    }
  };

  const trackSearch = (query: string, resultsCount: number) => {
    analytics.trackSearch(query, resultsCount, user?.uid);
  };

  const trackFilter = (filterType: string, filterValue: string) => {
    analytics.trackFilterUsed(filterType, filterValue, user?.uid);
  };

  const trackError = (error: string, context: string) => {
    analytics.trackError(error, context, user?.uid);
  };

  const trackPerformance = (metric: string, value: number) => {
    analytics.trackPerformance(metric, value, user?.uid);
  };

  return {
    trackEvent,
    trackDiveEntry,
    trackSearch,
    trackFilter,
    trackError,
    trackPerformance
  };
};
