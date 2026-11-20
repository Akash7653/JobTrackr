import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
} from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { applications, stats, userProfile } = useJobContext();
  const { isDark } = useTheme();

  // 1. Funnel Stages Breakdown
  const funnelData = useMemo(() => {
    const total = applications.length;
    const wishlist = applications.filter((a) => a.status === 'Wishlist').length;
    const applied = applications.filter(
      (a) => a.status !== 'Wishlist'
    ).length; // entered pipeline
    const assessment = applications.filter((a) =>
      ['Assessment', 'Interview', 'Offer'].includes(a.status)
    ).length;
    const interview = applications.filter((a) => ['Interview', 'Offer'].includes(a.status)).length;
    const offer = applications.filter((a) => a.status === 'Offer').length;

    return [
      {
        stage: 'Wishlist / Saved',
        count: wishlist,
        pct: total > 0 ? Math.round((wishlist / total) * 100) : 0,
        color: '#94A3B8',
      },
      {
        stage: 'Applied Submissions',
        count: applied,
        pct: total > 0 ? Math.round((applied / total) * 100) : 0,
        color: '#38BDF8',
      },
      {
        stage: 'Assessment / Take-home',
        count: assessment,
        pct: applied > 0 ? Math.round((assessment / applied) * 100) : 0,
        color: '#F59E0B',
      },
      {
        stage: 'Interviews Reached',
        count: interview,
        pct: applied > 0 ? Math.round((interview / applied) * 100) : 0,
        color: '#A855F7',
      },
      {
        stage: 'Job Offers Received',
        count: offer,
        pct: applied > 0 ? Math.round((offer / applied) * 100) : 0,
        color: '#10B981',
      },
    ];
  }, [applications]);

  // 2. Work Mode Distribution
  const workModeData = useMemo(() => {
    const counts = { Remote: 0, Hybrid: 0, Onsite: 0 };
    applications.forEach((a) => {
      if (counts[a.workMode] !== undefined) counts[a.workMode]++;
    });
    const total = applications.length;

    return [
      {
        mode: 'Remote',
        count: counts.Remote,
        pct: total > 0 ? Math.round((counts.Remote / total) * 100) : 0,
        color: '#10B981',
      },
      {
        mode: 'Hybrid',
        count: counts.Hybrid,
        pct: total > 0 ? Math.round((counts.Hybrid / total) * 100) : 0,
        color: '#6366F1',
      },
      {
        mode: 'Onsite',
        count: counts.Onsite,
        pct: total > 0 ? Math.round((counts.Onsite / total) * 100) : 0,
        color: '#94A3B8',
      },
    ];
  }, [applications]);

  // 3. Monthly Activity Breakdown
  const monthlyActivityData = useMemo(() => {
    const monthsMap: Record<string, { month: string; applications: number; offers: number }> = {};
    const now = new Date();

    // 5 preceding months plus current
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const name = d.toLocaleDateString('en-US', { month: 'short' });
      monthsMap[key] = { month: name, applications: 0, offers: 0 };
    }

    applications.forEach((app) => {
      const d = new Date(app.appliedDate);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthsMap[key]) {
          monthsMap[key].applications += 1;
        }
      }
      if (app.status === 'Offer') {
        const d = new Date(app.updatedAt);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (monthsMap[key]) {
            monthsMap[key].offers += 1;
          }
        }
      }
    });

    return Object.values(monthsMap);
  }, [applications]);

  // 5. Job Category Trends (e.g. Frontend, Fullstack, Design, Platform, Staff)
  const categoryTrends = useMemo(() => {
    const keywords = ['Frontend', 'Fullstack', 'Design', 'Platform', 'Staff', 'Senior', 'Product'];
    const counts: Record<string, number> = {};

    applications.forEach((app) => {
      const title = app.jobTitle.toLowerCase();
      keywords.forEach((kw) => {
        if (title.includes(kw.toLowerCase())) {
          counts[kw] = (counts[kw] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [applications]);

  // Salary Insights
  const salaryInsights = useMemo(() => {
    const salaries = applications
      .map((a) => a.salaryMax || a.salaryMin)
      .filter((s): s is number => typeof s === 'number' && s > 0);

    if (salaries.length === 0) {
      return { min: 0, max: 0, avg: 0, median: 0 };
    }

    salaries.sort((a, b) => a - b);
    const min = salaries[0];
    const max = salaries[salaries.length - 1];
    const avg = Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length);
    const median = salaries[Math.floor(salaries.length / 2)];

    return { min, max, avg, median };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Career & Funnel Analytics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Real-time metrics, pipeline conversion rates, and compensation intelligence.
        </p>
      </div>

      {/* Top 4 Key Rate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <span className="text-xs text-slate-500 dark:text-slate-400">Interview Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {stats.interviewRate}%
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Screen to onsite conversion</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <span className="text-xs text-slate-500 dark:text-slate-400">Offer Success Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.successRate}%
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Applications to offer</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <span className="text-xs text-slate-500 dark:text-slate-400">Average Compensation</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {salaryInsights.avg ? formatCurrency(salaryInsights.avg) : 'N/A'}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Target salary average</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <span className="text-xs text-slate-500 dark:text-slate-400">Target Role Goal</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(userProfile.targetSalary)}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Annual baseline preference</span>
        </div>
      </div>

      {/* Conversion Funnel & Work Mode Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Pipeline Funnel (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Application Funnel Stages</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Conversion performance from initial application to final offer
          </p>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {funnelData.map((stage) => (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{stage.count}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">({stage.pct}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, stage.pct)}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Mode Breakdown (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Work Mode Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Breakdown across Remote, Hybrid, and Onsite
            </p>

            <div className="space-y-3.5 mt-2">
              {workModeData.map((item) => (
                <div key={item.mode} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.mode}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {item.count} roles ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Spread Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs">
            <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
              <span>Salary Spread</span>
              <span>
                {salaryInsights.min ? formatCurrency(salaryInsights.min) : '$0'} –{' '}
                {salaryInsights.max ? formatCurrency(salaryInsights.max) : '$0'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Median role compensation in your active pipeline is{' '}
              <span className="text-slate-900 dark:text-slate-200 font-medium">
                {salaryInsights.median ? formatCurrency(salaryInsights.median) : 'N/A'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Submissions Bar Chart & Category Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Activity Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Monthly Application Volume</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Submissions and offers won across recent months
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="month" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs text-slate-900 dark:text-slate-100">
                          <p className="font-semibold text-slate-900 dark:text-slate-200 mb-1">{label}</p>
                          <div className="text-indigo-600 dark:text-indigo-400">
                            Applications: <span className="font-bold">{payload[0]?.value}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="applications" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Frequent Categories / Specializations */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Role Specializations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Most frequently applied job types and tags
          </p>

          <div className="flex-1 space-y-3">
            {categoryTrends.map((cat, idx) => (
              <div
                key={cat.category}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat.category} Roles</span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
                  {cat.count} application{cat.count === 1 ? '' : 's'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
