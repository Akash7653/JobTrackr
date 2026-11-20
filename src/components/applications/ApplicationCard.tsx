import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  ExternalLink,
  Bookmark,
  DollarSign,
  Clock,
} from 'lucide-react';
import { JobApplication } from '../../types/job';
import { useJobContext } from '../../context/JobContext';
import { CompanyAvatar } from './CompanyAvatar';
import { StatusBadge, WorkModeBadge, PriorityBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  formatDate,
  formatSalaryRange,
  formatRelativeDays,
} from '../../utils/formatters';

export interface ApplicationCardProps {
  application: JobApplication;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const { setActiveJob, openEditModal, deleteApplication, toggleFavorite } =
    useJobContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        onClick={() => setActiveJob(application)}
        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:shadow-card-dark transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
      >
        {/* Top Header: Avatar, Company, Role, Menu */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <CompanyAvatar company={application.company} size="md" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-300 block truncate group-hover:text-white transition-colors">
                  {application.company}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{application.location}</span>
                </span>
              </div>
            </div>

            {/* Favorite & Options */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleFavorite(application.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  application.favorite
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Bookmark"
              >
                <Bookmark
                  className={`w-4 h-4 ${application.favorite ? 'fill-amber-400' : ''}`}
                />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-8 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-30 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openEditModal(application);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      Edit Application
                    </button>
                    {application.jobUrl && (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        View Job Posting
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-3">
            {application.jobTitle}
          </h3>

          {/* Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <StatusBadge status={application.status} size="sm" />
            <WorkModeBadge mode={application.workMode} size="sm" />
            <PriorityBadge priority={application.priority} size="sm" />
          </div>
        </div>

        {/* Footer Details: Salary & Important Dates */}
        <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              Salary:
            </span>
            <span className="font-semibold text-slate-200">
              {formatSalaryRange(
                application.salaryMin,
                application.salaryMax,
                application.salaryCurrency,
                application.salaryPeriod
              )}
            </span>
          </div>

          {application.interviewDate ? (
            <div className="flex items-center justify-between text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              <span className="text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                Interview:
              </span>
              <span className="font-semibold">{formatRelativeDays(application.interviewDate)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Applied:
              </span>
              <span>{formatDate(application.appliedDate)}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => deleteApplication(application.id)}
        title="Delete Application"
        message={`Are you sure you want to delete ${application.jobTitle} at ${application.company}?`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};
