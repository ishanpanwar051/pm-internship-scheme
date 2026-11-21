import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { InternshipSlot } from '../../types';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  X,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  GraduationCap,
  ArrowRight,
  Send,
} from 'lucide-react';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const DOMAINS = [
  'All Fields & Streams',
  'Mechanical, Automotive & EV',
  'Banking, Finance & Commerce',
  'Healthcare, Pharma & Biotech',
  'Agriculture & Food Technology',
  'Civil & Infrastructure Works',
  'Renewable Energy & Electrical',
  'Logistics & Supply Chain',
  'Retail, Sales & Marketing',
  'Legal, HR & Administration',
  'Information Technology & AI',
];

export const InternExplore: React.FC = () => {
  const [slots, setSlots] = useState<InternshipSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Fields & Streams');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<InternshipSlot | null>(null);
  const [appliedSlots, setAppliedSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (search) params.search = search;
        if (selectedDomain !== 'All Fields & Streams') params.domain = selectedDomain;
        if (isRemoteOnly) params.isRemote = 'true';

        const res = await api.get('/intern/slots', { params });
        let allSlots = res.data.slots || [];

        // Fallback filter for client preview
        if (selectedDomain !== 'All Fields & Streams') {
          allSlots = allSlots.filter((s: any) =>
            s.domain?.toLowerCase().includes(selectedDomain.toLowerCase()) ||
            selectedDomain.toLowerCase().includes((s.domain || '').toLowerCase())
          );
        }
        if (search) {
          const q = search.toLowerCase();
          allSlots = allSlots.filter((s: any) =>
            s.title?.toLowerCase().includes(q) ||
            s.companyId?.companyName?.toLowerCase().includes(q) ||
            s.location?.city?.toLowerCase().includes(q) ||
            s.location?.state?.toLowerCase().includes(q) ||
            (s.skillsRequired || s.requiredSkills || []).some((sk: string) => sk.toLowerCase().includes(q))
          );
        }

        setSlots(allSlots);
      } catch (err) {
        console.error('Failed to query slots:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSlots, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedDomain, isRemoteOnly]);

  const handleApply = (slotId: string, title: string) => {
    setAppliedSlots((prev) => [...prev, slotId]);
    toast.success(`Applied for ${title}! Position added to your preferred matching profile.`);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* 1. Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Browse Opportunities & Sectors
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Explore 1.25 Lakh+ accredited enterprise internship openings across 500+ top Indian companies.
        </p>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, domain keywords, company, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2 text-xs text-slate-600 select-none cursor-pointer px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium">
            <input
              type="checkbox"
              checked={isRemoteOnly}
              onChange={(e) => setIsRemoteOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Remote</span>
          </label>
        </div>
      </div>

      {/* 3. Stream Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Streams:
        </span>
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDomain(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
              selectedDomain === d
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d === 'All Fields & Streams' ? '🌟 All Streams' : d}
          </button>
        ))}
      </div>

      {/* 4. Slots Grid */}
      {isLoading ? (
        <SkeletonLoader type="card" count={6} />
      ) : slots.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white border border-dashed border-slate-200 text-slate-400 space-y-2">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No opportunities match your filter criteria.</div>
          <div className="text-xs text-slate-400">Try clearing your search keyword or switching streams.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => {
            const skills = slot.requiredSkills || (slot as any).skillsRequired || [];
            const domain = slot.domain || (slot as any).domain || 'National Opportunity';
            const company = (slot as any).companyId?.companyName || (slot as any).company || 'Top 500 Enterprise';
            const seats = slot.totalSeats || (slot as any).openPositions || 25;
            const locationStr = slot.location?.city
              ? `${slot.location.city}, ${slot.location.state}`
              : slot.location?.state || 'Pan-India';
            const isApplied = appliedSlots.includes(slot._id);

            return (
              <div
                key={slot._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all text-left shadow-xs space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-[200px]">
                      {domain}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                      {seats} seats
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    {slot.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-600 mb-2.5">
                    {company}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{locationStr}</span>
                    </div>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono font-bold text-emerald-600">
                      ₹{slot.stipend?.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-100">
                    {skills.slice(0, 4).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    ● Open for Allocation
                  </span>
                  <div className="flex items-center space-x-2">
                    {isApplied ? (
                      <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                        ✓ Preference Saved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Slot Details & Application Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedSlot.domain}
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug pt-1">
                  {selectedSlot.title}
                </h3>
                <div className="text-xs font-bold text-blue-600">
                  {(selectedSlot as any).companyId?.companyName || (selectedSlot as any).company}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Role Overview
                </div>
                <p className="leading-relaxed text-slate-700">
                  {selectedSlot.description ||
                    'Hands-on industrial internship under the PM Internship Scheme with direct mentorship, on-the-job training, and exposure to live enterprise operations.'}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Required Competencies & Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedSlot.requiredSkills || (selectedSlot as any).skillsRequired || []).map(
                    (s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 text-slate-800 font-semibold border border-slate-200"
                      >
                        ✓ {s}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Total Monthly Stipend</div>
                  <div className="font-mono text-base font-black text-emerald-700 mt-0.5">
                    ₹{selectedSlot.stipend?.toLocaleString()}/mo
                  </div>
                  <div className="text-[10px] text-emerald-600">₹5,000 Govt DBT Included</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Duration & Location</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {selectedSlot.duration || '6 Months'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedSlot.location?.city ? `${selectedSlot.location.city}, ` : ''}
                    {selectedSlot.location?.state}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleApply(selectedSlot._id, selectedSlot.title)}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Save as Preference</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternExplore;
