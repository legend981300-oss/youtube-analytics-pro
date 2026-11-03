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
import { formatNumber, formatDate, exportToCSV } from '@/lib/utils';
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Subscriber Growth Analytics
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Data
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Detailed acquisition and churn breakdown across the last {dateRange.toUpperCase()}.
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Subscribers"
            value={formatNumber(selectedChannel.subscribers)}
            change={14.2}
            icon={Users}
            iconColor="text-rose-500"
            subtitle="Current count (Demo)"
          />
          <StatCard
            title="Subscribers Gained"
            value={`+${formatNumber(totalGained)}`}
            change={18.4}
            icon={UserPlus}
            iconColor="text-emerald-500"
            subtitle={`Across last ${dateRange.toUpperCase()}`}
          />
          <StatCard
            title="Subscribers Lost"
            value={`-${formatNumber(totalLost)}`}
            change={-4.1}
            icon={UserMinus}
            iconColor="text-amber-500"
            subtitle="Low churn rate (1.2%)"
          />
          <StatCard
            title="Net Growth"
            value={`+${formatNumber(totalNet)}`}
            change={22.6}
            icon={TrendingUp}
            iconColor="text-brand-500"
            subtitle={`Avg +${avgNetDaily} subs / day`}
          />
        </div>

        {/* Milestone Banner */}
        <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-600/10 via-navy-850 to-purple-600/10 p-5 dark:border-navy-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-500">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Next Major Milestone: 250,000 Subscribers
                  </h3>
                  <Badge variant="purple" size="sm">
                    Silver Play Button +
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Only <span className="font-bold text-slate-800 dark:text-slate-200">1,500</span> more subscribers to reach 250k.
                  At current pace (+{avgNetDaily}/day), estimated achievement date is in{' '}
                  <strong className="text-brand-500 font-bold">12 days</strong>.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress</span>
                <span className="text-brand-500">99.4%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-navy-950 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-rose-500 rounded-full w-[99.4%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart: Gained vs Lost Daily */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Acquisition vs Churn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparison of daily subscribers gained vs lost.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => val.slice(5)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#334155"
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatNumber(Number(value)),
                      name === 'subscribersGained' ? 'Gained' : 'Lost',
                    ]}
                    labelFormatter={(l) => `Date: ${formatDate(String(l))}`}
                  />
                  <Legend
                    formatter={(val) => (val === 'subscribersGained' ? 'Subscribers Gained' : 'Subscribers Lost')}
                  />
                  <Bar dataKey="subscribersGained" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="subscribersLost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Recent Daily Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-750 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Gained</th>
                  <th className="pb-3">Lost</th>
                  <th className="pb-3">Net Growth</th>
                  <th className="pb-3">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-750">
                {DEMO_DAILY_DATA.slice(-8).reverse().map((row) => (
                  <tr key={row.date} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                    <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2.5 text-emerald-500 font-semibold">
                      +{row.subscribersGained}
                    </td>
                    <td className="py-2.5 text-rose-500 font-semibold">
                      -{row.subscribersLost}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                      +{row.netSubscribers}
                    </td>
                    <td className="py-2.5 text-slate-500">
                      1 per {Math.round(row.views / row.netSubscribers)} views
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
