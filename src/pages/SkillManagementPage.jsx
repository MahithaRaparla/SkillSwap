import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SkillCard } from '../components/cards/SkillCard';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusCircle, CheckCircle2, Target, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export const SkillManagementPage = () => {
  const { currentUser } = useAuth();
  const { skills, addSkill, updateSkill, deleteSkill, showToast } = useData();

  const [activeTab, setActiveTab] = useState('teach'); // 'teach' | 'learn'
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [form, setForm] = useState({
    name: '',
    type: 'teach',
    category: 'Programming & Tech',
    proficiency: 'Intermediate',
    yearsExperience: 2,
    priority: 'Medium',
    description: ''
  });

  const mySkills = skills.filter((s) => s.userId === currentUser?.id);
  const skillsTeach = mySkills.filter((s) => s.type === 'teach');
  const skillsLearn = mySkills.filter((s) => s.type === 'learn');

  const openAddModal = (type) => {
    setEditingSkill(null);
    setForm({
      name: '',
      type,
      category: 'Programming & Tech',
      proficiency: 'Intermediate',
      yearsExperience: 2,
      priority: 'Medium',
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      type: skill.type,
      category: skill.category,
      proficiency: skill.proficiency || 'Intermediate',
      yearsExperience: skill.yearsExperience || 1,
      priority: skill.priority || 'Medium',
      description: skill.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    // Check duplicate
    const isDuplicate = mySkills.some(
      (s) =>
        s.name.toLowerCase() === form.name.toLowerCase() &&
        s.type === form.type &&
        (!editingSkill || s.id !== editingSkill.id)
    );

    if (isDuplicate) {
      showToast(`You already have "${form.name}" in your ${form.type} list.`, 'error');
      return;
    }

    if (editingSkill) {
      updateSkill(editingSkill.id, form);
    } else {
      addSkill(form);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-400" /> Skill Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage skills you offer to teach and skills you want to learn from community peers.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openAddModal('teach')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Teaching Skill
          </button>
          <button
            onClick={() => openAddModal('learn')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Learning Skill
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('teach')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'teach'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Skills I Can Teach ({skillsTeach.length})
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'learn'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" /> Skills I Want to Learn ({skillsLearn.length})
        </button>
      </div>

      {/* Skills Grid */}
      {activeTab === 'teach' ? (
        skillsTeach.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsTeach.map((skill) => (
              <SkillCard key={skill.id} skill={skill} isOwner={true} onEdit={openEditModal} onDelete={deleteSkill} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Teaching Skills Listed"
            description="Showcase what you know! Adding skills you can teach unlocks mutual exchange pairing options."
            actionText="Add Skill to Teach"
            onAction={() => openAddModal('teach')}
          />
        )
      ) : skillsLearn.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsLearn.map((skill) => (
            <SkillCard key={skill.id} skill={skill} isOwner={true} onEdit={openEditModal} onDelete={deleteSkill} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Learning Wishlist Skills"
          description="List skills you want to learn to discover peer mentors and set learning goals."
          actionText="Add Skill to Learn"
          onAction={() => openAddModal('learn')}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSkill ? 'Edit Skill Record' : 'Add New Skill Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Category Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'teach' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  form.type === 'teach'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                I Can Teach This
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'learn' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  form.type === 'learn'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                I Want to Learn This
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. React, Python, UI/UX Design, Public Speaking"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Programming & Tech">Programming & Tech</option>
                <option value="Design & UI/UX">Design & UI/UX</option>
                <option value="Business & Marketing">Business & Marketing</option>
                <option value="Creative & Media">Creative & Media</option>
                <option value="Communication & Soft Skills">Communication & Soft Skills</option>
                <option value="Data Science & AI">Data Science & AI</option>
              </select>
            </div>

            {form.type === 'teach' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={form.proficiency}
                  onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Key Topics</label>
            <textarea
              rows={3}
              placeholder="Provide context on what you can offer or want to learn..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            {editingSkill ? 'Update Skill Record' : 'Save Skill Record'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
