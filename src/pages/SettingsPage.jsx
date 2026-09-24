import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Settings,
  Shield,
  User,
  Database,
  Server,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { refreshAllData, showToast } = useData();

  const handleSync = async () => {
    await refreshAllData();
    showToast('Synced profile and application state with backend!');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-400" /> Account & System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          View your full-stack account details, database status, and API configuration.
        </p>
      </div>

      {/* Backend Architecture Status Banner */}
      <div className="glass-card p-6 border-indigo-500/30 bg-indigo-950/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" /> Full-Stack Architecture Active
            </p>
            <p className="text-slate-300 leading-relaxed">
              Your SkillBridge account, skills, exchange goals, activity logs, and connections are securely persisted in a <strong>MongoDB Atlas / Express backend server</strong> via JWT authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="glass-card p-6 border-slate-700 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-5 h-5 text-indigo-400" /> Account Profile Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">Full Name</span>
            <span className="font-bold text-white text-sm">{currentUser?.fullName || 'User'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">Email Address</span>
            <span className="font-bold text-white text-sm flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> {currentUser?.email || 'N/A'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">Username</span>
            <span className="font-bold text-indigo-300 text-sm">@{currentUser?.username || 'user'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px]">Location</span>
            <span className="font-bold text-white text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {currentUser?.location || 'Not specified'}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" /> Database Sync Status
            </h4>
            <p className="text-xs text-slate-400">Force refresh all application state from the REST API.</p>
          </div>
          <button
            onClick={handleSync}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Sync State
          </button>
        </div>
      </div>
    </div>
  );
};
