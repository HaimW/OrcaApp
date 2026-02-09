import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import Header from '../components/Layout/Header';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import Input from '../components/UI/Input';
import OrcaImage from '../components/UI/OrcaImage';
import { 
  FaUsers, 
  FaWater, 
  FaFish, 
  FaChartLine,
  FaDatabase,
  FaCog,
  FaShieldAlt,
  FaTrash,
  FaEdit,
  FaCrown,
  FaUserShield,
  FaDownload,
  FaUpload
} from 'react-icons/fa';
import { AdminStats } from '../types/user';

const AdminPage: React.FC = () => {
  const { currentUser, users } = useAppSelector(state => state.auth);
  const { diveEntries } = useAppSelector(state => state.diveEntries);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'data' | 'settings'>('overview');
  const [whatsappGroupLink, setWhatsappGroupLink] = useState(
    localStorage.getItem('orca-community-whatsapp') || ''
  );

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <div className="text-red-500 text-6xl mb-4">
            <FaShieldAlt />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            גישה מוגבלת
          </h1>
          <p className="text-gray-600">
            אין לכם הרשאה לגשת לעמוד הניהול
          </p>
        </Card>
      </div>
    );
  }

  // Calculate admin statistics
  const adminStats: AdminStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all users' dive entries
    const allDiveEntries = users.flatMap(user => {
      try {
        const userEntries = localStorage.getItem(`orca-dive-entries-${user.id}`);
        return userEntries ? JSON.parse(userEntries) : [];
      } catch {
        return [];
      }
    });

    const totalFish = allDiveEntries.reduce((sum, dive) => sum + (dive.catches?.length || 0), 0);
    
    const activeUsersLastWeek = users.filter(user => {
      const userCreated = new Date(user.createdAt);
      return userCreated >= weekAgo;
    }).length;

    // Popular locations
    const locationCounts: Record<string, number> = {};
    allDiveEntries.forEach(dive => {
      if (dive.location) {
        locationCounts[dive.location] = (locationCounts[dive.location] || 0) + 1;
      }
    });

    const popularLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // User activity (registrations per day for last 7 days)
    const userActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = users.filter(user => {
        const userDate = new Date(user.createdAt).toISOString().split('T')[0];
        return userDate === dateStr;
      }).length;
      
      return { 
        date: date.toLocaleDateString('he-IL'), 
        count 
      };
    }).reverse();

    return {
      totalUsers: users.length,
      totalDives: allDiveEntries.length,
      totalFish,
      activeUsersLastWeek,
      popularLocations,
      userActivity
    };
  }, [users]);

  const handleExportAllData = () => {
    const allData = {
      users: users.map(u => ({ ...u, password: undefined })), // Remove passwords
      diveEntries: users.flatMap(user => {
        try {
          const userEntries = localStorage.getItem(`orca-dive-entries-${user.id}`);
          return userEntries ? JSON.parse(userEntries) : [];
        } catch {
          return [];
        }
      }),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `orca-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };


  const handleSaveWhatsappGroup = () => {
    localStorage.setItem('orca-community-whatsapp', whatsappGroupLink.trim());
    alert('קישור קבוצת WhatsApp נשמר בהצלחה');
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <FaUsers size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{adminStats.totalUsers}</div>
              <div className="text-sm text-gray-600">משתמשים</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg">
              <FaWater size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{adminStats.totalDives}</div>
              <div className="text-sm text-gray-600">צלילות</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
              <FaFish size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{adminStats.totalFish}</div>
              <div className="text-sm text-gray-600">דגים נתפסו</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <FaChartLine size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{adminStats.activeUsersLastWeek}</div>
              <div className="text-sm text-gray-600">משתמשים חדשים השבוע</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Locations */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">מיקומי צלילה פופולריים</h3>
        <div className="space-y-3">
          {adminStats.popularLocations.map((location, index) => (
            <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="font-medium">{location.location}</span>
              </div>
              <span className="text-gray-600">{location.count} צלילות</span>
            </div>
          ))}
        </div>
      </Card>

      {/* User Activity Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">פעילות משתמשים (7 ימים אחרונים)</h3>
        <div className="space-y-2">
          {adminStats.userActivity.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-2">
              <span className="text-sm text-gray-600">{day.date}</span>
              <div className="flex items-center gap-2">
                <div className="bg-blue-200 h-2 rounded-full" style={{ width: `${Math.max(day.count * 20, 5)}px` }}></div>
                <span className="text-sm font-medium">{day.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">ניהול משתמשים</h2>
        <Button onClick={() => console.log('Add user')}>
          <FaUsers size={16} />
          הוסף משתמש
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    {user.fullName}
                    {user.role === 'admin' && (
                      <FaCrown className="text-yellow-500" size={16} />
                    )}
                    {user.role === 'moderator' && (
                      <FaUserShield className="text-blue-500" size={16} />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">@{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {user.role === 'admin' ? 'מנהל' : user.role === 'moderator' ? 'מנחה' : 'משתמש'}
                </span>
                <Button variant="secondary" size="sm">
                  <FaEdit size={12} />
                </Button>
                <Button variant="danger" size="sm" disabled={user.role === 'admin'}>
                  <FaTrash size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">ניהול נתונים</h2>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaDatabase className="text-blue-500" />
          גיבוי ושחזור
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">ייצוא נתונים כללי</h4>
            <p className="text-sm text-blue-600 mb-3">
              ייצוא כל נתוני המערכת כולל משתמשים וצלילות
            </p>
            <Button onClick={handleExportAllData}>
              <FaDownload size={16} />
              ייצוא נתונים מלא
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">ייבוא נתונים</h4>
            <p className="text-sm text-yellow-600 mb-3">
              ייבוא נתונים מקובץ גיבוי קיים
            </p>
            <Button variant="secondary">
              <FaUpload size={16} />
              ייבוא נתונים
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">הגדרות מערכת</h2>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaCog className="text-gray-500" />
          הגדרות כלליות
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">גרסת אפליקציה</h4>
            <p className="text-sm text-gray-600">אורקה v1.0.0</p>
          </div>


          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">קבוצת WhatsApp לדיווחים</h4>
            <div className="space-y-3">
              <Input
                label="קישור הזמנה לקבוצה"
                type="url"
                dir="ltr"
                value={whatsappGroupLink}
                onChange={(e) => setWhatsappGroupLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
              />
              <p className="text-xs text-gray-500">
                רק מנהל מערכת מגדיר את הקבוצה. כל הדיווחים מהמשתמשים יישלחו לקבוצה זו.
              </p>
              <Button variant="secondary" onClick={handleSaveWhatsappGroup}>
                שמירת קישור הקבוצה
              </Button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">מידע מערכת</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>סה"כ משתמשים: {users.length}</p>
              <p>סה"כ צלילות: {adminStats.totalDives}</p>
              <p>תאריך עדכון אחרון: {new Date().toLocaleDateString('he-IL')}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="לוח בקרת מנהל" />
      
      <div className="p-4">
        {/* Admin Badge */}
        <div className="mb-6">
          <Card className="bg-gradient-to-l from-red-50 to-pink-50 border-red-200">
            <div className="flex items-center gap-4">
              <OrcaImage 
                size="lg" 
                shape="circle" 
                specificImage="orca-spy-hopping"
                showCredits={false}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-800">ברוכים הבאים לוח הבקרה</h2>
                <p className="text-sm text-red-600">
                  אתם מחוברים כמנהל מערכת עם הרשאות מלאות
                </p>
              </div>
              <FaShieldAlt className="text-red-500 text-2xl" />
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'סקירה כללית', icon: FaChartLine },
              { key: 'users', label: 'משתמשים', icon: FaUsers },
              { key: 'data', label: 'נתונים', icon: FaDatabase },
              { key: 'settings', label: 'הגדרות', icon: FaCog },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'data' && <DataTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
