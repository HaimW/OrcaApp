import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiveEntries, useAnalytics, useUserProfile } from '../hooks';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import DiveEntryCard from '../components/Entries/DiveEntryCard';
import FilterBar from '../components/Entries/FilterBar';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { FilterOptions } from '../types';
import { UserProfile, UserProfilesService } from '../firebase/userProfiles';

const EntriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { diveEntries, isLoading } = useDiveEntries();
  const { trackSearch, trackFilter } = useAnalytics();
  const { isAdmin } = useUserProfile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<'all' | string>('all');

  useEffect(() => {
    if (!isAdmin) {
      setUserProfiles([]);
      setSelectedUserId('all');
      return;
    }

    const unsubscribe = UserProfilesService.subscribeToAllProfiles(setUserProfiles);
    return () => unsubscribe();
  }, [isAdmin]);

  const entriesForView = useMemo(() => {
    if (!isAdmin || selectedUserId === 'all') return diveEntries;
    return diveEntries.filter((entry) => entry.userId === selectedUserId);
  }, [diveEntries, isAdmin, selectedUserId]);

  const filteredEntries = entriesForView.filter((entry) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        entry.location.toLowerCase().includes(searchLower) ||
        entry.notes.toLowerCase().includes(searchLower) ||
        entry.catches.some((c) => c.species.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (filters.dateFrom && entry.date < filters.dateFrom) return false;
    if (filters.dateTo && entry.date > filters.dateTo) return false;
    if (filters.location && !entry.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.fishingType && entry.fishingType !== filters.fishingType) return false;
    if (filters.minDepth && entry.depth < filters.minDepth) return false;
    if (filters.maxDepth && entry.depth > filters.maxDepth) return false;
    if (filters.minRating && entry.rating < filters.minRating) return false;

    return true;
  });

  const handleAddNew = () => navigate('/add');
  const handleEntryClick = (entryId: string) => navigate(`/entries/${entryId}`);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => trackSearch(searchTerm, filteredEntries.length), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, filteredEntries.length, trackSearch]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') trackFilter(key, value.toString());
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '') || searchTerm;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="יומן צלילות" showAddButton onAddClick={handleAddNew} />
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" text="טוען צלילות..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <Header title="יומן צלילות" showAddButton onAddClick={handleAddNew} />

      <div className="p-4 space-y-4 pb-24">
        <section className="rounded-3xl bg-gradient-to-r from-[#082746] to-[#0f4f72] p-5 text-white shadow-sm">
          <h2 className="text-2xl font-bold">יומן צלילות</h2>
          <p className="mt-1 text-cyan-100">ניהול צלילות בעיצוב חדש, עם זמן תחילה/סיום ותנאי ים מפורטים.</p>
        </section>

        {isAdmin && (
          <Card padding="sm" className="border-slate-200/80 bg-white/95">
            <label htmlFor="entries-user-filter" className="mb-2 block text-sm font-medium text-gray-700">
              הצגת צלילות לפי משתמש
            </label>
            <select
              id="entries-user-filter"
              className="input"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="all">כל המשתמשים</option>
              {userProfiles.map((profile) => (
                <option key={profile.uid} value={profile.uid}>
                  {profile.displayName} ({profile.email})
                </option>
              ))}
            </select>
          </Card>
        )}

        <Card padding="sm" className="border-slate-200/80 bg-white/95">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש לפי מיקום, הערות או סוג דג..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pr-10"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant={showFilters ? 'primary' : 'secondary'} size="sm" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter size={14} />
                מסננים {hasActiveFilters && '(פעיל)'}
              </Button>

              {hasActiveFilters && (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-coral-600">
                  ניקוי מסננים
                </Button>
              )}
            </div>
          </div>
        </Card>

        {showFilters && <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />}

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{filteredEntries.length} מתוך {entriesForView.length} צלילות</span>
          {hasActiveFilters && <span className="font-medium text-cyan-700">מסוננות</span>}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <DiveEntryCard key={entry.id} entry={entry} onClick={() => handleEntryClick(entry.id)} />
            ))}
          </div>
        ) : entriesForView.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="mb-4 text-gray-400"><FaPlus size={48} className="mx-auto" /></div>
            <h3 className="mb-2 text-lg font-semibold text-gray-600">עדיין אין צלילות ביומן</h3>
            <p className="mb-4 text-gray-500">התחילו לתעד את חוויות הצלילה שלכם</p>
            <Button variant="primary" onClick={handleAddNew}><FaPlus size={16} /> הוספת צלילה ראשונה</Button>
          </Card>
        ) : (
          <Card className="py-12 text-center">
            <div className="mb-4 text-gray-400"><FaSearch size={48} className="mx-auto" /></div>
            <h3 className="mb-2 text-lg font-semibold text-gray-600">לא נמצאו תוצאות</h3>
            <p className="mb-4 text-gray-500">נסו לשנות את פרמטרי החיפוש או המסננים</p>
            <Button variant="secondary" onClick={clearFilters}>ניקוי מסננים</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EntriesPage;
