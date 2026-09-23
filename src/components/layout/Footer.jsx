import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white">SkillSwap</span>
          <span className="text-xs text-slate-500">• Share what you know. Learn what you love.</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Built for Community Skill Exchange & Peer Learning • Persistent Browser LocalStorage Architecture
        </p>
      </div>
    </footer>
  );
};
