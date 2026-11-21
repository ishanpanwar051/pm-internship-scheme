import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Award, IndianRupee, Sparkles, UserCheck } from 'lucide-react';

interface Milestone {
  number: string;
  badge: string;
  badgeColor: string;
  numColor: string;
  title: string;
  desc: string;
  timelineLabel: string;
  activeColor: string;
}

const MILESTONES: Milestone[] = [
  {
    number: '01',
    badge: '~4 min',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    numColor: 'text-orange-500',
    title: 'Make your profile once',
    desc: 'Super-light sign-up, college auto-filled from the AICTE/AISHE database, skills in your own words. No CV formatting pain.',
    timelineLabel: 'SIGN UP',
    activeColor: 'bg-orange-500 ring-orange-200',
  },
  {
    number: '02',
    badge: 'Instant',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    numColor: 'text-purple-600',
    title: 'Let the AI matcher dig',
    desc: 'Every live opening scored against your branch, year, city and skills — then ranked. You only see what you can actually get.',
    timelineLabel: 'GET MATCHED',
    activeColor: 'bg-purple-600 ring-purple-200',
  },
  {
    number: '03',
    badge: '1 tap',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    numColor: 'text-cyan-500',
    title: 'One tap, every ministry or corporate',
    desc: 'No re-typing the same details for each requirement. One profile goes everywhere, and every application is tracked for you.',
    timelineLabel: 'APPLY',
    activeColor: 'bg-cyan-500 ring-cyan-200',
  },
  {
    number: '04',
    badge: 'Paid monthly',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    numColor: 'text-slate-400',
    title: 'Shortlisted, then salaried',
    desc: 'Employers respond inside the portal. Stipends are declared upfront and paid to your bank account — never negotiated in DMs.',
    timelineLabel: 'GET PAID',
    activeColor: 'bg-emerald-500 ring-emerald-200',
  },
  {
    number: '05',
    badge: 'Credits',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    numColor: 'text-slate-400',
    title: 'Walk away with credits',
    desc: 'A government-issued, QR-verifiable certificate plus credits into your ABC (Academic Bank of Credits) account.',
    timelineLabel: 'CERTIFIED',
    activeColor: 'bg-indigo-600 ring-indigo-200',
  },
];

export const MilestoneStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // 0-indexed, default to 2 (Milestone 3 of 5, as in screenshot 2)

  const progressPercent = Math.round(((activeStep + 1) / 5) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Subtitle & Progress Tracker Header */}
      <div className="text-center space-y-4">
        <p className="text-base sm:text-lg text-slate-800 font-bold max-w-3xl mx-auto">
          Five milestones, end to end — no agents and no fees. This is the government's own pipeline.
        </p>

        {/* Progress Tracker Pill */}
        <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
            {activeStep + 1}
          </div>
          <span className="text-sm font-bold text-slate-800">
            Milestone {activeStep + 1} of 5
          </span>
          <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-600 font-mono">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* 5 Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MILESTONES.map((m, idx) => {
          const isSelected = activeStep === idx;
          const isCompleted = activeStep > idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative bg-white ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-md scale-[1.02]'
                  : isCompleted
                  ? 'border-slate-200 shadow-2xs hover:border-slate-300'
                  : 'border-slate-200/80 shadow-2xs opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header: Number + Pill Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-3xl font-black font-mono ${m.numColor}`}>
                    {m.number}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${m.badgeColor}`}
                  >
                    {m.badge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {m.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Step indicator bar at bottom */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Phase {idx + 1}</span>
                {isCompleted ? (
                  <span className="text-emerald-600 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : isSelected ? (
                  <span className="text-cyan-600 font-bold">Active Phase</span>
                ) : (
                  <span>Upcoming</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Horizontal Interactive Timeline Stepper Connector */}
      <div className="pt-6 max-w-4xl mx-auto px-4">
        <div className="relative flex items-center justify-between">
          {/* Connecting Line Background */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0" />
          
          {/* Active Progress Line */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 rounded-full z-0 transition-all duration-300"
            style={{ width: `${(activeStep / 4) * 100}%` }}
          />

          {/* Timeline Nodes */}
          {MILESTONES.map((m, idx) => {
            const isCompleted = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveStep(idx)}
              >
                {/* Node Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    idx === 0
                      ? 'bg-orange-500 text-white shadow-md'
                      : idx === 1
                      ? activeStep >= 1
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                      : idx === 2
                      ? activeStep >= 2
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-200 shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                      : idx === 3
                      ? activeStep >= 3
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                      : activeStep >= 4
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 shadow-md'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {idx === 0 ? (
                    <UserCheck className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <Sparkles className="w-5 h-5" />
                  ) : idx === 2 ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : idx === 3 ? (
                    <IndianRupee className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>

                {/* Node Label */}
                <div
                  className={`text-xs font-black tracking-wider mt-3 transition-colors uppercase ${
                    isCurrent
                      ? 'text-slate-900 scale-105'
                      : isCompleted
                      ? 'text-slate-700 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {m.timelineLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="text-center pt-6">
        <Link
          to="/login?role=intern"
          className="inline-flex items-center space-x-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-base font-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <span>Start milestone one — It's free</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default MilestoneStepper;
