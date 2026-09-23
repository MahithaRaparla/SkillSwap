import React from 'react';
import { Target, Calendar, CheckSquare, Square, Edit3, Trash2, ChevronRight, Award } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const GoalCard = ({ goal, onUpdateProgress, onToggleMilestone, onEdit, onDelete, onViewDetail }) => {
  const isCompleted = goal.currentProgress === 100 || goal.status === 'Completed';

  const priorityColors = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
  };

  return (
    <div className="glass-card-hover p-6 flex flex-col justify-between relative group">
      <div>
        {/* Priority & Skill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
            <Target className="w-3 h-3" />
            {goal.skill}
          </span>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${priorityColors[goal.priority] || priorityColors.Medium}`}>
              {goal.priority || 'Medium'} Priority
            </span>
            {isCompleted && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Completed 🎉
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4
          onClick={() => onViewDetail && onViewDetail(goal)}
          className="text-lg font-extrabold text-white group-hover:text-indigo-400 transition-colors cursor-pointer mb-2 flex items-center justify-between"
        >
          <span>{goal.title}</span>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </h4>

        {goal.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {goal.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-5">
          <ProgressBar progress={goal.currentProgress || 0} color={isCompleted ? 'emerald' : 'indigo'} size="md" />
        </div>

        {/* Milestones Preview */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Milestones Checklist:</span>
              <span className="text-indigo-400">
                {goal.milestones.filter((m) => m.completed).length} / {goal.milestones.length}
              </span>
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {goal.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onToggleMilestone && onToggleMilestone(goal.id, m.id)}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer group/m select-none"
                >
                  {m.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 group-hover/m:text-indigo-400 shrink-0" />
                  )}
                  <span className={m.completed ? 'line-through text-slate-500' : ''}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Date */}
        {goal.targetCompletionDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Target completion: <strong className="text-slate-200">{goal.targetCompletionDate}</strong></span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => onViewDetail && onViewDetail(goal)}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          View Details & Update
        </button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              title="Edit Goal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
