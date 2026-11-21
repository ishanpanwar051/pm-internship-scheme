import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { ScrollText, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import toast from 'react-hot-toast';

interface AuditEntry {
  _id: string;
  userId: { name?: string; email?: string } | null;
  role: string;
  action: string;
  entity: string;
  details: Record<string, any>;
  ip: string;
  createdAt: string;
}

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/admin/audit-logs?page=${p}&limit=25`);
      setLogs(res.data.logs || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (e) {
      toast.error('Unable to load audit trail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleClear = async () => {
    if (!window.confirm('Clear the entire audit trail? This action is itself audited.')) return;
    try {
      await api.delete('/admin/audit-logs');
      toast.success('Audit trail cleared');
      fetchLogs(1);
    } catch (e: any) {
      toast.error(e.message || 'Clear failed');
    }
  };

  const formatAction = (action: string) =>
    action
      .split('.')
      .map((s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(' · ');

  const detailSummary = (d: Record<string, any>) => {
    if (!d || Object.keys(d).length === 0) return '';
    try {
      const parts = Object.entries(d)
        .filter(([k]) => !['logId'].includes(k))
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
      return parts.join(', ').slice(0, 120);
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Audit Trail
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Immutable record of administrative actions across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-saas-muted hover:text-red-400 bg-saas-surface hover:bg-saas-surface-hover border border-saas-border rounded-md transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Trail</span>
        </button>
      </div>

      <div className="bg-saas-card border border-saas-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-saas-border flex items-center justify-between">
          <h3 className="text-xs font-semibold text-saas-primary uppercase tracking-wider">
            Action History
          </h3>
          <span className="text-[11px] font-mono text-saas-dim">{total} entries</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-saas-muted animate-pulse-slow">
            Loading audit trail...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-saas-muted">
            No audit entries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-saas-surface/60 border-b border-saas-border text-saas-dim uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saas-border-subtle">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-saas-surface/50 transition-colors align-top">
                    <td className="py-3 px-4 text-saas-dim whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString()}{' '}
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-saas-primary font-medium">
                        {log.userId?.name || 'System'}
                      </div>
                      <div className="text-[10px] text-saas-dim font-mono">
                        {log.userId?.email || log.ip || '—'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={log.action} />
                      <div className="text-[10px] text-saas-dim mt-0.5">
                        {log.role} · {log.entity || '—'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-saas-dim">
                      {detailSummary(log.details) || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="px-4 py-3 border-t border-saas-border flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-saas-surface hover:bg-saas-surface-hover text-saas-primary border border-saas-border disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[11px] font-mono text-saas-dim">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-saas-surface hover:bg-saas-surface-hover text-saas-primary border border-saas-border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLog;