import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Settings2, Save, RotateCcw, SlidersHorizontal, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConfigState {
  weights: Record<string, number>;
  quotas: Record<string, number>;
}

const WEIGHT_LABELS: Record<string, string> = {
  location: 'Location Preference Match',
  homeState: 'Home State Alignment',
  domain: 'Domain Interest Alignment',
  cgpaHigh: 'Academic Merit — CGPA ≥ 8.5',
  cgpaMid: 'Academic Merit — CGPA ≥ 7.5',
  cgpaLow: 'Academic Merit — CGPA ≥ 6.5',
  penaltyGate: 'CGPA Eligibility Gate Penalty (invalid score)',
};

const QUOTA_LABELS: Record<string, string> = {
  SC: 'SC',
  ST: 'ST',
  OBC: 'OBC',
  PH: 'PH',
};

export const AdminSystemConfig: React.FC = () => {
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [quotas, setQuotas] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/system-config');
      const cfg: ConfigState = res.data.config;
      setConfig(cfg);
      const w: Record<string, string> = {};
      Object.keys(WEIGHT_LABELS).forEach((k) => {
        w[k] = cfg.weights?.[k] !== undefined ? String(cfg.weights[k]) : '0';
      });
      const q: Record<string, string> = {};
      Object.keys(QUOTA_LABELS).forEach((k) => {
        q[k] = cfg.quotas?.[k] !== undefined ? String(cfg.quotas[k] * 100) : '0';
      });
      setWeights(w);
      setQuotas(q);
    } catch (e) {
      toast.error('Unable to load engine configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleRestoreDefaults = () => {
    setWeights({
      location: '0.2',
      homeState: '0.08',
      domain: '0.12',
      cgpaHigh: '0.1',
      cgpaMid: '0.07',
      cgpaLow: '0.05',
      penaltyGate: '-999',
    });
    setQuotas({ SC: '15', ST: '7.5', OBC: '27', PH: '4' });
    toast.success('Form restored to recommended defaults (apply to persist)');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const weightsPayload: Record<string, number> = {};
      Object.keys(weights).forEach((k) => {
        const v = parseFloat(weights[k]);
        if (!isNaN(v)) weightsPayload[k] = v;
      });
      const quotasPayload: Record<string, number> = {};
      Object.keys(quotas).forEach((k) => {
        const v = parseFloat(quotas[k]);
        if (!isNaN(v)) quotasPayload[k] = v / 100;
      });

      await api.put('/admin/system-config', {
        weights: weightsPayload,
        quotas: quotasPayload,
      });
      toast.success('Engine configuration saved — applies to the next run');
      fetchConfig();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    'w-28 px-3 py-2 text-right text-xs font-mono rounded-lg border border-saas-border bg-saas-surface text-saas-primary outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-saas-border">
        <div>
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-brand-indigo" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-saas-primary">
              Engine Configuration
            </h1>
          </div>
          <p className="text-xs text-saas-muted mt-1">
            Tune scoring weights and quota splits. Values apply to the next allocation run.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-saas-muted hover:text-saas-primary bg-saas-surface hover:bg-saas-surface-hover border border-saas-border rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center space-x-2 px-4 py-1.5 text-xs font-medium bg-brand-indigo hover:bg-brand-indigo-light text-white rounded-md disabled:opacity-50 transition-colors shadow-glow-indigo"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-saas-card border border-saas-border rounded-lg p-8 text-center text-xs text-saas-muted animate-pulse-slow">
          Loading engine configuration...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scoring Weights */}
          <div className="bg-saas-card border border-saas-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-saas-border flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-indigo" />
              <h3 className="text-xs font-semibold text-saas-primary uppercase tracking-wider">
                Scoring Weights (additive bonuses)
              </h3>
            </div>
            <div className="divide-y divide-saas-border-subtle">
              {Object.keys(WEIGHT_LABELS).map((key) => (
                <div key={key} className="px-4 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-saas-primary truncate">
                      {WEIGHT_LABELS[key]}
                    </div>
                    {key === 'penaltyGate' && (
                      <div className="text-[10px] text-saas-dim">
                        Negative value invalidates the match for that pair
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weights[key] ?? ''}
                    onChange={(e) => setWeights((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quota Splits */}
          <div className="bg-saas-card border border-saas-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-saas-border flex items-center space-x-2">
              <Percent className="w-3.5 h-3.5 text-brand-indigo" />
              <h3 className="text-xs font-semibold text-saas-primary uppercase tracking-wider">
                Category Quota Splits (% of seats per slot)
              </h3>
            </div>
            <div className="divide-y divide-saas-border-subtle">
              {Object.keys(QUOTA_LABELS).map((key) => (
                <div key={key} className="px-4 py-3 flex items-center justify-between gap-4">
                  <div className="text-xs font-semibold text-saas-primary">
                    {QUOTA_LABELS[key]} Quota
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={quotas[key] ?? ''}
                      onChange={(e) => setQuotas((p) => ({ ...p, [key]: e.target.value }))}
                      className={inputCls}
                    />
                    <span className="text-xs text-saas-dim">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-saas-border-subtle text-[11px] text-saas-dim leading-relaxed">
              General category receives the remaining seats after reserved proportions. Scores are
              always real AI-computed cosine similarities plus configured bonuses — never random.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemConfig;