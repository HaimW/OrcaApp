import { createLazyComponent } from '../components/UI/LazyComponent';

// Lazy load pages for better performance
export const LazyHomePage = createLazyComponent(() => import('./HomePage'));
export const LazyEntriesPage = createLazyComponent(() => import('./EntriesPage'));
export const LazyAddEntryPage = createLazyComponent(() => import('./AddEntryPage'));
export const LazyStatsPage = createLazyComponent(() => import('./StatsPage'));
export const LazySettingsPage = createLazyComponent(() => import('./SettingsPage'));
export const LazyEntryDetailPage = createLazyComponent(() => import('./EntryDetailPage'));
