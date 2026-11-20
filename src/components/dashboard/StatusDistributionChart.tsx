import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { JobApplication } from '../../types/job';
import { getStatusConfig } from '../../utils/formatters';

interface StatusDistributionChartProps {
  applications: JobApplication[];
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  applications,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    const counts: Record<string, number> = {
      Wishlist: 0,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    const items = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => {
        const config = getStatusConfig(status as any);
        return {
          name: status,
          value: count,
          color: config.color,
          percentage: applications.length > 0 ? Math.round((count / applications.length) * 100) : 0,
        };
      });

    return items;
  }, [applications]);

  const total = applications.length;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Pipeline Status</h3>
          <p className="text-xs text-slate-400">Distribution across application stages</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
          {total} Total
        </span>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[220px]">
        {total === 0 ? (
          <div className="text-xs text-slate-500 py-10 text-center">No applications recorded</div>
        ) : (
          <>
            {/* Donut Chart */}
            <div className="w-48 h-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-xl text-xs">
                            <span className="font-semibold text-slate-200">{item.name}: </span>
                            <span className="text-white font-bold">{item.value}</span>
                            <span className="text-slate-400 ml-1">({item.percentage}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#0F172A"
                        strokeWidth={2}
                        className="transition-all duration-150 cursor-pointer outline-none"
                        style={{
                          transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                          transformOrigin: 'center center',
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white tracking-tight">
                  {activeIndex !== null && data[activeIndex] ? data[activeIndex].value : total}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {activeIndex !== null && data[activeIndex] ? data[activeIndex].name : 'Records'}
                </span>
              </div>
            </div>

            {/* Custom Status Legend */}
            <div className="flex-1 w-full space-y-1.5 overflow-y-auto max-h-48 pr-1">
              {data.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeIndex === idx ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-200">{item.value}</span>
                    <span className="text-[10px] text-slate-500 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
