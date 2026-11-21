import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';
import { GraduationCap, Building2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role>('intern');

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-saas-radial-glow pointer-events-none" />
      <div className="max-w-md w-full bg-saas-card p-8 rounded-2xl shadow-card border border-saas-border relative">
        <div className="text-center mb-6 space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-purple text-white flex items-center justify-center mx-auto shadow-glow-indigo">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Create an account
          </h2>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s
                    ? 'bg-brand-indigo text-white'
                    : 'bg-saas-surface text-saas-dim'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-20 h-1 mx-2 rounded ${
                    step > s ? 'bg-brand-indigo' : 'bg-saas-surface-hover'
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
              <h2 className="text-lg font-bold text-white">Select your role</h2>
              <p className="text-xs text-saas-muted mt-1">
                How do you want to use the allocation platform?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                onClick={() => handleStep1('intern')}
                className="p-6 rounded-xl border border-saas-border bg-saas-surface hover:border-brand-indigo hover:bg-saas-surface-hover cursor-pointer transition-all flex items-center space-x-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 text-brand-indigo-light flex items-center justify-center border border-brand-indigo/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Student / Intern Applicant</h3>
                  <p className="text-xs text-saas-muted">
                    Build your profile, upload a resume, and get matched to internships.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleStep1('company')}
                className="p-6 rounded-xl border border-saas-border bg-saas-surface hover:border-brand-purple hover:bg-saas-surface-hover cursor-pointer transition-all flex items-center space-x-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center border border-brand-purple/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Organization / Company</h3>
                  <p className="text-xs text-saas-muted">
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
            <div className="flex items-center justify-between border-b border-saas-border-subtle pb-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-saas-muted hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo-light">
                Registering as: {role === 'intern' ? 'Student' : role}
              </span>
            </div>

            {role === 'company' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Tech Pvt. Ltd."
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
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
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo placeholder-saas-dim"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-saas-border bg-saas-surface text-white outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-brand-indigo hover:bg-brand-indigo-light text-white font-bold text-xs uppercase tracking-wider shadow-glow-indigo transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer disabled:opacity-60"
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">
                Account Successfully Created!
              </h2>
              <p className="text-xs text-saas-muted mt-2 max-w-sm mx-auto">
                Your account is registered. Complete your profile to get matched by the allocation
                engine.
              </p>
            </div>

            <button
              onClick={() => {
                if (role === 'company') navigate('/company/dashboard');
                else navigate('/intern/profile');
              }}
              className="w-full py-3 px-4 rounded-xl bg-brand-indigo hover:bg-brand-indigo-light text-white font-bold text-xs uppercase tracking-wider shadow-glow-indigo transition-all cursor-pointer"
            >
              {role === 'company' ? 'Go to Organization Console' : 'Complete Profile & Upload Resume'}
            </button>
          </div>
        )}

        <div className="text-center text-xs text-saas-dim pt-6 border-t border-saas-border-subtle mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-indigo-light hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;