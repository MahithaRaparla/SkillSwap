import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DEMO_CATEGORIES, DEMO_SKILL_CATALOG } from '../data/demoData';
import { UserCard } from '../components/cards/UserCard';
import { Search, Compass, BookOpen, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getId = (v) => (typeof v === 'object' && v ? (v.id || v._id?.toString()) : v);

export const ExploreSkillsPage = () => {
  const { skills, users, connections, sendConnectionRequest } = useData();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Group skills by category
  const categoriesList = ['All', ...DEMO_CATEGORIES.map((c) => c.name)];

  // Filter skills catalog
  const filteredCatalog = DEMO_SKILL_CATALOG.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Find teachers for selected skill or search query
  const matchingTeachers = selectedSkill
    ? users.filter((u) =>
        skills.some(
          (s) => getId(s.userId) === getId(u) && s.type === 'teach' && s.name.toLowerCase() === selectedSkill.toLowerCase()
        )
      )
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Compass className="w-7 h-7 text-indigo-400" /> Explore Skills Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse categories and click any skill to discover community peers who teach it.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-card p-4 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills (e.g. React, Figma, Python, Public Speaking)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSkill(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid Catalog */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Skills Catalog ({filteredCatalog.length})
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {filteredCatalog.map((item) => {
            const teacherCount = skills.filter(
              (s) => s.type === 'teach' && s.name.toLowerCase() === item.name.toLowerCase()
            ).length;

            const isSelected = selectedSkill === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setSelectedSkill(isSelected ? null : item.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800'
                }`}
              >
                <span>{item.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                  {teacherCount} teachers
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Teachers Display */}
      {selectedSkill && (
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> People who teach "{selectedSkill}" ({matchingTeachers.length})
            </h3>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              Clear Selection
            </button>
          </div>

          {matchingTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingTeachers.map((user) => {
                const uId = getId(user);
                const userOffered = skills.filter((s) => getId(s.userId) === uId && s.type === 'teach');
                const userWanted = skills.filter((s) => getId(s.userId) === uId && s.type === 'learn');

                return (
                  <UserCard
                    key={user.id}
                    user={user}
                    skillsOffered={userOffered}
                    skillsWanted={userWanted}
                    onConnect={sendConnectionRequest}
                  />
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-8 text-center border-dashed border-slate-700">
              <p className="text-sm font-bold text-slate-300">No instructors listed for "{selectedSkill}" yet.</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to offer this skill in your profile!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
