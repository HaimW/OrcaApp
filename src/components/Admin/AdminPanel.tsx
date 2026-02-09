import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../hooks';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FaTrash, FaBan, FaCheck, FaCrown, FaSyncAlt } from 'react-icons/fa';
import { UserProfile, UserProfilesService } from '../../firebase/userProfiles';

const AdminPanel: React.FC = () => {
  const { isAdmin, isProfileLoading, profile } = useUserProfile();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const unsubscribe = UserProfilesService.subscribeToAllProfiles((profiles) => {
      setUsers(profiles);
      setIsLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const refreshFromServer = async () => {
    try {
      setIsRefreshing(true);
      const serverProfiles = await UserProfilesService.fetchAllProfilesFromServer();
      setUsers(serverProfiles);
      setError(null);
    } catch (refreshError) {
      console.error('Error refreshing users from server:', refreshError);
      setError('שגיאה ברענון מהענן. נסה שוב.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, nextStatus: boolean) => {
    try {
      await UserProfilesService.updateUserStatus(userId, nextStatus);
    } catch (statusError) {
      console.error('Error updating user status:', statusError);
      setError('לא ניתן לעדכן סטטוס משתמש כרגע.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך להשבית את המשתמש?')) {
      return;
    }

    try {
      await UserProfilesService.updateUserStatus(userId, false);
    } catch (deleteError) {
      console.error('Error disabling user:', deleteError);
      setError('לא ניתן להשבית את המשתמש כרגע.');
    }
  };

  const handleToggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    try {
      await UserProfilesService.updateUserRole(userId, currentlyAdmin ? 'user' : 'admin');
    } catch (roleError) {
      console.error('Error updating admin role:', roleError);
      setError('לא ניתן לעדכן הרשאות כרגע.');
    }
  };

  if (isProfileLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="טוען משתמשים מהענן..." />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="mb-6">
            <FaCrown className="text-yellow-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">גישה נדחתה</h2>
            <p className="text-gray-600">רק מנהלי מערכת פעילים יכולים לגשת לדף זה</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">פאנל ניהול משתמשים</h1>
          <p className="text-gray-600">ניהול משתמשים והרשאות מתוך Firestore בזמן אמת</p>
          <p className="text-sm text-gray-500 mt-1">מחובר כמנהל: {profile?.displayName || profile?.email}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">שם</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">אימייל</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">תאריך הרשמה</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">סטטוס</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">הרשאות</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((managedUser) => (
                  <tr key={managedUser.uid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {managedUser.role === 'admin' && <FaCrown className="text-yellow-500" size={16} />}
                        <span className="font-medium">{managedUser.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{managedUser.email}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(managedUser.createdAt).toLocaleDateString('he-IL')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        managedUser.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {managedUser.isActive ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        managedUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {managedUser.role === 'admin' ? 'מנהל' : 'משתמש'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={managedUser.isActive ? 'secondary' : 'primary'}
                          onClick={() => handleToggleUserStatus(managedUser.uid, !managedUser.isActive)}
                        >
                          {managedUser.isActive ? <FaBan size={12} /> : <FaCheck size={12} />}
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleToggleAdmin(managedUser.uid, managedUser.role === 'admin')}
                        >
                          <FaCrown size={12} />
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeleteUser(managedUser.uid)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="primary" onClick={refreshFromServer} disabled={isRefreshing}>
            <FaSyncAlt size={16} />
            {isRefreshing ? 'מרענן מהענן...' : 'רענן מהענן'}
          </Button>
          <p className="text-xs text-gray-500 mt-2">הרענון משתמש ב-getDocsFromServer כדי למשוך נתונים עדכניים ישירות מהענן.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
