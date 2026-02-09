import React from 'react';
import { FaHome, FaList, FaPlus, FaChartBar, FaCog, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks';

interface NavItem {
  path: string;
  icon: any;
  label: string;
  isSpecial?: boolean;
  isAdmin?: boolean;
}

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useUserProfile();

  const baseNavItems: NavItem[] = [
    { path: '/', icon: FaHome, label: 'בית' },
    { path: '/entries', icon: FaList, label: 'יומן' },
    { path: '/add', icon: FaPlus, label: 'הוספה', isSpecial: true },
    { path: '/stats', icon: FaChartBar, label: 'סטטיסטיקות' },
    { path: '/community', icon: FaUsers, label: 'קהילה' },
    { path: '/settings', icon: FaCog, label: 'הגדרות' },
  ];

  const navItems: NavItem[] = isAdmin
    ? [...baseNavItems, { path: '/admin', icon: FaShieldAlt, label: 'ניהול', isAdmin: true }]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive
                  ? item.isAdmin ? 'text-red-500' : 'text-ocean-500'
                  : 'text-gray-500 hover:text-gray-700'
              } ${
                item.isSpecial
                  ? 'bg-ocean-500 text-white hover:bg-ocean-600 active:bg-ocean-700 shadow-lg scale-110'
                  : item.isAdmin
                  ? 'bg-red-50 border border-red-200'
                  : ''
              }`}
              aria-label={item.label}
            >
              <Icon
                size={item.isSpecial ? 24 : 20}
                className={`mb-1 ${item.isSpecial ? 'text-white' : ''}`}
              />
              <span
                className={`text-xs font-medium ${
                  item.isSpecial ? 'text-white' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
