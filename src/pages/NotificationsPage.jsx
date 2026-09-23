import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { EmptyState } from '../components/ui/EmptyState';
import { Bell, CheckCircle2, Sparkles, UserPlus, Flame, Target } from 'lucide-react';

export const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotifRead, markAllNotifsRead } = useData();

  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id || !n.userId);
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-400" /> Notifications Inbox
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Updates on match suggestions, streak alerts, connection requests, and achievements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotifsRead}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {myNotifs.length > 0 ? (
        <div className="space-y-3">
          {myNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotifRead(n.id)}
              className={`glass-card p-5 border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.read
                  ? 'border-slate-800 bg-slate-900/50 text-slate-400'
                  : 'border-indigo-500/40 bg-indigo-950/30 text-white shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{n.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
                    {new Date(n.date || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Notifications Yet"
          description="Your inbox is clear! Check back later for match alerts and streak milestones."
        />
      )}
    </div>
  );
};
