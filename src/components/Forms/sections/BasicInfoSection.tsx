import React from 'react';
import Card from '../../UI/Card';
import Input from '../../UI/Input';
import { DiveEntry } from '../../../types';
import { FaMapMarkerAlt, FaWater, FaEye, FaRegClock } from 'react-icons/fa';
import { LOCATION_REGIONS } from '../../../utils/constants';

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="תאריך"
            type="date"
            value={data.date || ''}
            onChange={(e) => onUpdate('date', e.target.value)}
            error={errors.date}
            required
          />

          <Input
            label="זמן כניסה"
            type="time"
            value={data.startTime || ''}
            onChange={(e) => onUpdate('startTime', e.target.value)}
            error={errors.startTime}
            required
            icon={<FaRegClock />}
          />

          <Input
            label="זמן יציאה"
            type="time"
            value={data.endTime || ''}
            onChange={(e) => onUpdate('endTime', e.target.value)}
            error={errors.endTime}
            required
            icon={<FaRegClock />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מיקום כללי (פומבי)
            </label>
            <select
              className="input"
              value={data.location || ''}
              onChange={(e) => onUpdate('location', e.target.value)}
              required
            >
              <option value="">בחר אזור</option>
              {LOCATION_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-sm text-coral-500 font-medium mt-1">{errors.location}</p>
            )}
          </div>

          <Input
            label="מיקום מדויק (פרטי)"
            value={data.detailedLocation || ''}
            onChange={(e) => onUpdate('detailedLocation', e.target.value)}
            placeholder="לדוגמה: ריף הדולפינים - נקודה צפונית"
            icon={<FaMapMarkerAlt />}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            label="ראות (מטר)"
            type="number"
            min="0"
            step="0.1"
            value={data.visibility || ''}
            onChange={(e) => onUpdate('visibility', parseFloat(e.target.value) || 0)}
            icon={<FaEye />}
          />
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
