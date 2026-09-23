import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateOverviewStats, calculateStreakStats } from '../services/analyticsService';
import { SkillCard } from '../components/cards/SkillCard';
import { Modal } from '../components/ui/Modal';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Code2,
  Share2,
  Edit3,
  BookOpen,
  Target,
  Award,
  Clock,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { skills, goals, activities, connections, deleteSkill } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: currentUser?.fullName || '',
    location: currentUser?.location || '',
    status: currentUser?.status || 'Student',
    institution: currentUser?.institution || '',
    education: currentUser?.education || '',
    experience: currentUser?.experience || '',
    bio: currentUser?.bio || '',
    portfolio: currentUser?.portfolio || '',
    github: currentUser?.github || '',
    linkedin: currentUser?.linkedin || ''
  });

  const overview = calculateOverviewStats(currentUser?.id, goals, activities, skills, connections);
  const streakStats = calculateStreakStats(activities, currentUser?.id);

  const mySkills = skills.filter((s) => s.userId === currentUser?.id);
  const skillsTeach = mySkills.filter((s) => s.type === 'teach');
  const skillsLearn = mySkills.filter((s) => s.type === 'learn');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Banner Header */}
      <div className="glass-card p-6 sm:p-8 border-slate-700 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser?.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white">{currentUser?.fullName}</h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentUser?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mb-2">@{currentUser?.username}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                {currentUser?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentUser.location}
                  </span>
                )}
                {currentUser?.institution && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {currentUser.institution}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {currentUser?.bio && (
          <p className="text-xs sm:text-sm text-slate-300 mt-6 pt-4 border-t border-slate-800 leading-relaxed">
            {currentUser.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
          {currentUser?.portfolio && (
            <a href={currentUser.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-400">
              <Globe className="w-4 h-4" /> Portfolio
            </a>
          )}
          {currentUser?.github && (
            <a href={currentUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-400">
              <Code2 className="w-4 h-4" /> GitHub
            </a>
          )}
          {currentUser?.linkedin && (
            <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-400">
              <Share2 className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{skillsTeach.length}</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Skills Offered</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-indigo-400">{skillsLearn.length}</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Skills Learning</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-amber-400">{streakStats.currentStreak} Days 🔥</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Current Streak</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-purple-400">{overview.totalHours} hrs</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Learning Hours</p>
        </div>
      </div>

      {/* Skills Sections */}
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Skills I Can Teach ({skillsTeach.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsTeach.map((s) => (
              <SkillCard key={s.id} skill={s} isOwner={true} onDelete={deleteSkill} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Skills I Want to Learn ({skillsLearn.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsLearn.map((s) => (
              <SkillCard key={s.id} skill={s} isOwner={true} onDelete={deleteSkill} />
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile Details">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Institution</label>
              <input
                type="text"
                value={editForm.institution}
                onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio Link</label>
              <input
                type="url"
                value={editForm.portfolio}
                onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link</label>
              <input
                type="url"
                value={editForm.github}
                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Link</label>
              <input
                type="url"
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
          >
            Save Profile Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};
