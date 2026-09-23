import React from 'react';
import { ArrowLeftRight, Sparkles, UserPlus, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MatchCard = ({ match, onConnect, isConnected, isPending }) => {
  const navigate = useNavigate();
  const { user, matchScore, matchType, canLearnSkill, canTeachSkill, explanation } = match;

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between relative overflow-hidden border-indigo-500/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <h4 className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
                {user.fullName}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>{user.status}</span>
                {user.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{user.location}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 text-sm font-extrabold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 inline-block">
              {matchScore}% Match
            </span>
            <span className="block text-[11px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">
              {matchType}
            </span>
          </div>
        </div>

        {/* Match Exchange Box */}
        <div className="mb-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">You Learn:</p>
            <p className="text-xs font-extrabold text-white truncate">{canLearnSkill || 'UI/UX Design'}</p>
          </div>

          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <div className="flex-1 text-right">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">They Learn:</p>
            <p className="text-xs font-extrabold text-white truncate">{canTeachSkill || 'React'}</p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 flex items-start gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{explanation}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          View Profile
        </button>
        <button
          disabled={isConnected || isPending}
          onClick={() => onConnect && onConnect(user.id)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            isConnected
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
              : isPending
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isConnected ? 'Connected' : isPending ? 'Pending' : 'Exchange Skills'}</span>
        </button>
      </div>
    </div>
  );
};
