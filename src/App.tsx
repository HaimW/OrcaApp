import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthWrapper from './components/Auth/AuthWrapper';
import BottomNav from './components/Layout/BottomNav';
import ErrorBoundary from './components/UI/ErrorBoundary';
import OfflineIndicator from './components/UI/OfflineIndicator';
import FirebaseStatus from './components/UI/FirebaseStatus';
import AdminPanel from './components/Admin/AdminPanel';
import HomePage from './pages/HomePage';
import EntriesPage from './pages/EntriesPage';
import AddEntryPage from './pages/AddEntryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import EntryDetailPage from './pages/EntryDetailPage';

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <AuthWrapper>
        <OfflineIndicator />
        <FirebaseStatus />
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/entries" element={<EntriesPage />} />
            <Route path="/entries/:id" element={<EntryDetailPage />} />
            <Route path="/add" element={<AddEntryPage />} />
            <Route path="/edit/:id" element={<AddEntryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <BottomNav />
        </div>
      </AuthWrapper>
    </ErrorBoundary>
  );
}

export default App;