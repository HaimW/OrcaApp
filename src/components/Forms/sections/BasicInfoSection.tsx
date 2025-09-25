import React from 'react';
import Card from '../../UI/Card';
import Input from '../../UI/Input';
import { DiveEntry } from '../../../types';
import { FaMapMarkerAlt, FaClock, FaWater, FaEye } from 'react-icons/fa';
import { DIVING_LOCATIONS } from '../../../utils/constants';

interface BasicInfoSectionProps {
  data: Partial<DiveEntry>;
  errors: Record<string, string>;
  onUpdate: (field: string, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  data,
  errors,
  onUpdate,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaWater className="text-ocean-500" />
        פרטי צלילה בסיסיים
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="תאריך"
            type="date"
            value={data.date || ''}
            onChange={(e) => onUpdate('date', e.target.value)}
            error={errors.date}
            required
          />
          
          <Input
            label="שעה"
            type="time"
            value={data.time || ''}
            onChange={(e) => onUpdate('time', e.target.value)}
            error={errors.time}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מיקום צלילה
          </label>
          <div className="relative">
            <input
              list="locations"
              className="input pr-10"
              value={data.location || ''}
              onChange={(e) => onUpdate('location', e.target.value)}
              placeholder="בחרו מיקום או הקלידו חדש..."
              required
            />
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <datalist id="locations">
              {DIVING_LOCATIONS.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
          {errors.location && (
            <p className="text-sm text-coral-500 font-medium mt-1">
              {errors.location}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="עומק (מטר)"
            type="number"
            min="0"
            step="0.1"
            value={data.depth || ''}
            onChange={(e) => onUpdate('depth', parseFloat(e.target.value) || 0)}
            error={errors.depth}
            icon={<FaWater />}
            required
          />
          
          <Input
            label="משך (דקות)"
            type="number"
            min="0"
            value={data.duration || ''}
            onChange={(e) => onUpdate('duration', parseInt(e.target.value) || 0)}
            error={errors.duration}
            icon={<FaClock />}
            required
          />
          
          <Input
            label="ראות (מטר)"
            type="number"
            min="0"
            step="0.1"
            value={data.visibility || ''}
            onChange={(e) => onUpdate('visibility', parseFloat(e.target.value) || 0)}
            icon={<FaEye />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קואורדינטות (אופציונלי)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="קו רוחב"
              type="number"
              step="any"
              value={data.coordinates?.lat || ''}
              onChange={(e) => onUpdate('coordinates', {
                ...data.coordinates,
                lat: parseFloat(e.target.value) || undefined,
              })}
            />
            <Input
              placeholder="קו אורך"
              type="number"
              step="any"
              value={data.coordinates?.lng || ''}
              onChange={(e) => onUpdate('coordinates', {
                ...data.coordinates,
                lng: parseFloat(e.target.value) || undefined,
              })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;


