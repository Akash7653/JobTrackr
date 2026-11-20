import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { JobApplication } from '../../types/job';

interface ActivityChartProps {
  applications: JobApplication[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ applications }) => {
  // Aggregate applications into chronological date buckets (last 6 weeks)
  const chartData = useMemo(() => {
    const buckets: Record<string, { label: string; date: Date; applications: number; interviews: number }> = {};
    const now = new Date();

    // Initialize 6 weekly buckets up to today
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = `w-${d.getFullYear()}-${Math.floor(d.getDate() / 7)}-${d.getMonth()}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      buckets[key] = {
        label,
        date: d,
        applications: 0,
        interviews: 0,
      };
    }

    applications.forEach((app) => {
      const appDate = new Date(app.appliedDate);
      if (!isNaN(appDate.getTime())) {
        const diffDays = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIdx = Math.min(5, Math.max(0, 5 - Math.floor(diffDays / 7)));
        const keys = Object.keys(buckets);
        if (keys[weekIdx] && buckets[keys[weekIdx]]) {
          buckets[keys[weekIdx]].applications += 1;
        }
      }

      if (app.interviewDate) {
        const intDate = new Date(app.interviewDate);
        if (!isNaN(intDate.getTime())) {
          const diffDays = Math.floor((now.getTime() - intDate.getTime()) / (1000 * 60 * 60 * 24));
          const weekIdx = Math.min(5, Math.max(0, 5 - Math.floor(diffDays / 7)));
          const keys = Object.keys(buckets);
          if (keys[weekIdx] && buckets[keys[weekIdx]]) {
            buckets[keys[weekIdx]].interviews += 1;
          }
        }
      }
    });

    const result = Object.values(buckets);
    // If all zero (e.g. empty data), provide baseline
    return result;
  }, [applications]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-semibold text-slate-200 mb-1.5">Week of {label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-indigo-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Applications
              </span>
              <span className="font-bold text-slate-100">{payload[0].value}</span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between gap-4 text-purple-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Interviews
                </span>
                <span className="font-bold text-slate-100">{payload[1].value}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
            Application Velocity
          </h3>
          <p className="text-xs text-slate-400">Activity and interview milestones over time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Applications
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Interviews
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorApps)"
            />
            <Area
              type="monotone"
              dataKey="interviews"
              stroke="#A855F7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInt)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
