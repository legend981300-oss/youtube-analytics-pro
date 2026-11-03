'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { DEMO_AUDIT_METRICS } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';

export default function ChannelAuditPage() {
  const { selectedChannel, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'good'>('all');
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const filteredMetrics = DEMO_AUDIT_METRICS.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      setIsRunningAudit(false);
      showToast('Audit Complete', 'Channel Health Audit re-indexed successfully!', 'success');
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Channel Health & Algorithmic Audit
              </h1>
              <Badge variant="success" size="sm">
                Score: 86 / 100
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Automated audit evaluating your channel against YouTube’s recommendation signals.
            </p>
          </div>

          <Button size="sm" isLoading={isRunningAudit} onClick={handleRunAudit}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Re-Scan Channel
          </Button>
        </div>

        {/* Big Health Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border-4 border-emerald-500">
                <div className="text-center">
                  <span className="text-3xl font-black text-emerald-500">86</span>
                  <span className="block text-[10px] font-bold text-slate-400">EXCELLENT</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedChannel.name} is in the top 12% of creator velocity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  Your channel demonstrates exceptional click-through rate and consistent upload pacing. Addressing your end-screen click-through and the first 30-second retention drop will boost algorithm recommendation velocity by an estimated <strong>+24%</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  filter === 'critical'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Needs Work (1)
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  filter === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Moderate (2)
              </button>
              <button
                onClick={() => setFilter('good')}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  filter === 'good'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Healthy (3)
              </button>
            </div>
          </div>
        </div>

        {/* Audit Metrics List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMetrics.map((metric) => (
            <div
              key={metric.name}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.status === 'good' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {metric.status === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  {metric.status === 'critical' && (
                    <XCircle className="h-4 w-4 text-rose-500" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {metric.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={metric.impact === 'High' ? 'danger' : 'default'}
                    size="sm"
                  >
                    {metric.impact} Impact
                  </Badge>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {metric.score}/100
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    metric.status === 'good'
                      ? 'bg-emerald-500'
                      : metric.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {metric.description}
              </p>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-700 dark:bg-navy-800 dark:text-slate-300 border border-slate-100 dark:border-navy-750">
                <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
                  Actionable Next Step:
                </strong>
                {metric.actionItem}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

