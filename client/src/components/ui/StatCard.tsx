import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {change && (
          <div
            className={`flex items-center text-xs font-bold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-1 text-[11px] text-slate-400 font-medium truncate">{subtitle}</div>
      )}
    </div>
  );
};

export default StatCard;
