import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  confirmVariant,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = isDestructive || confirmVariant === 'danger';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-saas-card rounded-lg max-w-md w-full p-5 border border-saas-border shadow-saas-hover">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2 rounded-md flex-shrink-0 ${
              isDanger
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-saas-primary">{title}</h3>
            <p className="mt-1 text-xs text-saas-muted leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-saas-dim hover:text-saas-primary p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-saas-border flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-saas-border hover:bg-saas-surface text-saas-muted hover:text-saas-primary transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md text-white shadow-sm flex items-center space-x-1.5 transition-colors ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-brand-indigo hover:bg-brand-indigo-light'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
