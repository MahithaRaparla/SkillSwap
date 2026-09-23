import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  calculateOverviewStats,
  calculateStreakStats,
  getChartDataHoursByDate,
  getSkillProgressChartData,
  generateSkillDevelopmentReport
} from '../services/analyticsService';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { StatCard } from '../components/ui/StatCard';
import { TrendingUp, Printer, Award, Clock, Flame, Target, BookOpen, FileText } from 'lucide-react';

export const ProgressAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const { goals, activities, skills, connections } = useData();

  const overview = calculateOverviewStats(currentUser?.id, goals, activities, skills, connections);
  const streakStats = calculateStreakStats(activities, currentUser?.id);

  const hoursChartData = getChartDataHoursByDate(activities, currentUser?.id);
  const skillChartData = getSkillProgressChartData(goals, currentUser?.id);
  const reportData = generateSkillDevelopmentReport(currentUser, goals, activities, skills);

  const pieData = [
    { name: 'Completed Goals', value: overview.completedGoals || 1, color: '#10b981' },
    { name: 'Active Goals', value: overview.activeGoals || 1, color: '#8b5cf6' }
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-indigo-400" /> Analytics & Progress Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic growth metrics, learning hours charts, and skill development report.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <StatCard title="Total Learning Hours" value={`${overview.totalHours} hrs`} subtitle={`${overview.totalSessions} sessions`} icon={Clock} color="indigo" />
        <StatCard title="Current Streak" value={`${streakStats.currentStreak} Days`} subtitle={`Max ${streakStats.longestStreak} days`} icon={Flame} color="amber" />
        <StatCard title="Goal Completion" value={`${overview.goalCompletionRate}%`} subtitle={`${overview.completedGoals} of ${overview.totalGoals} goals`} icon={Award} color="emerald" />
        <StatCard title="Weekly Consistency" value={`${streakStats.weeklyConsistency}%`} subtitle="Active days ratio" icon={TrendingUp} color="purple" />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        {/* Chart 1: Learning Hours Over Time */}
        <div className="glass-card p-6 border-slate-700">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Learning Hours Over Time
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hoursChartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Skill Progress Bar Chart */}
        <div className="glass-card p-6 border-slate-700">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" /> Goal Progress by Skill (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillChartData}>
                <XAxis dataKey="skill" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="progress" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personalized Skill Development PDF Report Card (Printable) */}
      <div className="glass-card p-8 border-indigo-500/40 bg-slate-900/90 space-y-6 print:border-none print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" /> Skill Development Report
            </div>
            <h2 className="text-2xl font-black text-white">{reportData.userName}</h2>
            <p className="text-xs text-slate-400">{reportData.status} • {reportData.location} • Generated {reportData.generatedDate}</p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-indigo-400">{reportData.totalHours} hrs</span>
            <p className="text-xs text-slate-400 font-semibold">Total Learning Time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Strongest Skill Goal</p>
            <p className="text-sm font-black text-white">{reportData.strongestSkill}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Needs Improvement</p>
            <p className="text-sm font-black text-white">{reportData.skillNeedingImprovement}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Current Streak</p>
            <p className="text-sm font-black text-white">{reportData.currentStreak} Days 🔥</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-2">Summary Insights:</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {reportData.summaryInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
