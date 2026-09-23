import React from 'react';
import { BookOpen, Award, Clock, Star, Edit3, Trash2, Tag } from 'lucide-react';

export const SkillCard = ({ skill, onEdit, onDelete, isOwner = false }) => {
  const isTeach = skill.type === 'teach';

  const badgeStyles = isTeach
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

  return (
    <div className="glass-card-hover p-5 flex flex-col justify-between relative group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md border uppercase tracking-wider ${badgeStyles}`}>
            {isTeach ? 'Can Teach' : 'Wants to Learn'}
          </span>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            {skill.category}
          </span>
        </div>

        <h4 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          {skill.name}
        </h4>

        {isTeach ? (
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {skill.proficiency || 'Intermediate'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {skill.yearsExperience || 1} yrs exp
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-rose-400" />
              Priority: <strong className="text-slate-200">{skill.priority || 'Medium'}</strong>
            </span>
          </div>
        )}

        {skill.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {skill.description}
          </p>
        )}
      </div>

      {isOwner && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => onEdit && onEdit(skill)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            title="Edit Skill"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(skill.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Skill"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
