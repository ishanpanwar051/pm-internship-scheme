import React from 'react';
import { GraduationCap, Calendar, QrCode, ShieldCheck } from 'lucide-react';

export const NationalValueCards: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: NEP 2020 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              NEP 2020
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              ABC credit that follows you
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mapped directly to your Academic Bank of Credits (ABC) ID. Earn accredited university coursework credits while gaining hands-on corporate exposure in premier enterprises.
            </p>
          </div>
        </div>

        {/* Card 2: Fits your timetable */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
              Fits your timetable
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Work alongside your studies
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Flexible schedules designed around college semesters. Choose between virtual, hybrid, or on-site placements tailored to your examination timetable and coursework.
            </p>
          </div>
        </div>

        {/* Card 3: Verifiable by anyone */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verifiable by anyone
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Government issued QR credential
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tamper-proof, digitally signed certificates stored in your DigiLocker. Easily shareable on professional networks and verifiable by employers anywhere in the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalValueCards;
