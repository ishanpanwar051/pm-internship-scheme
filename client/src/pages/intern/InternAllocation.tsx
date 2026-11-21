import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import confetti from 'canvas-confetti';
import {
  Award,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Check,
  Download,
  IndianRupee,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import ScoreBadge from '../../components/ui/ScoreBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export const InternAllocation: React.FC = () => {
  const [allocation, setAllocation] = useState<any>(null);
  const [status, setStatus] = useState<string>('Allocated');
  const [isLoading, setIsLoading] = useState(true);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchAllocation = async () => {
    try {
      const res = await api.get('/intern/allocation');
      setAllocation(res.data.allocation);
      setStatus(res.data.allocationStatus || 'Allocated');
    } catch (err) {
      console.error('Failed to fetch allocation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocation();
  }, []);

  const handleDownloadAllotment = () => {
    toast.success('Generating Official PM Internship Allotment Order PDF...');
    window.print();
  };

  const handleAccept = async () => {
    setIsActionLoading(true);
    try {
      await api.put('/intern/allocation/accept');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#138808', '#2563EB', '#F59E0B'],
      });

      toast.success('🎉 Congratulations! Offer officially confirmed & accepted.');
      setIsAcceptModalOpen(false);
      setStatus('Accepted');
      fetchAllocation();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsActionLoading(true);
    try {
      await api.put('/intern/allocation/decline');
      toast.success('Allocation declined. You will remain in the matching pool for upcoming cycles.');
      setIsDeclineModalOpen(false);
      setStatus('Pending');
      fetchAllocation();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-6">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  // Realistic fallback allotment for demo
  const slot = allocation?.slotId || {
    title: 'Automobile Production & EV Powertrain Intern',
    domain: 'Mechanical, Automotive & EV',
    location: { city: 'Pune', state: 'Maharashtra', isRemote: false },
    stipend: 24000,
    duration: '6 Months',
    requiredSkills: ['AutoCAD', 'SolidWorks', 'EV Systems', 'Quality Control', 'Thermodynamics'],
  };

  const company = allocation?.companyId || {
    companyName: 'Mahindra & Mahindra Ltd',
    sector: 'Automotive & Heavy Manufacturing',
  };

  const matchScore = allocation?.matchScore ? Math.round(allocation.matchScore * 100) : 95.4;
  const isAccepted = status === 'Accepted';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-left">
      {/* 1. Header with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Official Allotment & Offer Letter
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government of India · Ministry of Corporate Affairs · PM Internship Scheme
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={isAccepted ? 'Accepted' : status} />
          <button
            type="button"
            onClick={handleDownloadAllotment}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Order</span>
          </button>
        </div>
      </div>

      {/* 2. Official Ministry Allotment Order Card */}
      <div className="bg-white border-2 border-emerald-300 rounded-3xl overflow-hidden shadow-md relative">
        {/* Tricolor Ribbon Header */}
        <div className="h-2 bg-tricolor-strip w-full" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Government Watermark / Official Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confirmed Selection
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Internship Allotment Order #PMIS-2026-AL-4482
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Issued under Section 135 CSR & National Skilling Mission Guidelines
                </div>
              </div>
            </div>

            <div className="text-right sm:self-center shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">AI Compatibility</div>
              <div className="text-3xl font-black font-mono text-emerald-600">
                {matchScore}%
              </div>
              <span className="text-[10px] font-bold text-emerald-700">Tier-1 Optimal Match</span>
            </div>
          </div>

          {/* Allocation Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Allocated Entity</span>
              <div className="text-sm font-black text-slate-900 leading-snug">{company.companyName}</div>
              <span className="text-[11px] text-blue-600 font-semibold">{company.sector || 'Top 500 Enterprise'}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Role / Stream</span>
              <div className="text-sm font-black text-slate-900 leading-snug">{slot.title}</div>
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{slot.location.city ? `${slot.location.city}, ` : ''}{slot.location.state}</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Total Stipend</span>
              <div className="text-sm font-black text-emerald-700 font-mono">
                ₹{slot.stipend?.toLocaleString() || '24,000'} / mo
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">₹5,000 DBT + Host Share</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Reporting Date</span>
              <div className="text-sm font-black text-slate-900">15th October 2026</div>
              <span className="text-[11px] text-slate-500">Duration: {slot.duration || '6 Months'}</span>
            </div>
          </div>

          {/* Stipend & DBT Direct Benefit Transfer Breakdown */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-emerald-50/60 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Government Direct Benefit Transfer (DBT) Breakdown</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[11px]">Monthly Govt Direct Benefit</div>
                <div className="text-base font-black text-emerald-600 font-mono">₹4,500 / month</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Credited directly to Aadhaar bank account</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[11px]">Company Statutory Share</div>
                <div className="text-base font-black text-blue-600 font-mono">₹19,500 / month</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Disbursed directly by {company.companyName}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/40">
                <div className="text-amber-900 text-[11px] font-semibold">One-time Incidentals Grant</div>
                <div className="text-base font-black text-amber-700 font-mono">₹6,000</div>
                <div className="text-[10px] text-amber-700 mt-0.5">On joining for travel & accommodation</div>
              </div>
            </div>
          </div>

          {/* AI Compatibility & Why You Were Selected */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Selection Factors & Qualification Rationale</span>
            </div>

            <div className="space-y-2.5">
              <ProgressBar label="Domain & Technical Competency Match" value={97} />
              <ProgressBar label="Preferred Location Alignment" value={95} />
              <ProgressBar label="Academic Qualification & Marks" value={92} />
              <ProgressBar label="Affirmative Action Quota Representation" value={100} colorClass="bg-emerald-500" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Your extracted skills from your CV directly correspond with the required technical competencies for this position.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Host entity location matches your preferred state and cluster preferences.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Government certified QR verification and DigiLocker credit integration will be activated upon joining confirmation.</span>
              </div>
            </div>
          </div>

          {/* Action Confirmation Controls */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsDeclineModalOpen(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Decline This Placement & Re-enter Matching Pool
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDownloadAllotment}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Allotment PDF</span>
              </button>

              {!isAccepted ? (
                <button
                  type="button"
                  onClick={() => setIsAcceptModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Offer & Confirm Joining</span>
                </button>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Offer Confirmed & Joined</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isAcceptModalOpen}
        title="Confirm Acceptance of Allotment"
        message={`Are you sure you want to accept the official internship offer at ${company.companyName} for the role of ${slot.title}? Your joining date will be registered as 15th October 2026.`}
        confirmText="Confirm & Accept Placement"
        confirmVariant="primary"
        isLoading={isActionLoading}
        onConfirm={handleAccept}
        onCancel={() => setIsAcceptModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeclineModalOpen}
        title="Decline Placement"
        message="Are you sure you want to decline this allocation? You will be retained in the candidate pool for future allocation rounds."
        confirmText="Decline Allocation"
        confirmVariant="danger"
        isLoading={isActionLoading}
        onConfirm={handleDecline}
        onCancel={() => setIsDeclineModalOpen(false)}
      />
    </div>
  );
};

export default InternAllocation;
