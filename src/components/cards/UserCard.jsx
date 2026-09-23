import React from 'react';
import { MapPin, Briefcase, GraduationCap, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserCard = ({
  user,
  skillsOffered = [],
  skillsWanted = [],
  matchScore,
  matchType,
  onConnect,
  onViewMatch,
  isConnected = false,
  isPending = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between relative group">
      <div>
        {/* Header with Match Percentage */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500/80 transition-all"
            />
            <div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                {user.fullName}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                {user.status === 'Student' ? (
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{user.status}</span>
                {user.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate max-w-[120px]">{user.location}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {matchScore !== undefined && matchScore !== null && (
            <div className="flex flex-col items-end">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20">
                {matchScore}% Match
              </span>
              {matchType && (
                <span className="text-[10px] font-semibold text-emerald-400 mt-1">
                  {matchType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {user.bio || 'SkillSwap peer learner passionate about mutual skill exchanges and continuous growth.'}
        </p>

        {/* Skills Offered */}
        <div className="mb-3">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Can Teach:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skillsOffered.length > 0 ? (
              skillsOffered.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {skill.name || skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills listed yet</span>
            )}
            {skillsOffered.length > 3 && (
              <span className="text-xs text-slate-400 font-semibold self-center">
                +{skillsOffered.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mb-5">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Wants to Learn:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skillsWanted.length > 0 ? (
              skillsWanted.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {skill.name || skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills specified</span>
            )}
            {skillsWanted.length > 3 && (
              <span className="text-xs text-slate-400 font-semibold self-center">
                +{skillsWanted.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate(`/profile/${user.id}`)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          View Profile
        </button>

        {onViewMatch && matchScore !== undefined && (
          <button
            onClick={() => onViewMatch(user)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 transition-colors"
          >
            Match Breakdown
          </button>
        )}

        {onConnect && (
          <button
            disabled={isConnected || isPending}
            onClick={() => onConnect(user.id)}
            className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              isConnected
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                : isPending
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isConnected ? 'Connected' : isPending ? 'Pending' : 'Connect'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
