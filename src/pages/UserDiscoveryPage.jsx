import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateSkillMatch } from '../services/matchingService';
import { UserCard } from '../components/cards/UserCard';
import { Modal } from '../components/ui/Modal';
import { Search, Users, Filter, Sparkles, X, MapPin, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

const getId = (v) => (typeof v === 'object' && v ? (v.id || v._id?.toString()) : v);

export const UserDiscoveryPage = () => {
  const { currentUser } = useAuth();
  const { users, skills, connections, sendConnectionRequest, searchQuery, setSearchQuery } = useData();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMatchUser, setSelectedMatchUser] = useState(null);

  const currentUserId = getId(currentUser);
  const otherUsers = users.filter((u) => getId(u) !== currentUserId);

  // Calculate matches and filter
  const processedUsers = otherUsers.map((u) => {
    const uId = getId(u);
    const uTeach = skills.filter((s) => getId(s.userId) === uId && s.type === 'teach');
    const uLearn = skills.filter((s) => getId(s.userId) === uId && s.type === 'learn');

    const matchInfo = currentUser ? calculateSkillMatch(currentUser, u, skills) : { matchScore: 50 };

    return {
      user: u,
      skillsOffered: uTeach,
      skillsWanted: uLearn,
      matchScore: matchInfo.matchScore,
      matchType: matchInfo.matchType,
      explanation: matchInfo.explanation
    };
  });

  // Apply Search & Filter
  const filteredUsers = processedUsers.filter(({ user, skillsOffered, skillsWanted }) => {
    // Search query check
    const query = searchQuery.toLowerCase();
    const matchesName = user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query);
    const matchesLocation = user.location && user.location.toLowerCase().includes(query);
    const matchesTeach = skillsOffered.some((s) => s.name.toLowerCase().includes(query));
    const matchesLearn = skillsWanted.some((s) => s.name.toLowerCase().includes(query));

    const matchesSearch = !query || matchesName || matchesLocation || matchesTeach || matchesLearn;

    // Status filter
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === 'All' ||
      skillsOffered.some((s) => s.category === categoryFilter) ||
      skillsWanted.some((s) => s.category === categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort by highest match score
  filteredUsers.sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-400" /> Find Learning Partners
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Discover peers with complementary skill sets and mutual skill exchange scores.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, skill (e.g. React), location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 md:w-48"
            >
              <option value="All">All Categories</option>
              <option value="Programming & Tech">Programming & Tech</option>
              <option value="Design & UI/UX">Design & UI/UX</option>
              <option value="Business & Marketing">Business & Marketing</option>
              <option value="Creative & Media">Creative & Media</option>
              <option value="Communication & Soft Skills">Communication & Soft Skills</option>
              <option value="Data Science & AI">Data Science & AI</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 md:w-36"
            >
              <option value="All">All Statuses</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
            </select>

            {(searchQuery || categoryFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                }}
                className="px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(({ user, skillsOffered, skillsWanted, matchScore, matchType }) => {
          const uId = getId(user);
          const isConn = connections.some(
            (c) =>
              ((getId(c.requesterId) === currentUserId && getId(c.receiverId) === uId) ||
                (getId(c.requesterId) === uId && getId(c.receiverId) === currentUserId)) &&
              c.status === 'Accepted'
          );
          const isPend = connections.some(
            (c) =>
              ((getId(c.requesterId) === currentUserId && getId(c.receiverId) === uId) ||
                (getId(c.requesterId) === uId && getId(c.receiverId) === currentUserId)) &&
              c.status === 'Pending'
          );

          return (
            <UserCard
              key={user.id}
              user={user}
              skillsOffered={skillsOffered}
              skillsWanted={skillsWanted}
              matchScore={matchScore}
              matchType={matchType}
              onConnect={sendConnectionRequest}
              onViewMatch={(u) => setSelectedMatchUser(u)}
              isConnected={isConn}
              isPending={isPend}
            />
          );
        })}
      </div>

      {/* Match Breakdown Modal */}
      {selectedMatchUser && (
        <Modal
          isOpen={!!selectedMatchUser}
          onClose={() => setSelectedMatchUser(null)}
          title={`Match Analysis: ${selectedMatchUser.fullName}`}
        >
          {(() => {
            const matchInfo = calculateSkillMatch(currentUser, selectedMatchUser, skills);
            return (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 text-center">
                  <span className="text-3xl font-black text-emerald-400">{matchInfo.matchScore}% Match Score</span>
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mt-1">
                    {matchInfo.matchType}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Explanation:
                  </p>
                  <p className="text-slate-300">{matchInfo.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-indigo-400 uppercase tracking-wider mb-1">They Can Teach:</p>
                    <p className="text-slate-200 font-bold">{matchInfo.canLearnSkill || 'General Domain Expertise'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-emerald-400 uppercase tracking-wider mb-1">You Can Teach:</p>
                    <p className="text-slate-200 font-bold">{matchInfo.canTeachSkill || 'Skill Mentoring'}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sendConnectionRequest(selectedMatchUser.id);
                    setSelectedMatchUser(null);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
                >
                  Send Skill Exchange Connection Request
                </button>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
