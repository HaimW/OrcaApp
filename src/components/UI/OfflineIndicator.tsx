import React from 'react';
import { useOffline } from '../../hooks/useOffline';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline, lastOnline } = useOffline();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  const formatLastOnline = (date: Date | null) => {
    if (!date) return 'לא ידוע';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'עכשיו';
    if (minutes < 60) return `לפני ${minutes} דקות`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm z-50 shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <FaExclamationTriangle size={16} />
        <span className="font-medium">אין חיבור לאינטרנט</span>
        {lastOnline && (
          <span className="text-orange-100">
            (מחובר לאחרונה: {formatLastOnline(lastOnline)})
          </span>
        )}
      </div>
      <div className="text-xs text-orange-100 mt-1">
        האפליקציה תעבוד במצב לא מקוון עם הנתונים השמורים
      </div>
    </div>
  );
};

export default OfflineIndicator;
