'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { UserCheck, Globe, Users, Languages, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
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
import { formatNumber, exportToCSV } from '@/lib/utils';
import { AUDIENCE_DEMOGRAPHICS } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';

const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_HOURS = ['Morning (6am-12pm)', 'Afternoon (12pm-5pm)', 'Prime Evening (5pm-9pm)', 'Late Night (9pm-12am)'];

// Activity intensity level 1 to 4
const HEATMAP_MATRIX = [
  [2, 3, 4, 2], // Mon
  [2, 3, 4, 3], // Tue (High)
  [2, 4, 4, 2], // Wed
  [2, 3, 4, 3], // Thu
  [3, 4, 4, 3], // Fri (Peak)
  [4, 4, 4, 2], // Sat (All day)
  [4, 4, 3, 2], // Sun
];

export default function AudiencePage() {
  const { selectedChannel, showToast } = useApp();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Audience Demographics & Behavior
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Demographics (Demo)
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Understand viewer age brackets, geographic density, and prime active watch hours.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV('audience-geography', AUDIENCE_DEMOGRAPHICS.geography);
              showToast('Export Complete', 'Audience geography exported to CSV', 'success');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export Geography CSV
          </Button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Core Age Bracket"
            value="25 - 34"
            change={3.2}
            icon={Users}
            iconColor="text-blue-500"
            subtitle="42.1% of all watch time"
          />
          <StatCard
            title="Top Region"
            value="United States"
            change={5.4}
            icon={Globe}
            iconColor="text-purple-500"
            subtitle="38.4% total audience"
          />
          <StatCard
            title="Returning Viewers"
            value="64.2%"
            change={8.8}
            icon={UserCheck}
            iconColor="text-emerald-500"
            subtitle="High channel loyalty score"
          />
          <StatCard
            title="Subtitles Enabled"
            value="48.1%"
            change={11.0}
            icon={Languages}
            iconColor="text-amber-500"
            subtitle="English CC & Spanish"
          />
        </div>

        {/* 2-Column: Age Chart + Gender Pie */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Age Distribution */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Audience Age Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Distribution of viewers by age group (%).
            </p>

            <ChartWrapper heightClass="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AUDIENCE_DEMOGRAPHICS.age} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Audience Share']} />
                  <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Gender Distribution */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Gender Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Audience share by gender identity.
            </p>

            <ChartWrapper heightClass="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AUDIENCE_DEMOGRAPHICS.gender}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {AUDIENCE_DEMOGRAPHICS.gender.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <div className="flex justify-center gap-4 text-xs mt-3">
              {AUDIENCE_DEMOGRAPHICS.gender.map((g) => (
                <div key={g.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {g.name} ({g.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* When Viewers Are on YouTube Heatmap */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="pb-3 border-b border-slate-100 dark:border-navy-750">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              When Your Viewers Are on YouTube
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Darker purple blocks represent peak simultaneous active viewers. Ideal upload window: <strong>Tuesday & Friday at 2:00 PM EST</strong>.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="text-slate-400 text-[11px] font-semibold">
                  <th className="text-left pb-2 w-16">Day</th>
                  {HEATMAP_HOURS.map((h) => (
                    <th key={h} className="pb-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {HEATMAP_DAYS.map((day, dIdx) => (
                  <tr key={day}>
                    <td className="text-left py-2 font-bold text-slate-800 dark:text-slate-200">
                      {day}
                    </td>
                    {HEATMAP_HOURS.map((h, hIdx) => {
                      const level = HEATMAP_MATRIX[dIdx][hIdx];
                      const bgClasses = [
                        'bg-purple-500/10 text-purple-300',
                        'bg-purple-500/25 text-purple-200',
                        'bg-purple-500/50 text-white font-medium',
                        'bg-purple-600 text-white font-bold shadow-sm',
                      ][level - 1];

                      return (
                        <td key={h} className="p-1">
                          <div className={`h-8 rounded-lg flex items-center justify-center text-[10px] ${bgClasses}`}>
                            {level === 4 ? '🔥 Peak' : level === 3 ? 'High' : 'Moderate'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Geographies Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Top Geographies by Views
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Audience regions contributing the most views and highest AdSense CPMs.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-750 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Country / Territory</th>
                  <th className="pb-3">Estimated Views</th>
                  <th className="pb-3">Audience Share</th>
                  <th className="pb-3">Average CPM Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-750">
                {AUDIENCE_DEMOGRAPHICS.geography.map((geo) => (
                  <tr key={geo.code} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                      {geo.country}
                    </td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">
                      {formatNumber(geo.views)}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${geo.percentage}%` }} />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{geo.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-medium text-emerald-500">
                      {geo.code === 'US' || geo.code === 'GB' || geo.code === 'DE' || geo.code === 'CA'
                        ? 'Tier 1 ($7 - $14 CPM)'
                        : 'Standard Global'}
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
