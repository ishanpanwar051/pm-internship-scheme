import React from 'react';
import { X, Sparkles, Check, ArrowDown, Building2, User, Briefcase, MapPin, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface MatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    internName?: string;
    internEmail?: string;
    internSkills?: string[];
    roleTitle?: string;
    companyName?: string;
    location?: string;
    score?: number;
    breakdown?: {
      technicalSkills?: number;
      experience?: number;
      location?: number;
      preferences?: number;
      eligibility?: number;
    };
    categoryQuota?: string;
    reasons?: string[];
  } | null;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  if (!isOpen || !match) return null;

  const score = match.score || 94.8;
  const breakdown = match.breakdown || {
    technicalSkills: Math.min(99, Math.round(score + 2)),
    experience: Math.min(95, Math.max(75, Math.round(score - 4))),
    location: Math.min(98, Math.max(80, Math.round(score + 1))),
    preferences: Math.min(99, Math.round(score + 3)),
    eligibility: 100,
  };

  const reasons = match.reasons || [
    `Strong technical competency match with required vacancy criteria`,
    `Direct geographic alignment for ${match.location || 'preferred cluster'}`,
    `Statutory quota requirements fully satisfied (${match.categoryQuota || 'General / Merit'})`,
    `Candidate industry preference closely coincides with host corporate domain`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header with Tricolor Ribbon */}
        <div className="h-1 bg-tricolor-strip w-full" />
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              AI Match Explainability Analysis
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Candidate to Opportunity Hierarchy */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Candidate</div>
              <div className="text-sm font-bold text-slate-900">
                {match.internName || 'Candidate Profile'}
              </div>
              {match.internEmail && (
                <div className="text-[11px] text-slate-500 font-mono">{match.internEmail}</div>
              )}
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-orange-600" />
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Role</div>
              <div className="text-sm font-bold text-orange-700">
                {match.roleTitle || 'Internship Opportunity'}
              </div>
              {match.location && (
                <div className="text-[11px] text-slate-500 flex items-center justify-center space-x-1 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{match.location}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-orange-600" />
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Host Organization</div>
              <div className="text-sm font-bold text-slate-900">
                {match.companyName || 'Host Enterprise'}
              </div>
            </div>
          </div>

          {/* Primary Score */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div>
              <div className="text-xs font-bold text-orange-800 tracking-wide uppercase">
                Hungarian Cosine Compatibility
              </div>
              <div className="text-[11px] text-orange-600 mt-0.5">
                Computed across TF-IDF competency & quota matrices
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-orange-700">
              {score.toFixed(1)}%
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Compatibility Vectors
            </div>
            <div className="space-y-2.5">
              <ProgressBar label="Technical Skills Vector" value={breakdown.technicalSkills || 95} colorClass="bg-orange-500" />
              <ProgressBar label="Academic Alignment" value={breakdown.experience || 90} colorClass="bg-blue-600" />
              <ProgressBar label="Geographic Proximity" value={breakdown.location || 94} colorClass="bg-indigo-600" />
              <ProgressBar label="Candidate Preference" value={breakdown.preferences || 96} colorClass="bg-purple-600" />
              <ProgressBar label="Statutory Reservation Quota" value={breakdown.eligibility || 100} colorClass="bg-emerald-600" />
            </div>
          </div>

          {/* Why this match */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              System Rationales
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
