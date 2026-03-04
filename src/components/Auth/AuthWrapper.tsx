import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import LoadingSpinner from '../UI/LoadingSpinner';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaSignOutAlt } from 'react-icons/fa';

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
    signOut,
    getUserDisplayName 
  } = useAuth();
  
  const [showRegister, setShowRegister] = useState(false);

  // No auto sign in - user must manually authenticate

  // Debug logging
  console.log('AuthWrapper state:', { isLoading, isAuthenticated, user: !!user, error });
  console.log('AuthWrapper user details:', { uid: user?.uid, email: user?.email, displayName: user?.displayName });

  // Add timeout for loading state
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    } else {
      setShowTimeout(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="מתחבר..." />
          {showTimeout && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                יש בעיה בחיבור. אנא רענן את הדף או נסה שוב.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                רענן דף
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* User quick panel */}
      <div className="fixed right-3 top-3 z-[60] rounded-full bg-blue-600/95 text-white shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs">
          <span className="max-w-[140px] truncate">מחובר כ: {getUserDisplayName()}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1 rounded-full bg-blue-700 px-2 py-1 hover:bg-blue-800"
            aria-label="יציאה"
          >
            <FaSignOutAlt size={11} />
            יציאה
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthWrapper;
