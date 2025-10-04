import React, { useEffect } from 'react';
import { useAuth } from '../../hooks';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FaGoogle, FaUserSecret, FaSignOutAlt } from 'react-icons/fa';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated, 
    isAnonymous,
    signInAnonymously, 
    signInWithGoogle, 
    signOut,
    getUserDisplayName 
  } = useAuth();

  // Auto sign in anonymously if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signInAnonymously();
    }
  }, [isLoading, isAuthenticated, signInAnonymously]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="מתחבר..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="gradient-ocean rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center text-4xl">
              🐋
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ברוכים הבאים לאורקה
            </h2>
            <p className="text-gray-600">
              יומן הצלילה המקצועי שלכם
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-coral-50 border border-coral-200 rounded-lg">
              <p className="text-coral-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={signInAnonymously}
              disabled={isLoading}
            >
              <FaUserSecret size={20} />
              התחלה מהירה (ללא הרשמה)
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <FaGoogle size={20} />
              התחברות עם Google
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500 space-y-2">
            <p>
              <strong>התחלה מהירה:</strong> שימוש ללא הרשמה, הנתונים יישמרו באופן מקומי
            </p>
            <p>
              <strong>Google:</strong> סנכרון בין מכשירים וגיבוי בענן
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* User info bar - only show for non-anonymous users */}
      {!isAnonymous && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-xs z-50">
          <div className="flex items-center justify-between px-4">
            <span>מחובר כ: {getUserDisplayName()}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1 hover:bg-blue-600 px-2 py-1 rounded"
            >
              <FaSignOutAlt size={12} />
              יציאה
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthWrapper;
