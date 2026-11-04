'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Clock, Timer, Monitor, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatDate, exportToCSV, calculateXAxisInterval } from '@/lib/utils';
import { DEMO_DAILY_DATA, AUDIENCE_DEMOGRAPHICS, getDataForRange } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';

// Mock audience retention curve data (0% to 100% of duration)
const RETENTION_CURVE_DATA = [
  { point: '0%', retention: 100, note: 'Intro start' },
  { point: '10%', retention: 84, note: 'Hook delivered' },
  { point: '20%', retention: 76, note: 'Intro dip' },
  { point: '30%', retention: 72, note: 'First key takeaway' },
  { point: '40%', retention: 68, note: 'Deep dive code demo' },
  { point: '50%', retention: 64, note: 'Midpoint re-hook' },
  { point: '60%', retention: 60, note: 'Architecture diagram' },
  { point: '70%', retention: 57, note: 'Advanced tips' },
  { point: '80%', retention: 53, note: 'Common pitfalls' },
  { point: '90%', retention: 48, note: 'Outro begins' },
  { point: '100%', retention: 39, note: 'End screen' },
];

export default function WatchHoursPage() {
  const { selectedChannel, dateRange, showToast } = useApp();

  const currentDailyData = getDataForRange(dateRange, DEMO_DAILY_DATA);
  const totalWatchHours = currentDailyData.reduce((acc, curr) => acc + curr.watchHours, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Watch Hours & Retention Analytics
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Data
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Analyze how deeply engaged your audience is across the last {dateRange.toUpperCase()}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV(`watch-hours-${selectedChannel.handle}-${dateRange}`, currentDailyData);
              showToast('Export Complete', `Watch hours exported (${dateRange.toUpperCase()})`, 'success');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Watch Time (Hours)"
            value={`${formatNumber(totalWatchHours)}h`}
            change={18.5}
            icon={Clock}
            iconColor="text-emerald-500"
            subtitle="Qualifies for monetization"
          />
          <StatCard
            title="Avg View Duration"
            value="7m 42s"
            change={8.2}
            icon={Timer}
            iconColor="text-blue-500"
            subtitle="Benchmark: 5m 12s in tech"
          />
          <StatCard
            title="Avg % Viewed"
            value="51.2%"
            change={4.8}
            icon={Clock}
            iconColor="text-purple-500"
            subtitle="Top 15% retention tier"
          />
          <StatCard
            title="Desktop Viewers"
            value="56.4%"
            change={2.1}
            icon={Monitor}
            iconColor="text-cyan-500"
            subtitle="Higher average watch time"
          />
        </div>

        {/* Daily Watch Hours Area Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Watch Hours Accumulation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total hours watched every 24 hours.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80" minHeight={320}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#10b981" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(val) => `${formatNumber(val)}h`}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dx={-4}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${formatNumber(Number(val))} Hours`, 'Watch Time']}
                    labelFormatter={(l) => `Date: ${formatDate(String(l))}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="watchHours"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hoursEmerald)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* 2 Cols: Retention Curve + Device Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Audience Retention Curve Chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Audience Retention Curve (Catalog Average)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Percentage of viewers still watching at each point of the video.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <ChartWrapper heightClass="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={RETENTION_CURVE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                    <XAxis dataKey="point" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Retention']}
                      labelFormatter={(l) => `Video Progress: ${l}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="#a855f7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#a855f7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <div className="mt-3 rounded-xl bg-purple-500/10 p-3 text-xs text-purple-600 dark:text-purple-300">
              💡 <strong>Key Finding:</strong> Your retention holds strong through 70% of long-form videos. Adding pattern interrupts at the 50% mark will boost completion by an estimated +8%.
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <div className="pb-3 border-b border-slate-100 dark:border-navy-750">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Device Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Platforms and hardware used by your audience.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {AUDIENCE_DEMOGRAPHICS.devices.map((dev) => (
                <div key={dev.device} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {dev.device}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {dev.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${dev.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-navy-750 dark:bg-navy-800 text-xs text-slate-600 dark:text-slate-300">
              💻 Desktop viewers represent over <strong>56%</strong> of your watch time, which drives higher CPMs on programming tutorials.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
