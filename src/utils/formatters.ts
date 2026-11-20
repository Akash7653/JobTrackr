import { JobStatus, WorkMode, JobPriority } from '../types/job';

export function formatCurrency(amount?: number, currency = '$'): string {
  if (amount === undefined || isNaN(amount)) return '';
  return `${currency}${amount.toLocaleString('en-US')}`;
}

export function formatSalaryRange(
  min?: number,
  max?: number,
  currency = '$',
  period: 'year' | 'month' | 'hour' = 'year'
): string {
  if (!min && !max) return 'Not specified';
  const suffix = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';

  if (min && max) {
    if (min === max) return `${formatCurrency(min, currency)}${suffix}`;
    // Format compact: e.g. $140k - $180k/yr
    const minStr = min >= 1000 ? `${currency}${Math.round(min / 1000)}k` : `${currency}${min}`;
    const maxStr = max >= 1000 ? `${currency}${Math.round(max / 1000)}k` : `${currency}${max}`;
    return `${minStr} – ${maxStr}${suffix}`;
  }

  if (min) return `From ${formatCurrency(min, currency)}${suffix}`;
  return `Up to ${formatCurrency(max, currency)}${suffix}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateTimeStr?: string): string {
  if (!dateTimeStr) return '';
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateTimeStr;
  }
}

export function formatRelativeDays(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const target = new Date(dateStr);
    const today = new Date();
    // Normalize to date boundary
    const tDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const cDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = tDay.getTime() - cDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays > 7) return formatDate(dateStr);
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}d ago`;
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
}

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const BRAND_PALETTE = [
  { bg: 'bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' },
  { bg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30' },
  { bg: 'bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/30' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  { bg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30' },
  { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'border-fuchsia-500/30' },
];

export function getCompanyColorClass(company: string) {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BRAND_PALETTE.length;
  return BRAND_PALETTE[index];
}

export function getStatusConfig(status: JobStatus) {
  switch (status) {
    case 'Wishlist':
      return {
        label: 'Wishlist',
        color: '#94A3B8', // slate-400
        badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-500/30',
        dotClass: 'bg-slate-500 dark:bg-slate-400',
        indicator: 'border-slate-400 dark:border-slate-500',
      };
    case 'Applied':
      return {
        label: 'Applied',
        color: '#0284C7', // sky-600
        badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-500/30',
        dotClass: 'bg-sky-500 dark:bg-sky-400',
        indicator: 'border-sky-500',
      };
    case 'Assessment':
      return {
        label: 'Assessment',
        color: '#D97706', // amber-600
        badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
        dotClass: 'bg-amber-500 dark:bg-amber-400',
        indicator: 'border-amber-500',
      };
    case 'Interview':
      return {
        label: 'Interview',
        color: '#9333EA', // purple-600
        badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30',
        dotClass: 'bg-purple-500 dark:bg-purple-400',
        indicator: 'border-purple-500',
      };
    case 'Offer':
      return {
        label: 'Offer',
        color: '#059669', // emerald-600
        badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
        dotClass: 'bg-emerald-500 dark:bg-emerald-400',
        indicator: 'border-emerald-500',
      };
    case 'Rejected':
      return {
        label: 'Rejected',
        color: '#E11D48', // rose-600
        badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30',
        dotClass: 'bg-rose-500 dark:bg-rose-400',
        indicator: 'border-rose-500',
      };
  }
}

export function getWorkModeConfig(mode: WorkMode) {
  switch (mode) {
    case 'Remote':
      return {
        label: 'Remote',
        badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
      };
    case 'Hybrid':
      return {
        label: 'Hybrid',
        badgeClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/30',
      };
    case 'Onsite':
      return {
        label: 'Onsite',
        badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-500/30',
      };
  }
}

export function getPriorityConfig(priority?: JobPriority) {
  switch (priority) {
    case 'High':
      return { label: 'High', colorClass: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-300 dark:border-rose-500/30' };
    case 'Medium':
      return { label: 'Med', colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-300 dark:border-amber-500/30' };
    case 'Low':
      return { label: 'Low', colorClass: 'text-slate-700 dark:text-slate-400 bg-slate-500/10 border-slate-300 dark:border-slate-500/30' };
    default:
      return { label: '', colorClass: '' };
  }
}
