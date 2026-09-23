import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Target,
  ArrowLeft,
  Calendar,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Award,
  Sparkles
} from 'lucide-react';

export const GoalDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { goals, updateGoal, deleteGoal } = useData();
  const navigate = useNavigate();

  const goal = goals.find((g) => g.id === id);

  const [newMilestoneText, setNewMilestoneText] = useState('');

  if (!goal) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-white mb-2">Goal Not Found</h3>
        <button
          onClick={() => navigate('/goals')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Back to Learning Goals
        </button>
      </div>
    );
  }

  const milestones = goal.milestones || [];

  const handleToggleMilestone = (mId) => {
    const updated = milestones.map((m) =>
      m.id === mId
        ? {
            ...m,
            completed: !m.completed,
            dateCompleted: !m.completed ? new Date().toISOString().split('T')[0] : null
          }
        : m
    );
    updateGoal(goal.id, { milestones: updated });
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    const newM = {
      id: `m_${Date.now()}`,
      title: newMilestoneText.trim(),
      completed: false,
      dateCompleted: null
    };

    const updated = [...milestones, newM];
    updateGoal(goal.id, { milestones: updated });
    setNewMilestoneText('');
  };

  const handleDeleteMilestone = (mId) => {
    const updated = milestones.filter((m) => m.id !== mId);
    updateGoal(goal.id, { milestones: updated });
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/goals')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Goals
      </button>

      {/* Goal Main Card */}
      <div className="glass-card p-6 sm:p-8 border-purple-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="px-3 py-1 text-xs font-bold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
              <Target className="w-3.5 h-3.5" /> Skill: {goal.skill}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{goal.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Target: {goal.targetLevel || 'Intermediate'}
            </span>
            <button
              onClick={() => {
                deleteGoal(goal.id);
                navigate('/goals');
              }}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            {goal.description}
          </p>
        )}

        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Overall Completion Progress</span>
            <span className="text-purple-400">{goal.currentProgress}%</span>
          </div>
          <ProgressBar progress={goal.currentProgress || 0} color="purple" size="lg" showText={false} />
        </div>

        {goal.targetCompletionDate && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-800">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Target completion deadline: <strong className="text-white">{goal.targetCompletionDate}</strong></span>
          </div>
        )}
      </div>

      {/* Milestones Checklist Card */}
      <div className="glass-card p-6 border-slate-700 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-400" /> Milestones Checklist ({milestones.filter((m) => m.completed).length} / {milestones.length})
          </h3>
        </div>

        {/* Add Milestone Form */}
        <form onSubmit={handleAddMilestone} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new milestone (e.g. Master custom hooks in React)..."
            value={newMilestoneText}
            onChange={(e) => setNewMilestoneText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        {/* Milestones List */}
        <div className="space-y-3">
          {milestones.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No milestones added yet.</p>
          ) : (
            milestones.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  m.completed
                    ? 'bg-slate-900/50 border-slate-800/80'
                    : 'bg-slate-900 border-slate-700/80 hover:border-purple-500/50'
                }`}
              >
                <div
                  onClick={() => handleToggleMilestone(m.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  {m.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${m.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {m.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {m.completed && m.dateCompleted && (
                    <span className="text-[10px] text-slate-500 font-semibold hidden sm:block">
                      Done {m.dateCompleted}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
