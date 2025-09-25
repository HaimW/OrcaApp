import React from 'react';
import { DiveEntry } from '../../types';
import Card from '../UI/Card';
import { 
  FaMapMarkerAlt, 
  FaWater, 
  FaClock, 
  FaFish, 
  FaStar,
  FaEye,
  FaThermometerHalf,
  FaCamera
} from 'react-icons/fa';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { FISHING_METHODS, WEATHER_CONDITIONS } from '../../utils/constants';

interface DiveEntryCardProps {
  entry: DiveEntry;
  onClick: () => void;
}

const DiveEntryCard: React.FC<DiveEntryCardProps> = ({ entry, onClick }) => {
  const totalCatches = entry.catches.reduce((sum, c) => sum + c.quantity, 0);
  const fishingMethod = FISHING_METHODS.find(m => m.type === entry.fishingType);
  const weatherCondition = WEATHER_CONDITIONS.find(w => w.condition === entry.weather.condition);

  const formatDate = (dateStr: string, timeStr: string) => {
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      return {
        date: format(date, 'dd/MM/yyyy', { locale: he }),
        time: format(date, 'HH:mm', { locale: he }),
      };
    } catch {
      return { date: dateStr, time: timeStr };
    }
  };

  const { date, time } = formatDate(entry.date, entry.time);

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="text-coral-500 flex-shrink-0" size={14} />
              <h3 className="font-semibold text-gray-800 truncate">
                {entry.location}
              </h3>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{date}</span>
              <span>{time}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" size={14} />
            <span className="text-sm font-medium text-gray-700">
              {entry.rating}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 py-2 border-t border-gray-100">
          <div className="text-center">
            <FaWater className="text-ocean-500 mx-auto mb-1" size={16} />
            <div className="text-sm font-medium text-gray-800">{entry.depth}מ'</div>
            <div className="text-xs text-gray-500">עומק</div>
          </div>
          
          <div className="text-center">
            <FaClock className="text-blue-500 mx-auto mb-1" size={16} />
            <div className="text-sm font-medium text-gray-800">{entry.duration}ד'</div>
            <div className="text-xs text-gray-500">משך</div>
          </div>
          
          <div className="text-center">
            <FaEye className="text-green-500 mx-auto mb-1" size={16} />
            <div className="text-sm font-medium text-gray-800">{entry.visibility}מ'</div>
            <div className="text-xs text-gray-500">ראות</div>
          </div>
          
          <div className="text-center">
            <FaFish className="text-coral-500 mx-auto mb-1" size={16} />
            <div className="text-sm font-medium text-gray-800">{totalCatches}</div>
            <div className="text-xs text-gray-500">דגים</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Weather */}
            <div className="flex items-center gap-1 text-gray-600">
              <FaThermometerHalf size={12} />
              <span>{entry.weather.waterTemperature}°C</span>
            </div>

            {/* Fishing Method */}
            {fishingMethod && (
              <div className="text-gray-600">
                {fishingMethod.label}
              </div>
            )}
          </div>

          {/* Photos indicator */}
          {entry.photos.length > 0 && (
            <div className="flex items-center gap-1 text-purple-500">
              <FaCamera size={12} />
              <span className="text-xs">{entry.photos.length}</span>
            </div>
          )}
        </div>

        {/* Catches Preview */}
        {entry.catches.length > 0 && (
          <div className="border-t border-gray-100 pt-2">
            <div className="text-xs text-gray-500 mb-1">דגים שנתפסו:</div>
            <div className="text-sm text-gray-700">
              {entry.catches.slice(0, 3).map((catch_, index) => (
                <span key={catch_.id}>
                  {catch_.species}
                  {catch_.quantity > 1 && ` (${catch_.quantity})`}
                  {index < Math.min(entry.catches.length, 3) - 1 && ', '}
                </span>
              ))}
              {entry.catches.length > 3 && (
                <span className="text-gray-500">
                  {' '}ועוד {entry.catches.length - 3}...
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DiveEntryCard;


