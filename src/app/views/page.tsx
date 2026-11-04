'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Eye, MousePointerClick, Share2, Compass, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatDate, exportToCSV, calculateXAxisInterval } from '@/lib/utils';
import { DEMO_DAILY_DATA, AUDIENCE_DEMOGRAPHICS, getDataForRange } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';

export default function ViewsPage() {
  const { selectedChannel, dateRange, showToast } = useApp();

  const currentDailyData = getDataForRange(dateRange, DEMO_DAILY_DATA);
  const totalViews = currentDailyData.reduce((acc, curr) => acc + curr.views, 0);
  const totalImpressions = currentDailyData.reduce((acc, curr) => acc + curr.impressions, 0);
  const avgCtr = (
    currentDailyData.reduce((acc, curr) => acc + curr.ctr, 0) / currentDailyData.length
  ).toFixed(2);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Views & Traffic Analytics
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Data
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Discover how viewers find and click your content across the last {dateRange.toUpperCase()}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV(`views-analytics-${selectedChannel.handle}-${dateRange}`, currentDailyData);
              showToast('Export Complete', `Views data exported (${dateRange.toUpperCase()})`, 'success');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Views"
            value={formatNumber(totalViews)}
            change={22.8}
            icon={Eye}
            iconColor="text-blue-500"
            subtitle="Avg 19,400 / day"
          />
          <StatCard
            title="Impressions"
            value={formatNumber(totalImpressions)}
            change={19.1}
            icon={Compass}
            iconColor="text-purple-500"
            subtitle="Thumbnails served in feeds"
          />
          <StatCard
            title="Avg Click-Through (CTR)"
            value={`${avgCtr}%`}
            change={12.5}
            icon={MousePointerClick}
            iconColor="text-emerald-500"
            subtitle="High performance benchmark"
          />
          <StatCard
            title="External Traffic"
            value="6.7%"
            change={5.2}
            icon={Share2}
            iconColor="text-amber-500"
            subtitle="Reddit, Twitter, Blogs"
          />
        </div>

        {/* Views & Impressions Dual Area Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Views Trend Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily views volume across {dateRange.toUpperCase()}.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80" minHeight={320}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                  <XAxis
                    dataKey="date"
                    interval={calculateXAxisInterval(currentDailyData.length, 7)}
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
                    formatter={(val: any) => [formatNumber(Number(val)), 'Views']}
                    labelFormatter={(l) => `Date: ${formatDate(String(l))}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#viewsBlue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Donut Chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Traffic Sources Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Where viewers found your content.
            </p>

            <ChartWrapper heightClass="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AUDIENCE_DEMOGRAPHICS.trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {AUDIENCE_DEMOGRAPHICS.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
              {AUDIENCE_DEMOGRAPHICS.trafficSources.map((item) => (
                <div key={item.source} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.source} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources Detailed Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Traffic Source Performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Insights into the best performing acquisition channels.
            </p>

            <div className="space-y-3">
              {AUDIENCE_DEMOGRAPHICS.trafficSources.map((src) => {
                const estViews = Math.round((totalViews * src.percentage) / 100);
                return (
                  <div
                    key={src.source}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {src.source}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatNumber(estViews)} views ({src.percentage}%)
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-navy-950 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${src.percentage}%`,
                          backgroundColor: src.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
