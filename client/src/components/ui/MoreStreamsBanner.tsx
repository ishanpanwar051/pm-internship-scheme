import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const STREAMS = [
  'Biotechnology',
  'Agriculture',
  'Pharmacy',
  'Management & Commerce',
  'Law',
  'Hotel Management',
  'Aeronautical',
  'Automobile',
  'Instrumentation',
  'Textile',
  'Mining',
  'Petroleum',
  'Environmental',
  'Food Technology',
  'Mass Communication',
  'Applied Sciences',
];

export const MoreStreamsBanner: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title */}
        <div className="shrink-0 lg:max-w-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            MORE STREAMS
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">
            Not an engineer? We have you covered too.
          </h3>
        </div>

        {/* Right Stream Tag Pills & View All Button */}
        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          {STREAMS.map((stream, idx) => (
            <Link
              key={idx}
              to="/intern/explore"
              className="px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors"
            >
              {stream}
            </Link>
          ))}

          <Link
            to="/intern/explore"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs shrink-0"
          >
            <span>View all streams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MoreStreamsBanner;
