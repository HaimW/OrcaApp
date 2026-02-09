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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 text-slate-900 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 active:bg-slate-200"
              aria-label="חזור"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 active:bg-slate-200"
              aria-label="תפריט"
            >
              <FaBars size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <FaWater size={20} className="text-cyan-600" />
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </div>
        
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="rounded-lg bg-cyan-50 p-2 text-cyan-700 transition-colors hover:bg-cyan-100 active:bg-cyan-200"
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

