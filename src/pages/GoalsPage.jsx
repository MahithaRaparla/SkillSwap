import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { GoalCard } from '../components/cards/GoalCard';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Target, PlusCircle, CheckCircle2, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GoalsPage = () => {
  const { currentUser } = useAuth();
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Active' | 'Completed'
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [form, setForm] = useState({
    title: '',
    skill: '',
    category: 'Programming & Tech',
    targetLevel: 'Intermediate',
    priority: 'Medium',
    targetCompletionDate: '',
    description: '',
    milestoneText: ''
  });

  const myGoals = goals.filter((g) => g.userId === currentUser?.id);

  const filteredGoals = myGoals.filter((g) => {
    if (filterStatus === 'Active') return g.status === 'Active' && g.currentProgress < 100;
    if (filterStatus === 'Completed') return g.status === 'Completed' || g.currentProgress === 100;
    return true;
  });

  const openAddModal = () => {
    setEditingGoal(null);
    setForm({
      title: '',
      skill: '',
      category: 'Programming & Tech',
      targetLevel: 'Intermediate',
      priority: 'Medium',
      targetCompletionDate: '',
      description: '',
      milestoneText: ''
    });
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      skill: goal.skill,
      category: goal.category || 'Programming & Tech',
      targetLevel: goal.targetLevel || 'Intermediate',
      priority: goal.priority || 'Medium',
      targetCompletionDate: goal.targetCompletionDate || '',
      description: goal.description || '',
      milestoneText: goal.milestones ? goal.milestones.map((m) => m.title).join('\n') : ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.skill) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: form.title,
        skill: form.skill,
        category: form.category,
        targetLevel: form.targetLevel,
        priority: form.priority,
        targetCompletionDate: form.targetCompletionDate,
        description: form.description
      });
    } else {
      const milestones = form.milestoneText
        ? form.milestoneText.split('\n').filter(Boolean).map((t, idx) => ({
            id: `m_${idx}_${Date.now()}`,
            title: t.trim(),
            completed: false
          }))
        : [
            { id: 'm_1', title: 'Basic Setup & Fundamentals', completed: false },
            { id: 'm_2', title: 'Core Practice Exercises', completed: false }
          ];

      addGoal({
        title: form.title,
        skill: form.skill,
        category: form.category,
        targetLevel: form.targetLevel,
        priority: form.priority,
        targetCompletionDate: form.targetCompletionDate,
        description: form.description,
        milestones
      });
    }

    setShowModal(false);
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    const targetGoal = myGoals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const updatedMilestones = targetGoal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    updateGoal(goalId, { milestones: updatedMilestones });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-400" /> Learning Goals & Milestones
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Set target dates, track milestone checklists, and complete structured skill roadmaps.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create Learning Goal
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['All', 'Active', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === st
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {st} Goals ({st === 'All' ? myGoals.length : myGoals.filter((g) => (st === 'Completed' ? g.currentProgress === 100 : g.currentProgress < 100)).length})
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={handleToggleMilestone}
              onEdit={openEditModal}
              onDelete={deleteGoal}
              onViewDetail={() => navigate(`/goals/${goal.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Learning Goals Found"
          description="Create structured goals with target completion dates to monitor progress."
          actionText="Create Learning Goal"
          onAction={openAddModal}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingGoal ? 'Edit Goal' : 'Create Learning Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title *</label>
            <input
              type="text"
              placeholder="e.g. Master Figma Design Systems & Auto Layout"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill *</label>
              <input
                type="text"
                placeholder="e.g. Figma"
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Completion Date</label>
              <input
                type="date"
                value={form.targetCompletionDate}
                onChange={(e) => setForm({ ...form, targetCompletionDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Level</label>
              <select
                value={form.targetLevel}
                onChange={(e) => setForm({ ...form, targetLevel: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="What do you plan to achieve with this goal?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          {!editingGoal && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Milestones (One per line)</label>
              <textarea
                rows={3}
                placeholder="1. Read Figma Documentation&#10;2. Build Low-Fi Prototype&#10;3. Perform User Test"
                value={form.milestoneText}
                onChange={(e) => setForm({ ...form, milestoneText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
          >
            {editingGoal ? 'Update Goal' : 'Save Goal'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
