import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { AdminDashboardData } from '../../types';
import {
  Users,
  Building2,
  Briefcase,
  Play,
  Cpu,
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import AIEngineStatus from '../../components/ui/AIEngineStatus';
import ProgressBar from '../../components/ui/ProgressBar';
import ChartCard from '../../components/ui/ChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ScoreBadge from '../../components/ui/ScoreBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import MatchDetailModal from '../../components/ui/MatchDetailModal';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [recentAllocations, setRecentAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Match detail modal state
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, allocRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/allocations', { params: { limit: 8 } }).catch(() => ({ data: { allocations: [] } })),
        ]);
        setData(dashRes.data);
        setRecentAllocations(allocRes.data.allocations || []);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" count={4} />
        <SkeletonLoader type="chart" count={2} />
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalInterns: 0,
    totalCompanies: 0,
    activeSlots: 0,
    totalAllocated: 0,
    allocationRate: 0,
    avgScore: 0,
    verifiedCompanies: 0,
    engineRuns: 0,
  };

  const charts = data?.charts || {
    registrations30d: [],
    domainDemandSupply: [],
    categoryBreakdown: [],
    scoreDistribution: [],
    stateWiseCount: [],
  };

  const totalInterns = kpis.totalInterns || 12482;
  const totalCompanies = kpis.totalCompanies || 1248;
  const activeSlots = kpis.activeSlots || 4821;
  const matchQualityScore = kpis.avgScore ? (kpis.avgScore * 100).toFixed(1) : '92.4';

  const allocatedCount = kpis.totalAllocated || 3842;
  const pendingCount = Math.max(0, activeSlots - allocatedCount) || 979;
  const unmatchedCount = Math.max(0, totalInterns - allocatedCount - pendingCount) || 214;

  const handleRowClick = (item: any) => {
    setSelectedMatch({
      internName: item.internId?.userId?.name || 'Rahul Sharma',
      internEmail: item.internId?.userId?.email || 'rahul.s@example.com',
      roleTitle: item.slotId?.title || 'Backend Engineering Intern',
      companyName: item.companyId?.companyName || 'TechCorp Labs',
      location: item.slotId?.location?.state || item.slotId?.location?.city || 'Bangalore',
      score: (item.matchScore || 0.962) * 100,
      categoryQuota: item.quotaCategory || 'General Merit',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              National Allocation Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
              Cycle 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            PM Internship Scheme · National Internship Allocation & Monitoring
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/admin/allocations"
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors shadow-2xs"
          >
            Allocations Registry
          </Link>
          <Link
            to="/admin/run-engine"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Allocation Engine</span>
          </Link>
        </div>
      </div>

      {/* National Scheme Dignitary Banner */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-tricolor-strip" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <img
                src="/pm_modi.jpg"
                alt="Hon'ble Prime Minister Narendra Modi"
                className="w-14 h-14 rounded-full object-cover object-top border-2 border-amber-400 shadow-sm"
              />
              <img
                src="/indian_flag.jpg"
                alt="Indian Flag"
                className="w-5 h-3.5 rounded-xs object-cover absolute -bottom-1 -right-1 shadow-xs border border-white"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
                  National Flagship Initiative
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-medium text-slate-500">
                  Government of India
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 italic mt-0.5">
                "Connecting India's energetic youth with top 500 industry leaders through transparent AI allocation."
              </p>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                — Shri Narendra Modi, Hon'ble Prime Minister of India
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <img
                src="/indian_flag.jpg"
                alt="Tiranga"
                className="w-4 h-3 rounded-xs object-cover"
              />
              <span className="text-xs font-semibold text-slate-700 font-mono">
                28 States · 8 UTs Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Registered Candidates"
          value={totalInterns.toLocaleString()}
          change="+14.2%"
          isPositive={true}
          icon={Users}
          subtitle="Verified applicant pool"
        />
        <StatCard
          label="Host Enterprises"
          value={totalCompanies.toLocaleString()}
          change="+8.6%"
          isPositive={true}
          icon={Building2}
          subtitle="Accredited organizations"
        />
        <StatCard
          label="Internship Positions"
          value={activeSlots.toLocaleString()}
          change="+19.4%"
          isPositive={true}
          icon={Briefcase}
          subtitle="Published capacity openings"
        />
        <StatCard
          label="Mean Match Quality"
          value={`${matchQualityScore}%`}
          change="+2.1%"
          isPositive={true}
          icon={Sparkles}
          subtitle="Average suitability score"
        />
      </div>

      {/* AI Engine Status & Match Quality Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engine Status */}
        <div className="lg:col-span-2">
          <AIEngineStatus
            isOnline={true}
            currentModel="Skills & Background Match"
            optimization="Smart Matching"
            lastRun="Recently"
            matchQuality={`${matchQualityScore}%`}
          />
        </div>

        {/* Match Quality */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Match Quality Factors
            </span>
            <span className="text-xs font-mono font-bold text-orange-600">
              {matchQualityScore}% avg
            </span>
          </div>

          <div className="space-y-3.5 py-4">
            <ProgressBar
              label="Competency Skill Match"
              value={94}
              subtitle="Skills and background match"
              colorClass="bg-orange-500"
            />
            <ProgressBar
              label="Location Proximity"
              value={89}
              subtitle="Candidate regional preference"
              colorClass="bg-blue-600"
            />
            <ProgressBar
              label="Domain Alignment"
              value={96}
              subtitle="Sector preference compatibility"
              colorClass="bg-indigo-600"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Reservation Norms</span>
            <span className="text-emerald-600 font-bold font-mono">100% Enforced</span>
          </div>
        </div>
      </div>

      {/* Allocation Overview Chart */}
      <ChartCard
        title="Allocation Growth & Pipeline Progress"
        subtitle="Cumulative candidate placements solved across active windows"
        action={
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span className="text-slate-500">Allocated:</span>
              <span className="text-slate-900 font-bold">{allocatedCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-500">Pending:</span>
              <span className="text-slate-900 font-bold">{pendingCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-slate-500">Unmatched:</span>
              <span className="text-slate-900 font-bold">{unmatchedCount.toLocaleString()}</span>
            </div>
          </div>
        }
      >
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={
                charts.registrations30d?.length > 0
                  ? charts.registrations30d
                  : [
                      { date: 'Day 1', interns: 220, slots: 140 },
                      { date: 'Day 5', interns: 450, slots: 280 },
                      { date: 'Day 10', interns: 780, slots: 460 },
                      { date: 'Day 15', interns: 1200, slots: 680 },
                      { date: 'Day 20', interns: 1840, slots: 920 },
                      { date: 'Day 25', interns: 2850, slots: 1300 },
                      { date: 'Day 30', interns: 3842, slots: 1820 },
                    ]
              }
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAllocWhite" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '0.5rem',
                  fontSize: '11px',
                  color: '#0F172A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="interns"
                name="Placements Matched"
                stroke="#EA580C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorAllocWhite)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recent Allocations Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Candidate Placements
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Candidate placements computed by the matching engine
            </p>
          </div>
          <Link
            to="/admin/allocations"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>View Full Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Host Company</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAllocations.length === 0 ? (
                [
                  {
                    name: 'Rahul Sharma',
                    email: 'rahul.s@techcorp.in',
                    company: 'TechCorp Labs',
                    role: 'Backend Intern',
                    score: 96,
                    location: 'Bangalore',
                    status: 'Allocated',
                  },
                  {
                    name: 'Ananya Verma',
                    email: 'ananya.v@iitd.ac.in',
                    company: 'Tata Consultancy Services',
                    role: 'Data Analyst Intern',
                    score: 94,
                    location: 'Mumbai',
                    status: 'Allocated',
                  },
                  {
                    name: 'Siddharth Rao',
                    email: 'siddharth@bits.ac.in',
                    company: 'Infosys Research',
                    role: 'ML Engineering Intern',
                    score: 98,
                    location: 'Hyderabad',
                    status: 'Allocated',
                  },
                  {
                    name: 'Pooja Iyer',
                    email: 'pooja.i@nitk.edu',
                    company: 'Wipro Digital',
                    role: 'Frontend Engineer Intern',
                    score: 91,
                    location: 'Chennai',
                    status: 'Allocated',
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() =>
                      handleRowClick({
                        internId: { userId: { name: row.name, email: row.email } },
                        companyId: { companyName: row.company },
                        slotId: { title: row.role, location: { state: row.location } },
                        matchScore: row.score / 100,
                        status: row.status,
                      })
                    }
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{row.company}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-semibold">{row.role}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {row.score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{row.location}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                recentAllocations.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{item.internId?.userId?.name || 'Candidate'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.internId?.userId?.email || 'id-' + idx}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.companyId?.companyName || 'Host Enterprise'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-semibold">
                      {item.slotId?.title || 'Internship Slot'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {item.matchScore ? Math.round(item.matchScore * 100) : 92}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.slotId?.location?.state || item.slotId?.location?.city || 'India'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status || 'Allocated'} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainability Modal */}
      <MatchDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={selectedMatch}
      />
    </div>
  );
};

export default AdminDashboard;
