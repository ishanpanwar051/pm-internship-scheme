import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable, { Column } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import ScoreBadge from '../../components/ui/ScoreBadge';
import MatchDetailModal from '../../components/ui/MatchDetailModal';
import {
  Download,
  Filter,
  Edit3,
  X,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAllocations: React.FC = () => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Inspection Modal
  const [inspectMatch, setInspectMatch] = useState<any | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  // Override Modal
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const [overrideStatus, setOverrideStatus] = useState('Allocated');
  const [isOverriding, setIsOverriding] = useState(false);

  const fetchAllocations = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get('/admin/allocations', { params });
      setAllocations(res.data.allocations || []);
    } catch (err) {
      console.error('Failed to fetch allocations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [statusFilter, categoryFilter]);

  const handleDownloadCsv = async () => {
    try {
      toast.loading('Preparing allocations report CSV...', { id: 'alloc-csv' });
      const res = await api.get('/admin/reports/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PM_Internship_Allocations_Report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded Allocation Registry CSV', { id: 'alloc-csv' });
    } catch (err: any) {
      toast.error('Failed to download allocations CSV', { id: 'alloc-csv' });
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation) return;

    setIsOverriding(true);
    try {
      await api.put(`/admin/allocations/${selectedAllocation._id}/override`, {
        status: overrideStatus,
      });
      toast.success('Allocation state updated successfully');
      setSelectedAllocation(null);
      fetchAllocations();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update allocation');
    } finally {
      setIsOverriding(false);
    }
  };

  const openInspection = (item: any) => {
    setInspectMatch({
      internName: item.internId?.userId?.name || 'Candidate',
      internEmail: item.internId?.userId?.email,
      roleTitle: item.slotId?.title || 'Internship Position',
      companyName: item.companyId?.companyName || 'Host Enterprise',
      location: item.slotId?.location?.state || item.slotId?.location?.city || 'India',
      score: (item.matchScore || 0.94) * 100,
      categoryQuota: item.quotaCategory || 'General Merit',
    });
    setIsInspectOpen(true);
  };

  const columns: Column<any>[] = [
    {
      header: 'Candidate / Intern',
      accessorKey: 'internId',
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">
            {item.internId?.userId?.name || 'Candidate'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">{item.internId?.userId?.email}</div>
        </div>
      ),
    },
    {
      header: 'Allocated Host Entity',
      cell: (item) => (
        <span className="text-slate-800 text-xs font-semibold">
          {item.companyId?.companyName || 'Host Enterprise'}
        </span>
      ),
    },
    {
      header: 'Position Title & Location',
      cell: (item) => (
        <div>
          <span className="text-xs text-slate-900 font-bold">
            {item.slotId?.title || 'Internship Slot'}
          </span>
          <div className="text-[10px] text-slate-500 font-medium">
            {item.slotId?.location?.city ? `${item.slotId.location.city}, ` : ''}
            {item.slotId?.location?.state || 'India'}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {item.matchReason?.quotaCategory || item.quotaCategory || 'General'}
        </span>
      ),
    },
    {
      header: 'Match %',
      accessorKey: 'matchScore',
      sortable: true,
      cell: (item) => (
        <ScoreBadge
          score={item.matchScore ? item.matchScore * 100 : 92}
          variant="badge"
        />
      ),
    },
    {
      header: 'Enrollment Status',
      accessorKey: 'status',
      sortable: true,
      cell: (item) => <StatusBadge status={item.status || 'Allocated'} />,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => openInspection(item)}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
          >
            Explain
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => {
              setSelectedAllocation(item);
              setOverrideStatus(item.status || 'Allocated');
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Allocations & Enrollments Registry
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official government repository of candidate-to-company internship allocations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center gap-3 shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-amber-500"
        >
          <option value="">All Statuses</option>
          <option value="Allocated">Allocated</option>
          <option value="Accepted">Accepted by Candidate</option>
          <option value="Declined">Declined</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-amber-500"
        >
          <option value="">All Quotas</option>
          <option value="General">General / Open</option>
          <option value="OBC">OBC (27%)</option>
          <option value="SC">SC (15%)</option>
          <option value="ST">ST (7.5%)</option>
          <option value="PH">PH / PwD (5%)</option>
        </select>

        {(statusFilter || categoryFilter) && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('');
              setCategoryFilter('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 3. Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <DataTable
          columns={columns}
          data={allocations}
          isLoading={isLoading}
          searchPlaceholder="Search candidate name, email, company, role, or state..."
          emptyMessage="No allocation records found matching current query"
        />
      </div>

      {/* 4. Override / Edit Modal */}
      {selectedAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Update Allocation State
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAllocation(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-400">Candidate:</span>{' '}
                  <span className="text-slate-900 font-bold">
                    {selectedAllocation.internId?.userId?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Host Enterprise:</span>{' '}
                  <span className="text-slate-900 font-bold">
                    {selectedAllocation.companyId?.companyName}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Allocation Status
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="Allocated">Allocated</option>
                  <option value="Accepted">Accepted by Candidate</option>
                  <option value="Declined">Declined</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAllocation(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOverriding}
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isOverriding ? 'Saving...' : 'Commit Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. AI Explanation Modal */}
      <MatchDetailModal
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        match={inspectMatch}
      />
    </div>
  );
};

export default AdminAllocations;
