import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Cpu,
  Layers,
  BarChart3,
  Bell,
  Sparkles,
  UserCheck,
  Award,
  Search,
  CheckCircle2,
  Settings2,
  ScrollText,
  Webhook,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const adminNav = [
    { to: '/admin/dashboard', label: 'National Overview', icon: LayoutDashboard },
    { to: '/admin/run-engine', label: 'AI Matching Engine', icon: Cpu, badge: 'AI' },
    { to: '/admin/allocations', label: 'Allocations Registry', icon: Layers },
    { to: '/admin/users', label: 'Candidate Directory', icon: Users },
    { to: '/admin/companies', label: 'Host Organizations', icon: Building2 },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/notifications', label: 'Directives & Alerts', icon: Bell },
    { to: '/admin/system-config', label: 'System Configuration', icon: Settings2 },
    { to: '/admin/audit-logs', label: 'Security Audit Trail', icon: ScrollText },
  ];

  const companyNav = [
    { to: '/company/dashboard', label: 'Company Console', icon: LayoutDashboard },
    { to: '/company/slots', label: 'Post & Manage Slots', icon: Briefcase },
    { to: '/company/accepted-interns', label: 'Allocated Interns', icon: CheckCircle2 },
    { to: '/company/matches', label: 'Candidate AI Matches', icon: Webhook, badge: 'AI' },
    { to: '/company/profile', label: 'Organization Profile', icon: Building2 },
  ];

  const internNav = [
    { to: '/intern/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
    { to: '/intern/explore', label: 'Browse Internships', icon: Search },
    { to: '/intern/profile?step=5', label: 'Upload Resume & Skills', icon: FileText, badge: 'AI' },
    { to: '/intern/profile', label: 'My Profile & KYC', icon: UserCheck },
    { to: '/intern/allocation', label: 'Allotment & Offer Letter', icon: Award, badge: 'Govt' },
  ];

  let links = internNav;
  if (user.role === 'company') links = companyNav;
  if (user.role === 'admin') links = adminNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight tracking-tight uppercase">
                  National Portal
                </div>
                <div className="text-[10px] text-orange-600 font-bold tracking-wider uppercase">
                  {user.role} Workspace
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {user.role === 'intern' ? 'Student' : user.role} Navigation
            </div>

            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-800 font-bold border-l-3 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive ? 'text-orange-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-saas-border bg-saas-surface/40">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-800 uppercase">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">
                  {user.email}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase font-bold">
              {user.role === 'intern' ? 'Student' : user.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;