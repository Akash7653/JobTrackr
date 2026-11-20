import React from 'react';
import { Search, X, LayoutGrid, List, RotateCcw, Bookmark } from 'lucide-react';
import { JobStatus, WorkMode, EmploymentType } from '../../types/job';

export interface FilterState {
  search: string;
  status: JobStatus | 'All';
  workMode: WorkMode | 'All';
  employmentType: EmploymentType | 'All';
  sortBy: 'date-desc' | 'date-asc' | 'company-asc' | 'company-desc' | 'salary-desc';
  favoriteOnly: boolean;
  viewMode: 'table' | 'grid';
}

interface ApplicationFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onChange,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    Boolean(filters.search) ||
    filters.status !== 'All' ||
    filters.workMode !== 'All' ||
    filters.employmentType !== 'All' ||
    filters.favoriteOnly;

  const handleReset = () => {
    onChange({
      ...filters,
      search: '',
      status: 'All',
      workMode: 'All',
      employmentType: 'All',
      favoriteOnly: false,
    });
  };

  return (
    <div className="space-y-3.5">
      {/* Top Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search company, job title, or location..."
            className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/80"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Filter Reset */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Favorite Only Toggle */}
          <button
            onClick={() => onChange({ ...filters, favoriteOnly: !filters.favoriteOnly })}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              filters.favoriteOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filters.favoriteOnly ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Table / Grid View Switcher */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onChange({ ...filters, viewMode: 'table' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filters.viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChange({ ...filters, viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filters.viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Filters Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
          className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Wishlist">Wishlist</option>
          <option value="Applied">Applied</option>
          <option value="Assessment">Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Work Mode Filter */}
        <select
          value={filters.workMode}
          onChange={(e) => onChange({ ...filters, workMode: e.target.value as any })}
          className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>

        {/* Employment Type */}
        <select
          value={filters.employmentType}
          onChange={(e) => onChange({ ...filters, employmentType: e.target.value as any })}
          className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>

        {/* Sort Order */}
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
          className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ml-auto"
        >
          <option value="date-desc">Newest Date</option>
          <option value="date-asc">Oldest Date</option>
          <option value="company-asc">Company (A-Z)</option>
          <option value="company-desc">Company (Z-A)</option>
          <option value="salary-desc">Highest Salary</option>
        </select>

        <span className="text-xs text-slate-500 font-medium ml-1">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>
    </div>
  );
};
