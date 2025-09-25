import React, { useMemo } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import { 
  FaWater, 
  FaFish, 
  FaClock, 
  FaEye, 
  FaThermometerHalf,
  FaChartBar,
  FaStar,
  FaCalendarAlt
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { FISHING_METHODS, COMMON_FISH_SPECIES } from '../utils/constants';

const StatsPage: React.FC = () => {
  const { diveEntries } = useAppSelector((state) => state.diveEntries);

  const stats = useMemo(() => {
    if (diveEntries.length === 0) {
      return {
        totalDives: 0,
        totalFish: 0,
        totalDuration: 0,
        avgDepth: 0,
        maxDepth: 0,
        avgVisibility: 0,
        avgRating: 0,
        avgWaterTemp: 0,
        fishBySpecies: {},
        divesByMethod: {},
        divesByMonth: {},
        recentActivity: 0,
      };
    }

    const totalDives = diveEntries.length;
    const totalFish = diveEntries.reduce((sum, entry) => 
      sum + entry.catches.reduce((catchSum, c) => catchSum + c.quantity, 0), 0
    );
    const totalDuration = diveEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgDepth = diveEntries.reduce((sum, entry) => sum + entry.depth, 0) / totalDives;
    const maxDepth = Math.max(...diveEntries.map(entry => entry.depth));
    const avgVisibility = diveEntries.reduce((sum, entry) => sum + entry.visibility, 0) / totalDives;
    const avgRating = diveEntries.reduce((sum, entry) => sum + entry.rating, 0) / totalDives;
    const avgWaterTemp = diveEntries.reduce((sum, entry) => sum + entry.weather.waterTemperature, 0) / totalDives;

    // Fish by species
    const fishBySpecies: Record<string, number> = {};
    diveEntries.forEach(entry => {
      entry.catches.forEach(catch_ => {
        fishBySpecies[catch_.species] = (fishBySpecies[catch_.species] || 0) + catch_.quantity;
      });
    });

    // Dives by fishing method
    const divesByMethod: Record<string, number> = {};
    diveEntries.forEach(entry => {
      divesByMethod[entry.fishingType] = (divesByMethod[entry.fishingType] || 0) + 1;
    });

    // Dives by month
    const divesByMonth: Record<string, number> = {};
    diveEntries.forEach(entry => {
      const month = format(parseISO(entry.date), 'yyyy-MM');
      divesByMonth[month] = (divesByMonth[month] || 0) + 1;
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = diveEntries.filter(entry => 
      parseISO(entry.date) >= thirtyDaysAgo
    ).length;

    return {
      totalDives,
      totalFish,
      totalDuration,
      avgDepth,
      maxDepth,
      avgVisibility,
      avgRating,
      avgWaterTemp,
      fishBySpecies,
      divesByMethod,
      divesByMonth,
      recentActivity,
    };
  }, [diveEntries]);

  const topFishSpecies = Object.entries(stats.fishBySpecies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const methodLabels = Object.entries(stats.divesByMethod)
    .map(([method, count]) => ({
      method: FISHING_METHODS.find(m => m.type === method)?.label || method,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="סטטיסטיקות" />
      
      <div className="p-4 space-y-6">
        {diveEntries.length === 0 ? (
          <Card className="text-center py-12">
            <FaChartBar className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              אין עדיין נתונים לסטטיסטיקות
            </h3>
            <p className="text-gray-500">
              הוסיפו צלילות כדי לראות סטטיסטיקות מפורטות
            </p>
          </Card>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <div className="bg-ocean-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <FaWater className="text-ocean-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalDives}</div>
                <div className="text-sm text-gray-600">צלילות</div>
              </Card>

              <Card className="text-center">
                <div className="bg-coral-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <FaFish className="text-coral-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalFish}</div>
                <div className="text-sm text-gray-600">דגים נתפסו</div>
              </Card>

              <Card className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <FaClock className="text-blue-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(stats.totalDuration / 60)}
                </div>
                <div className="text-sm text-gray-600">שעות במים</div>
              </Card>

              <Card className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <FaStar className="text-yellow-500" size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">דירוג ממוצע</div>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">נתונים מפורטים</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaWater className="text-ocean-500" />
                    <span>עומק ממוצע</span>
                  </div>
                  <span className="font-semibold">{stats.avgDepth.toFixed(1)} מ'</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaWater className="text-ocean-700" />
                    <span>עומק מקסימלי</span>
                  </div>
                  <span className="font-semibold">{stats.maxDepth} מ'</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaEye className="text-green-500" />
                    <span>ראות ממוצעת</span>
                  </div>
                  <span className="font-semibold">{stats.avgVisibility.toFixed(1)} מ'</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaThermometerHalf className="text-blue-500" />
                    <span>טמפ' מים ממוצעת</span>
                  </div>
                  <span className="font-semibold">{stats.avgWaterTemp.toFixed(1)}°C</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-500" />
                    <span>צלילות ב-30 הימים האחרונים</span>
                  </div>
                  <span className="font-semibold">{stats.recentActivity}</span>
                </div>
              </div>
            </Card>

            {/* Top Fish Species */}
            {topFishSpecies.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">דגים מובילים</h3>
                <div className="space-y-3">
                  {topFishSpecies.map(([species, count], index) => (
                    <div key={species} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-coral-100 text-coral-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{species}</span>
                      </div>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Fishing Methods */}
            {methodLabels.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">שיטות דיג</h3>
                <div className="space-y-3">
                  {methodLabels.map(({ method, count }, index) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="font-medium">{method}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 rounded-full h-2 w-20">
                          <div 
                            className="bg-ocean-500 h-2 rounded-full"
                            style={{ 
                              width: `${(count / Math.max(...methodLabels.map(m => m.count))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold min-w-[2rem] text-center">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
