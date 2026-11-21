import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Cpu,
  Play,
  History,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ArrowRight,
  Layers,
  Loader2,
  RefreshCcw,
  BarChart3,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AllocationPipeline from '../../components/ui/AllocationPipeline';
import StatusBadge from '../../components/ui/StatusBadge';

export const AdminRunEngine: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 1..6 mapped from 8 server steps
  const [stepMessage, setStepMessage] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/engine/logs');
      setHistoryLogs(res.data.logs || []);
      setStats(res.data.stats || null);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Poll status while job is executing
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await api.get('/admin/engine/status');
          const log = res.data.log;
          if (log) {
            const mappedStep = Math.min(6, Math.max(1, Math.ceil(((log.currentStep || 1) * 6) / 8)));
            setCurrentStep(mappedStep);
            setStepMessage(log.stepMessage || 'Matching in progress...');

            if (log.status === 'Success') {
              setIsRunning(false);
              setSummary({
                totalAllocated: log.totalAllocated || 0,
                avgScore: log.averageMatchScore != null ? (log.averageMatchScore * 100).toFixed(1) : '0.0',
                duration: log.duration || 0,
                totalInterns: log.totalInterns || 0,
                totalSlots: log.totalSlots || 0,
              });
              toast.success(`Allocation completed! ${log.totalAllocated || 0} matches generated.`);
              clearInterval(interval);
              fetchLogs();
            } else if (log.status === 'Failed') {
              setIsRunning(false);
              toast.error(`Engine failed: ${log.errorMessage || 'Unknown error'}`);
              clearInterval(interval);
            }
          }
        } catch (e) {
          // continue polling
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startRun = async (endpoint: string, actionLabel: string) => {
    setIsRunning(true);
    setSummary(null);
    setCurrentStep(1);
    setStepMessage('Loading candidates and available opportunities...');

    try {
      await api.post(endpoint);
      toast.success(`${actionLabel} initiated`);
    } catch (err: any) {
      toast.error(err.message || `${actionLabel} failed to start`);
      setIsRunning(false);
    }
  };

  const handleStartEngine = () => startRun('/admin/engine/run', 'Allocation run');
  const handleReallocate = () => startRun('/admin/engine/realloc', 'Re-allocation run');

  const formatDuration = (sec: number) => {
    if (!sec && sec !== 0) return '—';
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    return `${m}m ${sec % 60}s`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Matching Engine
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Smart matching based on applicant skills, qualification, location, and Government reservation norms
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setShowHistory((p) => !p)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-saas-muted hover:text-saas-primary bg-saas-surface hover:bg-saas-surface-hover border border-saas-border rounded-md transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide Run History' : 'Run History'}</span>
          </button>
          <button
            type="button"
            onClick={handleReallocate}
            disabled={isRunning}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-saas-muted hover:text-saas-primary bg-saas-surface hover:bg-saas-surface-hover border border-saas-border rounded-md transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Re-Allocate Freed Capacity</span>
          </button>
          <button
            type="button"
            onClick={handleStartEngine}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-4 py-1.5 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md disabled:opacity-50 transition-colors shadow-glow-indigo"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Engine...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Allocation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aggregate run stats */}
      {stats && !isRunning && !summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Successful Runs', value: stats.totalRuns ?? 0, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Total Allocations', value: (stats.totalAllocated ?? 0).toLocaleString(), icon: Layers, color: 'text-brand-indigo-light' },
            { label: 'Profiles Processed', value: (stats.totalInternsProcessed ?? 0).toLocaleString(), icon: UserCheck, color: 'text-cyan-400' },
            { label: 'Mean Match Score', value: stats.avgMatchScore != null ? `${(stats.avgMatchScore * 100).toFixed(1)}%` : '—', icon: BarChart3, color: 'text-brand-indigo-light' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-saas-card border border-saas-border rounded-lg p-4">
                <div className={`flex items-center space-x-2 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-saas-dim">
                    {card.label}
                  </span>
                </div>
                <div className="text-xl font-bold text-saas-primary mt-2 font-mono">{card.value}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pipeline Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-saas-dim uppercase tracking-wider">
            Autonomous Pipeline Architecture
          </span>
          <span className="font-mono text-[11px] text-brand-indigo-light">
            {isRunning ? `Stage 0${currentStep}/06 in progress` : summary ? 'Pipeline Complete' : 'Engine Idle'}
          </span>
        </div>

        <AllocationPipeline
          currentStageIndex={currentStep}
          isRunning={isRunning}
          isComplete={!isRunning && summary !== null}
          executionMetrics={summary}
        />
      </div>

      {/* Real-time Telemetry Terminal Log */}
      <div className="bg-saas-card border border-saas-border rounded-lg p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-saas-border text-saas-dim">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-brand-indigo" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Live Engine Telemetry
            </span>
          </div>
          <span className="text-[10px] text-saas-dim">
            {isRunning ? 'STREAMING' : 'STANDBY'}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 text-[11px] text-saas-muted min-h-24">
          <div className="text-saas-dim">
            System status: Matching engine ready.
          </div>
          <div className="text-saas-dim">
            Government guidelines and reservation norms active.
          </div>
          {isRunning && (
            <div className="text-brand-indigo-light flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse" />
              <span>{stepMessage}</span>
            </div>
          )}
          {summary && (
            <>
              <div className="text-emerald-400 font-semibold">
                ✓ Matching complete in {formatDuration(summary.duration)}. Best-fit assignments generated successfully.
              </div>
              <div className="text-brand-indigo-light">
                Evaluated {summary.totalInterns || 0} candidate profiles across {summary.totalSlots || 0} opportunity positions (Average fit: {summary.avgScore}%).
              </div>
              <div className="text-saas-primary font-semibold">
                {summary.totalAllocated?.toLocaleString()} candidate placements finalized in registry.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation to results */}
      {summary && (
        <div className="flex justify-end animate-fade-in">
          <Link
            to="/admin/allocations"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium bg-saas-surface hover:bg-saas-surface-hover text-saas-primary border border-saas-border rounded-md transition-colors"
          >
            <span>Review Newly Matched Candidates in Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Previous Runs History Table */}
      {showHistory && (
        <div className="bg-saas-card border border-saas-border rounded-lg overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-saas-border">
            <h3 className="text-xs font-semibold text-saas-primary uppercase tracking-wider">
              Execution History
            </h3>
            <p className="text-[11px] text-saas-dim mt-0.5">
              Record of allocation engine runs (scored real, never simulated)
            </p>
          </div>

          {historyLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-saas-muted">
              No engine runs recorded yet. Trigger "Run Allocation" to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-saas-surface/40 border-b border-saas-border text-saas-dim uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-2.5 px-4">Run ID</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Profiles</th>
                    <th className="py-2.5 px-4">Slots</th>
                    <th className="py-2.5 px-4">Allocated</th>
                    <th className="py-2.5 px-4">Mean Score</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-saas-border-subtle">
                  {historyLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-saas-surface/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-saas-primary font-medium">
                        {log._id?.substring(0, 14)}
                      </td>
                      <td className="py-3 px-4 text-saas-dim whitespace-nowrap">
                        {new Date(log.runAt || log.createdAt).toLocaleDateString()}{' '}
                        {new Date(log.runAt || log.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-saas-dim">{log.totalInterns ?? '—'}</td>
                      <td className="py-3 px-4 font-mono text-saas-dim">{log.totalSlots ?? '—'}</td>
                      <td className="py-3 px-4 font-mono text-saas-primary font-semibold">
                        {log.totalAllocated ?? 0}
                      </td>
                      <td className="py-3 px-4 font-mono text-brand-indigo-light">
                        {log.averageMatchScore != null ? `${(log.averageMatchScore * 100).toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-saas-dim font-mono">
                        {log.duration != null ? formatDuration(log.duration) : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={log.status || '—'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Error hint when no runs yet */}
      {!summary && !isRunning && historyLogs.length === 0 && (
        <div className="flex items-center space-x-2 text-xs text-saas-muted bg-saas-card border border-saas-border rounded-lg p-4">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>
            The engine has not run yet. Click <strong className="text-saas-primary">Run Allocation</strong> to compute
            real matches for the current candidate pool.
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminRunEngine;