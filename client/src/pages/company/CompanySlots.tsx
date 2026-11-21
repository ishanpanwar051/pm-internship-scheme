import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { InternshipSlot } from '../../types';
import TagInput from '../../components/ui/TagInput';
import DataTable, { Column } from '../../components/ui/DataTable';
import ConfirmModal from '../../components/ui/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  X,
  Briefcase,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DOMAINS = [
  'Information Technology',
  'Finance & Banking',
  'Heavy Manufacturing',
  'Healthcare & Pharma',
  'Agriculture & Agrotech',
  'Education & EdTech',
  'Renewable Energy',
  'Retail & E-Commerce',
  'Infrastructure & Smart Cities',
  'Logistics & Supply Chain',
];

const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
  'Gujarat', 'Telangana', 'Rajasthan', 'West Bengal', 'Madhya Pradesh',
];

export const CompanySlots: React.FC = () => {
  const [slots, setSlots] = useState<InternshipSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'Information Technology',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    city: '',
    state: 'Karnataka',
    isRemote: false,
    stipend: 25000,
    duration: '3 Months',
    totalSeats: 12,
    minCGPA: 7.0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/company/slots');
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error('Failed to query vacancy slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingSlotId(null);
    setFormData({
      title: '',
      description: '',
      domain: 'Information Technology',
      requiredSkills: [],
      preferredSkills: [],
      city: '',
      state: 'Karnataka',
      isRemote: false,
      stipend: 25000,
      duration: '3 Months',
      totalSeats: 12,
      minCGPA: 7.0,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (slot: InternshipSlot) => {
    setIsEditing(true);
    setEditingSlotId(slot._id);
    setFormData({
      title: slot.title,
      description: slot.description,
      domain: slot.domain,
      requiredSkills: slot.requiredSkills,
      preferredSkills: slot.preferredSkills || [],
      city: slot.location.city,
      state: slot.location.state,
      isRemote: slot.location.isRemote,
      stipend: slot.stipend,
      duration: slot.duration,
      totalSeats: slot.totalSeats,
      minCGPA: slot.eligibility?.minCGPA || 6.0,
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      toast.error('Specify at least one competency skill requirement');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        requiredSkills: formData.requiredSkills,
        preferredSkills: formData.preferredSkills,
        location: {
          city: formData.city,
          state: formData.state,
          isRemote: formData.isRemote,
        },
        stipend: formData.stipend,
        duration: formData.duration,
        totalSeats: formData.totalSeats,
        minCGPA: formData.minCGPA,
      };

      if (isEditing && editingSlotId) {
        await api.put(`/company/slots/${editingSlotId}`, payload);
        toast.success('Opportunity updated successfully');
      } else {
        await api.post('/company/slots', payload);
        toast.success('New opportunity published');
      }

      setIsDrawerOpen(false);
      fetchSlots();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSlotId) return;
    try {
      await api.delete(`/company/slots/${deleteSlotId}`);
      toast.success('Opportunity removed from matching registry');
      setDeleteSlotId(null);
      fetchSlots();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove opportunity');
    }
  };

  const columns: Column<InternshipSlot>[] = [
    {
      header: 'Role Title',
      accessorKey: 'title',
      sortable: true,
      cell: (slot) => (
        <div>
          <div className="font-medium text-saas-primary">{slot.title}</div>
          <div className="text-[10px] text-saas-dim font-mono">{slot.domain}</div>
        </div>
      ),
    },
    {
      header: 'Location',
      cell: (slot) => (
        <span className="text-xs text-saas-muted">
          {slot.location.state} {slot.location.isRemote && <span className="text-emerald-400">(Remote)</span>}
        </span>
      ),
    },
    {
      header: 'Capacity',
      cell: (slot) => (
        <span className="text-xs font-mono text-saas-primary">
          {slot.filledSeats || 0} / {slot.totalSeats} positions
        </span>
      ),
    },
    {
      header: 'Stipend',
      cell: (slot) => <span className="font-mono text-xs text-saas-primary">₹{slot.stipend?.toLocaleString()}/mo</span>,
    },
    {
      header: 'Actions',
      cell: (slot) => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/company/slots/${slot._id}/matches`}
            className="text-[11px] text-brand-indigo-light hover:text-white font-medium"
          >
            AI Matches
          </Link>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => handleOpenEdit(slot)}
            className="text-[11px] text-saas-muted hover:text-saas-primary font-medium"
          >
            Edit
          </button>
          <span className="text-zinc-700">·</span>
          <button
            type="button"
            onClick={() => setDeleteSlotId(slot._id)}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 16. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Opportunities & Vacancies
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Published internship positions indexed for the autonomous Hungarian AI allocation engine
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-saas-surface border border-saas-border rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded ${
                viewMode === 'cards' ? 'bg-zinc-800 text-white' : 'text-saas-dim hover:text-saas-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${
                viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-saas-dim hover:text-saas-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.length === 0 ? (
            // Sample demonstration cards if database has 0 items
            [
              {
                title: 'Backend Engineering Intern',
                company: 'TechCorp Labs',
                location: 'Bangalore',
                seats: 12,
                skills: ['Python', 'SQL', 'APIs', 'PostgreSQL'],
                stipend: 25000,
              },
              {
                title: 'Machine Learning Research Intern',
                company: 'AI Synergy Corp',
                location: 'Hyderabad',
                seats: 8,
                skills: ['PyTorch', 'TensorFlow', 'NLP', 'Vector Search'],
                stipend: 30000,
              },
              {
                title: 'Cloud Infrastructure Intern',
                company: 'Global Cloud Systems',
                location: 'Pune',
                seats: 10,
                skills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
                stipend: 22000,
              },
            ].map((slot, idx) => (
              <div
                key={idx}
                className="bg-saas-card border border-saas-border rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-saas-primary">{slot.title}</h3>
                      <p className="text-xs text-saas-muted mt-0.5">{slot.company}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-saas-border">
                      {slot.seats} positions
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-saas-dim mt-2">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{slot.location}</span>
                    <span className="text-zinc-700">·</span>
                    <span className="font-mono text-zinc-400">₹{slot.stipend.toLocaleString()}/mo</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-saas-border-subtle">
                    {slot.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-saas-surface text-saas-primary border border-saas-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-saas-border flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-400 font-mono">Engine Indexed</span>
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="text-xs font-medium text-brand-indigo-light hover:text-white"
                  >
                    Manage Slot
                  </button>
                </div>
              </div>
            ))
          ) : (
            slots.map((slot) => (
              <div
                key={slot._id}
                className="bg-saas-card border border-saas-border rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-saas-primary">{slot.title}</h3>
                      <p className="text-xs text-saas-muted mt-0.5">{slot.domain}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-saas-border">
                      {slot.totalSeats} positions
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-saas-dim mt-2">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{slot.location.state}</span>
                    {slot.location.isRemote && <span className="text-emerald-400">(Remote)</span>}
                    <span className="text-zinc-700">·</span>
                    <span className="font-mono text-zinc-400">₹{slot.stipend?.toLocaleString()}/mo</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-saas-border-subtle">
                    {slot.requiredSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-saas-surface text-saas-primary border border-saas-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-saas-border flex items-center justify-between text-xs">
                  <Link
                    to={`/company/slots/${slot._id}/matches`}
                    className="text-xs font-medium text-brand-indigo-light hover:text-white flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>View AI Matches</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(slot)}
                      className="text-saas-dim hover:text-saas-primary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteSlotId(slot._id)}
                      className="text-saas-dim hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={slots}
          isLoading={isLoading}
          searchPlaceholder="Search opportunity by title, domain, or state..."
          emptyMessage="No opportunities published yet"
        />
      )}

      {/* Create / Edit Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-saas-card border-l border-saas-border h-full flex flex-col justify-between overflow-y-auto p-6 shadow-saas-hover">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-saas-border">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-brand-indigo" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-saas-muted">
                    {isEditing ? 'Edit Opportunity' : 'Publish New Opportunity'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-saas-dim hover:text-saas-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-saas-muted mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Backend Engineering Intern"
                    className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-saas-muted mb-1">
                      Industry Sector
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-saas-muted mb-1">
                      Primary Location State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-saas-muted mb-1">
                    Required Competency Skills (TF-IDF Vectorized)
                  </label>
                  <TagInput
                    tags={formData.requiredSkills}
                    onChange={(tags) => setFormData({ ...formData, requiredSkills: tags })}
                    placeholder="Type skill & press Enter (e.g. Python, SQL)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-saas-muted mb-1">
                      Available Positions
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-saas-muted mb-1">
                      Monthly Stipend (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={formData.stipend}
                      onChange={(e) => setFormData({ ...formData, stipend: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-saas-muted mb-1">
                    Detailed Specification
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key responsibilities and expected project deliverables..."
                    className="w-full text-xs bg-saas-surface border border-saas-border rounded-md px-3 py-2 text-saas-primary focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="pt-4 border-t border-saas-border flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-3 py-1.5 text-xs text-saas-muted hover:text-saas-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Opportunity' : 'Publish Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteSlotId}
        title="Remove Opportunity"
        message="Are you sure you want to remove this vacancy slot from the active allocation index?"
        confirmText="Remove Slot"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlotId(null)}
      />
    </div>
  );
};

export default CompanySlots;
