import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeStyles = 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60';

  const lower = status.toLowerCase();

  if (lower.includes('accepted') || lower.includes('success') || lower.includes('active') || lower.includes('verified')) {
    badgeStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (lower.includes('allocated')) {
    badgeStyles = 'bg-brand-indigo/10 text-brand-indigo-light border-brand-indigo/20';
  } else if (lower.includes('pending') || lower.includes('processing')) {
    badgeStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (lower.includes('rejected') || lower.includes('declined') || lower.includes('failed') || lower.includes('blocked')) {
    badgeStyles = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (lower.includes('completed')) {
    badgeStyles = 'bg-brand-indigo/10 text-brand-indigo-light border-brand-indigo/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border font-mono ${badgeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
