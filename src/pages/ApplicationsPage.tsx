import React, { useState, useMemo } from 'react';
import {
  Plus,
  Briefcase,
  Download,
  Trash2,
  Edit3,
  Bookmark,
} from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import { ApplicationFilters, FilterState } from '../components/applications/ApplicationFilters';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { CompanyAvatar } from '../components/applications/CompanyAvatar';
import { WorkModeBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { downloadCSV } from '../utils/exportImport';
import { formatDate, formatSalaryRange } from '../utils/formatters';
import { JobStatus, JobApplication } from '../types/job';

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    openAddModal,
    openEditModal,
    setActiveJob,
    deleteApplication,
    updateStatus,
  } = useJobContext();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    workMode: 'All',
    employmentType: 'All',
    sortBy: 'date-desc',
    favoriteOnly: false,
    viewMode: 'table',
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDeleteOpen, setIsBatchDeleteOpen] = useState(false);
  const [singleDeleteJob, setSingleDeleteJob] = useState<JobApplication | null>(null);

  // Filter & Sort Logic
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase().trim();
          const matchCompany = app.company.toLowerCase().includes(q);
          const matchTitle = app.jobTitle.toLowerCase().includes(q);
          const matchLocation = app.location.toLowerCase().includes(q);
          const matchRecruiter = app.recruiterName && app.recruiterName.toLowerCase().includes(q);
          if (!matchCompany && !matchTitle && !matchLocation && !matchRecruiter) {
            return false;
          }
        }

        // Status
        if (filters.status !== 'All' && app.status !== filters.status) {
          return false;
        }

        // Work Mode
        if (filters.workMode !== 'All' && app.workMode !== filters.workMode) {
          return false;
        }

        // Employment Type
        if (filters.employmentType !== 'All' && app.employmentType !== filters.employmentType) {
          return false;
        }

        // Favorite
        if (filters.favoriteOnly && !app.favorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'date-desc') {
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        }
        if (filters.sortBy === 'date-asc') {
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        }
        if (filters.sortBy === 'company-asc') {
          return a.company.localeCompare(b.company);
        }
        if (filters.sortBy === 'company-desc') {
          return b.company.localeCompare(a.company);
        }
        if (filters.sortBy === 'salary-desc') {
          const salA = a.salaryMax || a.salaryMin || 0;
          const salB = b.salaryMax || b.salaryMin || 0;
          return salB - salA;
        }
        return 0;
      });
  }, [applications, filters]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredApplications.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    selectedIds.forEach((id) => deleteApplication(id));
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Job Applications
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage, filter, and track all your active career opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCSV(filteredApplications, 'jobtrackr-export.csv')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ApplicationFilters
        filters={filters}
        onChange={setFilters}
        totalCount={applications.length}
        filteredCount={filteredApplications.length}
      />

      {/* Batch Action Bar (if selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between animate-in fade-in duration-150">
          <span className="text-xs font-semibold text-indigo-300">
            {selectedIds.length} application{selectedIds.length === 1 ? '' : 's'} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsBatchDeleteOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Content: Table or Grid */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title={applications.length === 0 ? 'No applications yet' : 'No matching applications'}
          description={
            applications.length === 0
              ? 'Start tracking your career opportunities and interview milestones today.'
              : 'Try broadening your search or adjusting your status and work mode filters.'
          }
          actionLabel={applications.length === 0 ? 'Add First Application' : 'Clear Filters'}
          onAction={() => {
            if (applications.length === 0) {
              openAddModal();
            } else {
              setFilters({
                search: '',
                status: 'All',
                workMode: 'All',
                employmentType: 'All',
                sortBy: 'date-desc',
                favoriteOnly: false,
                viewMode: filters.viewMode,
              });
            }
          }}
        />
      ) : filters.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredApplications.length > 0 &&
                        selectedIds.length === filteredApplications.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Salary Range</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplications.map((app) => {
                  const isSelected = selectedIds.includes(app.id);
                  return (
                    <tr
                      key={app.id}
                      onClick={() => setActiveJob(app)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(app.id, e as any)}
                          className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <CompanyAvatar company={app.company} size="sm" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                              {app.company}
                            </div>
                            <div className="text-slate-400 truncate">{app.jobTitle}</div>
                          </div>
                          {app.favorite && (
                            <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value as JobStatus)}
                          className="bg-slate-900 border border-slate-700 rounded-md text-[11px] font-medium py-1 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="Wishlist">Wishlist</option>
                          <option value="Applied">Applied</option>
                          <option value="Assessment">Assessment</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <WorkModeBadge mode={app.workMode} size="sm" />
                      </td>

                      <td className="py-3 px-4 text-slate-400 truncate max-w-[120px]">
                        {app.location}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-300">
                        {formatSalaryRange(
                          app.salaryMin,
                          app.salaryMax,
                          app.salaryCurrency,
                          app.salaryPeriod
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(app.appliedDate)}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSingleDeleteJob(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Batch Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBatchDeleteOpen}
        onClose={() => setIsBatchDeleteOpen(false)}
        onConfirm={handleBatchDelete}
        title="Delete Selected Applications"
        message={`Are you sure you want to delete ${selectedIds.length} application(s)? This action cannot be undone.`}
        confirmText="Delete Selected"
        variant="danger"
      />

      {/* Single Delete Confirmation */}
      {singleDeleteJob && (
        <ConfirmDialog
          isOpen={Boolean(singleDeleteJob)}
          onClose={() => setSingleDeleteJob(null)}
          onConfirm={() => {
            deleteApplication(singleDeleteJob.id);
            setSingleDeleteJob(null);
          }}
          title="Delete Application"
          message={`Are you sure you want to delete ${singleDeleteJob.jobTitle} at ${singleDeleteJob.company}?`}
          confirmText="Delete Application"
          variant="danger"
        />
      )}
    </div>
  );
};
