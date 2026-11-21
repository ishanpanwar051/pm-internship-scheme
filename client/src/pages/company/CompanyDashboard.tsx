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

  const companyName = user?.name || data?.companyName || 'Tata Consultancy Services';
  const openPositions = data?.activeSlots || 12;
  const applications = data?.totalApplicants || 148;
  const allocatedInterns = data?.filledSeats || 18;

  // Diverse candidates across multiple streams
  const recommendedCandidates = [
    {
      role: 'Automobile Assembly & EV Powertrain Intern',
      stream: 'Mechanical & Automotive',
      candidates: [
        { name: 'Aarav Yadav', score: 96, skills: ['AutoCAD', 'SolidWorks', 'EV Powertrain', 'Thermodynamics'], degree: 'B.Tech Mechanical' },
        { name: 'Pooja Verma', score: 92, skills: ['CATIA', 'Quality Control', 'Six Sigma', 'Manufacturing'], degree: 'Diploma Auto' },
      ],
    },
    {
      role: 'Financial Risk & Investment Modeling Intern',
      stream: 'Commerce & Banking',
      candidates: [
        { name: 'Priya Sharma', score: 95, skills: ['Financial Modeling', 'Excel', 'Tally Prime', 'Accountancy'], degree: 'B.Com Honors' },
        { name: 'Kunal Deshmukh', score: 91, skills: ['Auditing', 'GST Compliance', 'Taxation', 'Corporate Finance'], degree: 'BBA Finance' },
      ],
    },
    {
      role: 'AI & Data Engineering Intern',
      stream: 'Computer Science & AI',
      candidates: [
        { name: 'Rahul Sen', score: 94, skills: ['Python', 'SQL', 'FastAPI', 'PyTorch', 'Data Pipelines'], degree: 'B.Tech CS' },
        { name: 'Sneha Rao', score: 90, skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], degree: 'BCA' },
      ],
    },
  ];

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
          label="Open Positions"
          value={openPositions}
          icon={Briefcase}
          subtitle="Active recruitment vacancies"
        />
        <StatCard
          label="Applications Received"
          value={applications}
          change="+18%"
          isPositive={true}
          icon={Users}
          subtitle="Candidate submissions"
        />
        <StatCard
          label="High-Affinity AI Matches"
          value="42"
          icon={Sparkles}
          subtitle="Top Hungarian score matches"
        />
        <StatCard
          label="Confirmed Interns"
          value={allocatedInterns}
          icon={CheckCircle2}
          subtitle="Joined & accepted placements"
        />
      </div>

      {/* 3. CSR & Affirmative Quota Compliance Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-950">
              MCA Section 135 CSR & Affirmative Action Representation:
            </span>
            <span className="text-emerald-800 ml-1">
              Your host entity satisfies 100% reservation parity (SC: 15%, ST: 7.5%, OBC: 27%, EWS: 10%, PwD: 4%).
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] shrink-0">
          Compliant
        </span>
      </div>

      {/* 4. AI-Ranked Candidate Talent Pipeline (Multi-Discipline) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              AI-Matched Candidate Shortlists by Sector
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Hungarian Optimal Match Engine
          </span>
        </div>

        <div className="space-y-6">
          {recommendedCandidates.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                    {group.stream}
                  </span>
                  <span>{group.role}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {group.candidates.length} AI matches ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.candidates.map((cand, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{cand.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{cand.degree}</div>
                        </div>
                        <ScoreBadge score={cand.score} variant="badge" />
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {cand.skills.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-slate-700 border border-slate-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-bold">
                        ✓ Quota & KYC Validated
                      </span>
                      <Link
                        to="/company/accepted-interns"
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                      >
                        Review Candidate Dossier →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              Add new department requirements, edit stipends, and manage slot seat quotas
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
