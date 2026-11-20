import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { Button } from '../common/Button';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { applications, upcomingInterviews, userProfile, openAddModal } = useJobContext();

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/applications',
      label: 'Applications',
      icon: Briefcase,
      badge: applications.length.toString(),
    },
    {
      to: '/kanban',
      label: 'Kanban Board',
      icon: KanbanSquare,
      badge: null,
    },
    {
      to: '/calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: upcomingInterviews.length > 0 ? `${upcomingInterviews.length} upcoming` : null,
      badgeHighlight: true,
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0D14] border-r border-slate-200 dark:border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="14" x="3" y="7" rx="3" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="12.01" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                JobTrackr
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Application Suite</span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        {isCollapsed ? (
          <button
            onClick={() => openAddModal()}
            className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-sm shadow-indigo-600/30"
            title="New Application"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <Button
            variant="primary"
            className="w-full justify-center shadow-md shadow-indigo-600/20"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Application
          </Button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 px-3 py-1 tracking-wider">
          {!isCollapsed ? 'Platform' : '•'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-xs dark:bg-indigo-600/15 dark:text-white dark:border-indigo-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        item.badgeHighlight
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 animate-pulse-subtle'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badgeHighlight && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Target Salary / Career Goal Widget (if expanded) */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Target Goal
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              ${(userProfile.targetSalary / 1000).toFixed(0)}k/yr
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    15,
                    (applications.filter((a) => a.status === 'Offer' || a.status === 'Interview')
                      .length /
                      Math.max(1, applications.length)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
            <span>
              {applications.filter((a) => a.status === 'Offer').length} Offer
              {applications.filter((a) => a.status === 'Offer').length === 1 ? '' : 's'}
            </span>
            <span>
              {applications.filter((a) => a.status === 'Interview').length} In Interview
            </span>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <NavLink
          to="/settings"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700/60 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-white">
                {userProfile.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {userProfile.targetRole}
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 z-30 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`fixed top-0 bottom-0 left-0 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
