import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FaUsers, FaTrash, FaBan, FaCheck, FaCrown } from 'react-icons/fa';
import { isUserAdmin } from '../../utils/adminConfig';

interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt?: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is admin
  const isAdmin = isUserAdmin(user?.email);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const storedUsers = JSON.parse(localStorage.getItem('orca_users') || '[]') as StoredUser[];

      const normalizedUsers = storedUsers.map(storedUser => ({
        uid: storedUser.uid,
        email: storedUser.email,
        displayName: storedUser.displayName,
        createdAt: storedUser.createdAt,
        isAdmin: isUserAdmin(storedUser.email),
        isActive: true,
      }));

      setUsers(normalizedUsers);
      setError(null);
    } catch (error) {
      setError('שגיאה בטעינת רשימת המשתמשים');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // In a real app, you would call your backend API
      setUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isActive: !isActive } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      try {
        // In a real app, you would call your backend API
        setUsers(prev => prev.filter(u => u.uid !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      // In a real app, you would call your backend API
      setUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isAdmin: !isAdmin } : u
      ));
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="mb-6">
            <FaCrown className="text-yellow-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              גישה נדחתה
            </h2>
            <p className="text-gray-600">
              רק מנהלי מערכת יכולים לגשת לדף זה
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="טוען משתמשים..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            פאנל ניהול משתמשים
          </h1>
          <p className="text-gray-600">
            ניהול משתמשי המערכת
          </p>
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
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {user.isAdmin && <FaCrown className="text-yellow-500" size={16} />}
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isAdmin ? 'מנהל' : 'משתמש'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={user.isActive ? "secondary" : "primary"}
                          onClick={() => handleToggleUserStatus(user.uid, user.isActive)}
                        >
                          {user.isActive ? <FaBan size={12} /> : <FaCheck size={12} />}
                        </Button>
                        
                        {!user.isAdmin && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                          >
                            <FaCrown size={12} />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeleteUser(user.uid)}
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
          <Button
            variant="primary"
            onClick={fetchUsers}
          >
            <FaUsers size={16} />
            רענן רשימה
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
