import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import {
  getMonthCalendarGrid,
  formatMonthName,
  formatISODate,
} from '../utils/dateUtils';
import { formatDateTime, formatDate, formatRelativeDays } from '../utils/formatters';
import { CompanyAvatar } from '../components/applications/CompanyAvatar';
import { Button } from '../components/common/Button';
import { JobApplication } from '../types/job';

interface CalendarEvent {
  id: string;
  type: 'interview' | 'deadline' | 'followup' | 'applied';
  title: string;
  dateStr: string; // YYYY-MM-DD
  timeStr?: string;
  application: JobApplication;
}

export const CalendarPage: React.FC = () => {
  const { applications, setActiveJob, openAddModal } = useJobContext();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    formatISODate(new Date())
  );
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'interview' | 'deadline' | 'followup'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatISODate(today));
  };

  // Compile all events across applications
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];

    applications.forEach((app) => {
      // 1. Interviews
      if (app.interviewDate) {
        const dStr = app.interviewDate.split('T')[0];
        events.push({
          id: `int-${app.id}`,
          type: 'interview',
          title: `Interview: ${app.company}`,
          dateStr: dStr,
          timeStr: app.interviewDate,
          application: app,
        });
      }

      // 2. Assessment Deadlines
      if (app.assessmentDeadline) {
        events.push({
          id: `dead-${app.id}`,
          type: 'deadline',
          title: `Take-home Due: ${app.company}`,
          dateStr: app.assessmentDeadline,
          application: app,
        });
      }

      // 3. Follow-up Dates
      if (app.followUpDate) {
        events.push({
          id: `fol-${app.id}`,
          type: 'followup',
          title: `Follow-up: ${app.company}`,
          dateStr: app.followUpDate,
          application: app,
        });
      }

      // 4. Application Submission Date
      if (app.appliedDate) {
        events.push({
          id: `app-${app.id}`,
          type: 'applied',
          title: `Applied to ${app.company}`,
          dateStr: app.appliedDate,
          application: app,
        });
      }
    });

    return events;
  }, [applications]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'all') return allEvents;
    return allEvents.filter((e) => e.type === eventTypeFilter);
  }, [allEvents, eventTypeFilter]);

  // Calendar Grid Days
  const calendarDays = useMemo(() => {
    return getMonthCalendarGrid(year, month);
  }, [year, month]);

  // Events for selected day
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.dateStr === selectedDateStr);
  }, [filteredEvents, selectedDateStr]);

  // Upcoming interviews and deadlines for the month sidebar
  const upcomingSchedule = useMemo(() => {
    const todayStr = formatISODate(new Date());
    return filteredEvents
      .filter((e) => e.dateStr >= todayStr && e.type !== 'applied')
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
      .slice(0, 8);
  }, [filteredEvents]);

  const getEventBadge = (event: CalendarEvent) => {
    switch (event.type) {
      case 'interview':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30';
      case 'deadline':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30';
      case 'followup':
        return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Interview & Milestone Calendar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Keep track of interviews, assessment deadlines, and follow-up milestones.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-1 shadow-xs dark:shadow-none">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 px-3 min-w-[130px] text-center">
              {formatMonthName(year, month)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {[
          { id: 'all', label: 'All Milestones' },
          { id: 'interview', label: 'Interviews Only' },
          { id: 'deadline', label: 'Deadlines' },
          { id: 'followup', label: 'Follow-ups' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setEventTypeFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors border shrink-0 ${
              eventTypeFilter === tab.id
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-600/15 dark:text-indigo-300 dark:border-indigo-500/30'
                : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calendar Grid + Agenda Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main 7-Day Month Grid (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 overflow-hidden shadow-xs dark:shadow-none">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center font-semibold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((calDay) => {
              const dayEvents = filteredEvents.filter((e) => e.dateStr === calDay.dateString);
              const isSelected = selectedDateStr === calDay.dateString;
              const hasInterview = dayEvents.some((e) => e.type === 'interview');
              const hasDeadline = dayEvents.some((e) => e.type === 'deadline');

              return (
                <div
                  key={calDay.dateString}
                  onClick={() => setSelectedDateStr(calDay.dateString)}
                  className={`min-h-[75px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/20 ring-1 ring-indigo-500/50'
                      : calDay.isToday
                      ? 'border-indigo-300 dark:border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-500/5'
                      : calDay.isCurrentMonth
                      ? 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'border-slate-100 dark:border-slate-900/40 bg-slate-50/40 dark:bg-slate-950/30 opacity-40 hover:opacity-70'
                  }`}
                >
                  {/* Day Number + Dots */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold rounded-md w-5 h-5 flex items-center justify-center ${
                        calDay.isToday
                          ? 'bg-indigo-600 text-white font-bold'
                          : calDay.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {calDay.dayNumber}
                    </span>

                    <div className="flex items-center gap-1">
                      {hasInterview && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />}
                      {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />}
                    </div>
                  </div>

                  {/* Event Badges List on Day */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveJob(ev.application);
                        }}
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded truncate font-medium border cursor-pointer hover:brightness-110 transition-all ${getEventBadge(
                          ev
                        )}`}
                        title={ev.title}
                      >
                        {ev.application.company}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate font-medium">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Upcoming Milestone Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Selected Day Detail Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs dark:shadow-none">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                  Selected Date
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatDate(selectedDateStr)}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {selectedDayEvents.length} event{selectedDayEvents.length === 1 ? '' : 's'}
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No events or deadlines on this date.
              </p>
            ) : (
              <div className="space-y-2.5">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setActiveJob(ev.application)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <CompanyAvatar company={ev.application.company} size="sm" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate block">
                          {ev.application.company}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {ev.application.jobTitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/40">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{ev.type}</span>
                      {ev.timeStr && <span>{formatDateTime(ev.timeStr).split(',')[1]}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Schedule Summary */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs dark:shadow-none">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Upcoming Milestones</span>
              </h3>
            </div>

            {upcomingSchedule.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                No upcoming interviews or deadlines.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingSchedule.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setActiveJob(ev.application)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                        {ev.application.company}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {ev.application.jobTitle}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 shrink-0">
                      {formatRelativeDays(ev.dateStr)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
