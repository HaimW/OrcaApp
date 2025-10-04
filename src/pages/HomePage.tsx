import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiveEntries, useAuth } from '../hooks';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  FaPlus, 
  FaList, 
  FaChartBar, 
  FaWater, 
  FaFish, 
  FaClock 
} from 'react-icons/fa';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { diveEntries, isLoading } = useDiveEntries();
  const { getUserDisplayName, isAnonymous } = useAuth();
  
  const recentEntries = diveEntries.slice(0, 3);
  const totalDives = diveEntries.length;
  const totalFish = diveEntries.reduce((sum, entry) => 
    sum + entry.catches.reduce((catchSum, c) => catchSum + c.quantity, 0), 0
  );
  const avgDepth = diveEntries.length > 0 
    ? diveEntries.reduce((sum, entry) => sum + entry.depth, 0) / diveEntries.length 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="אורקה - יומן צלילה" />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="טוען נתונים..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="אורקה - יומן צלילה" />
      
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <OrcaImage 
            size="xl" 
            shape="circle" 
            className="mx-auto mb-4"
            showCredits={false}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ברוכים הבאים לאורקה
          </h2>
          <p className="text-gray-600">
            יומן הצלילה המקצועי שלכם
          </p>
          <p className="text-xs text-gray-400 mt-2">
            💡 לחצו על התמונה לתמונה חדשה
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">פעולות מהירות</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/add')}
              className="h-16"
            >
              <FaPlus size={20} />
              <span>צלילה חדשה</span>
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/entries')}
              className="h-16"
            >
              <FaList size={20} />
              <span>יומן צלילות</span>
            </Button>
          </div>
        </Card>

        {/* Stats Overview */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">סטטיסטיקות כלליות</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-ocean-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <FaWater className="text-ocean-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalDives}</div>
              <div className="text-sm text-gray-600">צלילות</div>
            </div>
            
            <div className="text-center">
              <div className="bg-coral-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <FaFish className="text-coral-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalFish}</div>
              <div className="text-sm text-gray-600">דגים</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <FaClock className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{avgDepth.toFixed(1)}</div>
              <div className="text-sm text-gray-600">עומק ממוצע</div>
            </div>
          </div>
        </Card>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">צלילות אחרונות</h3>
              <Button
                variant="ghost"
                onClick={() => navigate('/entries')}
                className="text-ocean-600"
              >
                צפייה בכל
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => navigate(`/entries/${entry.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {entry.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(entry.date), 'dd/MM/yyyy', { locale: he })}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-ocean-600">
                      {entry.depth} מ'
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.catches.length} דגים
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {totalDives === 0 && (
          <Card className="text-center py-8">
            <FaWater size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              עדיין לא יש לכם צלילות
            </h3>
            <p className="text-gray-500 mb-4">
              התחילו לתעד את חוויות הצלילה שלכם
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/add')}
            >
              <FaPlus size={16} />
              הוספת צלילה ראשונה
            </Button>
          </Card>
        )}

        {/* Quick Stats Button */}
        {totalDives > 0 && (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/stats')}
            className="h-12"
          >
            <FaChartBar size={20} />
            <span>צפייה בסטטיסטיקות מפורטות</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;


