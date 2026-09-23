import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateOverviewStats, calculateStreakStats } from '../services/analyticsService';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import { StatCard } from '../components/ui/StatCard';
import { GoalCard } from '../components/cards/GoalCard';
import { ActivityCard } from '../components/cards/ActivityCard';
import { MatchCard } from '../components/cards/MatchCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import {
  Sparkles,
  PlusCircle,
  Users,
  Target,
  BookOpen,
  Flame,
  Award,
  Clock,
  Link2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const {
    users,
    skills,
    goals,
    activities,
    connections,
    achievements,
    addSkill,
    addGoal,
    addActivity,
    updateGoal,
    deleteGoal,
    sendConnectionRequest
  } = useData();

  const navigate = useNavigate();

  // Modals for Quick Actions
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Forms State
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    type: 'teach',
    category: 'Programming & Tech',
    proficiency: 'Intermediate',
    yearsExperience: 2,
    priority: 'Medium',
    description: ''
  });

  const [newGoalForm, setNewGoalForm] = useState({
    title: '',
    skill: '',
    category: 'Programming & Tech',
    targetLevel: 'Intermediate',
    priority: 'Medium',
    targetCompletionDate: '',
    description: '',
    milestoneText: ''
  });

  const overview = calculateOverviewStats(currentUser?.id, goals, activities, skills, connections);
  const streakStats = calculateStreakStats(activities, currentUser?.id);
  const recommendations = getPersonalizedRecommendations(currentUser, users, skills, goals, activities);

  const mySkills = skills.filter((s) => s.userId === currentUser?.id);
  const myGoals = goals.filter((g) => g.userId === currentUser?.id);
  const myActivities = activities.filter((a) => a.userId === currentUser?.id);

  // Profile completion calculation
  const profileSteps = [
    mySkills.some((s) => s.type === 'teach'),
    mySkills.some((s) => s.type === 'learn'),
    myGoals.length > 0,
    myActivities.length > 0,
    currentUser?.bio,
    currentUser?.location
  ];
  const profileCompletionPct = Math.round((profileSteps.filter(Boolean).length / profileSteps.length) * 100);

  const handleCreateSkillSubmit = (e) => {
    e.preventDefault();
    if (!newSkillForm.name) return;
    addSkill(newSkillForm);
    setShowAddSkillModal(false);
    setNewSkillForm({
      name: '',
      type: 'teach',
      category: 'Programming & Tech',
      proficiency: 'Intermediate',
      yearsExperience: 2,
      priority: 'Medium',
      description: ''
    });
  };

  const handleCreateGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalForm.title || !newGoalForm.skill) return;

    const milestones = newGoalForm.milestoneText
      ? newGoalForm.milestoneText.split('\n').filter(Boolean).map((t, idx) => ({
          id: `m_${idx}_${Date.now()}`,
          title: t.trim(),
          completed: false
        }))
      : [
          { id: 'm_1', title: 'Basic Concepts & Setup', completed: false },
          { id: 'm_2', title: 'Core Hands-on Practice', completed: false }
        ];

    addGoal({
      title: newGoalForm.title,
      skill: newGoalForm.skill,
      category: newGoalForm.category,
      targetLevel: newGoalForm.targetLevel,
      priority: newGoalForm.priority,
      targetCompletionDate: newGoalForm.targetCompletionDate,
      description: newGoalForm.description,
      milestones
    });

    setShowAddGoalModal(false);
    setNewGoalForm({
      title: '',
      skill: '',
      category: 'Programming & Tech',
      targetLevel: 'Intermediate',
      priority: 'Medium',
      targetCompletionDate: '',
      description: '',
      milestoneText: ''
    });
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
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Member Dashboard
            </span>
            <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> {streakStats.currentStreak}-Day Streak
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.fullName || 'Learner'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You have <strong className="text-indigo-300">{overview.activeGoals} active goals</strong> and{' '}
            <strong className="text-emerald-300">{overview.totalHours} total learning hours</strong> accumulated in your network.
          </p>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Add Skill
          </button>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5"
          >
            <Target className="w-4 h-4" /> Create Goal
          </button>
          <button
            onClick={() => navigate('/activities')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Log Session
          </button>
        </div>
      </div>

      {/* Profile Completion Bar (if < 100%) */}
      {profileCompletionPct < 100 && (
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-amber-500/30 bg-amber-950/20">
          <div className="w-full sm:w-2/3">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Complete your SkillSwap Profile
              </span>
              <span className="text-amber-400">{profileCompletionPct}%</span>
            </div>
            <ProgressBar progress={profileCompletionPct} color="amber" size="sm" showText={false} />
          </div>
          <Link
            to="/profile"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors whitespace-nowrap"
          >
            Edit Profile →
          </Link>
        </div>
      )}

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Skills Offered" value={overview.skillsTeachCount} subtitle="Skills you teach" icon={BookOpen} color="emerald" />
        <StatCard title="Skills Learning" value={overview.skillsLearnCount} subtitle="Skills in catalog" icon={Target} color="indigo" />
        <StatCard title="Active Goals" value={overview.activeGoals} subtitle={`${overview.completedGoals} completed`} icon={Award} color="purple" />
        <StatCard title="Learning Hours" value={`${overview.totalHours} hrs`} subtitle={`${overview.totalSessions} sessions`} icon={Clock} color="amber" />
      </div>

      {/* Recommended Partners Section (Skill Matching Engine) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Recommended Peer Exchange Partners
            </h3>
            <p className="text-xs text-slate-400">Calculated by client-side mutual skill matching algorithm</p>
          </div>
          <Link to="/opportunities" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Matches <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.partnerRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {recommendations.partnerRecommendations.slice(0, 2).map((match, idx) => {
              const isConn = connections.some(
                (c) =>
                  ((c.requesterId === currentUser?.id && c.receiverId === match.user.id) ||
                    (c.requesterId === match.user.id && c.receiverId === currentUser?.id)) &&
                  c.status === 'Accepted'
              );
              const isPend = connections.some(
                (c) =>
                  ((c.requesterId === currentUser?.id && c.receiverId === match.user.id) ||
                    (c.requesterId === match.user.id && c.receiverId === currentUser?.id)) &&
                  c.status === 'Pending'
              );

              return (
                <MatchCard
                  key={idx}
                  match={match}
                  onConnect={sendConnectionRequest}
                  isConnected={isConn}
                  isPending={isPend}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Skill Matches Yet"
            description="Add more skills you want to learn or can teach to trigger mutual skill exchange pairings!"
            actionText="Add Skills Now"
            onAction={() => setShowAddSkillModal(true)}
          />
        )}
      </div>

      {/* Active Goals & Personalized Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Learning Goals (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Current Learning Goals
            </h3>
            <Link to="/goals" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Manage Goals ({myGoals.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myGoals.slice(0, 4).map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggleMilestone={handleToggleMilestone}
                  onViewDetail={() => navigate(`/goals/${goal.id}`)}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Active Learning Goals"
              description="Set target completion dates and milestones to structured learning path."
              actionText="Create Goal"
              onAction={() => setShowAddGoalModal(true)}
            />
          )}
        </div>

        {/* Rule-Based Recommendations Panel (1 Column) */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Recommended For You
          </h3>

          <div className="glass-card p-5 space-y-4 border-slate-700">
            {recommendations.skillSuggestions.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Skill Suggestion
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.category}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{item.reason}</p>
              </div>
            ))}

            {recommendations.streakReminders.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Consistency Reminder
                </span>
                <h4 className="text-xs font-bold text-amber-200">{item.title}</h4>
                <p className="text-[11px] text-amber-300/80 leading-snug">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Recent Activities
          </h3>
          <Link to="/history" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            View History Timeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myActivities.slice(0, 3).map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Learning Activities Logged"
            description="Log your first self-learning or teaching session to activate daily streaks!"
            actionText="Log First Activity"
            onAction={() => navigate('/activities')}
          />
        )}
      </div>

      {/* Modal: Add Skill */}
      <Modal isOpen={showAddSkillModal} onClose={() => setShowAddSkillModal(false)} title="Add New Skill">
        <form onSubmit={handleCreateSkillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewSkillForm({ ...newSkillForm, type: 'teach' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  newSkillForm.type === 'teach'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                I Can Teach This
              </button>
              <button
                type="button"
                onClick={() => setNewSkillForm({ ...newSkillForm, type: 'learn' })}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  newSkillForm.type === 'learn'
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
              placeholder="e.g. React, Figma, Python, Public Speaking"
              value={newSkillForm.name}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={newSkillForm.category}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Programming & Tech">Programming & Tech</option>
                <option value="Design & UI/UX">Design & UI/UX</option>
                <option value="Business & Marketing">Business & Marketing</option>
                <option value="Creative & Media">Creative & Media</option>
                <option value="Communication & Soft Skills">Communication & Soft Skills</option>
                <option value="Data Science & AI">Data Science & AI</option>
              </select>
            </div>

            {newSkillForm.type === 'teach' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={newSkillForm.proficiency}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, proficiency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
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
                  value={newSkillForm.priority}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Topics Covered</label>
            <textarea
              rows={2}
              placeholder="What specifically can you teach or want to master?"
              value={newSkillForm.description}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            Save Skill
          </button>
        </form>
      </Modal>

      {/* Modal: Create Goal */}
      <Modal isOpen={showAddGoalModal} onClose={() => setShowAddGoalModal(false)} title="Create Learning Goal">
        <form onSubmit={handleCreateGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title *</label>
            <input
              type="text"
              placeholder="e.g. Master React State Management & Hooks"
              value={newGoalForm.title}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skill *</label>
              <input
                type="text"
                placeholder="e.g. React"
                value={newGoalForm.skill}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, skill: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={newGoalForm.targetCompletionDate}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, targetCompletionDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Milestones (One per line)</label>
            <textarea
              rows={3}
              placeholder="Understand Components & Props&#10;Master useEffect Hook&#10;Build Portfolio Project"
              value={newGoalForm.milestoneText}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, milestoneText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
          >
            Create Goal
          </button>
        </form>
      </Modal>
    </div>
  );
};
