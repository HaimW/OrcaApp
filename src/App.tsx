import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/Layout/BottomNav';
import HomePage from './pages/HomePage';
import EntriesPage from './pages/EntriesPage';
import AddEntryPage from './pages/AddEntryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import EntryDetailPage from './pages/EntryDetailPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entries" element={<EntriesPage />} />
        <Route path="/entries/:id" element={<EntryDetailPage />} />
        <Route path="/add" element={<AddEntryPage />} />
        <Route path="/edit/:id" element={<AddEntryPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;


