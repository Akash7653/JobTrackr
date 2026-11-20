import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { CompanyAvatar } from '../applications/CompanyAvatar';
import { StatusBadge, WorkModeBadge } from '../common/Badge';
import { formatDate, formatSalaryRange } from '../../utils/formatters';

export const RecentApplicationsWidget: React.FC = () => {
  const { recentApplications, setActiveJob, openAddModal } = useJobContext();

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs dark:shadow-none flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Latest pipeline updates and additions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal()}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <Link
            to="/applications"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        {recentApplications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No applications yet. Click "Add" to start tracking!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setActiveJob(app)}
                className="py-3 px-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyAvatar company={app.company} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {app.company}
                      </span>
                      <WorkModeBadge mode={app.workMode} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{app.jobTitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {formatSalaryRange(
                        app.salaryMin,
                        app.salaryMax,
                        app.salaryCurrency,
                        app.salaryPeriod
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(app.appliedDate)}</span>
                  </div>

                  <StatusBadge status={app.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
