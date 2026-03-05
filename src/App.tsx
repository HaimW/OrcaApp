import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AuthWrapper from './components/Auth/AuthWrapper';
import BottomNav from './components/Layout/BottomNav';
import ErrorBoundary from './components/UI/ErrorBoundary';
import OfflineIndicator from './components/UI/OfflineIndicator';
import FirebaseStatus from './components/UI/FirebaseStatus';
import EntriesPage from './pages/EntriesPage';
import AddEntryPage from './pages/AddEntryPage';
import EntryDetailPage from './pages/EntryDetailPage';
import StatsPage from './pages/StatsPage';
import AdminPage from './pages/AdminPage';

function App() {
  const location = useLocation();
  const showBottomNav = ['/entries', '/add', '/stats', '/admin'].some((path) => location.pathname.startsWith(path));

  return (
    <ErrorBoundary>
      <AuthWrapper>
        <OfflineIndicator />
        <FirebaseStatus />
        <div className={`min-h-screen bg-gray-50 ${showBottomNav ? 'pb-20' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/entries" replace />} />
            <Route path="/entries" element={<EntriesPage />} />
            <Route path="/entries/:id" element={<EntryDetailPage />} />
            <Route path="/add" element={<AddEntryPage />} />
            <Route path="/edit/:id" element={<AddEntryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/entries" replace />} />
          </Routes>
          {showBottomNav && <BottomNav />}
        </div>
      </AuthWrapper>
    </ErrorBoundary>
  );
}

export default App;
