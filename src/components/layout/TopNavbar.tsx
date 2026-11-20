import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Settings,
  Download,
  RotateCcw,
  User,
  ChevronRight,
} from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationsDrawer } from './NotificationsDrawer';
import { downloadJSON } from '../../utils/exportImport';

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const {
    openAddModal,
    setIsCommandPaletteOpen,
    notifications,
    userProfile,
    applications,
    resetToSampleData,
  } = useJobContext();
  const { theme, toggleTheme } = useTheme();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute page title and breadcrumbs
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard Overview', category: 'Overview' };
    if (path.startsWith('/applications')) return { title: 'Job Applications', category: 'Tracking' };
    if (path.startsWith('/kanban')) return { title: 'Kanban Board', category: 'Workflow' };
    if (path.startsWith('/calendar')) return { title: 'Interview Calendar', category: 'Schedule' };
    if (path.startsWith('/analytics')) return { title: 'Career Analytics', category: 'Insights' };
    if (path.startsWith('/settings')) return { title: 'Preferences & Settings', category: 'Account' };
    return { title: 'JobTrackr', category: 'App' };
  };

  const pageInfo = getPageInfo();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span>JobTrackr</span>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-600 dark:text-slate-400">{pageInfo.category}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search trigger button */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 dark:bg-slate-900/80 dark:hover:bg-slate-800/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-all w-64 lg:w-80 text-left shadow-xs"
      >
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <span className="flex-1 truncate">Search applications, companies...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-white border border-slate-300 dark:text-slate-400 dark:bg-slate-800/80 dark:border-slate-700/60 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Add Application Button */}
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm shadow-indigo-600/30 transition-all border border-indigo-500/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Application</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-800/60 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#0A0D14]" />
            )}
          </button>
          <NotificationsDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700/60"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800/80 mb-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{userProfile.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Profile Details
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                App Preferences
              </Link>

              <button
                onClick={() => {
                  downloadJSON({ applications, userProfile }, 'jobtrackr-backup.json');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Export Backup (JSON)
              </button>

              <div className="border-t border-slate-200 dark:border-slate-800/80 my-1" />

              <button
                onClick={() => {
                  resetToSampleData();
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors text-left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample Data
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
