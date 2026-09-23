import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateSkillMatch } from '../services/matchingService';
import { SkillCard } from '../components/cards/SkillCard';
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Code2,
  Share2,
  UserPlus,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Target
} from 'lucide-react';

export const PublicProfilePage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { users, skills, connections, sendConnectionRequest } = useData();
  const navigate = useNavigate();

  const targetUser = users.find((u) => u.id === id) || users.find((u) => u.username === id);

  if (!targetUser) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-white mb-2">User Not Found</h3>
        <button
          onClick={() => navigate('/partners')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Back to Find Partners
        </button>
      </div>
    );
  }

  const userSkills = skills.filter((s) => s.userId === targetUser.id);
  const skillsTeach = userSkills.filter((s) => s.type === 'teach');
  const skillsLearn = userSkills.filter((s) => s.type === 'learn');

  const isSelf = currentUser?.id === targetUser.id;
  const matchResult = currentUser && !isSelf ? calculateSkillMatch(currentUser, targetUser, skills) : null;

  const isConnected = connections.some(
    (c) =>
      ((c.requesterId === currentUser?.id && c.receiverId === targetUser.id) ||
        (c.requesterId === targetUser.id && c.receiverId === currentUser?.id)) &&
      c.status === 'Accepted'
  );

  const isPending = connections.some(
    (c) =>
      ((c.requesterId === currentUser?.id && c.receiverId === targetUser.id) ||
        (c.requesterId === targetUser.id && c.receiverId === currentUser?.id)) &&
      c.status === 'Pending'
  );

  return (
    <div className="space-y-8 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* User Banner */}
      <div className="glass-card p-6 sm:p-8 border-slate-700 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
              alt={targetUser.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white">{targetUser.fullName}</h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {targetUser.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">@{targetUser.username}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                {targetUser.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {targetUser.location}
                  </span>
                )}
                {targetUser.institution && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {targetUser.institution}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isSelf && currentUser && (
            <div className="flex flex-col items-end gap-3">
              {matchResult && (
                <span className="px-3.5 py-1.5 text-sm font-extrabold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                  {matchResult.matchScore}% Skill Match
                </span>
              )}

              <button
                disabled={isConnected || isPending}
                onClick={() => sendConnectionRequest(targetUser.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isConnected
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : isPending
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isConnected ? 'Connected' : isPending ? 'Request Pending' : 'Send Connection Request'}</span>
              </button>
            </div>
          )}
        </div>

        {targetUser.bio && (
          <p className="text-xs sm:text-sm text-slate-300 mt-6 pt-4 border-t border-slate-800 leading-relaxed">
            {targetUser.bio}
          </p>
        )}

        {/* Match Breakdown Explanation */}
        {matchResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-300">Match Compatibility Explanation:</p>
              <p className="text-slate-300 mt-0.5">{matchResult.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Skills Sections */}
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Skills {targetUser.fullName.split(' ')[0]} Can Teach ({skillsTeach.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsTeach.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Skills {targetUser.fullName.split(' ')[0]} Wants to Learn ({skillsLearn.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsLearn.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
