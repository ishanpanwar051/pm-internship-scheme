import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Cpu,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
  Briefcase,
  HelpCircle,
  Landmark,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRole = searchParams.get('role') as Role | null;
  const initialRole: Role = queryRole === 'admin' || queryRole === 'company' ? queryRole : 'intern';

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Keep state in sync if URL query param changes
  useEffect(() => {
    if (queryRole && ['intern', 'company', 'admin'].includes(queryRole) && queryRole !== role) {
      setRole(queryRole);
      setEmail('');
      setPassword('');
    }
  }, [queryRole]);

  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
    setEmail('');
    setPassword('');
  };

  const fillCredentials = (roleToSet: Role, emailToSet: string, passToSet: string) => {
    setRole(roleToSet);
    setSearchParams({ role: roleToSet });
    setEmail(emailToSet);
    setPassword(passToSet);
    toast.success(`Demo credentials filled for ${roleToSet.toUpperCase()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error('Email and password required');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email: cleanEmail, password, role });
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'company') navigate('/company/dashboard');
      else navigate('/intern/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Invalid email or password.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center">
      {/* Top Main Heading */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold tracking-wide uppercase mb-2 border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Prime Minister's Internship Scheme · Single Sign-On</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Select Your Portal to Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Dedicated, secure authentication panels tailored for Students, Corporate Hosts, and Ministry Officers.
        </p>
      </div>

      {/* 3-Way Segmented Portal Switcher */}
      <div className="w-full max-w-4xl mb-6">
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* 1. Student Tab */}
          <button
            type="button"
            onClick={() => handleRoleSwitch('intern')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              role === 'intern'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 ${role === 'intern' ? 'text-white' : 'text-blue-600'}`} />
            <div className="text-left">
              <div className="leading-tight">Student / Candidate</div>
              <div className={`text-[10px] hidden sm:block ${role === 'intern' ? 'text-blue-100' : 'text-slate-400'}`}>
                Youth Skilling & DBT
              </div>
            </div>
          </button>

          {/* 2. Corporate Tab */}
          <button
            type="button"
            onClick={() => handleRoleSwitch('company')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              role === 'company'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${role === 'company' ? 'text-white' : 'text-emerald-600'}`} />
            <div className="text-left">
              <div className="leading-tight">Corporate / Partner</div>
              <div className={`text-[10px] hidden sm:block ${role === 'company' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Top 500 Enterprises
              </div>
            </div>
          </button>

          {/* 3. Ministry / Admin Tab */}
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-amber-400 shadow-md shadow-slate-900/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Landmark className={`w-4 h-4 sm:w-5 sm:h-5 ${role === 'admin' ? 'text-amber-400' : 'text-slate-700'}`} />
            <div className="text-left">
              <div className="leading-tight">Ministry / Admin</div>
              <div className={`text-[10px] hidden sm:block ${role === 'admin' ? 'text-amber-200/70' : 'text-slate-400'}`}>
                National Command & AI
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Demo Credentials Access Bar */}
      <div className="w-full max-w-4xl mb-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
          <span>Quick Demo Access:</span>
          <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">(1-click auto-fill for testing)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('intern', 'intern1@example.com', 'Intern@123')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 ${
              role === 'intern'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
          >
            <span>🎓 Student (Aarav)</span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('company', 'company1@example.com', 'Company@123')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 ${
              role === 'company'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            <span>🏢 Company (TCS)</span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('admin', 'admin@pminternship.gov.in', 'Admin@123')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 ${
              role === 'admin'
                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            <span>🏛️ National Admin</span>
          </button>
        </div>
      </div>

      {/* Main Panel Box */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        {/* ========================================================================= */}
        {/* PANEL 1: STUDENT / CANDIDATE SKILLING PORTAL */}
        {/* ========================================================================= */}
        {role === 'intern' && (
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Hero: Student Skilling & Direct Benefits */}
            <div className="md:col-span-6 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Top Indian Tricolor Strip Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-tricolor-strip" />

              <div className="space-y-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                      National Youth Skilling Portal
                    </span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      PM Internship Candidate Login
                    </h2>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 fill-amber-300" />
                    <span>Direct Benefit Transfer (DBT) Scheme</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                      <div className="text-[10px] text-slate-300 uppercase">Monthly Stipend</div>
                      <div className="text-base font-black text-white">₹5,000 / mo</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                      <div className="text-[10px] text-slate-300 uppercase">One-Time Grant</div>
                      <div className="text-base font-black text-emerald-400">₹6,000</div>
                    </div>
                  </div>
                </div>

                {/* Candidate Benefits Checklist */}
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Smart Skill-Matching:</strong> Opportunities matched to your skills, education, and preferences across top companies.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Fair Representation:</strong> Inclusive opportunities for SC, ST, OBC, EWS, & PwD candidates as per Government guidelines.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">MCA Verified Credentials:</strong> Government-authenticated certificate upon completion.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Viksit Bharat 2047 · Youth Empowerment</span>
                <span className="text-emerald-400 font-semibold">● 1.25 Lakh Openings</span>
              </div>
            </div>

            {/* Right Form: Student Login */}
            <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Candidate Skilling Portal</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Step 1 of 1</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">Sign in to Candidate Portal</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Access your profile, verify your skills, and view your real-time company allocations.
                </p>

                {/* Custom Credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student / Candidate Email ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="intern1@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-[11px] text-blue-600 hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    <span>{isLoading ? 'Authenticating Candidate...' : 'Sign In as Candidate'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2 text-center">
                <div className="text-xs text-slate-600">
                  New student applicant?{' '}
                  <Link to="/register?role=intern" className="text-blue-600 hover:text-blue-700 font-bold underline">
                    Register for PM Internship Scheme
                  </Link>
                </div>
                <div className="text-[11px] text-slate-400">
                  Toll-Free Student Support: 1800-11-2047 (Mon-Sat, 9AM-6PM)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANEL 2: CORPORATE / PARTNER ENTERPRISE PORTAL */}
        {/* ========================================================================= */}
        {role === 'company' && (
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Hero: Corporate Host Entities */}
            <div className="md:col-span-6 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-tricolor-strip" />

              <div className="space-y-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Corporate Partner Portal
                    </span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      Enterprise Host Entity Login
                    </h2>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-teal-300">
                    <Briefcase className="w-4 h-4" />
                    <span>Companies Act Section 135 CSR Compliance</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Partner with the Government of India to host talented youth in high-growth industrial sectors while fulfilling national corporate social skilling commitments.
                  </p>
                </div>

                {/* Corporate Capabilities */}
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Slot & Capacity Management:</strong> Publish and edit verified internship openings across all departments.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Fair Selection:</strong> Built-in alignment with national guidelines for inclusive youth skilling.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Candidate Review:</strong> Review shortlisted candidates matched to your specific slot requirements.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Top 500 Indian Enterprises Network</span>
                <span className="text-teal-400 font-semibold">● CSR Certified</span>
              </div>
            </div>

            {/* Right Form: Corporate Login */}
            <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Enterprise Host Entity</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Corporate Auth</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">Partner Corporate Login</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Sign in with your registered corporate email or CIN account to manage host slots.
                </p>

                {/* Custom Credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Corporate / Enterprise Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="company1@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-[11px] text-emerald-600 hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    <span>{isLoading ? 'Authenticating Enterprise...' : 'Access Enterprise Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2 text-center">
                <div className="text-xs text-slate-600">
                  New corporate partner?{' '}
                  <Link to="/register?role=company" className="text-emerald-600 hover:text-emerald-700 font-bold underline">
                    Register Your Enterprise as Host Entity
                  </Link>
                </div>
                <div className="text-[11px] text-slate-400">
                  MCA Corporate Desk: corporate-support@pminternship.gov.in
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANEL 3: MINISTRY & NATIONAL ADMIN COMMAND CENTER */}
        {/* ========================================================================= */}
        {role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Hero: Ministry Command Center */}
            <div className="md:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-tricolor-strip" />

              <div className="space-y-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Ministry of Corporate Affairs
                    </span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      National Command & AI Engine
                    </h2>
                  </div>
                </div>

                {/* Hon'ble PM Vision Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/20 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400/60 flex-shrink-0">
                      <img
                        src="/pm_modi.jpg"
                        alt="Hon'ble Prime Minister"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Shri Narendra Modi</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Hon'ble Prime Minister of India
                      </div>
                      <div className="text-[9px] font-black text-amber-400 mt-1 uppercase tracking-wider">
                        Viksit Bharat 2047
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                    "Connecting one crore youth with practical industry experience in India's top 500 companies."
                  </p>
                </div>

                {/* Admin Engine Controls */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start space-x-2.5">
                    <Cpu className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Matching Engine:</strong> Coordinate national internship allocations based on skills, eligibility, and preference.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Reservation Monitoring:</strong> Monitor representation across SC, ST, OBC, EWS, and PwD categories in real-time.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Government of India · NIC Authenticated</span>
                <span className="text-amber-400 font-semibold">● Protected Node</span>
              </div>
            </div>

            {/* Right Form: Admin Login */}
            <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ministry Command Center</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">NIC Official Auth</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">National Admin Login</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Authorized government officers & system administrators only.
                </p>

                {/* Custom Credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Government Email ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@pminternship.gov.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Passcode / Token
                      </label>
                      <Link to="/forgot-password" className="text-[11px] text-amber-700 hover:underline">
                        Forgot Passcode?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all shadow-md shadow-slate-900/30 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate into Command Center'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 text-center">
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Notice: Access governed by Section 43 & 66 of Information Technology Act 2000. All authentication attempts and session activity are cryptographically logged.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Verification Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center space-x-4">
        <span>© {new Date().getFullYear()} Ministry of Corporate Affairs</span>
        <span>•</span>
        <span>National Informatics Centre (NIC)</span>
        <span>•</span>
        <span>Viksit Bharat 2047</span>
      </div>
    </div>
  );
};

export default LoginPage;
