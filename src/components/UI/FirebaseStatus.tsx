import React, { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'offline'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check Firebase connection
    const checkConnection = async () => {
      try {
        console.log('Checking Firebase connection...');
        const { db } = await import('../../firebase/config');
        if (db) {
          console.log('Firebase connection successful');
          setStatus('connected');
        } else {
          console.log('Firebase connection failed - no db');
          setStatus('error');
        }
      } catch (error) {
        console.error('Firebase connection check failed:', error);
        setStatus('error');
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return null; // Don't show anything while checking
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: FaCheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: 'מחובר ל-Firebase',
          details: 'הנתונים נשמרים בענן'
        };
      case 'error':
        return {
          icon: FaExclamationTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          message: 'מצב לא מקוון',
          details: 'הנתונים נשמרים מקומית'
        };
      case 'offline':
        return {
          icon: FaWifi,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          message: 'לא מחובר לאינטרנט',
          details: 'הנתונים נשמרים מקומית'
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  const Icon = statusInfo.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 ${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-3 shadow-lg max-w-xs`}>
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Icon className={statusInfo.color} size={16} />
        <span className={`text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.message}
        </span>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-xs text-gray-600">
          {statusInfo.details}
        </div>
      )}
    </div>
  );
};

export default FirebaseStatus;
