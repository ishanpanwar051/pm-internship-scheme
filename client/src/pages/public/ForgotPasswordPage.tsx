import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Mail, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Reset link dispatched to registered email');
    } catch (err: any) {
      toast.error(err.message || 'Unable to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-200 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-5 shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>

        <Link
          to="/login"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Password Reset Dispatched</h2>
            <p className="text-xs text-slate-600">
              If an account with <strong className="text-slate-900">{email}</strong> exists, you
              will receive an encrypted reset link expiring in 15 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Forgot Password</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email to initiate password recovery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white placeholder-slate-400 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
