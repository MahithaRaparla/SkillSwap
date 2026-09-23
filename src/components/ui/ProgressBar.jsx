import React from 'react';

export const ProgressBar = ({ progress = 0, color = 'indigo', showText = true, size = 'md' }) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  const colors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500'
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ease-out ${colors[color] || colors.indigo}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
