import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { CompanyAvatar } from '../applications/CompanyAvatar';
import { formatDateTime, formatRelativeDays } from '../../utils/formatters';

export const UpcomingInterviewsWidget: React.FC = () => {
  const { upcomingInterviews, setActiveJob } = useJobContext();

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs dark:shadow-none flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Upcoming Interviews
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Next rounds and scheduled panels</p>
          </div>
        </div>

        <Link
          to="/calendar"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 space-y-2.5">
        {upcomingInterviews.length === 0 ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-transparent">
            <Clock className="w-6 h-6 text-slate-400 dark:text-slate-600 mb-2" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">No interviews currently scheduled</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Schedule dates on any application card to see them here
            </p>
          </div>
        ) : (
          upcomingInterviews.slice(0, 4).map((app) => (
            <div
              key={app.id}
              onClick={() => setActiveJob(app)}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 dark:border-slate-800/80 dark:hover:border-slate-700/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CompanyAvatar company={app.company} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                      {app.company}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-medium border border-purple-500/20">
                      {formatRelativeDays(app.interviewDate)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{app.jobTitle}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatDateTime(app.interviewDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveJob(app);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors"
                  title="Prepare for Interview"
                >
                  <ArrowUpRight className="w-4 h-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
