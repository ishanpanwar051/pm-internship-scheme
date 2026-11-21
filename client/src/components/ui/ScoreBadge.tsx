import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreBadgeProps {
  score: number; // 0 to 1 float or 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'badge' | 'circular';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = 'sm',
  showLabel = false,
  variant = 'badge',
}) => {
  const normalizedScore = score <= 1 ? Math.round(score * 100) : Math.round(score);

  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-brand-indigo/10 text-brand-indigo-light border border-brand-indigo/20">
        {normalizedScore}%
      </span>
    );
  }

  let pathColor = '#6366F1'; // Brand indigo by default
  if (normalizedScore >= 90) {
    pathColor = '#10B981'; // Green for 90%+
  } else if (normalizedScore < 60) {
    pathColor = '#F59E0B'; // Amber
  }

  const dimensions = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-12 h-12 text-xs',
    lg: 'w-20 h-20 text-sm font-bold',
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <div className={`${dimensions[size]} font-mono font-semibold`}>
        <CircularProgressbar
          value={normalizedScore}
          text={`${normalizedScore}%`}
          styles={buildStyles({
            textSize: '26px',
            pathColor,
            textColor: '#F4F4F5',
            trailColor: '#27272A',
          })}
        />
      </div>
      {showLabel && size === 'lg' && (
        <span className="text-xs font-medium text-saas-dim uppercase tracking-wider">
          Match Quality
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
