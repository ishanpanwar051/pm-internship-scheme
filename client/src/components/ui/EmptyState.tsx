import React from 'react';
import { Inbox, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = Inbox,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-12 px-6 rounded-lg border border-dashed border-saas-border bg-saas-card/50 ${className}`}
    >
      <div className="w-10 h-10 rounded-md bg-saas-surface border border-saas-border text-saas-dim mx-auto flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-saas-primary">{title}</h3>
      <p className="mt-1 text-xs text-saas-muted max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3.5 py-1.5 rounded-md bg-brand-indigo hover:bg-brand-indigo-light text-white text-xs font-medium transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
