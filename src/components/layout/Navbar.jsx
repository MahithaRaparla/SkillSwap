import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Sparkles,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotifRead, markAllNotifsRead, searchQuery, setSearchQuery } = useData();
  const navigate = useNavigate();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read && (n.userId === currentUser?.id || !n.userId));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Skill<span className="text-indigo-400">Swap</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Share what you know. Learn what you love.
            </span>
          </div>
        </Link>

        {/* Global Search Bar (when logged in) */}
        {currentUser && (
          <div className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, people, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => navigate('/partners')}
                className="w-full pl-10 pr-4 py-1.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card bg-slate-900 border-slate-700 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Notifications ({unreadNotifs.length})
                      </h4>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotifsRead}
                          className="text-xs text-indigo-400 hover:underline font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotifRead(n.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                              n.read
                                ? 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                                : 'bg-indigo-950/40 border-indigo-500/30 text-slate-200'
                            }`}
                          >
                            <p className="font-bold text-white mb-0.5">{n.title}</p>
                            <p className="text-slate-300 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-center mt-3">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifMenu(false)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                      >
                        View All Notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <span className="text-xs font-bold text-slate-200 hidden sm:block">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card bg-slate-900 border-slate-700 p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{currentUser.username}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" /> My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-indigo-400" /> Settings
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1 border-t border-slate-800"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
