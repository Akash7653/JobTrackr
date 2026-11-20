import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MapPin, Clock, Bookmark } from 'lucide-react';
import { JobApplication } from '../../types/job';
import { useJobContext } from '../../context/JobContext';
import { CompanyAvatar } from '../applications/CompanyAvatar';
import { WorkModeBadge, PriorityBadge } from '../common/Badge';
import { formatSalaryRange, formatRelativeDays, formatDate } from '../../utils/formatters';

interface KanbanCardProps {
  application: JobApplication;
  index: number;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ application, index }) => {
  const { setActiveJob, toggleFavorite } = useJobContext();

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setActiveJob(application)}
          className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 cursor-grab active:cursor-grabbing select-none group relative shadow-xs dark:shadow-none ${
            snapshot.isDragging
              ? 'border-indigo-500 shadow-2xl scale-[1.02] bg-white dark:bg-slate-800 rotate-1 z-50 ring-2 ring-indigo-500/30'
              : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-md'
          }`}
        >
          {/* Top Row: Company Avatar + Company Name + Bookmark */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <CompanyAvatar company={application.company} size="sm" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  {application.company}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                  <span className="truncate">{application.location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleFavorite(application.id)}
                className={`p-1 rounded-md transition-colors ${
                  application.favorite
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${application.favorite ? 'fill-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Job Title */}
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2.5">
            {application.jobTitle}
          </h4>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <WorkModeBadge mode={application.workMode} size="sm" />
            <PriorityBadge priority={application.priority} size="sm" />
          </div>

          {/* Card Footer: Dates or Salary */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {application.salaryMin || application.salaryMax ? (
              <span className="font-medium text-slate-800 dark:text-slate-300 truncate">
                {formatSalaryRange(
                  application.salaryMin,
                  application.salaryMax,
                  application.salaryCurrency,
                  application.salaryPeriod
                )}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {formatDate(application.appliedDate)}
              </span>
            )}

            {application.interviewDate && (
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-500/15 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/20 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                {formatRelativeDays(application.interviewDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
