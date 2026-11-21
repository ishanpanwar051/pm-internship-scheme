import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable, { Column } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Download, Star, CheckCircle2, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyAccepted: React.FC = () => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Feedback Modal
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [markCompleted, setMarkCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccepted = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/company/accepted-interns');
      setAllocations(res.data.allocations || []);
    } catch (err) {
      console.error('Failed to query accepted roster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
  }, []);

  const handleDownloadCsv = () => {
    window.open('/api/v1/company/report/download', '_blank');
    toast.success('Downloading candidate roster CSV...');
  };

  const handleOpenFeedback = (item: any) => {
    setSelectedAllocation(item);
    setRating(item.internRating || 5);
    setFeedback(item.companyFeedback || '');
    setMarkCompleted(item.status === 'Completed');
  };

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation) return;

    setIsSubmitting(true);
    try {
      await api.post(`/company/intern/${selectedAllocation._id}/feedback`, {
        rating,
        feedback,
        markCompleted,
      });
      toast.success('Performance review recorded');
      setSelectedAllocation(null);
      fetchAccepted();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Intern Name',
      cell: (item) => (
        <div>
          <div className="font-medium text-saas-primary">{item.internId?.userId?.name || 'Candidate'}</div>
          <div className="text-[10px] text-saas-dim font-mono">{item.internId?.userId?.email}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (item) => (
        <span className="text-xs text-saas-primary font-medium">{item.slotId?.title || 'Internship Slot'}</span>
      ),
    },
    {
      header: 'Academic Dossier',
      cell: (item) => (
        <div className="text-xs text-saas-muted">
          <div>{item.internId?.academic?.institution || 'Engineering Institute'}</div>
          <div className="text-[10px] text-saas-dim font-mono">CGPA: {item.internId?.academic?.cgpa || '8.2'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status || 'Accepted'} />,
    },
    {
      header: 'Performance Rating',
      cell: (item) => (
        <div className="flex items-center space-x-1">
          {item.internRating ? (
            <>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-mono text-xs text-saas-primary font-medium">{item.internRating}/5</span>
            </>
          ) : (
            <span className="text-[11px] text-saas-dim">Pending review</span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <button
          type="button"
          onClick={() => handleOpenFeedback(item)}
          className="text-[11px] text-brand-indigo-light hover:text-white font-medium"
        >
          Review & Feedback
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Allocated Interns Roster
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Confirmed candidate placements assigned to your enterprise via the AI matching engine
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium bg-saas-surface hover:bg-saas-surface-hover text-saas-primary border border-saas-border rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Roster CSV</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={allocations}
        isLoading={isLoading}
        searchPlaceholder="Search allocated intern by name, role, or college..."
        emptyMessage="No interns allocated to this enterprise yet"
      />

      {/* Review Modal */}
      {selectedAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-saas-card border border-saas-border rounded-lg max-w-md w-full p-5 space-y-4 shadow-saas-hover">
            <div className="flex items-center justify-between pb-3 border-b border-saas-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-saas-muted">
                Candidate Evaluation & Feedback
              </span>
              <button
                type="button"
                onClick={() => setSelectedAllocation(null)}
                className="text-saas-dim hover:text-saas-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-4">
              <div className="text-xs text-saas-dim">
                Intern: <span className="font-semibold text-saas-primary">{selectedAllocation.internId?.userId?.name}</span>
                <br />
                Role: <span className="text-brand-indigo-light">{selectedAllocation.slotId?.title}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-saas-muted mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-saas-dim hover:text-amber-400"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          rating >= s ? 'text-amber-400 fill-current' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-saas-muted mb-1.5">
                  Evaluation Feedback Notes
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Record project milestones, domain aptitude, and performance..."
                  className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-saas-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={markCompleted}
                  onChange={(e) => setMarkCompleted(e.target.checked)}
                  className="rounded bg-saas-surface border-saas-border text-brand-indigo"
                />
                <span>Mark Internship Program as Successfully Completed</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2 border-t border-saas-border">
                <button
                  type="button"
                  onClick={() => setSelectedAllocation(null)}
                  className="px-3 py-1.5 text-xs text-saas-muted hover:text-saas-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAccepted;
