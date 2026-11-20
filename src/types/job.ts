export type JobStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship';

export type JobPriority = 'Low' | 'Medium' | 'High';

export interface TimelineEntry {
  id: string;
  status: JobStatus;
  date: string; // ISO date string (YYYY-MM-DD or full ISO)
  note?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  logoUrl?: string;
  companyColor?: string; // Hex color for avatar background
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string; // e.g. '$'
  salaryPeriod?: 'year' | 'month' | 'hour';
  appliedDate: string; // YYYY-MM-DD
  status: JobStatus;
  jobDescription?: string;
  jobUrl?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  notes?: string;
  interviewDate?: string; // ISO datetime string or YYYY-MM-DDTHH:mm
  assessmentDeadline?: string; // YYYY-MM-DD
  followUpDate?: string; // YYYY-MM-DD
  priority?: JobPriority;
  rating?: number; // 1-5
  favorite?: boolean;
  timeline?: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface JobFilterState {
  search: string;
  status: JobStatus | 'All';
  workMode: WorkMode | 'All';
  employmentType: EmploymentType | 'All';
  location: string;
  priority: JobPriority | 'All';
  sortBy: 'date-desc' | 'date-asc' | 'company-asc' | 'company-desc' | 'salary-desc' | 'status';
  favoriteOnly: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  avatarUrl: string;
  targetRole: string;
  targetSalary: number;
  targetLocations: string[];
  currency: string;
  bio?: string;
}
