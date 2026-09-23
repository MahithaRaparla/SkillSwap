import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ACHIEVEMENTS_DEFINITION } from '../data/demoData';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Trophy,
  Award,
  Target,
  Flame,
  GraduationCap,
  Compass,
  Users,
  Clock,
  Footprints,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Footprints,
  Target,
  Flame,
  GraduationCap,
  Compass,
  Users,
  Trophy,
  Award,
  Clock,
  Sparkles
};

export const AchievementsPage = () => {
  const { currentUser } = useAuth();
  const { achievements } = useData();

  const unlockedIds = achievements || [];
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS_DEFINITION.length;
  const completionPct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 border-amber-500/30 bg-gradient-to-r from-amber-950/40 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Gamification & Achievements
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Trophy Room & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Unlock achievement badges by logging sessions, maintaining streaks, and hitting learning goals.
          </p>
        </div>

        <div className="w-full sm:w-64 glass-card p-4 text-center border-amber-500/30 bg-slate-900">
          <p className="text-3xl font-black text-amber-400">{unlockedCount} / {totalCount}</p>
          <p className="text-xs font-bold text-slate-300 mb-2">Achievements Unlocked</p>
          <ProgressBar progress={completionPct} color="amber" size="sm" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS_DEFINITION.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);
          const IconComponent = iconMap[badge.icon] || Trophy;

          return (
            <div
              key={badge.id}
              className={`glass-card p-6 flex items-start gap-4 transition-all ${
                isUnlocked
                  ? 'border-amber-500/40 bg-slate-900/90 shadow-xl shadow-amber-500/5'
                  : 'border-slate-800 bg-slate-950/40 opacity-70'
              }`}
            >
              <div
                className={`p-4 rounded-2xl border shrink-0 ${
                  isUnlocked
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-600 border-slate-700'
                }`}
              >
                {isUnlocked ? <IconComponent className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-white">{badge.title}</h4>
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-2">{badge.description}</p>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Category: {badge.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
