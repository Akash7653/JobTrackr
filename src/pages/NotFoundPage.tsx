import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-black mb-4">
        404
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved to another location.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
