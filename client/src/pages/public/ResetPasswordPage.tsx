import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password updated successfully. Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Token invalid or expired');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-saas-radial-glow pointer-events-none" />
      <div className="max-w-md w-full p-8 bg-saas-card rounded-2xl shadow-card border border-saas-border space-y-6 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-purple text-white flex items-center justify-center mx-auto mb-5 shadow-glow-indigo">
          <Sparkles className="w-5 h-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Set New Password</h2>
          <p className="text-xs text-saas-muted mt-1">
            Choose a new secure password to regain platform access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-saas-dim" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-saas-border bg-saas-surface outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-saas-dim" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-saas-border bg-saas-surface outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim text-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigo-light text-white font-bold text-xs uppercase tracking-wider shadow-glow-indigo transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;