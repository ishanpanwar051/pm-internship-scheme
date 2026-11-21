import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'chart' | 'line';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 1 }) => {
  if (type === 'table') {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-saas-surface rounded border border-saas-border w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-10 bg-saas-card rounded border border-saas-border-subtle w-full" />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="p-5 bg-saas-card rounded-lg border border-saas-border animate-pulse">
        <div className="h-4 bg-saas-surface rounded w-1/4 mb-5" />
        <div className="h-52 bg-saas-surface/40 rounded flex items-end justify-between p-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-800 rounded-t w-full"
              style={{ height: `${25 + (i * 11) % 65}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-saas-card rounded-lg border border-saas-border animate-pulse space-y-3"
          >
            <div className="h-3 bg-saas-surface rounded w-1/2" />
            <div className="h-6 bg-saas-surface rounded w-1/3" />
            <div className="h-2 bg-zinc-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-3.5 bg-saas-surface rounded w-full" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
