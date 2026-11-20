import { JobStatus, WorkMode } from './job';

export interface DashboardStats {
  total: number;
  inProgress: number; // Applied + Assessment + Interview
  interviewsScheduled: number;
  offersReceived: number;
  rejected: number;
  wishlist: number;
  successRate: number; // Offers / (Total - Wishlist) * 100 or Offers / Total
  interviewRate: number; // Interviews / (Total - Wishlist) * 100
  averageSalary: number;
}

export interface ActivityDataPoint {
  date: string; // "Nov 12", "Week 45", etc.
  fullDate: string;
  applied: number;
  interviews: number;
  offers: number;
}

export interface StatusDistributionItem {
  name: JobStatus;
  value: number;
  color: string;
}

export interface WorkModeDistributionItem {
  name: WorkMode;
  count: number;
  percentage: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CategoryTrendItem {
  category: string;
  count: number;
  averageSalary: number;
}
