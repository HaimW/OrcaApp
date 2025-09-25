import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import DiveEntryCard from '../components/Entries/DiveEntryCard';
import FilterBar from '../components/Entries/FilterBar';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { FilterOptions } from '../types';

const EntriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { diveEntries } = useAppSelector((state) => state.diveEntries);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Filter and search entries
  const filteredEntries = diveEntries.filter((entry) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        entry.location.toLowerCase().includes(searchLower) ||
        entry.notes.toLowerCase().includes(searchLower) ||
        entry.catches.some(c => c.species.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Date filters
    if (filters.dateFrom && entry.date < filters.dateFrom) return false;
    if (filters.dateTo && entry.date > filters.dateTo) return false;

    // Location filter
    if (filters.location && !entry.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Fishing type filter
    if (filters.fishingType && entry.fishingType !== filters.fishingType) {
      return false;
    }

    // Depth filters
    if (filters.minDepth && entry.depth < filters.minDepth) return false;
    if (filters.maxDepth && entry.depth > filters.maxDepth) return false;

    // Rating filter
    if (filters.minRating && entry.rating < filters.minRating) return false;

    return true;
  });

  const handleAddNew = () => {
    navigate('/add');
  };

  const handleEntryClick = (entryId: string) => {
    navigate(`/entries/${entryId}`);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '') || searchTerm;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="יומן צלילות" 
        showAddButton 
        onAddClick={handleAddNew}
      />
      
      <div className="p-4 space-y-4">
        {/* Search and Filter Bar */}
        <Card padding="sm">
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש לפי מיקום, הערות או סוג דג..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pr-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant={showFilters ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter size={14} />
                מסננים {hasActiveFilters && '(פעיל)'}
              </Button>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-coral-600"
                >
                  ניקוי מסננים
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Filter Bar */}
        {showFilters && (
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredEntries.length} מתוך {diveEntries.length} צלילות
          </span>
          {hasActiveFilters && (
            <span className="text-ocean-600 font-medium">
              מסוננות
            </span>
          )}
        </div>

        {/* Entries List */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <DiveEntryCard
                key={entry.id}
                entry={entry}
                onClick={() => handleEntryClick(entry.id)}
              />
            ))}
          </div>
        ) : diveEntries.length === 0 ? (
          /* Empty State - No entries */
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaPlus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              עדיין אין צלילות ביומן
            </h3>
            <p className="text-gray-500 mb-4">
              התחילו לתעד את חוויות הצלילה שלכם
            </p>
            <Button
              variant="primary"
              onClick={handleAddNew}
            >
              <FaPlus size={16} />
              הוספת צלילה ראשונה
            </Button>
          </Card>
        ) : (
          /* Empty State - No results */
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              לא נמצאו תוצאות
            </h3>
            <p className="text-gray-500 mb-4">
              נסו לשנות את פרמטרי החיפוש או המסננים
            </p>
            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              ניקוי מסננים
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EntriesPage;


