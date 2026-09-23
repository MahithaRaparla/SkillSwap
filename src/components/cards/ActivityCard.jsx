import React from 'react';
import { Calendar, Clock, User, Star, Trash2, BookOpen, Users, Sparkles, Video, MessageSquare } from 'lucide-react';

const typeIcons = {
  'Self Learning': BookOpen,
  'Teaching Session': Users,
  'Practice': Sparkles,
  'Project': Video,
  'Discussion': MessageSquare,
  'Workshop': Users,
  'Knowledge Sharing': Users
};

export const ActivityCard = ({ activity, onDelete }) => {
  const IconComponent = typeIcons[activity.activityType || activity.sessionType] || BookOpen;

  const durationHours = (activity.durationMinutes / 60).toFixed(1);

  return (
    <div className="glass-card p-5 flex flex-col justify-between relative group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                {activity.activityType || activity.sessionType || 'Learning Session'}
              </span>
              <h4 className="text-base font-bold text-white">{activity.title}</h4>
            </div>
          </div>

          <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 shrink-0">
            {activity.durationMinutes} min ({durationHours} hrs)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {activity.date}
          </span>

          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Skill: <strong className="text-slate-200">{activity.skill}</strong>
          </span>

          {activity.partnerName && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Partner: <strong className="text-slate-200">{activity.partnerName}</strong>
            </span>
          )}
        </div>

        {activity.description && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {activity.description}
          </p>
        )}

        {activity.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < activity.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1 font-semibold">({activity.rating}/5)</span>
          </div>
        )}
      </div>

      {onDelete && (
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => onDelete(activity.id)}
            className="text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
};
