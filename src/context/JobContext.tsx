import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  JobApplication,
  JobStatus,
  UserProfile,
} from '../types/job';
import { DashboardStats } from '../types/analytics';
import { NotificationItem } from '../types/user';
import { SAMPLE_APPLICATIONS, INITIAL_USER_PROFILE } from '../data/sampleJobs';
import { useToast } from './ToastContext';

interface JobContextValue {
  applications: JobApplication[];
  userProfile: UserProfile;
  stats: DashboardStats;
  upcomingInterviews: JobApplication[];
  recentApplications: JobApplication[];
  notifications: NotificationItem[];

  // CRUD
  addApplication: (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => JobApplication;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  updateStatus: (id: string, newStatus: JobStatus) => void;
  toggleFavorite: (id: string) => void;
  resetToSampleData: () => void;
  clearAllData: () => void;
  importApplications: (newApps: JobApplication[]) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // UI state
  activeJob: JobApplication | null;
  setActiveJob: (job: JobApplication | null) => void;
  isAddModalOpen: boolean;
  prefilledStatus: JobStatus | undefined;
  editingJob: JobApplication | null;
  openAddModal: (status?: JobStatus) => void;
  openEditModal: (job: JobApplication) => void;
  closeModal: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const JobContext = createContext<JobContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  APPLICATIONS: 'jobtrackr_applications_v1',
  PROFILE: 'jobtrackr_profile_v1',
  READ_NOTIFS: 'jobtrackr_read_notifications_v1',
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Load applications from localStorage or populate sample data
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load applications from localStorage:', err);
    }
    return SAMPLE_APPLICATIONS;
  });

  // Load user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
    return INITIAL_USER_PROFILE;
  });

  // Track read notification IDs
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.READ_NOTIFS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // UI state
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefilledStatus, setPrefilledStatus] = useState<JobStatus | undefined>(undefined);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (err) {
      console.error('Failed to persist applications to localStorage:', err);
    }
  }, [applications]);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (err) {
      console.error('Failed to persist profile to localStorage:', err);
    }
  }, [userProfile]);

  // Sync read notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.READ_NOTIFS, JSON.stringify(readNotifIds));
    } catch {
      // ignore
    }
  }, [readNotifIds]);

  // Keep activeJob synced when applications list updates
  useEffect(() => {
    if (activeJob) {
      const updated = applications.find((a) => a.id === activeJob.id);
      if (updated) {
        setActiveJob(updated);
      } else {
        setActiveJob(null);
      }
    }
  }, [applications, activeJob]);

  // Confetti trigger helper
  const fireOfferCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#38BDF8', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  // CRUD Operations
  const addApplication = useCallback(
    (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): JobApplication => {
      const now = new Date().toISOString();
      const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newApp: JobApplication = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
        timeline: data.timeline && data.timeline.length > 0
          ? data.timeline
          : [
              {
                id: `tl-${Date.now()}`,
                status: data.status,
                date: data.appliedDate || now.split('T')[0],
                note: `Application created with status: ${data.status}`,
              },
            ],
      };

      setApplications((prev) => [newApp, ...prev]);
      showToast({
        title: 'Application Added',
        message: `${newApp.jobTitle} at ${newApp.company}`,
        type: 'success',
      });

      if (newApp.status === 'Offer') {
        fireOfferCelebration();
      }

      return newApp;
    },
    [showToast, fireOfferCelebration]
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<JobApplication>) => {
      const now = new Date().toISOString();
      let statusChanged = false;
      let newStatus: JobStatus | undefined;
      let appName = '';

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          appName = `${app.jobTitle} at ${app.company}`;

          let updatedTimeline = app.timeline ? [...app.timeline] : [];
          if (updates.status && updates.status !== app.status) {
            statusChanged = true;
            newStatus = updates.status;
            updatedTimeline.push({
              id: `tl-${Date.now()}`,
              status: updates.status,
              date: updates.appliedDate || now.split('T')[0],
              note: `Status updated to ${updates.status}`,
            });
          }

          return {
            ...app,
            ...updates,
            timeline: updatedTimeline,
            updatedAt: now,
          };
        })
      );

      showToast({
        title: 'Application Updated',
        message: appName || 'Changes saved successfully',
        type: 'info',
      });

      if (statusChanged && newStatus === 'Offer') {
        fireOfferCelebration();
      }
    },
    [showToast, fireOfferCelebration]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      let deletedName = '';
      setApplications((prev) => {
        const target = prev.find((a) => a.id === id);
        if (target) deletedName = `${target.jobTitle} at ${target.company}`;
        return prev.filter((a) => a.id !== id);
      });

      if (activeJob && activeJob.id === id) {
        setActiveJob(null);
      }

      showToast({
        title: 'Application Deleted',
        message: deletedName ? `Removed ${deletedName}` : 'Application removed',
        type: 'warning',
      });
    },
    [activeJob, showToast]
  );

  const updateStatus = useCallback(
    (id: string, newStatus: JobStatus) => {
      const now = new Date().toISOString();
      let updatedCompany = '';

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          if (app.status === newStatus) return app;

          updatedCompany = app.company;
          const updatedTimeline = [
            ...(app.timeline || []),
            {
              id: `tl-${Date.now()}`,
              status: newStatus,
              date: now.split('T')[0],
              note: `Moved to ${newStatus}`,
            },
          ];

          return {
            ...app,
            status: newStatus,
            timeline: updatedTimeline,
            updatedAt: now,
          };
        })
      );

      showToast({
        title: `Status: ${newStatus}`,
        message: `${updatedCompany} moved to ${newStatus}`,
        type: newStatus === 'Offer' ? 'success' : 'info',
      });

      if (newStatus === 'Offer') {
        fireOfferCelebration();
      }
    },
    [showToast, fireOfferCelebration]
  );

  const toggleFavorite = useCallback((id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, favorite: !app.favorite } : app))
    );
  }, []);

  const resetToSampleData = useCallback(() => {
    setApplications(SAMPLE_APPLICATIONS);
    setActiveJob(null);
    showToast({
      title: 'Sample Data Restored',
      message: `Restored ${SAMPLE_APPLICATIONS.length} applications`,
      type: 'info',
    });
  }, [showToast]);

  const clearAllData = useCallback(() => {
    setApplications([]);
    setActiveJob(null);
    showToast({
      title: 'All Data Cleared',
      message: 'Workspace is now empty',
      type: 'warning',
    });
  }, [showToast]);

  const importApplications = useCallback(
    (newApps: JobApplication[]) => {
      setApplications(newApps);
      setActiveJob(null);
      showToast({
        title: 'Data Imported',
        message: `Successfully loaded ${newApps.length} applications`,
        type: 'success',
      });
    },
    [showToast]
  );

  const updateUserProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setUserProfile((prev) => ({ ...prev, ...updates }));
      showToast({
        title: 'Profile Updated',
        message: 'Your profile settings have been saved',
        type: 'success',
      });
    },
    [showToast]
  );

  // Modal helpers
  const openAddModal = useCallback((status?: JobStatus) => {
    setPrefilledStatus(status);
    setEditingJob(null);
    setIsAddModalOpen(true);
  }, []);

  const openEditModal = useCallback((job: JobApplication) => {
    setEditingJob(job);
    setPrefilledStatus(undefined);
    setIsAddModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsAddModalOpen(false);
    setEditingJob(null);
    setPrefilledStatus(undefined);
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setReadNotifIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const clearAllNotifications = useCallback(() => {
    // mark all as read
    setReadNotifIds((prev) => {
      const allIds = [
        ...prev,
        ...applications.map((a) => `notif-interview-${a.id}`),
        ...applications.map((a) => `notif-deadline-${a.id}`),
        ...applications.map((a) => `notif-offer-${a.id}`),
      ];
      return Array.from(new Set(allIds));
    });
    showToast({
      title: 'Notifications Cleared',
      type: 'info',
    });
  }, [applications, showToast]);

  // Derived statistics
  const stats = useMemo<DashboardStats>(() => {
    const total = applications.length;
    let wishlist = 0;
    let applied = 0;
    let assessment = 0;
    let interview = 0;
    let offer = 0;
    let rejected = 0;
    let totalSalary = 0;
    let salaryCount = 0;

    applications.forEach((app) => {
      switch (app.status) {
        case 'Wishlist':
          wishlist++;
          break;
        case 'Applied':
          applied++;
          break;
        case 'Assessment':
          assessment++;
          break;
        case 'Interview':
          interview++;
          break;
        case 'Offer':
          offer++;
          break;
        case 'Rejected':
          rejected++;
          break;
      }

      if (app.salaryMax) {
        totalSalary += app.salaryMax;
        salaryCount++;
      } else if (app.salaryMin) {
        totalSalary += app.salaryMin;
        salaryCount++;
      }
    });

    const inProgress = applied + assessment + interview;
    const activeSubmissions = total - wishlist;
    const successRate = activeSubmissions > 0 ? Math.round((offer / activeSubmissions) * 100) : 0;
    const interviewRate = activeSubmissions > 0 ? Math.round(((interview + offer) / activeSubmissions) * 100) : 0;
    const averageSalary = salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;

    return {
      total,
      inProgress,
      interviewsScheduled: interview,
      offersReceived: offer,
      rejected,
      wishlist,
      successRate,
      interviewRate,
      averageSalary,
    };
  }, [applications]);

  // Upcoming interviews sorted by date
  const upcomingInterviews = useMemo(() => {
    const nowTimestamp = new Date().getTime();
    return applications
      .filter((app) => {
        if (!app.interviewDate) return false;
        const d = new Date(app.interviewDate).getTime();
        return !isNaN(d) && d >= nowTimestamp - 24 * 60 * 60 * 1000; // includes today
      })
      .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());
  }, [applications]);

  // Recent applications
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.updatedAt || b.appliedDate).getTime() - new Date(a.updatedAt || a.appliedDate).getTime())
      .slice(0, 6);
  }, [applications]);

  // Dynamic notifications based on dates and events
  const notifications = useMemo<NotificationItem[]>(() => {
    const notifs: NotificationItem[] = [];

    applications.forEach((app) => {
      // 1. Upcoming Interview
      if (app.interviewDate) {
        const interviewTime = new Date(app.interviewDate).getTime();
        const nowTime = Date.now();
        const diffHours = (interviewTime - nowTime) / (1000 * 60 * 60);
        if (diffHours >= -12 && diffHours <= 96) {
          const id = `notif-interview-${app.id}`;
          notifs.push({
            id,
            title: `Interview Scheduled: ${app.company}`,
            message: `${app.jobTitle} on ${new Date(app.interviewDate).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}`,
            type: 'interview',
            timestamp: app.interviewDate,
            read: readNotifIds.includes(id),
            jobId: app.id,
            company: app.company,
          });
        }
      }

      // 2. Assessment Deadline
      if (app.assessmentDeadline) {
        const deadlineTime = new Date(app.assessmentDeadline).getTime();
        const nowTime = Date.now();
        const diffDays = (deadlineTime - nowTime) / (1000 * 60 * 60 * 24);
        if (diffDays >= -1 && diffDays <= 7) {
          const id = `notif-deadline-${app.id}`;
          notifs.push({
            id,
            title: `Take-home Deadline: ${app.company}`,
            message: `Submission due by ${new Date(app.assessmentDeadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}`,
            type: 'deadline',
            timestamp: app.assessmentDeadline,
            read: readNotifIds.includes(id),
            jobId: app.id,
            company: app.company,
          });
        }
      }

      // 3. Offers
      if (app.status === 'Offer') {
        const id = `notif-offer-${app.id}`;
        notifs.push({
          id,
          title: `Active Offer: ${app.company}`,
          message: `${app.jobTitle} offer waiting for your decision`,
          type: 'status',
          timestamp: app.updatedAt,
          read: readNotifIds.includes(id),
          jobId: app.id,
          company: app.company,
        });
      }
    });

    return notifs.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
  }, [applications, readNotifIds]);

  return (
    <JobContext.Provider
      value={{
        applications,
        userProfile,
        stats,
        upcomingInterviews,
        recentApplications,
        notifications,
        addApplication,
        updateApplication,
        deleteApplication,
        updateStatus,
        toggleFavorite,
        resetToSampleData,
        clearAllData,
        importApplications,
        updateUserProfile,
        markNotificationRead,
        clearAllNotifications,
        activeJob,
        setActiveJob,
        isAddModalOpen,
        prefilledStatus,
        editingJob,
        openAddModal,
        openEditModal,
        closeModal,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
