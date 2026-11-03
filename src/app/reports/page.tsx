'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FileSpreadsheet, Download, Printer, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
import { DEMO_DAILY_DATA, DEMO_VIDEOS } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ReportsPage() {
  const { selectedChannel, showToast } = useApp();

  const handleExportFullCSV = () => {
    exportToCSV(`full-report-${selectedChannel.handle}`, DEMO_DAILY_DATA);
    showToast('Export Complete', `Full report exported as full-report-${selectedChannel.handle}.csv`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Weekly Executive Performance Report
              </h1>
              <Badge variant="success" size="sm">
                Week 44 • Generated
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Digestible executive report summarizing channel performance, revenue, and algorithmic health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5 mr-1" /> Print / Save PDF
            </Button>
            <Button size="sm" onClick={handleExportFullCSV}>
              <Download className="h-3.5 w-3.5 mr-1" /> Export Full CSV
            </Button>
          </div>
        </div>

        {/* Printable Executive Report Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-6 print:border-none print:shadow-none">
          {/* Report Top Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-navy-750 gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedChannel.avatar}
                alt=""
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedChannel.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedChannel.handle} • Category: {selectedChannel.category}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <p>Period: <strong>Oct 26 - Nov 02, 2026</strong></p>
              <p>Status: <strong className="text-emerald-500">Peak Velocity</strong></p>
            </div>
          </div>

          {/* 4 Weekly Headline Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Subscribers</span>
              <p className="text-xl font-black text-emerald-500 mt-1">+3,240</p>
              <span className="text-[10px] text-slate-400">+18% vs prior week</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Views</span>
              <p className="text-xl font-black text-blue-500 mt-1">142,800</p>
              <span className="text-[10px] text-slate-400">Avg 20.4k / day</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Watch Hours</span>
              <p className="text-xl font-black text-purple-500 mt-1">11,900 hrs</p>
              <span className="text-[10px] text-slate-400">AVD: 07:42 mins</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Revenue</span>
              <p className="text-xl font-black text-emerald-500 mt-1">$984.50</p>
              <span className="text-[10px] text-slate-400">RPM: $3.91 (Simulated)</span>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-navy-750 dark:bg-navy-800/60 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" /> Key Insights & Algorithmic Diagnosis
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Your channel enjoyed strong recommendation lift this week, primarily propelled by{' '}
              <strong className="text-slate-900 dark:text-white">
                &quot;How I Built a $10k/Month SaaS in 14 Days&quot;
              </strong>. This video registered a <strong>9.4% CTR</strong> and sustained <strong>42.8% retention</strong>, signaling to YouTube that it deserves broader distribution in Suggested Feeds.
            </p>
          </div>

          {/* Wins of the Week vs Areas for Improvement */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Wins of the Week
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Zero upload delays: 2 long-form videos published on schedule.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Shorts feed viewed rate exceeded 80% on both releases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Approaching 250,000 subscriber milestone (99.4% progress).</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" /> Focus for Next Week
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">→</span>
                  <span>Add explicit end-screen verbal teasers to improve 1.8% conversion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">→</span>
                  <span>Test higher contrast text in next video thumbnail.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">→</span>
                  <span>Pin comment on top viral short linking to long-form tutorial.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

