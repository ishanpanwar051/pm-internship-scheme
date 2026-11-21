import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';
import { GraduationCap, Building2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, User, Mail, Phone, Lock, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get('role');
  const initialRole: Role = urlRole === 'company' ? 'company' : 'intern';

  const [step, setStep] = useState<1 | 2 | 3>(urlRole ? 2 : 1);
  const [role, setRole] = useState<Role>(initialRole);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Information Technology');

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleStep1 = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const assignedRole = role === 'company' ? 'company' : 'intern';
      await register({
        name: assignedRole === 'company' ? companyName : name,
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: assignedRole,
        companyName,
        sector,
      });

      setStep(3);
      toast.success('Registration completed successfully!');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative">
        <div className="text-center mb-6 space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the National Internship Portal & AI Allocation Platform
          </p>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-20 h-1 mx-2 rounded transition-all ${
                    step > s ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900">Select your role</h2>
              <p className="text-xs text-slate-500 mt-1">
                How do you want to use the allocation platform?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                onClick={() => handleStep1('intern')}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/40 cursor-pointer transition-all flex items-center space-x-4 group shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Student / Intern Applicant
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Build your profile, verify skills, and get matched to top internships.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleStep1('company')}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center space-x-4 group shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Organization / Company
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish internship opportunities and receive AI-matched candidates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Account Details Form */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Registering as: {role === 'intern' ? 'Student' : 'Company'}
              </span>
            </div>

            {role === 'company' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech Pvt. Ltd."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all cursor-pointer"
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                      <option value="Heavy Manufacturing">Heavy Manufacturing</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                      <option value="Infrastructure & Smart Cities">Infrastructure & Smart Cities</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Account Successfully Created!
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                Your account is registered. Complete your profile to get matched by the allocation
                engine.
              </p>
            </div>

            <button
              onClick={() => {
                if (role === 'company') navigate('/company/dashboard');
                else navigate('/intern/profile');
              }}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {role === 'company' ? 'Go to Organization Console' : 'Complete Profile & Upload Resume'}
            </button>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
