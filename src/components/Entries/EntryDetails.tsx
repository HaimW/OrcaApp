import React, { useState } from 'react';
import { DiveEntry } from '../../types';
import Card from '../UI/Card';
import { 
  FaMapMarkerAlt, 
  FaWater, 
  FaClock, 
  FaEye,
  FaThermometerHalf,
  FaWind,
  FaCog,
  FaFish,
  FaCamera,
  FaStickyNote,
  FaStar,
  FaExpand,
  FaTimes,
  FaWeight,
  FaRuler
} from 'react-icons/fa';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { FISHING_METHODS, WEATHER_CONDITIONS, CURRENT_LEVELS } from '../../utils/constants';

interface EntryDetailsProps {
  entry: DiveEntry;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const fishingMethod = FISHING_METHODS.find(m => m.type === entry.fishingType);
  const weatherCondition = WEATHER_CONDITIONS.find(w => w.condition === entry.weather.condition);
  const currentLevel = CURRENT_LEVELS.find(c => c.value === entry.weather.current);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      return {
        date: format(date, 'EEEE, dd MMMM yyyy', { locale: he }),
        time: format(date, 'HH:mm', { locale: he }),
      };
    } catch {
      return { date: dateStr, time: timeStr };
    }
  };

  const { date, time } = formatDateTime(entry.date, entry.time);
  const totalCatches = entry.catches.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <>
      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-coral-500" />
                  <h2 className="text-xl font-bold text-gray-800">
                    {entry.location}
                  </h2>
                </div>
                
                <div className="text-gray-600 space-y-1">
                  <div>{date}</div>
                  <div>שעת כניסה: {time}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= entry.rating ? 'text-yellow-400' : 'text-gray-300'}
                    size={20}
                  />
                ))}
              </div>
            </div>

            {/* Coordinates */}
            {entry.coordinates && (
              <div className="text-sm text-gray-600">
                קואורדינטות: {entry.coordinates.lat.toFixed(6)}, {entry.coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>
        </Card>

        {/* Dive Stats */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaWater className="text-ocean-500" />
            נתוני צלילה
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-ocean-100 p-2 rounded-lg">
                <FaWater className="text-ocean-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">עומק</div>
                <div className="font-semibold text-gray-800">{entry.depth} מטר</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaClock className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">משך</div>
                <div className="font-semibold text-gray-800">{entry.duration} דקות</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaEye className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">ראות</div>
                <div className="font-semibold text-gray-800">{entry.visibility} מטר</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-coral-100 p-2 rounded-lg">
                <FaFish className="text-coral-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">דגים</div>
                <div className="font-semibold text-gray-800">{totalCatches} נתפסו</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weather */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaThermometerHalf className="text-orange-500" />
            תנאי מזג אוויר
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">מזג אוויר</span>
              <span className="font-medium">{weatherCondition?.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">טמפ' אוויר</span>
                <span className="font-medium">{entry.weather.temperature}°C</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">טמפ' מים</span>
                <span className="font-medium">{entry.weather.waterTemperature}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">רוח</span>
                <span className="font-medium">{entry.weather.windSpeed} קמ״ש {entry.weather.windDirection}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">גלים</span>
                <span className="font-medium">{entry.weather.waveHeight} מטר</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">זרם</span>
              <span className="font-medium">{currentLevel?.label}</span>
            </div>
          </div>
        </Card>

        {/* Equipment */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCog className="text-gray-600" />
            ציוד
          </h3>
          
          <div className="space-y-3">
            {entry.equipment.mask && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">מסכה</span>
                <span className="font-medium">{entry.equipment.mask}</span>
              </div>
            )}

            {entry.equipment.fins && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">סנפירים</span>
                <span className="font-medium">{entry.equipment.fins}</span>
              </div>
            )}

            {entry.equipment.suit && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">חליפה</span>
                <span className="font-medium">{entry.equipment.suit}</span>
              </div>
            )}

            {entry.equipment.weight > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">משקל</span>
                <span className="font-medium">{entry.equipment.weight} ק״ג</span>
              </div>
            )}

            {entry.equipment.gear && entry.equipment.gear.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-600 mb-2">ציוד נוסף</div>
                <div className="flex flex-wrap gap-2">
                  {entry.equipment.gear.map((item, index) => (
                    <span key={index} className="bg-white px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Catches */}
        {entry.catches.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaFish className="text-coral-500" />
              דגים שנתפסו ({totalCatches})
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                <span className="text-gray-600">שיטת דיג</span>
                <span className="font-medium">{fishingMethod?.label}</span>
              </div>

              {entry.catches.map((catch_) => (
                <div key={catch_.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        {catch_.species}
                        <span className="text-sm text-gray-500">
                          ({catch_.quantity} יח')
                        </span>
                        {catch_.released && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            שוחרר
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(catch_.weight || catch_.length) && (
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      {catch_.weight && (
                        <div className="flex items-center gap-1">
                          <FaWeight size={12} />
                          {catch_.weight} גרם
                        </div>
                      )}
                      {catch_.length && (
                        <div className="flex items-center gap-1">
                          <FaRuler size={12} />
                          {catch_.length} ס״מ
                        </div>
                      )}
                    </div>
                  )}

                  {catch_.notes && (
                    <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                      {catch_.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Photos */}
        {entry.photos.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCamera className="text-purple-500" />
              תמונות ({entry.photos.length})
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {entry.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo}
                    alt={`תמונה ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                    <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Notes */}
        {entry.notes && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaStickyNote className="text-yellow-500" />
              הערות
            </h3>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {entry.notes}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedPhoto}
              alt="תמונה מוגדלת"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EntryDetails;


