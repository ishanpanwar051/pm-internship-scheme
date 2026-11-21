import React, { useState } from 'react';
import { ChevronDown, ExternalLink, FileText, Megaphone, CheckCircle2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveTickerBar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-[#EFF8F2] border-y border-[#D1EBD9] px-4 py-2 text-xs font-medium text-slate-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Side: Live Badge + Ticker Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Badge */}
          <Link
            to="/intern/explore"
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-200 transition-colors shadow-2xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
            <span className="text-[11px] uppercase tracking-wider font-bold">LIVE</span>
            <span className="text-slate-800 font-semibold">Recently Posted Internships</span>
            <span>→</span>
          </Link>

          {/* Pill 1: Internship Report */}
          <a
            href="#report"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFF4E5] hover:bg-[#FFE7C8] text-[#8C4B00] border border-[#F5D5AB] transition-colors text-[11px] font-semibold"
          >
            <FileText className="w-3 h-3 text-[#D97706]" />
            <span>Internship Report 2025–26</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>

          {/* Pill 2: AMRUTAM 2.0 */}
          <a
            href="#amrutam"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EBF5FF] hover:bg-[#DBEEFF] text-[#004B8C] border border-[#BFDBFE] transition-colors text-[11px] font-semibold"
          >
            <Megaphone className="w-3 h-3 text-[#2563EB]" />
            <span>AMRUTAM 2.0 Pin Well Login</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>

          {/* Pill 3: Selected Interns */}
          <Link
            to="/login?role=intern"
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6F9F4] hover:bg-[#D0F5EB] text-[#006A4E] border border-[#A7F3D0] transition-colors text-[11px] font-semibold"
          >
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            <span>Selected Interns</span>
          </Link>

          {/* Pill 4: Amrit Sarovar */}
          <a
            href="#amrit-sarovar"
            onClick={(e) => e.preventDefault()}
            className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] transition-colors text-[11px] font-semibold"
          >
            <MapPin className="w-3 h-3 text-[#3B82F6]" />
            <span>Amrit Sarovar Geotagged Submissions</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>

        {/* Right Side: More interesting internships dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-orange-700 border border-orange-200 transition-colors text-[11px] font-semibold shadow-2xs"
          >
            <span>More interesting internships</span>
            <ChevronDown className="w-3 h-3 text-orange-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs text-slate-700 space-y-1 animate-fade-in">
              <Link
                to="/intern/explore"
                className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Smart Cities Urban Mission Internships
              </Link>
              <Link
                to="/intern/explore"
                className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Renewable Energy & Solar Missions
              </Link>
              <Link
                to="/intern/explore"
                className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Corporate CSR Direct Placements
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTickerBar;
