import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable, { Column } from '../../components/ui/DataTable';
import ConfirmModal from '../../components/ui/ConfirmModal';
import StatusBadge from '../../components/ui/StatusBadge';
import { User, Role } from '../../types';
import { Users, Ban, CheckCircle, Trash2, Shield, Upload, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoleTab, setActiveRoleTab] = useState<string>('all');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (activeRoleTab !== 'all') params.role = activeRoleTab;

      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to query users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRoleTab]);

  const handleToggleBlock = async (user: User) => {
    try {
      await api.put(`/admin/users/${user._id || user.id}/block`);
      toast.success(`Account state toggled for ${user.name}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      toast.success('User account removed');
      setDeleteUserId(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-saas-surface border border-saas-border flex items-center justify-center text-[10px] font-mono font-semibold text-saas-muted uppercase">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-saas-primary">{user.name}</div>
            <div className="text-[10px] text-saas-dim font-mono">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      cell: (user) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-saas-border">
          {user.role}
        </span>
      ),
    },
    {
      header: 'Account Status',
      accessorKey: 'isBlocked',
      cell: (user) => (
        <StatusBadge status={user.isBlocked ? 'Blocked' : 'Active'} />
      ),
    },
    {
      header: 'Created Date',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (user) => (
        <span className="text-[11px] text-saas-dim font-mono">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleToggleBlock(user)}
            className="text-[11px] text-saas-muted hover:text-saas-primary transition-colors font-medium"
          >
            {user.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => setDeleteUserId(user._id || user.id)}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Interns & Candidates
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Manage and analyze registered candidates across university and skill domains
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => toast('Candidate CSV bulk import is ready for batch processing')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-saas-surface hover:bg-saas-surface-hover text-saas-primary border border-saas-border rounded-md transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Candidates</span>
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center space-x-1 border-b border-saas-border pb-1">
        {[
          { id: 'all', label: 'All Accounts' },
          { id: 'intern', label: 'Candidate Interns' },
          { id: 'company', label: 'Host Companies' },
          { id: 'admin', label: 'Administrators' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRoleTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeRoleTab === tab.id
                ? 'bg-brand-indigo/10 text-brand-indigo-light border border-brand-indigo/20'
                : 'text-saas-muted hover:text-saas-primary hover:bg-saas-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search candidates by name, email, or credentials..."
        emptyMessage="No accounts matching the selected criteria"
      />

      {/* Confirmation Modal for delete */}
      <ConfirmModal
        isOpen={!!deleteUserId}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this account? This action cannot be undone."
        confirmText="Permanently Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteUserId(null)}
      />
    </div>
  );
};

export default AdminUsers;
