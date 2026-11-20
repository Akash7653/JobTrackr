import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  User,
  Mail,
  Bookmark,
  Send,
} from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { CompanyAvatar } from './CompanyAvatar';
import { WorkModeBadge, PriorityBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Button } from '../common/Button';
import { JobStatus } from '../../types/job';
import {
  formatDate,
  formatDateTime,
  formatSalaryRange,
  formatRelativeDays,
} from '../../utils/formatters';

export const ApplicationDetailDrawer: React.FC = () => {
  const {
    activeJob,
    setActiveJob,
    openEditModal,
    deleteApplication,
    updateStatus,
    toggleFavorite,
    updateApplication,
  } = useJobContext();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  if (!activeJob) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updatedNotes = activeJob.notes
      ? `${activeJob.notes}\n\n[${new Date().toLocaleDateString('en-US')}] ${newNote.trim()}`
      : `[${new Date().toLocaleDateString('en-US')}] ${newNote.trim()}`;

    updateApplication(activeJob.id, { notes: updatedNotes });
    setNewNote('');
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveJob(null)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <CompanyAvatar company={activeJob.company} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
                        {activeJob.jobTitle}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{activeJob.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {activeJob.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFavorite(activeJob.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      activeJob.favorite
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                    }`}
                    title={activeJob.favorite ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${activeJob.favorite ? 'fill-amber-500' : ''}`}
                    />
                  </button>

                  <button
                    onClick={() => openEditModal(activeJob)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors"
                    title="Edit application"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveJob(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors ml-1"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status and Quick Action Strip */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={activeJob.status}
                    onChange={(e) => updateStatus(activeJob.id, e.target.value as JobStatus)}
                    className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <WorkModeBadge mode={activeJob.workMode} />
                  <PriorityBadge priority={activeJob.priority} />
                  {activeJob.jobUrl && (
                    <a
                      href={activeJob.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline ml-1"
                    >
                      <span>Posting</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Highlight Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      Compensation
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatSalaryRange(
                        activeJob.salaryMin,
                        activeJob.salaryMax,
                        activeJob.salaryCurrency,
                        activeJob.salaryPeriod
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                      Applied Date
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(activeJob.appliedDate)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                      Interview
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {activeJob.interviewDate ? (
                        <span className="text-purple-600 dark:text-purple-300">
                          {formatRelativeDays(activeJob.interviewDate)}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-normal">Not scheduled</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Important Dates & Deadlines */}
                {(activeJob.interviewDate ||
                  activeJob.assessmentDeadline ||
                  activeJob.followUpDate) && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/5 border border-indigo-200/80 dark:border-indigo-500/20 space-y-2">
                    <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Milestone Schedule
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      {activeJob.interviewDate && (
                        <div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Interview Date</div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDateTime(activeJob.interviewDate)}
                          </div>
                        </div>
                      )}
                      {activeJob.assessmentDeadline && (
                        <div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Take-home Due</div>
                          <div className="font-medium text-amber-600 dark:text-amber-300">
                            {formatDate(activeJob.assessmentDeadline)}
                          </div>
                        </div>
                      )}
                      {activeJob.followUpDate && (
                        <div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Follow-up Target</div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDate(activeJob.followUpDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recruiter / Contacts */}
                {(activeJob.recruiterName || activeJob.recruiterEmail) && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Contact & Recruiter
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                          {activeJob.recruiterName ? activeJob.recruiterName[0] : 'R'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                            {activeJob.recruiterName || 'Talent Acquisition'}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Primary Contact</div>
                        </div>
                      </div>

                      {activeJob.recruiterEmail && (
                        <a
                          href={`mailto:${activeJob.recruiterEmail}`}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-500/20"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{activeJob.recruiterEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                {activeJob.jobDescription && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Job Description
                    </h3>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeJob.jobDescription}
                    </div>
                  </div>
                )}

                {/* Notes & Activity Log */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Notes & Discussion
                  </h3>

                  {activeJob.notes && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                      {activeJob.notes}
                    </div>
                  )}

                  {/* Add Quick Note Form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an update or interview note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button type="submit" variant="secondary" size="sm" disabled={!newNote.trim()}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>

                {/* Application Timeline Audit Trail */}
                {activeJob.timeline && activeJob.timeline.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Application Journey
                    </h3>
                    <div className="relative pl-6 space-y-4 border-l border-slate-200 dark:border-slate-800 ml-2">
                      {activeJob.timeline.map((entry) => (
                        <div key={entry.id} className="relative group">
                          {/* Dot on line */}
                          <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500" />
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {entry.status}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {formatDate(entry.date)}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          deleteApplication(activeJob.id);
          setActiveJob(null);
        }}
        title="Delete Job Application"
        message={`Are you sure you want to delete ${activeJob.jobTitle} at ${activeJob.company}? This action cannot be undone.`}
        confirmText="Delete Application"
        variant="danger"
      />
    </>
  );
};
