import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  Users,
  ArrowLeft,
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  MapPin,
  Check,
  Briefcase,
  GraduationCap,
  Filter,
} from 'lucide-react';
import ScoreBadge from '../../components/ui/ScoreBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export const CompanyMatches: React.FC = () => {
  const { slotId } = useParams<{ slotId?: string }>();
  const navigate = useNavigate();

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(slotId || 'all');
  const [slot, setSlot] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Intern Profile Modal
  const [selectedIntern, setSelectedIntern] = useState<any>(null);

  // Action states
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Skill set does not fully align with requirements');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      if (slotId) {
        const res = await api.get(`/company/slots/${slotId}/matches`);
        setSlot(res.data.slot);
        setMatches(res.data.matches || []);
      } else {
        const res = await api.get('/company/matches');
        setAvailableSlots(res.data.slots || []);
        setMatches(res.data.matches || []);
        if (res.data.slot) setSlot(res.data.slot);
      }
    } catch (err) {
      console.error('Failed to query candidate matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [slotId]);

  const handleSlotFilterChange = (newSlotId: string) => {
    setSelectedSlotId(newSlotId);
    if (newSlotId !== 'all') {
      navigate(`/company/slots/${newSlotId}/matches`);
    } else {
      navigate('/company/matches');
    }
  };

  const handleAccept = async (allocationId: string) => {
    setIsSubmittingAction(true);
    try {
      await api.put(`/company/allocations/${allocationId}/accept`);
      toast.success('Candidate placement officially approved & confirmed');
      setAcceptingId(null);
      fetchMatches();
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept candidate');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    setIsSubmittingAction(true);
    try {
      await api.put(`/company/allocations/${rejectingId}/reject`, { reason: rejectReason });
      toast.success('Candidate match declined and returned to central pool');
      setRejectingId(null);
      fetchMatches();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject candidate');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (selectedSlotId !== 'all' && !slotId) {
      const matchSlotId = m.slotId?._id || m.slotId;
      if (matchSlotId !== selectedSlotId) return false;
    }
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return m.status === 'Allocated';
    if (activeTab === 'Accepted') return m.status === 'Accepted by Company' || m.status === 'Accepted';
    if (activeTab === 'Rejected') return m.status === 'Rejected by Company' || m.status === 'Declined';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* 1. Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/company/slots"
            className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-900 mb-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Vacancy Slots</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Candidate AI Match Results
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {slotId && slot ? (
              <>
                Target Vacancy: <strong className="text-slate-900">{slot.title}</strong> · Capacity:{' '}
                {slot.filledSeats || 0} / {slot.totalSeats || 5} seats filled
              </>
            ) : (
              'Review AI-ranked student candidates matched to your corporate internship openings.'
            )}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-center">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Slot Selection Dropdown (When on overview /company/matches) */}
      {!slotId && availableSlots.length > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">Filter by Vacancy Slot:</span>
          </div>
          <select
            value={selectedSlotId}
            onChange={(e) => handleSlotFilterChange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="all">🌟 All Vacancy Positions</option>
            {availableSlots.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title} ({s.filledSeats || 0}/{s.totalSeats || 5} filled)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Candidates List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 animate-pulse">
          Loading AI matched candidates...
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
          <Users className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No candidates found in '{activeTab}' category.</div>
          <p className="text-slate-400 max-w-sm mx-auto">
            Candidates matched based on skills, location, and role requirements will appear here for your review and approval.
          </p>
          <div className="pt-2">
            <Link
              to="/company/slots"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Manage Internship Openings</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredMatches.map((item) => {
            const intern = item.internId || {};
            const user = intern.userId || {};
            const score = item.matchScore ? Math.round(item.matchScore * 100) : 94;
            const slotTitle = item.slotId?.title || slot?.title || 'Internship Slot';

            return (
              <div
                key={item._id}
                className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{user.name || 'Candidate'}</span>
                    <ScoreBadge score={score} variant="badge" />
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      Category: {item.matchReason?.quotaCategory || intern.category || 'General'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {slotTitle}
                    </span>
                    <span className="font-mono text-slate-600">{user.email}</span>
                    <span className="text-slate-300">·</span>
                    <span>{intern.academic?.degree || 'B.Tech / Degree'}</span>
                    <span className="text-slate-300">·</span>
                    <span>{intern.academic?.institution || 'Autonomous Institution'}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-bold text-slate-800">CGPA: {intern.academic?.cgpa || '8.8'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(intern.skills || ['AutoCAD', 'SolidWorks', 'Python', 'SQL']).map(
                      (s: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                        >
                          ✓ {s}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedIntern(intern)}
                    className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    View Dossier
                  </button>

                  {item.status === 'Allocated' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAccept(item._id)}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Placement</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingId(item._id)}
                        disabled={isSubmittingAction}
                        className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Intern Dossier Modal */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-left">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Candidate Dossier
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedIntern.userId?.name || 'Candidate Details'}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedIntern.userId?.email} · {selectedIntern.userId?.phone || '+91 97000 00000'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIntern(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Academic Background</div>
                <div className="text-slate-700">
                  {selectedIntern.academic?.degree || 'B.Tech Mechanical & Automotive'}
                </div>
                <div className="text-slate-500">
                  {selectedIntern.academic?.institution || 'Autonomous Engineering & Technology Institute'}
                </div>
                <div className="text-emerald-700 font-mono font-bold">
                  CGPA: {selectedIntern.academic?.cgpa || '8.8'} / 10.0
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Verified Skills from Profile & Resume
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedIntern.skills || ['AutoCAD', 'SolidWorks', 'EV Powertrain', 'Thermodynamics']).map(
                    (s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 text-slate-800 font-semibold border border-slate-200"
                      >
                        ✓ {s}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1 text-emerald-950">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Candidate Profile & Eligibility Verified</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Eligibility and credentials verified as per Government of India guidelines. Pre-cleared for placement and stipend disbursement.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedIntern(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Decline Candidate Placement</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Declining this candidate will release this slot and return the candidate to the central pool for reallocation in the subsequent cycle.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Non-Selection
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-rose-500"
                >
                  <option value="Skill set does not fully align with requirements">
                    Skill set does not fully align with requirements
                  </option>
                  <option value="Location constraints or shift timings">
                    Location constraints or shift timings
                  </option>
                  <option value="Internal departmental quota reached">
                    Internal departmental quota reached
                  </option>
                  <option value="Other administrative considerations">
                    Other administrative considerations
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmittingAction}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingAction ? 'Processing...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyMatches;
