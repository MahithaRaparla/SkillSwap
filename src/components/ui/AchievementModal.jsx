import React from 'react';
import { Trophy, Award, Target, Flame, Compass, Users, Clock, Footprints, GraduationCap, Sparkles } from 'lucide-react';
import { Modal } from './Modal';

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

export const AchievementModal = ({ achievement, onClose }) => {
  if (!achievement) return null;

  const IconComponent = iconMap[achievement.icon] || Trophy;

  return (
    <Modal isOpen={!!achievement} onClose={onClose} title="Achievement Unlocked!" maxWidth="max-w-md">
      <div className="text-center py-4 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse"></div>
          <div className="relative p-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl shadow-amber-500/30 border-2 border-amber-300">
            <IconComponent className="w-12 h-12" />
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
          {achievement.category || 'Badge'}
        </span>

        <h3 className="text-2xl font-extrabold text-white mb-2">{achievement.title}</h3>
        <p className="text-slate-300 text-sm max-w-xs leading-relaxed mb-6">
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200"
        >
          Awesome! Keep Growing
        </button>
      </div>
    </Modal>
  );
};
