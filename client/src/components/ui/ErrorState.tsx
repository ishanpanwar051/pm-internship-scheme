import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  description = 'Something went wrong while retrieving information. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-10 px-6 rounded-lg border border-rose-500/20 bg-rose-500/5 ${className}`}
    >
      <div className="w-9 h-9 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-3">
        <AlertCircle className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-semibold text-saas-primary">{title}</h3>
      <p className="mt-1 text-xs text-saas-muted max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-saas-primary text-xs font-medium border border-saas-border transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
