import React from 'react';
import { JobStatus, WorkMode, JobPriority } from '../../types/job';
import { getStatusConfig, getWorkModeConfig, getPriorityConfig } from '../../utils/formatters';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'dot';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<{ status: JobStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-wide select-none ${config.badgeClass} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

export const WorkModeBadge: React.FC<{ mode: WorkMode; size?: 'sm' | 'md' }> = ({
  mode,
  size = 'sm',
}) => {
  const config = getWorkModeConfig(mode);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-wide select-none ${config.badgeClass} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority?: JobPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  if (!priority) return null;
  const config = getPriorityConfig(priority);
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border uppercase tracking-wider select-none ${config.colorClass} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};
