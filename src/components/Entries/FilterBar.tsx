import React from 'react';
import Card from '../UI/Card';
import Input from '../UI/Input';
import { FilterOptions } from '../../types';
import { FISHING_METHODS } from '../../utils/constants';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <Card>
      <h4 className="font-medium text-gray-700 mb-3">מסננים</h4>
      
      <div className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="מתאריך"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            fullWidth={false}
          />
          <Input
            label="עד תאריך"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            fullWidth={false}
          />
        </div>

        {/* Location */}
        <Input
          label="מיקום"
          value={filters.location || ''}
          onChange={(e) => updateFilter('location', e.target.value)}
          placeholder="חיפוש לפי מיקום..."
        />

        {/* Fishing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שיטת דיג
          </label>
          <select
            className="input"
            value={filters.fishingType || ''}
            onChange={(e) => updateFilter('fishingType', e.target.value)}
          >
            <option value="">כל השיטות</option>
            {FISHING_METHODS.map((method) => (
              <option key={method.type} value={method.type}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Depth Range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="עומק מינימלי (מ')"
            type="number"
            min="0"
            value={filters.minDepth || ''}
            onChange={(e) => updateFilter('minDepth', e.target.value ? parseFloat(e.target.value) : undefined)}
            fullWidth={false}
          />
          <Input
            label="עומק מקסימלי (מ')"
            type="number"
            min="0"
            value={filters.maxDepth || ''}
            onChange={(e) => updateFilter('maxDepth', e.target.value ? parseFloat(e.target.value) : undefined)}
            fullWidth={false}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            דירוג מינימלי
          </label>
          <select
            className="input"
            value={filters.minRating || ''}
            onChange={(e) => updateFilter('minRating', e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">כל הדירוגים</option>
            <option value="1">1 כוכב ומעלה</option>
            <option value="2">2 כוכבים ומעלה</option>
            <option value="3">3 כוכבים ומעלה</option>
            <option value="4">4 כוכבים ומעלה</option>
            <option value="5">5 כוכבים בלבד</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;


