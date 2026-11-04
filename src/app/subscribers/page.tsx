'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Users, TrendingUp, UserPlus, UserMinus, Award, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatDate, exportToCSV, calculateXAxisInterval } from '@/lib/utils';
import { DEMO_DAILY_DATA, getDataForRange } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';

export default function SubscribersPage() {
  const { selectedChannel, dateRange, showToast } = useApp();

  const currentDailyData = getDataForRange(dateRange, DEMO_DAILY_DATA);
  const totalGained = currentDailyData.reduce((acc, curr) => acc + curr.subscribersGained, 0);
  const totalLost = currentDailyData.reduce((acc, curr) => acc + curr.subscribersLost, 0);
  const totalNet = totalGained - totalLost;
  const avgNetDaily = Math.round(totalNet / currentDailyData.length);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Subscriber Growth
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                Last {dateRange.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Acquisition telemetry and churn rate breakdown for <strong className="font-medium text-slate-900 dark:text-slate-200">{selectedChannel.name}</strong>.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV(`subscriber-growth-${selectedChannel.handle}-${dateRange}`, currentDailyData);
              showToast('Export Complete', `Subscriber data exported (${dateRange.toUpperCase()})`, 'success');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Subscribers"
            value={formatNumber(selectedChannel.subscribers)}
            change={14.2}
            icon={Users}
            subtitle="Current active total"
          />
          <StatCard
            title="Subscribers Gained"
            value={`+${formatNumber(totalGained)}`}
            change={18.4}
            icon={UserPlus}
            subtitle={`Across last ${dateRange.toUpperCase()}`}
          />
          <StatCard
            title="Subscribers Lost"
            value={`-${formatNumber(totalLost)}`}
            change={-4.1}
            icon={UserMinus}
            subtitle="Low churn (1.2%)"
          />
          <StatCard
            title="Net Growth"
            value={`+${formatNumber(totalNet)}`}
            change={22.6}
            icon={TrendingUp}
            subtitle={`Avg +${avgNetDaily} subs / day`}
          />
        </div>

        {/* Milestone Banner */}
        <div className="pro-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Next Target: 250,000 Subscribers
                  </h3>
                  <Badge variant="outline" size="sm">
                    Silver Creator Tier
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Remaining: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">1,500</span> subscribers.
                  At current pace (+{avgNetDaily}/day), estimated achievement date is in{' '}
                  <strong className="text-slate-900 dark:text-white font-medium">12 days</strong>.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Progress</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">99.4%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-white dark:bg-slate-200 rounded-full w-[99.4%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart: Gained vs Lost Daily */}
        <div className="pro-card p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Daily Acquisition vs Churn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparison of daily subscribers gained vs lost.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80" minHeight={320}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                  <XAxis
                    dataKey="date"
                    minTickGap={36}
                    interval="preserveStartEnd"
                    tickFormatter={(val) => {
                      if (!val) return '';
                      const parts = val.split('-');
                      if (parts.length === 3) {
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const m = months[parseInt(parts[1], 10) - 1] || parts[1];
                        return `${m} ${parseInt(parts[2], 10)}`;
                      }
                      return val.slice(5);
                    }}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dy={4}
                  />
                  <YAxis
                    tickFormatter={(val) => formatNumber(val)}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#11131a] p-2.5 shadow-xl font-mono text-xs">
                          <p className="text-[10px] text-slate-400">{formatDate(String(label))}</p>
                          <div className="mt-1 space-y-0.5">
                            <p className="text-emerald-500 font-semibold">
                              +{payload[0]?.value} gained
                            </p>
                            <p className="text-rose-500 font-semibold">
                              -{payload[1]?.value} lost
                            </p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    formatter={(val) => (
                      <span className="text-xs text-slate-400 font-medium font-sans">
                        {val === 'subscribersGained' ? 'Gained' : 'Lost'}
                      </span>
                    )}
                  />
                  <Bar dataKey="subscribersGained" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subscribersLost" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="pro-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Recent Telemetry Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase tracking-wider select-none">
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">Gained</th>
                  <th className="pb-2.5">Lost</th>
                  <th className="pb-2.5">Net Growth</th>
                  <th className="pb-2.5">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {DEMO_DAILY_DATA.slice(-8).reverse().map((row) => (
                  <tr key={row.date} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 font-mono text-slate-500">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-emerald-500">
                      +{row.subscribersGained}
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-rose-500">
                      -{row.subscribersLost}
                    </td>
                    <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white">
                      +{row.netSubscribers}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500">
                      1 / {Math.round(row.views / row.netSubscribers)} views
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
