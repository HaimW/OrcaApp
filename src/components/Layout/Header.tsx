import React from 'react';
import { FaWater, FaBars, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onMenuClick, 
  onAddClick, 
  showAddButton = false,
  showBackButton = false 
}) => {
  const navigate = useNavigate();
  return (
    <header className="gradient-ocean text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="חזור"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="תפריט"
            >
              <FaBars size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <FaWater size={24} className="text-white" />
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </div>
        
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="הוספת צלילה"
          >
            <FaPlus size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;


