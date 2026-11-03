'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  RefreshCw,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { DEMO_AUDIT_METRICS } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';

export default function ChannelAuditPage() {
  const { selectedChannel, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'good'>('all');
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Compute dynamic score based on completed items
  const baseScore = 86;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const dynamicScore = Math.min(100, baseScore + completedCount * 4);

  const toggleTask = (name: string) => {
    const isNowDone = !completedTasks[name];
    setCompletedTasks({ ...completedTasks, [name]: isNowDone });

    if (isNowDone) {
      showToast('Optimization Applied! 🎉', `Remediated: "${name}" (+4 Channel Health points)`, 'success');
    } else {
      showToast('Task Reopened', `Reopened remediation for "${name}"`, 'info');
    }
  };

  const filteredMetrics = DEMO_AUDIT_METRICS.filter((m) => {
    const isCompleted = completedTasks[m.name];
    const currentStatus = isCompleted ? 'good' : m.status;

    if (filter === 'all') return true;
    return currentStatus === filter;
  });

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      setIsRunningAudit(false);
      showToast('Audit Re-Indexed', 'Channel Health evaluated against YouTube algorithmic signals!', 'success');
    }, 1000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Channel Health & Algorithmic Audit
              </h1>
              <Badge variant={dynamicScore >= 90 ? 'success' : 'purple'} size="sm">
                Score: {dynamicScore} / 100
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Interactive health diagnostics evaluating your channel against YouTube’s recommendation signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" isLoading={isRunningAudit} onClick={handleRunAudit}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Re-Scan Channel
            </Button>
          </div>
        </div>

        {/* Big Health Banner */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border-4 border-emerald-500 transition-all">
                <div className="text-center">
                  <span className="text-3xl font-black text-emerald-500">{dynamicScore}</span>
                  <span className="block text-[10px] font-bold text-slate-400">
                    {dynamicScore >= 95 ? 'EXEMPLARY' : dynamicScore >= 85 ? 'EXCELLENT' : 'GOOD'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedChannel.name} is in the top {dynamicScore >= 90 ? '5%' : '12%'} of creator velocity
                  </h3>
                  {completedCount > 0 && (
                    <Badge variant="success" size="sm">
                      +{completedCount * 4} pts improved
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  Your channel demonstrates strong click-through rate and consistent upload pacing. Mark actionable tasks below as completed to improve your algorithmic recommendation velocity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                All Metrics (6)
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all ${
                  filter === 'critical'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Needs Work
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all ${
                  filter === 'warning'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Moderate
              </button>
              <button
                onClick={() => setFilter('good')}
                className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all ${
                  filter === 'good'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
                }`}
              >
                Healthy ({DEMO_AUDIT_METRICS.filter((m) => completedTasks[m.name] || m.status === 'good').length})
              </button>
            </div>
          </div>
        </div>

        {/* Audit Metrics List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMetrics.map((metric) => {
            const isDone = completedTasks[metric.name];
            const currentScore = isDone ? 100 : metric.score;
            const currentStatus = isDone ? 'good' : metric.status;

            return (
              <div
                key={metric.name}
                className={`rounded-2xl border p-5 shadow-sm transition-all space-y-3 ${
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 dark:border-emerald-500/30'
                    : 'border-slate-200/80 bg-white dark:border-navy-750 dark:bg-navy-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentStatus === 'good' && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {currentStatus === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {currentStatus === 'critical' && (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {metric.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isDone ? 'success' : metric.impact === 'High' ? 'danger' : 'default'}
                      size="sm"
                    >
                      {isDone ? 'Remediated' : `${metric.impact} Impact`}
                    </Badge>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {currentScore}/100
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentStatus === 'good'
                        ? 'bg-emerald-500'
                        : currentStatus === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${currentScore}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {metric.description}
                </p>

                <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-700 dark:bg-navy-800 dark:text-slate-300 border border-slate-100 dark:border-navy-750 flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
                      Actionable Remediation:
                    </strong>
                    {metric.actionItem}
                  </div>

                  <button
                    onClick={() => toggleTask(metric.name)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-brand-600 hover:text-white dark:bg-navy-700 dark:text-slate-300'
                    }`}
                  >
                    {isDone ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
