'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Target, Plus, CheckCircle2, Trophy, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Goal } from '@/types';
import { formatNumber, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function GoalsPage() {
  const { goals, addGoal, updateGoalProgress, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetMetric, setTargetMetric] = useState<Goal['targetMetric']>('subscribers');
  const [currentVal, setCurrentVal] = useState('248500');
  const [targetVal, setTargetVal] = useState('250000');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [unit, setUnit] = useState('subs');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title,
      targetMetric,
      currentValue: Number(currentVal),
      targetValue: Number(targetVal),
      deadline,
      unit,
    });

    showToast('Goal Created', `"${title}" milestone added to tracker`, 'success');
    setTitle('');
    setModalOpen(false);
  };

  const handleIncrement = (goalId: string, current: number, step: number) => {
    updateGoalProgress(goalId, current + step);
    showToast('Progress Updated', `+${step} logged towards goal`, 'info');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Creator Goal Tracker
              </h1>
              <Badge variant="cyan" size="sm">
                Milestones & KPIs
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Set actionable targets for subscribers, view counts, upload frequency, and monthly revenue.
            </p>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Create New Goal
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round((goal.currentValue / goal.targetValue) * 100)
            );
            const isCompleted = goal.completed || progress >= 100;
            const remaining = Math.max(0, goal.targetValue - goal.currentValue);

            return (
              <div
                key={goal.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-navy-850 space-y-4 transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-slate-200/80 dark:border-navy-750'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {goal.title}
                      </h3>
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          Completed 🎉
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Target Date: {formatDate(goal.deadline)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-brand-600 to-rose-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>
                      Current: <strong>{formatNumber(goal.currentValue)}</strong> {goal.unit}
                    </span>
                    <span>
                      Target: <strong>{formatNumber(goal.targetValue)}</strong> {goal.unit}
                    </span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-750 text-xs">
                    <span className="text-slate-500">
                      Remaining: <strong className="text-slate-800 dark:text-slate-200">{formatNumber(remaining)} {goal.unit}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIncrement(goal.id, goal.currentValue, goal.targetMetric === 'uploads' ? 1 : 250)}
                      >
                        + Quick Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateGoalProgress(goal.id, goal.targetValue)}
                      >
                        Mark Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Goal Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create Creator Goal"
          description="Track your next milestone with real-time progress calculations."
        >
          <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Goal Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reach 260k Subscribers"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Target Metric
                </label>
                <select
                  value={targetMetric}
                  onChange={(e: any) => setTargetMetric(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                >
                  <option value="subscribers">Subscribers</option>
                  <option value="views">Views</option>
                  <option value="revenue">Monthly Revenue ($)</option>
                  <option value="watch_hours">Watch Hours</option>
                  <option value="uploads">Upload Count</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Unit Label
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="subs, views, $, videos"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Current Value
                </label>
                <input
                  type="number"
                  required
                  value={currentVal}
                  onChange={(e) => setCurrentVal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Target Value
                </label>
                <input
                  type="number"
                  required
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-navy-750">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Start Tracking Goal
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}

