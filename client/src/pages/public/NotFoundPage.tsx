import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-5">
        <div className="text-5xl font-mono font-bold text-brand-indigo">404</div>
        <h2 className="text-xl font-semibold text-saas-primary">
          Page Not Found
        </h2>
        <p className="text-xs text-saas-muted leading-relaxed">
          The requested route or telemetry view does not exist or has been relocated within the intelligence platform.
        </p>
        <div className="flex justify-center pt-2">
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-brand-indigo hover:bg-brand-indigo-light text-white text-xs font-medium inline-flex items-center space-x-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Platform Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
