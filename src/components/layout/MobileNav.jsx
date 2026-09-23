import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, PlusCircle, Sparkles, User } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/activities', label: 'Log', icon: PlusCircle, isPrimary: true },
    { to: '/opportunities', label: 'Matches', icon: Sparkles },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        if (item.isPrimary) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -mt-5 border-4 border-slate-900 flex items-center justify-center"
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
