import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon = Sparkles }) => {
  return (
    <div className="glass-card p-10 text-center flex flex-col items-center justify-center my-6 border-dashed border-slate-700/80">
      <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700 text-indigo-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
