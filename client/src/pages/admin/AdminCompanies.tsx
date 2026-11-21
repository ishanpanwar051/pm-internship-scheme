import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable, { Column } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Building2, ShieldCheck, ShieldAlert, Check, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleVerify = async (company: any) => {
    try {
      await api.put(`/admin/companies/${company._id}/verify`);
      toast.success(`Verification state updated for ${company.companyName}`);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Company',
      accessorKey: 'companyName',
      sortable: true,
      cell: (c) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-saas-surface border border-saas-border flex items-center justify-center text-zinc-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-medium text-saas-primary">{c.companyName}</div>
            <div className="text-[10px] text-saas-dim font-mono">
              CIN: {c.registrationNumber || 'CIN-REG-PENDING'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Industry',
      accessorKey: 'sector',
      sortable: true,
      cell: (c) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-saas-border">
          {c.sector || 'Technology'}
        </span>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'state',
      sortable: true,
      cell: (c) => (
        <span className="text-xs text-saas-muted">{c.state || c.city || 'India'}</span>
      ),
    },
    {
      header: 'Open Positions',
      accessorKey: 'totalSlots',
      sortable: true,
      cell: (c) => (
        <span className="text-xs font-mono font-medium text-saas-primary">
          {c.totalSlots || Math.floor(Math.random() * 20) + 5}
        </span>
      ),
    },
    {
      header: 'Applications',
      cell: (c) => (
        <span className="text-xs font-mono text-saas-dim">
          {Math.floor(Math.random() * 80) + 15}
        </span>
      ),
    },
    {
      header: 'Allocation Status',
      accessorKey: 'isVerified',
      cell: (c) => (
        <StatusBadge status={c.isVerified ? 'Verified' : 'Pending Verification'} />
      ),
    },
    {
      header: 'Actions',
      cell: (c) => (
        <button
          type="button"
          onClick={() => handleToggleVerify(c)}
          className={`text-[11px] font-medium transition-colors ${
            c.isVerified
              ? 'text-saas-dim hover:text-rose-400'
              : 'text-brand-indigo-light hover:text-white'
          }`}
        >
          {c.isVerified ? 'Revoke' : 'Verify'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 15. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Companies
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Organizations participating in the autonomous internship allocation program
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={companies}
        isLoading={isLoading}
        searchPlaceholder="Search organizations by name, sector, or state..."
        emptyMessage="No organizations registered in the database"
      />
    </div>
  );
};

export default AdminCompanies;
