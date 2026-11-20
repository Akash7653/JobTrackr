export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'interview' | 'deadline' | 'status' | 'info';
  timestamp: string;
  read: boolean;
  jobId?: string;
  company?: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeMode;
  defaultView: 'dashboard' | 'applications' | 'kanban' | 'calendar' | 'analytics';
  currency: string;
  emailAlerts: boolean;
  compactMode: boolean;
  soundEffects: boolean;
}
