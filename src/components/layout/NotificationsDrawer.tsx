import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, AlertTriangle, CheckCheck, Gift, X } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { formatRelativeDays } from '../../utils/formatters';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, applications, setActiveJob } =
    useJobContext();

  const handleItemClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    if (notif.jobId) {
      const app = applications.find((a) => a.id === notif.jobId);
      if (app) {
        setActiveJob(app);
      }
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'deadline':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'status':
        return <Gift className="w-4 h-4 text-emerald-400" />;
      default:
        return <Calendar className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-3.5 px-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Notifications</span>
                {notifications.some((n) => !n.read) && (
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-medium">
                    {notifications.filter((n) => !n.read).length} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No upcoming notifications or deadlines
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      notif.read ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/30' : 'bg-slate-50/80 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {formatRelativeDays(notif.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
