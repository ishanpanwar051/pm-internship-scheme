import React from 'react';
import { Cpu, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIEngineStatusProps {
  isOnline?: boolean;
  currentModel?: string;
  optimization?: string;
  lastRun?: string;
  matchQuality?: string | number;
  onRunClick?: () => void;
  showAction?: boolean;
}

export const AIEngineStatus: React.FC<AIEngineStatusProps> = ({
  isOnline = true,
  currentModel = 'Skills & Profile Check',
  optimization = 'Smart Matching',
  lastRun = 'Recently',
  matchQuality = '92%',
  onRunClick,
  showAction = true,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-orange-600" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
            Matching Engine Status
          </span>
        </div>

        {/* Online Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>{isOnline ? 'SYSTEM ACTIVE' : 'SYSTEM OFFLINE'}</span>
        </div>
      </div>

      {/* Grid of specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <div>
          <div className="text-[11px] text-slate-500 font-medium">Profile Check</div>
          <div className="mt-1 text-xs font-bold text-slate-900 truncate">
            {currentModel}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-medium">Matching Method</div>
          <div className="mt-1 text-xs font-bold text-slate-900 truncate">
            {optimization}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-medium">Last Matching Run</div>
          <div className="mt-1 text-xs font-medium text-slate-600 truncate">
            {lastRun}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-medium">Average Match Fit</div>
          <div className="mt-1 text-xs font-bold text-orange-600">
            {matchQuality}
          </div>
        </div>
      </div>

      {showAction && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Government reservation categories applied (SC/ST/OBC/EWS/PwD)</span>
          </div>

          <Link
            to="/admin/run-engine"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>View Matching Runs</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AIEngineStatus;
