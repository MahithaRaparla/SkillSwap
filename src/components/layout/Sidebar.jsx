import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Users,
  Sparkles,
  Link2,
  Target,
  PlusCircle,
  History,
  TrendingUp,
  Trophy,
  Settings,
  Flame
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateStreakStats } from '../../services/analyticsService';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const { activities } = useData();

  const streakStats = calculateStreakStats(activities, currentUser?.id);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/skills', label: 'My Skills', icon: BookOpen },
    { to: '/explore', label: 'Explore Skills', icon: Compass },
    { to: '/partners', label: 'Find Partners', icon: Users },
    { to: '/opportunities', label: 'Exchange Matches', icon: Sparkles },
    { to: '/connections', label: 'My Connections', icon: Link2 },
    { to: '/goals', label: 'Learning Goals', icon: Target },
    { to: '/activities', label: 'Log Session', icon: PlusCircle },
    { to: '/history', label: 'Activity History', icon: History },
    { to: '/analytics', label: 'Analytics & Growth', icon: TrendingUp },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/settings', label: 'Settings & Data', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 hidden md:flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="space-y-1 overflow-y-auto pr-1">
        {/* Streak Highlight Card */}
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Current Streak</p>
              <p className="text-sm font-extrabold text-white">{streakStats.currentStreak} Days 🔥</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Max: {streakStats.longestStreak}d
          </span>
        </div>

        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        SkillSwap Network v1.0 • Client-Side LocalStorage
      </div>
    </aside>
  );
};
