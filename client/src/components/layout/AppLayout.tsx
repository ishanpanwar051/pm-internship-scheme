import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';

export const AppLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Only render sidebar inside authenticated dashboard pages, never on the public landing or auth pages
  const isDashboardPage =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/company') ||
    location.pathname.startsWith('/intern');

  const showSidebar = Boolean(user && isDashboardPage);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900">
      <Navbar onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex overflow-x-hidden">
        {showSidebar && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <main
          className={`flex-1 w-full transition-all duration-150 ${
            showSidebar ? 'p-4 sm:p-6 lg:p-8' : 'p-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
