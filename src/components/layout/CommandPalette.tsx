import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Plus,
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Calendar,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { useTheme } from '../../context/ThemeContext';
import { CompanyAvatar } from '../applications/CompanyAvatar';
import { StatusBadge } from '../common/Badge';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    applications,
    setActiveJob,
    openAddModal,
  } = useJobContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Quick navigation actions
  const quickActions = useMemo(
    () => [
      {
        id: 'action-add',
        title: 'Add New Job Application',
        subtitle: 'Track a new opportunity',
        icon: <Plus className="w-4 h-4 text-indigo-400" />,
        action: () => openAddModal(),
      },
      {
        id: 'action-dashboard',
        title: 'Go to Overview',
        subtitle: 'Key metrics and activity overview',
        icon: <LayoutDashboard className="w-4 h-4 text-slate-400" />,
        action: () => navigate('/'),
      },
      {
        id: 'action-apps',
        title: 'Go to Applications',
        subtitle: 'Search, filter, and table view',
        icon: <Briefcase className="w-4 h-4 text-sky-400" />,
        action: () => navigate('/applications'),
      },
      {
        id: 'action-kanban',
        title: 'Go to Kanban Board',
        subtitle: 'Visual drag-and-drop workflow',
        icon: <KanbanSquare className="w-4 h-4 text-amber-400" />,
        action: () => navigate('/kanban'),
      },
      {
        id: 'action-calendar',
        title: 'Go to Calendar',
        subtitle: 'Interviews and milestone deadlines',
        icon: <Calendar className="w-4 h-4 text-purple-400" />,
        action: () => navigate('/calendar'),
      },
      {
        id: 'action-analytics',
        title: 'Go to Analytics',
        subtitle: 'Conversion funnels and salary data',
        icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
        action: () => navigate('/analytics'),
      },
      {
        id: 'action-settings',
        title: 'Go to Settings',
        subtitle: 'Manage profile, export data & preferences',
        icon: <Settings className="w-4 h-4 text-slate-400" />,
        action: () => navigate('/settings'),
      },
      {
        id: 'action-theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle theme preference',
        icon:
          theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          ),
        action: () => toggleTheme(),
      },
    ],
    [navigate, openAddModal, theme, toggleTheme]
  );

  // Filtered applications
  const filteredApps = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return applications
      .filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q) ||
          app.location.toLowerCase().includes(q) ||
          app.status.toLowerCase().includes(q) ||
          (app.recruiterName && app.recruiterName.toLowerCase().includes(q)) ||
          (app.notes && app.notes.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [applications, query]);

  // Combined active list for arrow key navigation
  const allItems = useMemo(() => {
    if (query.trim()) {
      return [
        ...filteredApps.map((app) => ({
          type: 'app' as const,
          item: app,
        })),
        ...quickActions
          .filter(
            (a) =>
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.subtitle.toLowerCase().includes(query.toLowerCase())
          )
          .map((act) => ({
            type: 'action' as const,
            item: act,
          })),
      ];
    }
    return quickActions.slice(0, 6).map((act) => ({
      type: 'action' as const,
      item: act,
    }));
  }, [filteredApps, query, quickActions]);

  const handleSelect = (index: number) => {
    const selected = allItems[index];
    if (!selected) return;
    setIsCommandPaletteOpen(false);

    if (selected.type === 'app') {
      setActiveJob(selected.item);
    } else {
      selected.item.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < allItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsCommandPaletteOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-slate-800/80 bg-slate-900/60">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search applications, actions, companies, or commands..."
                className="w-full bg-transparent py-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700/60 rounded-md">
                ESC
              </kbd>
            </div>

            {/* List Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {query && filteredApps.length > 0 && (
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                  Applications ({filteredApps.length})
                </div>
              )}

              {allItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No matching applications or commands found for "{query}"
                </div>
              ) : (
                allItems.map((entry, idx) => {
                  const isSelected = idx === selectedIndex;

                  if (entry.type === 'app') {
                    const app = entry.item;
                    return (
                      <div
                        key={app.id}
                        onClick={() => handleSelect(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/15 border border-indigo-500/30 text-white'
                            : 'hover:bg-slate-800/40 border border-transparent text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CompanyAvatar company={app.company} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-100 truncate">
                              {app.jobTitle}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {app.company} • {app.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <StatusBadge status={app.status} size="sm" />
                          <ArrowRight
                            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                              isSelected ? 'translate-x-0.5 text-indigo-400' : ''
                            }`}
                          />
                        </div>
                      </div>
                    );
                  }

                  const act = entry.item;
                  return (
                    <div
                      key={act.id}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/80 border border-slate-700/60 text-white'
                          : 'hover:bg-slate-800/30 border border-transparent text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                          {act.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-200">{act.title}</div>
                          <div className="text-xs text-slate-400">{act.subtitle}</div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform shrink-0 ${
                          isSelected ? 'translate-x-0.5 text-slate-300' : ''
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 px-4 bg-slate-900/90 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Quick jump & actions
              </span>
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="font-mono text-slate-400">↑</kbd> <kbd className="font-mono text-slate-400">↓</kbd></span>
                <span>Select: <kbd className="font-mono text-slate-400">↵</kbd></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
