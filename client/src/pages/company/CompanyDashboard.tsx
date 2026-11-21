import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Building2,
  Plus,
  ShieldCheck,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ScoreBadge from '../../components/ui/ScoreBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/company/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load company metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8 text-left">
        <SkeletonLoader type="card" count={4} />
        <SkeletonLoader type="chart" count={2} />
      </div>
    );
  }

  const companyName = user?.name || 'Partner Organization';
  const totalSlots = data?.totalSlots || 0;
  const totalSeats = data?.totalSeats || 0;
  const filledSeats = data?.filledSeats || 0;
  const pendingMatches = data?.pendingMatches || 0;
  const recentAllocations = data?.recentAllocations || [];
  const slotsSummary = data?.slotsSummary || [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Enterprise Partner Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {companyName} · Accredited Corporate Host Entity · PM Internship Scheme
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/company/slots"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Slot</span>
          </Link>
        </div>
      </div>

      {/* 2. Primary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Posted Internships"
          value={totalSlots}
          icon={Briefcase}
          subtitle="Active vacancy listings"
        />
        <StatCard
          label="Total Seats"
          value={totalSeats}
          icon={Users}
          subtitle="Capacity across all slots"
        />
        <StatCard
          label="Shortlisted Candidates"
          value={pendingMatches}
          icon={Sparkles}
          subtitle="Awaiting your review"
        />
        <StatCard
          label="Confirmed Placements"
          value={filledSeats}
          icon={CheckCircle2}
          subtitle="Accepted candidates"
        />
      </div>

      {/* 3. CSR & Representation Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-950">
              MCA Section 135 CSR & Youth Skilling Initiative:
            </span>
            <span className="text-emerald-800 ml-1">
              Hosting candidates under the PM Internship Scheme contributes to your corporate skilling commitments with full Government guidelines compliance.
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] shrink-0">
          Compliant
        </span>
      </div>

      {/* 4. Candidate Talent Pipeline */}
      {totalSlots === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            You haven't posted an internship yet — create your first one
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Publish your available internship positions and our matching engine will pair you with qualified candidates based on skills, education, and location.
          </p>
          <div className="pt-2">
            <Link
              to="/company/slots"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Internship Opportunity</span>
            </Link>
          </div>
        </div>
      ) : recentAllocations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Matched Candidates
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {totalSlots} Active {totalSlots === 1 ? 'Slot' : 'Slots'}
            </span>
          </div>
          <div className="py-8 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No candidates matched yet</div>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Candidates matched to your {totalSlots} active listings will appear here once the matching run is completed.
            </p>
            <div className="pt-2">
              <Link
                to="/company/matches"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors"
              >
                <span>View Matches Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Candidate Matches
              </h2>
            </div>
            <Link
              to="/company/matches"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
            >
              View All Matches →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentAllocations.map((alloc: any) => (
              <div
                key={alloc._id}
                className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {alloc.internId?.userId?.name || 'Candidate'}
                    </div>
                    <ScoreBadge score={alloc.matchScore || 0.9} variant="badge" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {alloc.slotId?.title || 'Internship Slot'}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600">{alloc.status}</span>
                  <Link
                    to="/company/matches"
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Quick Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/company/slots"
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Manage Internship Capacity Slots
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Add new department requirements, edit stipends, and manage available seats
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-3" />
        </Link>

        <Link
          to="/company/accepted-interns"
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Allocated Candidates Roster
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Access confirmed intern profiles, verify joining certificates, and issue offer acceptances
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-3" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboard;
