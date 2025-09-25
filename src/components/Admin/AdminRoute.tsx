import React from 'react';
import { useAppSelector } from '../../hooks';
import { Card } from '../UI/Card';
import { FaShieldAlt } from 'react-icons/fa';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAppSelector(state => state.auth);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">
            <FaShieldAlt className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            גישה מוגבלת
          </h1>
          <p className="text-gray-600 mb-4">
            אין לכם הרשאה לגשת לעמוד הניהול
          </p>
          <p className="text-sm text-gray-500">
            רק משתמשים עם הרשאות מנהל יכולים לגשת לאזור זה
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
