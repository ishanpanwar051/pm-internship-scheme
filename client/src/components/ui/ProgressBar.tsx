import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number; // 0 to 100
  colorClass?: string;
  subtitle?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  colorClass = 'bg-orange-500',
  subtitle,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-900">{clamped}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {subtitle && (
        <div className="text-[10px] text-slate-400 font-medium">{subtitle}</div>
      )}
    </div>
  );
};

export default ProgressBar;
