import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ActivityCard } from '../components/cards/ActivityCard';
import { EmptyState } from '../components/ui/EmptyState';
import { History, Filter, ArrowUpDown, Calendar, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage = () => {
  const { currentUser } = useAuth();
  const { activities, deleteActivity } = useData();
  const navigate = useNavigate();

  const [filterSkill, setFilterSkill] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'longest'

  const myActivities = activities.filter((a) => a.userId === currentUser?.id);

  // Extract unique skill names for filter
  const uniqueSkills = ['All', ...new Set(myActivities.map((a) => a.skill))];

  // Filtering
  const filtered = myActivities.filter((a) => {
    const matchesSkill = filterSkill === 'All' || a.skill === filterSkill;
    const matchesType = filterType === 'All' || a.activityType === filterType || a.sessionType === filterType;
    return matchesSkill && matchesType;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortOrder === 'longest') return (b.durationMinutes || 0) - (a.durationMinutes || 0);
    return 0;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-amber-400" /> Learning History Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past learning logs, teaching sessions, and duration records.
          </p>
        </div>

        <button
          onClick={() => navigate('/activities')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          Log New Activity
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Skills</option>
            {uniqueSkills.filter((s) => s !== 'All').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Session Types</option>
            <option value="Self Learning">Self Learning</option>
            <option value="Teaching Session">Teaching Session</option>
            <option value="Practice">Practice</option>
            <option value="Project">Project</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 w-full md:w-auto"
          >
            <option value="newest">Sort by Newest Date</option>
            <option value="oldest">Sort by Oldest Date</option>
            <option value="longest">Sort by Longest Duration</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      {filtered.length > 0 ? (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800 hidden md:block">
          {filtered.map((act) => (
            <div key={act.id} className="relative pl-12">
              <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-slate-900"></div>
              <ActivityCard activity={act} onDelete={deleteActivity} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Learning History Records"
          description="Log your first study or teaching activity to build your timeline."
          actionText="Log Activity"
          onAction={() => navigate('/activities')}
        />
      )}

      {/* Mobile Card Stack */}
      <div className="md:hidden space-y-4">
        {filtered.map((act) => (
          <ActivityCard key={act.id} activity={act} onDelete={deleteActivity} />
        ))}
      </div>
    </div>
  );
};
