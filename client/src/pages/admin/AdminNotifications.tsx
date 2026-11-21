import React, { useState } from 'react';
import api from '../../api/client';
import { Bell, Send, CheckCircle2, Radio } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminNotifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [type, setType] = useState('info');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Title and message are required');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.post('/admin/notifications/broadcast', {
        title,
        message,
        targetRole,
        type,
      });
      toast.success(res.data.message || 'Broadcast transmitted successfully');
      setTitle('');
      setMessage('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch broadcast');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-saas-border">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-brand-indigo" />
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
            Alerts & Broadcasts
          </h1>
        </div>
        <p className="text-xs text-saas-muted mt-1">
          Transmit administrative updates and allocation cycle directives across active users
        </p>
      </div>

      {/* Broadcast Form */}
      <form
        onSubmit={handleBroadcast}
        className="bg-saas-card rounded-lg p-5 sm:p-6 border border-saas-border space-y-4"
      >
        <div>
          <label className="block text-xs font-medium text-saas-muted mb-1.5">
            Broadcast Headline
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Allocation Cycle 2 Results Published"
            className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-saas-muted mb-1.5">
              Target Audience
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
            >
              <option value="all">All Platform Users</option>
              <option value="intern">Registered Candidates Only</option>
              <option value="company">Host Companies Only</option>
              <option value="admin">Administrators Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-saas-muted mb-1.5">
              Alert Classification
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
            >
              <option value="info">Information (Standard)</option>
              <option value="success">Success / Allocation Matched</option>
              <option value="warning">Action Required / Deadline</option>
              <option value="action_required">Urgent Compliance Directive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-saas-muted mb-1.5">
            Notification Message Body
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Detailed broadcast briefing or instruction..."
            className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md transition-colors disabled:opacity-50 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Transmitting...' : 'Dispatch Broadcast'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNotifications;
