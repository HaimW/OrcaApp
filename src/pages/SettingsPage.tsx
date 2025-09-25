import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearEntries, importEntries } from '../store/slices/diveEntriesSlice';
import { logoutUser } from '../store/slices/authSlice';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import DeleteConfirmModal from '../components/UI/DeleteConfirmModal';
import { 
  FaTrash, 
  FaInfo, 
  FaHeart,
  FaDatabase,
  FaFileExport,
  FaFileImport,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import { DiveEntry } from '../types';
import { addSampleData } from '../utils/sampleData';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { diveEntries } = useAppSelector((state) => state.diveEntries);
  const { currentUser } = useAppSelector((state) => state.auth);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importError, setImportError] = useState<string>('');

  const handleExportData = () => {
    const dataStr = JSON.stringify(diveEntries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `orca-dive-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!Array.isArray(jsonData)) {
          throw new Error('הקובץ חייב להכיל מערך של צלילות');
        }

        // Basic validation of entries
        const validEntries: DiveEntry[] = jsonData.filter((entry: any) => {
          return entry.id && entry.date && entry.location && typeof entry.depth === 'number';
        });

        if (validEntries.length === 0) {
          throw new Error('לא נמצאו צלילות תקינות בקובץ');
        }

        if (currentUser) {
          dispatch(importEntries({ entries: validEntries, userId: currentUser.id }));
        }
        setImportError('');
        
        // Reset file input
        event.target.value = '';
        
        alert(`יובאו בהצלחה ${validEntries.length} צלילות`);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'שגיאה בקריאת הקובץ');
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (!currentUser) return;
    dispatch(clearEntries(currentUser.id));
    setShowClearModal(false);
  };

  const handleAddSampleData = () => {
    const added = addSampleData();
    if (added) {
      // Reload the page to refresh the Redux store
      window.location.reload();
    } else {
      alert('נתוני דוגמה כבר קיימים או שיש צלילות ביומן');
    }
  };

  const handleLogout = () => {
    if (confirm('האם אתם בטוחים שברצונכם להתנתק?')) {
      dispatch(logoutUser());
    }
  };

  const appVersion = '1.0.0';
  const buildDate = new Date().toLocaleDateString('he-IL');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="הגדרות" />
      
      <div className="p-4 space-y-6">
        {/* User Profile */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUser className="text-blue-500" />
            פרופיל משתמש
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-l from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                  {currentUser?.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{currentUser?.fullName}</div>
                  <div className="text-sm text-gray-600">@{currentUser?.username}</div>
                  <div className="text-sm text-gray-500">{currentUser?.email}</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              נרשמתם ב: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('he-IL') : ''}
            </div>

            {currentUser?.role === 'admin' && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => window.location.href = '/admin'}
                className="mb-3"
              >
                <FaUser size={16} />
                לוח בקרת מנהל
              </Button>
            )}

            <Button
              variant="danger"
              fullWidth
              onClick={handleLogout}
            >
              <FaSignOutAlt size={16} />
              התנתק מהמערכת
            </Button>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaDatabase className="text-blue-500" />
            ניהול נתונים
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">צלילות שמורות</div>
                <div className="text-sm text-gray-600">
                  {diveEntries.length} רשומות ביומן
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleExportData}
                disabled={diveEntries.length === 0}
              >
                <FaFileExport size={16} />
                ייצוא נתונים (JSON)
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-file"
                />
                <Button
                  variant="secondary"
                  fullWidth
                  as="label"
                  htmlFor="import-file"
                  className="cursor-pointer"
                >
                  <FaFileImport size={16} />
                  ייבוא נתונים (JSON)
                </Button>
              </div>

              {importError && (
                <div className="p-3 bg-coral-50 border border-coral-200 rounded-lg">
                  <div className="text-coral-700 text-sm font-medium">
                    שגיאה בייבוא: {importError}
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                fullWidth
                onClick={handleAddSampleData}
                disabled={diveEntries.length > 0}
              >
                <FaDatabase size={16} />
                הוספת נתוני דוגמה
              </Button>

              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowClearModal(true)}
                disabled={diveEntries.length === 0}
              >
                <FaTrash size={16} />
                מחיקת כל הנתונים
              </Button>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaInfo className="text-green-500" />
            אודות האפליקציה
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">גרסה</span>
              <span className="font-medium">{appVersion}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">תאריך בנייה</span>
              <span className="font-medium">{buildDate}</span>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 text-center">
                אורקה - יומן צלילה מקצועי לדייגים
              </div>
            </div>
          </div>
        </Card>

        {/* PWA Info */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Progressive Web App</h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>האפליקציה עובדת גם ללא חיבור לאינטרנט</span>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>ניתן להתקין על המסך הראשי של הטלפון</span>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>הנתונים נשמרים מקומית במכשיר</span>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>מותאמת לשימוש במובייל וטאבלט</span>
            </div>
          </div>
        </Card>

        {/* Credits */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaHeart className="text-coral-500" />
            תודות
          </h3>
          
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              נבנה עם ❤️ לקהילת הדייגים הישראלית
            </p>
            
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>React</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>PWA</span>
            </div>
          </div>
        </Card>

        {/* Usage Tips */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">טיפים לשימוש</h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="p-3 bg-blue-50 rounded-lg">
              <strong className="text-blue-800">התקנה:</strong> לחצו על "הוסף למסך הבית" בדפדפן להתקנת האפליקציה
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <strong className="text-green-800">גיבוי:</strong> ייצאו את הנתונים שלכם באופן קבוע לגיבוי
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <strong className="text-purple-800">תמונות:</strong> התמונות נשמרות במכשיר - גיבוי נפרד מומלץ
            </div>
          </div>
        </Card>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <DeleteConfirmModal
          title="מחיקת כל הנתונים"
          message={`האם אתם בטוחים שברצונכם למחוק את כל ${diveEntries.length} הצלילות? פעולה זו לא ניתנת לביטול. מומלץ לייצא את הנתונים לפני המחיקה.`}
          onConfirm={handleClearData}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;
