import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthWrapper from './components/Auth/AuthWrapper';
import BottomNav from './components/Layout/BottomNav';
import ErrorBoundary from './components/UI/ErrorBoundary';
import OfflineIndicator from './components/UI/OfflineIndicator';
import {
  LazyHomePage,
  LazyEntriesPage,
  LazyAddEntryPage,
  LazyStatsPage,
  LazySettingsPage,
  LazyEntryDetailPage
} from './pages/LazyPages';

function App() {
  return (
    <ErrorBoundary>
      <AuthWrapper>
        <OfflineIndicator />
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<LazyHomePage />} />
            <Route path="/entries" element={<LazyEntriesPage />} />
            <Route path="/entries/:id" element={<LazyEntryDetailPage />} />
            <Route path="/add" element={<LazyAddEntryPage />} />
            <Route path="/edit/:id" element={<LazyAddEntryPage />} />
            <Route path="/stats" element={<LazyStatsPage />} />
            <Route path="/settings" element={<LazySettingsPage />} />
          </Routes>
          <BottomNav />
        </div>
      </AuthWrapper>
    </ErrorBoundary>
  );
}

export default App;