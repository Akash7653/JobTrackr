import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  Gift,
  XCircle,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { StatusDistributionChart } from '../components/dashboard/StatusDistributionChart';
import { UpcomingInterviewsWidget } from '../components/dashboard/UpcomingInterviewsWidget';
import { RecentApplicationsWidget } from '../components/dashboard/RecentApplicationsWidget';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { stats, applications, userProfile, openAddModal } = useJobContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome & Target Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-900/90 border border-indigo-200/70 dark:border-indigo-500/20 p-6 sm:p-8 shadow-xs dark:shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/15 dark:border-indigo-500/30 dark:text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeting: {userProfile.targetRole}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {userProfile.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              You have <span className="text-indigo-600 dark:text-indigo-300 font-semibold">{stats.inProgress} applications</span> currently active in your interview funnel, with{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{stats.offersReceived} offer{stats.offersReceived === 1 ? '' : 's'}</span> received.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/kanban')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Kanban
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => openAddModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Application
            </Button>
          </div>
        </div>
      </div>

      {/* 6 Key Statistics Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Total Applications"
          value={stats.total}
          subtitle="All-time tracked"
          icon={<Briefcase className="w-4 h-4" />}
          colorScheme="indigo"
          onClick={() => navigate('/applications')}
        />
        <MetricCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Active pipeline"
          icon={<Clock className="w-4 h-4" />}
          colorScheme="amber"
          onClick={() => navigate('/kanban')}
        />
        <MetricCard
          title="Interviews"
          value={stats.interviewsScheduled}
          subtitle="Rounds scheduled"
          icon={<Calendar className="w-4 h-4" />}
          colorScheme="purple"
          onClick={() => navigate('/calendar')}
        />
        <MetricCard
          title="Offers Received"
          value={stats.offersReceived}
          subtitle="Decision pending"
          icon={<Gift className="w-4 h-4" />}
          colorScheme="emerald"
          onClick={() => navigate('/applications')}
        />
        <MetricCard
          title="Rejected"
          value={stats.rejected}
          subtitle="Archived"
          icon={<XCircle className="w-4 h-4" />}
          colorScheme="rose"
          onClick={() => navigate('/applications')}
        />
        <MetricCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Offers / Applied"
          icon={<TrendingUp className="w-4 h-4" />}
          colorScheme="emerald"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ActivityChart applications={applications} />
        </div>
        <div className="lg:col-span-5">
          <StatusDistributionChart applications={applications} />
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <UpcomingInterviewsWidget />
        </div>
        <div className="lg:col-span-7">
          <RecentApplicationsWidget />
        </div>
      </div>
    </div>
  );
};
