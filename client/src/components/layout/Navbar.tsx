import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Menu,
  Search,
  Cpu,
  Sparkles,
  Command,
  ChevronDown,
  Building2,
  LogIn,
  PhoneCall,
  AlertTriangle,
  X,
} from 'lucide-react';
import NotificationDropdown from '../ui/NotificationDropdown';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const isDashboardPage =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/company') ||
    location.pathname.startsWith('/intern');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes('/admin/dashboard')) return 'Overview';
    if (p.includes('/admin/run-engine')) return 'Matching Engine';
    if (p.includes('/admin/allocations')) return 'Allocations Registry';
    if (p.includes('/admin/users')) return 'Candidate Governance';
    if (p.includes('/admin/companies')) return 'Host Organizations';
    if (p.includes('/admin/reports')) return 'System Analytics';
    if (p.includes('/admin/notifications')) return 'Directives';
    if (p.includes('/admin/system-config')) return 'Configuration';
    if (p.includes('/admin/audit-logs')) return 'Audit Trail';
    if (p.includes('/company/dashboard')) return 'Enterprise Console';
    if (p.includes('/company/slots')) return 'Vacancy Slots';
    if (p.includes('/company/accepted-interns')) return 'Allocated Interns';
    if (p.includes('/company/profile')) return 'Organization Profile';
    if (p.includes('/intern/dashboard')) return 'Candidate Dashboard';
    if (p.includes('/intern/explore')) return 'Explore Opportunities';
    if (p.includes('/intern/allocation')) return 'AI Allocation Status';
    if (p.includes('/intern/profile')) return 'Candidate Profile';
    return 'National Portal';
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs w-full">
      {/* 1. Official Topmost Tier 1 Bar */}
      <div className="bg-[#FAFBFD] border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600">
        <div className="w-full flex items-center justify-between">
          {/* Left: Official Ministry Attribution with Real Flag Image */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-medium text-slate-700">
            <img
              src="/indian_flag.jpg"
              alt="National Flag of India"
              className="w-4 h-3 rounded-xs object-cover border border-slate-300 shadow-2xs shrink-0"
            />
            <span className="font-bold text-slate-900">भारत सरकार</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-800">Government of India</span>
            <span className="text-slate-300 hidden md:inline">·</span>
            <span className="hidden md:inline text-slate-600">
              Ministry of Corporate Affairs & Ministry of Education
            </span>
          </div>

          {/* Right: Important Note & Helpline Pills */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setNoteModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FFF1F1] hover:bg-[#FFE4E4] text-[#C53030] border border-[#FED7D7] text-[11px] font-semibold transition-colors"
            >
              <AlertTriangle className="w-3 h-3 text-[#E53E3E]" />
              <span>Important Note</span>
            </button>

            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA] text-[11px] font-semibold transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#EA580C]" />
              <span>Helpline & Support</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Branding cluster */}
          <div className="flex items-center space-x-3 shrink-0">
            {user && onToggleMobileMenu && isDashboardPage && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                aria-label="Open Navigation Drawer"
                className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2.5 group">
              {/* Stylized Tricolor "N" National Internship Portal Logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#138808] via-white to-[#FF9933] p-0.5 shadow-2xs border border-slate-300 shrink-0">
                <div className="w-full h-full bg-white rounded-md flex items-center justify-center font-black text-sm text-[#0F172A] tracking-tighter">
                  <span className="text-[#FF9933]">N</span>
                  <span className="text-[#138808]">I</span>
                  <span className="text-[#1A237E] text-[10px]">P</span>
                </div>
              </div>

              {/* AICTE Gold Seal Badge */}
              <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-300 shadow-2xs shrink-0">
                <span className="text-[10px] font-black text-amber-700">AICTE</span>
              </div>

              {/* Satyameva Jayate Lion Capital Emblem */}
              <div className="hidden lg:flex flex-col border-l border-slate-200 pl-2.5 shrink-0">
                <div className="text-[9px] font-bold text-slate-700 tracking-wider leading-tight">
                  सत्यमेव जयते
                </div>
                <div className="text-[8px] font-semibold text-slate-500 uppercase leading-none mt-0.5">
                  GOVT. OF INDIA
                </div>
              </div>

              {/* Main Brand Title */}
              <div className="border-l border-slate-200 pl-2.5 text-left">
                <div className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight">
                  NATIONAL INTERNSHIP PORTAL
                </div>
                <div className="text-[10px] text-orange-600 font-bold tracking-wider uppercase leading-none mt-0.5">
                  PM Internship Scheme
                </div>
              </div>
            </Link>

            {/* Breadcrumb if inside authenticated dashboard */}
            {user && isDashboardPage && (
              <div className="hidden md:flex items-center space-x-2 pl-3 ml-1 border-l border-slate-200 text-xs">
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-700">{getBreadcrumb()}</span>
              </div>
            )}
          </div>

          {/* Center: Contextual Navigation Links tailored for each user role */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-1 text-xs font-bold text-slate-700">
              {user.role === 'intern' && (
                <>
                  <Link
                    to="/intern/dashboard"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/intern/dashboard'
                        ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/intern/explore"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/intern/explore'
                        ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Browse Internships
                  </Link>
                  <Link
                    to="/intern/profile?step=5"
                    className="px-3 py-1.5 rounded-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors inline-flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Upload CV (AI)</span>
                  </Link>
                  <Link
                    to="/intern/allocation"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/intern/allocation'
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Allotment Letter
                  </Link>
                </>
              )}

              {user.role === 'company' && (
                <>
                  <Link
                    to="/company/dashboard"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/company/dashboard'
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Company Console
                  </Link>
                  <Link
                    to="/company/slots"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/company/slots'
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Post / Manage Slots
                  </Link>
                  <Link
                    to="/company/accepted-interns"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/company/accepted-interns'
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Allocated Interns
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      location.pathname === '/admin/dashboard'
                        ? 'bg-slate-900 text-amber-400 font-extrabold'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    National Overview
                  </Link>
                  <Link
                    to="/admin/run-engine"
                    className="px-3.5 py-1.5 rounded-full text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors font-bold inline-flex items-center space-x-1"
                  >
                    <Cpu className="w-3 h-3 text-orange-600" />
                    <span>Run AI Allocation Engine</span>
                  </Link>
                  <Link
                    to="/admin/allocations"
                    className="px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    Allocations Registry
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="hidden xl:flex items-center space-x-1 text-xs font-bold text-slate-700">
              <Link
                to="/intern/explore"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>Browse Opportunities</span>
              </Link>

              <Link
                to="/login?role=intern"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>Student Skilling</span>
              </Link>

              <Link
                to="/login?role=company"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>Corporate Hosts</span>
              </Link>

              <Link
                to="/admin/run-engine"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors font-bold"
              >
                <Cpu className="w-3 h-3 text-orange-600" />
                <span>AI Allocation Engine</span>
              </Link>
            </div>
          )}

          {/* Right Side: Actions (Different for Dashboard vs Public) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                {/* Search Bar for Authenticated Users */}
                <div className="hidden lg:flex items-center w-56 xl:w-64">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search roles, candidates..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Live Engine Status Pill */}
                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-bold font-mono shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>ONLINE</span>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications((p) => !p)}
                    aria-label="Notifications"
                    className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
                  </button>
                  {showNotifications && (
                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* User Avatar, Name & Logout */}
                <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-xs font-black text-orange-900 uppercase shadow-2xs shrink-0">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-black text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-orange-600 font-bold uppercase leading-none mt-0.5">
                      {user.role}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign out"
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 1. Hire Interns Pill Button */}
                <Link
                  to="/login?role=company"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-colors shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Hire Interns</span>
                </Link>

                {/* 2. Login Dropdown Pill Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className="inline-flex items-center space-x-1 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-colors shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Login</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {loginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs space-y-1 animate-fade-in">
                      <Link
                        to="/login?role=intern"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold transition-colors"
                      >
                        🎓 Student / Candidate Login
                      </Link>
                      <Link
                        to="/login?role=company"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold transition-colors"
                      >
                        🏢 Enterprise / Ministry Login
                      </Link>
                      <Link
                        to="/login?role=admin"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-purple-50 text-slate-800 font-semibold transition-colors"
                      >
                        ⚡ National Admin / AI Engine
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. Register Free Lime-Green Pill Button */}
                <Link
                  to="/register?role=intern"
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-black transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Register Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Important Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  Government Advisory & Important Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Zero Fee Policy:</strong> The National Internship Portal and PM Internship Scheme do not charge any registration, application, or processing fees from students.
              </p>
              <p>
                <strong>Affirmative Action Quotas:</strong> Candidates from SC, ST, OBC, and PwD cohorts are allocated transparently under statutory national reservation guidelines.
              </p>
              <p>
                <strong>Direct Benefit Transfer (DBT):</strong> Monthly stipends (₹5,000/mo) are disbursed directly to Aadhaar-seeded bank accounts through PFMS.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpline & Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-orange-600">
                <PhoneCall className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  National Candidate Support
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-700 space-y-3">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-[11px] font-bold text-orange-800 uppercase">Toll-Free Helpline</div>
                <div className="text-lg font-black text-orange-950 font-mono mt-0.5">1800-111-2027</div>
                <div className="text-[10px] text-orange-700">Mon–Sat, 09:00 AM – 06:00 PM IST</div>
              </div>
              <div className="text-xs text-slate-600">
                Email Grievance Cell: <span className="font-semibold text-slate-900">support.internship@gov.in</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;