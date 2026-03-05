import React from 'react';
import { DiveEntry } from '../../types';
import Card from '../UI/Card';
import {
  FaMapMarkerAlt,
  FaWater,
  FaFish,
  FaStar,
  FaEye,
  FaThermometerHalf,
  FaCamera,
} from 'react-icons/fa';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { FISHING_METHODS } from '../../utils/constants';

interface DiveEntryCardProps {
  entry: DiveEntry;
  onClick: () => void;
}

const DiveEntryCard: React.FC<DiveEntryCardProps> = ({ entry, onClick }) => {
  const totalCatches = entry.catches.reduce((sum, c) => sum + c.quantity, 0);
  const fishingMethods = (entry.fishingTypes && entry.fishingTypes.length > 0
    ? entry.fishingTypes
    : [entry.fishingType])
    .map((type) => FISHING_METHODS.find((m) => m.type === type)?.label || type);

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
    <Card hover onClick={onClick} className="cursor-pointer overflow-hidden border-slate-200/70 bg-white/95 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <FaMapMarkerAlt className="flex-shrink-0 text-cyan-700" size={14} />
              <h3 className="truncate font-semibold text-slate-800">{entry.location}</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>{date}</span>
              <span>{time}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
            <FaStar className="text-amber-500" size={13} />
            <span className="text-sm font-medium text-slate-700">{entry.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-slate-100 py-2">
          <div className="text-center">
            <FaWater className="mx-auto mb-1 text-cyan-700" size={16} />
            <div className="text-sm font-medium text-slate-800">{entry.depth}מ'</div>
            <div className="text-xs text-slate-500">עומק</div>
          </div>

          <div className="text-center">
            <FaEye className="mx-auto mb-1 text-emerald-600" size={16} />
            <div className="text-sm font-medium text-slate-800">{entry.visibility}מ'</div>
            <div className="text-xs text-slate-500">ראות</div>
          </div>

          <div className="text-center">
            <FaFish className="mx-auto mb-1 text-coral-500" size={16} />
            <div className="text-sm font-medium text-slate-800">{totalCatches}</div>
            <div className="text-xs text-slate-500">דגים</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-600">
              <FaThermometerHalf size={12} />
              <span>{entry.weather.waterTemperature}°C</span>
            </div>
            {fishingMethods.length > 0 && <div className="text-slate-600">{fishingMethods.join(' , ')}</div>}
          </div>

          {entry.photos.length > 0 && (
            <div className="flex items-center gap-1 text-purple-500">
              <FaCamera size={12} />
              <span className="text-xs">{entry.photos.length}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DiveEntryCard;
