import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaWater } from 'react-icons/fa';

const links = [
  { to: '/', label: 'בית' },
  { to: '/about', label: 'אודות' },
  { to: '/courses', label: 'קורסים ותכניות' },
  { to: '/community', label: 'קהילה' },
  { to: '/gallery', label: 'גלריה' },
  { to: '/contact', label: 'צור קשר / הרשמה' },
  { to: '/entries', label: 'יומן צלילות' },
];

const MarketingNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/40 bg-[#041b34]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-slate-50">
          <FaWater className="text-cyan-300" />
          <span className="font-display text-xl tracking-wide text-slate-50">אורקה</span>
        </NavLink>
        <nav className="flex gap-2 overflow-x-auto pb-1 text-sm md:text-base">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 transition ${
                  isActive
                    ? 'bg-cyan-300/20 text-cyan-100'
                    : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MarketingNav;
