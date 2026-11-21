import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import {
  User,
  Sparkles,
  Award,
  ArrowRight,
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  Building2,
  FileText,
  Download,
  ShieldCheck,
  Check,
  IndianRupee,
  GraduationCap,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Phone,
} from 'lucide-react';
import ScoreBadge from '../../components/ui/ScoreBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

export const InternDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/intern/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDownloadAllotment = () => {
    toast.success('Downloading Official Allotment Order PDF (Ministry of Corporate Affairs)...');
    window.print();
  };

  const handleAcceptOffer = async () => {
    try {
      await api.put('/intern/allocation/accept');
      setIsOfferAccepted(true);
      toast.success('Offer Accepted! Your host organization has been notified.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept offer');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" count={3} />
        <SkeletonLoader type="chart" count={1} />
      </div>
    );
  }

  const completion = data?.profileCompletionPercent || 0;
  const status = data?.allocationStatus || 'Not Applied';
  const allocation = data?.allocation;

  const candidateName = user?.name || 'Candidate';
  const candidateInitials = candidateName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const allocatedCompany = allocation?.companyId?.companyName || 'Host Enterprise';
  const allocatedRole = allocation?.slotId?.title || 'Internship Position';
  const allocatedLocation = allocation?.slotId?.location
    ? `${allocation.slotId.location.city ? allocation.slotId.location.city + ', ' : ''}${allocation.slotId.location.state || 'India'}`
    : 'On-site / Hybrid';
  const matchScore = allocation?.matchScore ? (allocation.matchScore * 100).toFixed(0) : '95';

  const recommendedOpportunities = [
    {
      title: 'Automobile Production & EV R&D Intern',
      company: 'Mahindra & Mahindra Ltd',
      location: 'Pune, Maharashtra',
      stream: 'Mechanical & Automotive',
      score: 95,
      skills: ['AutoCAD', 'SolidWorks', 'EV Systems', 'Quality Control'],
      stipend: 24000,
    },
    {
      title: 'Financial Risk & Investment Modeling Intern',
      company: 'HDFC Bank Ltd',
      location: 'Mumbai, Maharashtra',
      stream: 'Commerce & Banking (B.Com/BBA)',
      score: 93,
      skills: ['Financial Modeling', 'Excel', 'Tally', 'Accountancy'],
      stipend: 22000,
    },
    {
      title: 'Clinical Research & Pharma Formulation Intern',
      company: "Dr. Reddy's Laboratories",
      location: 'Hyderabad, Telangana',
      stream: 'Pharma & Biotech',
      score: 91,
      skills: ['Pharmacology', 'HPLC', 'Biochemistry', 'GLP'],
      stipend: 25000,
    },
    {
      title: 'Agro-Supply Chain & Crop Quality Intern',
      company: 'ITC Agri-Business Division',
      location: 'Bhopal, Madhya Pradesh',
      stream: 'Agriculture & Food Tech',
      score: 89,
      skills: ['Agronomy', 'Soil Analytics', 'Post-Harvest Mgmt', 'Cold Chain'],
      stipend: 20000,
    },
    {
      title: 'Structural Design & Highway Infrastructure Intern',
      company: 'Larsen & Toubro (L&T Construction)',
      location: 'Ahmedabad, Gujarat',
      stream: 'Civil & Smart Infrastructure',
      score: 88,
      skills: ['STAAD Pro', 'AutoCAD Civil', 'Surveying', 'Concrete Tech'],
      stipend: 26000,
    },
    {
      title: 'AI & Data Engineering Intern',
      company: 'Tata Consultancy Services',
      location: 'Bengaluru, Karnataka',
      stream: 'Computer Science & AI',
      score: 94,
      skills: ['Python', 'SQL', 'FastAPI', 'Machine Learning'],
      stipend: 25000,
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* 1. Header with Title & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Candidate Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your application status, internship allotment, and Direct Benefit Transfer (DBT) details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/intern/profile?step=5"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload / Re-Scan CV</span>
          </Link>
          <Link
            to="/intern/profile"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
          >
            Edit Profile Dossier
          </Link>
          <Link
            to="/intern/allocation"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Allotment Dossier</span>
          </Link>
        </div>
      </div>

      {/* 2. Authentic Student Profile & Verification Hero Card (Replacing the PM photo) */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Top Tricolor Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-tricolor-strip" />

        <div className="p-5 sm:p-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Student Identity */}
            <div className="flex items-start sm:items-center space-x-4">
              {/* Student Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-white">
                  {candidateInitials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </span>
              </div>

              {/* Student Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {candidateName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    ID: #PMIS-2026-88419
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Candidate Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {data?.profile?.academic?.degree || 'B.Tech Mechanical & Automotive'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    {data?.profile?.academic?.institution || 'Autonomous Engineering & Technology Institute'}
                  </span>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1.5">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aadhaar e-KYC Verified</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>DigiLocker ABC Linked</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <span>DBT Bank Account Seeded</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Profile Completeness Meter */}
            <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 space-y-1">
              <div className="text-xs font-semibold text-slate-500">Profile Dossier</div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {completion}%
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Optimal Match
                </span>
              </div>
              <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <Link
                to="/intern/profile"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline pt-0.5"
              >
                Update Profile Dossier →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 5-Step Application Life-Cycle Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Application & Skilling Lifecycle
          </span>
          <span className="text-xs text-blue-600 font-semibold font-mono">
            Cycle 2: 2026 Cohort
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { step: '1', title: 'Registration', desc: 'Profile initiated', done: true },
            { step: '2', title: 'Skills & Resume', desc: `${data?.skillsCount || 0} skills added`, done: (data?.skillsCount || 0) > 0 },
            { step: '3', title: 'Eligibility Check', desc: 'Category verified', done: completion >= 50 },
            { step: '4', title: 'Smart Matching', desc: allocation ? 'Position Assigned' : 'In Progress', current: !allocation, done: !!allocation },
            { step: '5', title: 'Joining & Onboarding', desc: isOfferAccepted ? 'Confirmed' : 'Pending', pending: !isOfferAccepted, done: isOfferAccepted },
          ].map((st, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border text-left space-y-1 ${
                st.done
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : st.current
                  ? 'bg-blue-50 border-blue-300 text-blue-950 ring-1 ring-blue-300'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    st.done
                      ? 'bg-emerald-600 text-white'
                      : st.current
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {st.done ? '✓' : st.step}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {st.done ? 'Completed' : st.current ? 'Active' : 'Upcoming'}
                </span>
              </div>
              <div className="text-xs font-bold leading-tight">{st.title}</div>
              <div className="text-[10px] opacity-80">{st.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Official Internship Allotment Order Banner (Actionable Card) */}
      {allocation ? (
        <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Official Allotment Notification · Government of India
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900">
                  You have been allotted an internship under the PM Internship Scheme!
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                {isOfferAccepted ? 'Joined & Confirmed' : 'Allotment Letter Issued'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Allocated Organization</span>
              <div className="text-sm font-black text-slate-900">{allocatedCompany}</div>
              <span className="text-[11px] text-blue-600 font-medium">Enterprise Partner</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Designation / Role</span>
              <div className="text-sm font-black text-slate-900">{allocatedRole}</div>
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{allocatedLocation}</span>
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Total Monthly Stipend</span>
              <div className="text-sm font-black text-emerald-700 font-mono">
                ₹{allocation?.slotId?.stipend?.toLocaleString() || '15,000'} / month
              </div>
              <span className="text-[10px] text-slate-500">₹5,000 Govt DBT + Host Share</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Skill Fit</span>
              <div className="text-sm font-black text-slate-900 font-mono">
                {matchScore}% Match
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Matched with Slot</span>
            </div>
          </div>

          {/* Action Buttons for Offer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-600 font-medium">
              Start Date: <strong className="text-slate-900">{allocation?.slotId?.startDate ? new Date(allocation.slotId.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'As notified by company'}</strong> · Location: <strong className="text-slate-900">{allocatedLocation}</strong>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadAllotment}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download Allotment Order (PDF)</span>
              </button>

              {!isOfferAccepted ? (
                <button
                  type="button"
                  onClick={handleAcceptOffer}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Offer & Confirm Joining</span>
                </button>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Offer Accepted</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Application Status · In Review
                </div>
                <div className="text-base font-bold text-slate-900">
                  {status === 'Pending' ? 'Your profile is active in the candidate pool' : 'Complete your profile to participate in matching'}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              Status: {status}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {completion < 70
              ? 'Your profile is currently being completed. Please finish filling your details, skills, and educational qualifications to ensure you are matched during the next allocation cycle.'
              : 'Your profile has been verified and is active in the candidate pool. You will be matched with internship opportunities based on your skills, academic background, and location preferences.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/intern/explore"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse Opportunities</span>
            </Link>
            <Link
              to="/intern/profile"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Update Profile & Skills ({completion}%)</span>
            </Link>
          </div>
        </div>
      )}

      {/* 5. 2-Column Operational Grid: DBT Stipend Tracker & AI Skill Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Column 1: Direct Benefit Transfer (DBT) Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Direct Benefit Transfer (DBT) Stipend Ledger
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Aadhaar Seeded Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="font-bold text-slate-900">Government Direct Benefit Transfer</div>
                <div className="text-[11px] text-slate-500">Ministry of Corporate Affairs direct account credit</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-emerald-600 text-sm">₹4,500 / mo</div>
                <div className="text-[10px] text-slate-400">Monthly on 1st</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="font-bold text-slate-900">Host Company Direct Contribution</div>
                <div className="text-[11px] text-slate-500">{allocatedCompany} Corporate CSR share</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-blue-600 text-sm">₹500 / mo</div>
                <div className="text-[10px] text-slate-400">Statutory minimum</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
              <div>
                <div className="font-bold text-amber-950">One-Time Incidentals & Relocation Grant</div>
                <div className="text-[11px] text-amber-800">For travel, accommodation, and preparation</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-amber-900 text-sm">₹6,000</div>
                <div className="text-[10px] text-amber-700">Upon joining confirmation</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Bank: <strong>State Bank of India (****4821)</strong></span>
            <span>PFMS Transaction ID: <strong>#PFMS-2026-9938</strong></span>
          </div>
        </div>

        {/* Column 2: AI Competency Radar & Career Gap Advisory */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                AI Competency & Skill Gap Advisory
              </h3>
            </div>
            <Link
              to="/intern/profile?step=5"
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold"
            >
              Re-Scan CV →
            </Link>
          </div>

          {/* Current Verified Skills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600">
              Verified Skills from Profile & Resume:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(data?.skills || ['Communication', 'Computer Literacy', 'Problem Solving']).map(
                (sk: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    ✓ {sk}
                  </span>
                )
              )}
            </div>
          </div>

          {/* AI Recommendation Alert */}
          <div className="p-3.5 rounded-lg bg-orange-50/70 border border-orange-200 space-y-1 text-xs">
            <div className="font-bold text-orange-950 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
              <span>AI Career Recommendation</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Candidates with your profile who also know <strong>MATLAB / Simulink</strong> or <strong>Battery Management Systems (BMS)</strong> have a <strong>+18% higher placement rate</strong> across automotive & renewable sectors.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Resume: <strong>candidate_resume_v2.pdf</strong></span>
            <span className="text-emerald-600 font-semibold">100% Parsed & Indexed</span>
          </div>
        </div>
      </div>

      {/* 6. Multi-Discipline Recommended Opportunities Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Explore More Multi-Discipline Opportunities
            </h2>
          </div>
          <Link
            to="/intern/explore"
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1"
          >
            <span>View All 500+ Open Slots</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recommendedOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 truncate">
                    {opp.stream}
                  </span>
                  <ScoreBadge score={opp.score} variant="badge" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug pt-1">
                  {opp.title}
                </h3>

                <div className="text-xs font-semibold text-slate-700">
                  {opp.company}
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{opp.location}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ₹{opp.stipend.toLocaleString()}/mo
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1.5">
                  {opp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-slate-700 border border-slate-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end">
                <Link
                  to="/intern/explore"
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-md transition-colors shadow-2xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Quick Helpdesk & Grievance Footer Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-blue-600" />
          <span>National Internship Scheme Helpdesk: <strong>1800-11-2047 (Toll Free)</strong></span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="mailto:support@pminternship.gov.in"
            className="text-blue-600 hover:underline font-semibold"
          >
            Lodge Grievance
          </a>
          <span className="text-slate-300">·</span>
          <span>Academic Bank of Credits (ABC) Status: <strong className="text-emerald-600">Synced</strong></span>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
