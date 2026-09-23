import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, Clock, BookOpen, User, Star, MessageSquare, Sparkles } from 'lucide-react';

export const ActivityLogPage = () => {
  const { currentUser } = useAuth();
  const { skills, connections, users, addActivity } = useData();
  const navigate = useNavigate();

  const mySkills = skills.filter((s) => s.userId === currentUser?.id);
  const acceptedConns = connections.filter(
    (c) => (c.requesterId === currentUser?.id || c.receiverId === currentUser?.id) && c.status === 'Accepted'
  );

  const connectedUserObjs = acceptedConns.map((conn) => {
    const targetId = conn.requesterId === currentUser?.id ? conn.receiverId : conn.requesterId;
    return users.find((u) => u.id === targetId);
  }).filter(Boolean);

  const [form, setForm] = useState({
    title: '',
    skill: mySkills[0]?.name || 'React',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 60,
    activityType: 'Self Learning',
    partnerId: '',
    partnerName: '',
    rating: 5,
    description: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.skill) return;

    let partnerName = form.partnerName;
    if (form.partnerId) {
      const pObj = users.find((u) => u.id === form.partnerId);
      if (pObj) partnerName = pObj.fullName;
    }

    addActivity({
      title: form.title,
      skill: form.skill,
      date: form.date,
      durationMinutes: Number(form.durationMinutes),
      activityType: form.activityType,
      sessionType: form.activityType,
      partnerId: form.partnerId || null,
      partnerName: partnerName || null,
      rating: Number(form.rating),
      description: form.description,
      notes: form.notes
    });

    navigate('/history');
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <PlusCircle className="w-7 h-7 text-emerald-400" /> Record Learning Activity
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Log self-study, practice sessions, or peer-teaching exchanges to maintain your streak!
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 border-emerald-500/30">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Title *</label>
            <input
              type="text"
              placeholder="e.g. React Component Architecture Practice & State Hooks"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skill *</label>
              <select
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                {mySkills.length > 0 ? (
                  mySkills.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.type === 'teach' ? 'Teach' : 'Learn'})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="React">React</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Python">Python</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Type</label>
              <select
                value={form.activityType}
                onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Self Learning">Self Learning</option>
                <option value="Teaching Session">Teaching Session</option>
                <option value="Practice">Practice</option>
                <option value="Project">Project</option>
                <option value="Discussion">Discussion</option>
                <option value="Workshop">Workshop</option>
                <option value="Knowledge Sharing">Knowledge Sharing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes) *</label>
              <input
                type="number"
                min={15}
                max={480}
                step={15}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Partner (Optional)</label>
            <select
              value={form.partnerId}
              onChange={(e) => setForm({ ...form, partnerId: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">None (Self-Study / Individual)</option>
              {connectedUserObjs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-300 ml-2">({form.rating}/5)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Key Takeaways</label>
            <textarea
              rows={3}
              placeholder="What did you build, solve, or learn during this session?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            Log Activity & Update Streak 🔥
          </button>
        </form>
      </div>
    </div>
  );
};
