import React from 'react';
import {
  FileText,
  Binary,
  GitCompare,
  Filter,
  Cpu,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'input',
    name: 'CANDIDATES & VACANCIES',
    description: 'Load applicant profiles and available opportunities',
    icon: FileText,
  },
  {
    id: 'features',
    name: 'SKILL ASSESSMENT',
    description: 'Review education, skills, and background',
    icon: Binary,
  },
  {
    id: 'similarity',
    name: 'PROFILE COMPATIBILITY',
    description: 'Calculate fit between candidate skills and role requirements',
    icon: GitCompare,
  },
  {
    id: 'constraints',
    name: 'ELIGIBILITY & NORMS',
    description: 'Apply Government reservation categories and location preferences',
    icon: Filter,
  },
  {
    id: 'optimization',
    name: 'SMART MATCHING',
    description: 'Pair candidates with the most suitable opportunities',
    icon: Cpu,
  },
  {
    id: 'allocation',
    name: 'FINAL PLACEMENT',
    description: 'Confirm and notify candidates and companies',
    icon: CheckCircle2,
  },
];

interface AllocationPipelineProps {
  currentStageIndex: number; // 0 to 6 (0 = idle, 1..6 = running stage, 6+ = done)
  isRunning: boolean;
  isComplete: boolean;
  executionMetrics?: {
    totalAllocated?: number;
    avgScore?: number | string;
    executionTimeMs?: number;
  };
}

export const AllocationPipeline: React.FC<AllocationPipelineProps> = ({
  currentStageIndex,
  isRunning,
  isComplete,
  executionMetrics,
}) => {
  return (
    <div className="space-y-6">
      {/* Horizontal / Grid Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const stageNumber = idx + 1;
          const isCurrent = isRunning && currentStageIndex === stageNumber;
          const isPassed = isComplete || (isRunning && currentStageIndex > stageNumber);

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-lg border transition-all duration-200 relative ${
                isCurrent
                  ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 text-slate-900 shadow-sm'
                  : isPassed
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center ${
                    isCurrent
                      ? 'bg-orange-600 text-white'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  0{stageNumber}
                </span>
              </div>

              <div className="text-[11px] font-semibold tracking-wide uppercase truncate text-slate-800">
                {stage.name}
              </div>
              <div className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-tight">
                {stage.description}
              </div>

              {/* Status indicator pill */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Status</span>
                <span
                  className={`font-mono font-medium ${
                    isCurrent
                      ? 'text-orange-600'
                      : isPassed
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {isCurrent ? 'Processing' : isPassed ? 'Complete' : 'Queued'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Summary banner if complete */}
      {isComplete && executionMetrics && (
        <div className="bg-white border border-emerald-200 rounded-lg p-5 shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Allocation Completed Successfully</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-3 bg-saas-surface rounded-md border border-saas-border">
              <div className="text-[11px] text-saas-dim">Matches Generated</div>
              <div className="text-xl font-semibold font-mono text-saas-primary mt-1">
                {executionMetrics.totalAllocated?.toLocaleString() || '0'}
              </div>
            </div>

            <div className="p-3 bg-saas-surface rounded-md border border-saas-border">
              <div className="text-[11px] text-saas-dim">Average Match Score</div>
              <div className="text-xl font-semibold font-mono text-brand-indigo-light mt-1">
                {typeof executionMetrics.avgScore === 'number'
                  ? `${executionMetrics.avgScore.toFixed(1)}%`
                  : executionMetrics.avgScore || '92.4%'}
              </div>
            </div>

            <div className="p-3 bg-saas-surface rounded-md border border-saas-border">
              <div className="text-[11px] text-saas-dim">Processing Time</div>
              <div className="text-xl font-semibold font-mono text-saas-primary mt-1">
                {executionMetrics.executionTimeMs
                  ? `${(executionMetrics.executionTimeMs / 1000).toFixed(2)}s`
                  : '4.8s'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationPipeline;
