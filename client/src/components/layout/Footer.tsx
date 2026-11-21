import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, ShieldCheck, Flag } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="h-1 bg-tricolor-strip w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 flex-shrink-0 flex flex-col">
                <div className="h-1/3 bg-[#FF9933] w-full" />
                <div className="h-1/3 bg-white w-full flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#1A237E]" />
                </div>
                <div className="h-1/3 bg-[#138808] w-full" />
              </div>
              <span className="font-bold text-slate-900">PM INTERNSHIP SCHEME</span>
              <span className="text-slate-300">·</span>
              <span className="text-orange-600 font-semibold text-[11px]">Smart Matching Portal</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-lg leading-relaxed">
              Empowering India's youth through transparent, skill-based internship matching with fair representation as per Government of India guidelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-500">
            <div className="flex items-center space-x-1 text-slate-700 font-medium">
              <Cpu className="w-3.5 h-3.5 text-orange-600" />
              <span>Smart Matching</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Government Guidelines Compliant</span>
            </div>
            <span className="text-slate-400">© {new Date().getFullYear()} Government of India Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;