import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Sparkles,
  Users,
  BookOpen,
  ArrowLeftRight,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Code,
  Palette,
  Video,
  Database,
  MessageSquare,
  Flame,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const { currentUser, loginAsDemoUser } = useAuth();
  const { users, skills, connections } = useData();
  const navigate = useNavigate();

  const totalSkillsCount = skills.length;
  const activeLearnersCount = users.length;
  const skillsSharedCount = skills.filter((s) => s.type === 'teach').length;
  const connectionsCount = connections.filter((c) => c.status === 'Accepted').length;

  const categories = [
    { title: 'Programming & Tech', count: '45+ skills', icon: Code, color: 'indigo' },
    { title: 'Design & UI/UX', count: '30+ skills', icon: Palette, color: 'purple' },
    { title: 'Creative & Media', count: '25+ skills', icon: Video, color: 'rose' },
    { title: 'Data Science & AI', count: '20+ skills', icon: Database, color: 'cyan' },
    { title: 'Communication', count: '18+ skills', icon: MessageSquare, color: 'amber' },
    { title: 'Business Strategy', count: '15+ skills', icon: TrendingUp, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 animate-spin" /> Community Peer Learning Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Learn from Others. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Share Your Skills.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Discover people who can teach what you want to learn, share your own expertise, set goals, and grow together in a structured skill exchange network.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                Go to My Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  Create Profile <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/explore"
                  className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
                >
                  Explore Skills
                </Link>
                <button
                  onClick={() => {
                    loginAsDemoUser('user_alex_rivera');
                    navigate('/dashboard');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" /> Try Demo Account (Alex)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Community Statistics Bar */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="glass-card p-5 text-center">
            <h3 className="text-3xl font-extrabold text-indigo-400">{totalSkillsCount}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Total Skills Cataloged</p>
          </div>
          <div className="glass-card p-5 text-center">
            <h3 className="text-3xl font-extrabold text-emerald-400">{activeLearnersCount}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Active Community Learners</p>
          </div>
          <div className="glass-card p-5 text-center">
            <h3 className="text-3xl font-extrabold text-purple-400">{skillsSharedCount}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Skills Offered to Teach</p>
          </div>
          <div className="glass-card p-5 text-center">
            <h3 className="text-3xl font-extrabold text-pink-400">{connectionsCount + 12}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Learning Connections</p>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Why SkillSwap is Built for Real Peer Learning
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Say goodbye to informal chat groups and unorganized contacts. SkillSwap structures your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card-hover p-6">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Showcase Your Skills</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              List the skills you can teach with proficiency levels and experience. Add skills you're eager to learn with priority tags.
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Find Matching Partners</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our deterministic matching algorithm pairs your learning goals with users who offer those skills for high mutual exchange scores.
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Exchange Knowledge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with peers, log structured teaching and self-learning sessions, and evaluate session usefulness with star ratings.
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Track Your Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain daily learning streaks, unlock 10+ achievements, track goals with milestones, and generate interactive analytics reports.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              How SkillSwap Works in 5 Simple Steps
            </h2>
            <p className="text-slate-400 text-sm">Start your peer learning exchange in under two minutes.</p>
          </div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Create your profile', desc: 'Set up your student or professional learner profile with your location and interests.' },
              { step: '02', title: 'Add skills you can teach', desc: 'Detail your expertise in programming, design, writing, public speaking, or data analytics.' },
              { step: '03', title: 'Add skills you want to learn', desc: 'Define target proficiency levels and learning priorities.' },
              { step: '04', title: 'Discover matching people', desc: 'Review mutual skill match percentages, send connection requests, and set goal deadlines.' },
              { step: '05', title: 'Track your learning journey', desc: 'Log sessions, build learning streaks, unlock achievement badges, and export progress reports.' }
            ].map((s, idx) => (
              <div key={idx} className="glass-card p-6 flex items-start gap-4 sm:gap-6">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{s.step}</span>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
