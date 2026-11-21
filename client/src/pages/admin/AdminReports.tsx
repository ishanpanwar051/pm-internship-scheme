import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  BarChart3,
  Download,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  PieChart as PieIcon,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export const AdminReports: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data)).catch(() => {});
  }, []);

  const handleDownload = (reportName: string) => {
    window.open('/api/v1/admin/reports/csv', '_blank');
    toast.success(`Exporting ${reportName} dataset...`);
  };

  const skillDemandSupply = [
    { skill: 'Python', demand: 1840, supply: 2420 },
    { skill: 'React / Web', demand: 1650, supply: 1980 },
    { skill: 'Data Science', demand: 1420, supply: 1210 },
    { skill: 'Cloud / DevOps', demand: 1120, supply: 780 },
    { skill: 'Finance & MBA', demand: 940, supply: 1350 },
    { skill: 'Embedded / IoT', demand: 620, supply: 540 },
  ];

  const quotaBreakdown = [
    { name: 'General / Open', value: 50.5 },
    { name: 'OBC (27%)', value: 27.0 },
    { name: 'SC (15%)', value: 15.0 },
    { name: 'ST (7.5%)', value: 7.5 },
  ];

  const geographicDistribution = [
    { state: 'Maharashtra', count: 940 },
    { state: 'Karnataka', count: 860 },
    { state: 'Delhi NCR', count: 720 },
    { state: 'Tamil Nadu', count: 640 },
    { state: 'Telangana', count: 580 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 17. Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Analytics & Telemetry
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Enterprise analytics on allocation performance, affirmative action, and competency dynamics
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleDownload('Master Allocation')}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Package</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Allocation Rate"
          value="87.4%"
          change="+4.2%"
          isPositive={true}
          subtitle="Positions matched successfully"
        />
        <StatCard
          label="Mean Affinity Score"
          value="92.4%"
          change="+1.8%"
          isPositive={true}
          subtitle="Cosine similarity index"
        />
        <StatCard
          label="Statutory Compliance"
          value="100%"
          isPositive={true}
          subtitle="Quota constraints fulfilled"
        />
        <StatCard
          label="Enterprise Retention"
          value="94.2%"
          change="+3.1%"
          isPositive={true}
          subtitle="Corporate slot fulfillment"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Allocation Performance & Trends */}
        <ChartCard
          title="Allocation Trends"
          subtitle="Cumulative candidates matched across active allocation windows"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { cycle: 'W1', count: 480 },
                  { cycle: 'W2', count: 1120 },
                  { cycle: 'W3', count: 1980 },
                  { cycle: 'W4', count: 2840 },
                  { cycle: 'W5', count: 3420 },
                  { cycle: 'W6', count: 3842 },
                ]}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="cycle" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111113',
                    borderColor: '#27272A',
                    borderRadius: '0.375rem',
                    fontSize: '11px',
                    color: '#F4F4F5',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Allocations"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="#6366F1"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Skill Demand vs Supply */}
        <ChartCard
          title="Skill Demand vs Supply"
          subtitle="Candidate competency inventory vs published corporate requirements"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillDemandSupply}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="skill" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111113',
                    borderColor: '#27272A',
                    borderRadius: '0.375rem',
                    fontSize: '11px',
                    color: '#F4F4F5',
                  }}
                />
                <Bar dataKey="demand" name="Market Demand" fill="#6366F1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="supply" name="Candidate Pool" fill="#27272A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Quota Distribution */}
        <ChartCard
          title="Quota Affirmative Distribution"
          subtitle="Statutory candidate representation enforced by Hungarian constraints"
        >
          <div className="h-56 flex items-center justify-between">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quotaBreakdown}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {quotaBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111113',
                      borderColor: '#27272A',
                      borderRadius: '0.375rem',
                      fontSize: '11px',
                      color: '#F4F4F5',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-2 text-xs font-mono">
              {quotaBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[idx] }}
                    />
                    <span className="text-saas-muted text-[11px]">{item.name}</span>
                  </div>
                  <span className="text-saas-primary font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Geographic Distribution */}
        <ChartCard
          title="Geographic Hub Distribution"
          subtitle="Top state clusters by internship position saturation"
        >
          <div className="space-y-3 pt-2">
            {geographicDistribution.map((geo, idx) => {
              const pct = Math.round((geo.count / 1000) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-saas-muted font-medium">{geo.state}</span>
                    <span className="font-mono text-saas-primary">{geo.count} positions</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-indigo rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Exportable Intelligence Reports */}
      <div className="bg-saas-card border border-saas-border rounded-lg p-5">
        <h3 className="text-xs font-semibold text-saas-primary uppercase tracking-wider mb-1">
          Exportable Master Registries
        </h3>
        <p className="text-[11px] text-saas-dim mb-4">
          Generated datasets with raw mathematical scores, NLP tokens, and quota audit logs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: 'Master Allocation Registry',
              desc: 'Complete export of all allocated candidate pairings and raw competency scores.',
            },
            {
              title: 'Affirmative Quota Audit Log',
              desc: 'Detailed validation of statutory category representation for SC, ST, OBC, and PH.',
            },
            {
              title: 'Corporate Capacity Matrix',
              desc: 'Published vacancy slots, candidate conversion rates, and corporate sector metrics.',
            },
          ].map((rep, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-saas-surface rounded-md border border-saas-border flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-saas-primary">{rep.title}</div>
                <div className="text-[11px] text-saas-dim mt-1 leading-relaxed">{rep.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(rep.title)}
                className="mt-3 inline-flex items-center space-x-1.5 text-xs text-brand-indigo-light hover:text-white font-medium self-start"
              >
                <Download className="w-3 h-3" />
                <span>Download CSV</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
