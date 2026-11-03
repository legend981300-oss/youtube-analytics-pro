'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GitCompare, TrendingUp, Users, Video, Target, Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_COMPETITORS } from '@/lib/demo-data';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
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

export default function ChannelComparisonPage() {
  const { selectedChannel, addIdea, showToast } = useApp();
  const [addedGaps, setAddedGaps] = useState<Record<string, boolean>>({});

  const comparisonData = [
    {
      name: selectedChannel.name,
      subscribers: selectedChannel.subscribers,
      avgViews: 58000,
      monthlyGrowth: 5.6,
      engagement: 8.2,
      isYourChannel: true,
    },
    ...DEMO_COMPETITORS.map((c) => ({
      name: c.name,
      subscribers: c.subscribers,
      avgViews: c.avgViewsPerVideo,
      monthlyGrowth: c.subGrowthRate,
      engagement: c.engagementRate,
      isYourChannel: false,
    })),
  ];

  const contentGaps = [
    {
      id: 'gap-1',
      topic: 'Full Stack AI Agent with LangChain v0.3',
      competitor: 'DevMatrix Official',
      views: '310k views in 7 days',
      opportunityScore: 'Very High',
      suggestedTitle: 'Build an Autonomous Coding Agent in 45 Minutes (Full Stack)',
    },
    {
      id: 'gap-2',
      topic: 'Next.js 15 Server Actions Deep Dive & Security',
      competitor: 'ByteCode Academy',
      views: '450k views in 14 days',
      opportunityScore: 'High',
      suggestedTitle: 'Why Next.js Server Actions Are Vulnerable (And How to Fix It)',
    },
    {
      id: 'gap-3',
      topic: 'How Solo Developers Price B2B Micro-SaaS',
      competitor: 'SaaS Builder Club',
      views: '290k views in 21 days',
      opportunityScore: 'High',
      suggestedTitle: 'The SaaS Pricing Formula That Quadrupled My MRR',
    },
  ];

  const handleAddGapToVault = (gap: typeof contentGaps[0]) => {
    addIdea({
      title: gap.suggestedTitle,
      category: 'Competitive Gap',
      targetKeywords: [gap.topic.toLowerCase()],
      predictedPotential: 'Very High',
      status: 'idea',
      notes: `Inspired by competitor ${gap.competitor} (${gap.views}).`,
      tags: ['CompetitorGap', 'Trending'],
    });
    setAddedGaps((prev) => ({ ...prev, [gap.id]: true }));
    showToast('Gap Added to Vault', `"${gap.suggestedTitle.slice(0, 30)}..." saved to Idea Vault`, 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Competitor & Channel Benchmark
              </h1>
              <Badge variant="purple" size="sm">
                Demo Benchmarks
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Benchmark your growth velocity and identify untapped content opportunities against peers.
            </p>
          </div>
        </div>

        {/* Competitor Cards Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Your Channel Card */}
          <div className="rounded-2xl border-2 border-brand-500/40 bg-white p-4 shadow-sm dark:bg-navy-850 relative">
            <span className="absolute -top-2.5 right-4 rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-extrabold text-white">
              YOUR CHANNEL
            </span>
            <div className="flex items-center gap-3">
              <img src={selectedChannel.avatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-500/30" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {selectedChannel.name}
                </h4>
                <p className="text-[10px] text-slate-400">{selectedChannel.handle}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-navy-750 pt-2">
              <div>
                <span className="text-[10px] text-slate-400">Subscribers</span>
                <p className="font-bold text-slate-900 dark:text-white">{formatNumber(selectedChannel.subscribers)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Mo. Growth</span>
                <p className="font-bold text-emerald-500">+5.6%</p>
              </div>
            </div>
          </div>

          {/* Competitor Cards */}
          {DEMO_COMPETITORS.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-navy-750 dark:bg-navy-850"
            >
              <div className="flex items-center gap-3">
                <img src={comp.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {comp.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">{comp.handle}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-navy-750 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400">Subscribers</span>
                  <p className="font-bold text-slate-900 dark:text-white">{formatNumber(comp.subscribers)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Mo. Growth</span>
                  <p className="font-bold text-emerald-500">+{comp.subGrowthRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparative Chart: Avg Views & Subscribers */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Channel Scale & Engagement Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing total audience and average views generated per upload.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <Tooltip formatter={(value: any, name: any) => [formatNumber(Number(value)), name]} />
                  <Legend />
                  <Bar dataKey="subscribers" name="Subscribers" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgViews" name="Avg Views / Video" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Content Gap Analysis */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-750">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Algorithmic Content Gap Opportunities
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            These topics recently drove breakout traffic for competitors while your channel has not covered them yet.
          </p>

          <div className="space-y-3">
            {contentGaps.map((gap) => (
              <div
                key={gap.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {gap.topic}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {gap.opportunityScore} Opportunity
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Validated by <strong className="text-slate-700 dark:text-slate-300">{gap.competitor}</strong> ({gap.views})
                  </p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                    Suggested angle: &quot;{gap.suggestedTitle}&quot;
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={addedGaps[gap.id] ? 'secondary' : 'primary'}
                  onClick={() => handleAddGapToVault(gap)}
                  disabled={addedGaps[gap.id]}
                >
                  {addedGaps[gap.id] ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" /> Added to Vault
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add to Idea Vault
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
