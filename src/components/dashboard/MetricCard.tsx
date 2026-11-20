import React from 'react';
import { motion } from 'framer-motion';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorScheme?: 'indigo' | 'emerald' | 'purple' | 'amber' | 'rose' | 'slate';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'indigo',
  onClick,
}) => {
  const schemeStyles = {
    indigo: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      accent: 'hover:shadow-sm dark:hover:shadow-glow-sm',
    },
    emerald: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      accent: 'hover:shadow-sm dark:hover:shadow-glow-sm',
    },
    purple: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-500/40',
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      accent: 'hover:shadow-sm dark:hover:shadow-glow-sm',
    },
    amber: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      accent: 'hover:shadow-sm dark:hover:shadow-glow-sm',
    },
    rose: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-rose-400 dark:hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      accent: 'hover:shadow-sm dark:hover:shadow-glow-sm',
    },
    slate: {
      border: 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      accent: '',
    },
  }[colorScheme];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border ${schemeStyles.border} ${schemeStyles.accent} shadow-xs dark:shadow-none transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">{title}</span>
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${schemeStyles.iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{subtitle}</p>}
    </motion.div>
  );
};
