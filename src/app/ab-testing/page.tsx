'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Copy,
  Smartphone,
  Monitor,
  Flame,
  Eye,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { SearchFeedSimulator } from '@/components/ab-testing/SearchFeedSimulator';

interface VariantData {
  title: string;
  thumbnailUrl: string;
}

export default function AbTestingPage() {
  const { showToast, addIdea } = useApp();

  const [variantA, setVariantA] = useState<VariantData>({
    title: 'How I Built a Full Stack SaaS with Next.js 14 in 7 Days',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  });

  const [variantB, setVariantB] = useState<VariantData>({
    title: 'Stop Building SaaS Wrong! The 2026 Next.js Blueprint',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  });

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Heuristic Analysis for Titles
  const analyzeTitle = (title: string) => {
    const powerWords = ['stop', 'wrong', 'secret', 'never', 'how i', 'blueprint', 'tested', 'insane', 'proven', 'shocking'];
    const lower = title.toLowerCase();
    const hasPowerWord = powerWords.some((pw) => lower.includes(pw));
    const hasNumber = /\d+/.test(title);
    const hasBrackets = /[\(\[\{\]\}\)]/.test(title);
    const len = title.length;

    let score = 50;
    if (len >= 40 && len <= 65) score += 20;
    else if (len < 30 || len > 80) score -= 15;
    else score += 10;

    if (hasPowerWord) score += 15;
    if (hasNumber) score += 10;
    if (hasBrackets) score += 5;

    const finalScore = Math.min(Math.max(score, 35), 98);
    const predictedCtr = (finalScore / 9.5).toFixed(1);

    return {
      score: finalScore,
      predictedCtr: `${predictedCtr}%`,
      length: len,
      hasPowerWord,
      hasNumber,
      hasBrackets,
    };
  };

  const statsA = analyzeTitle(variantA.title);
  const statsB = analyzeTitle(variantB.title);

  const winner = statsA.score >= statsB.score ? 'A' : 'B';
  const scoreDiff = Math.abs(statsA.score - statsB.score);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `Title copied: "${text.substring(0, 30)}..."`, 'info');
  };

  const handleSaveToVault = (title: string) => {
    addIdea({
      title,
      category: 'A/B Experiment',
      targetKeywords: ['ab testing', 'high ctr'],
      predictedPotential: 'Very High',
      status: 'idea',
      tags: ['A/B Tested', 'High CTR'],
      notes: `Winner of A/B test simulation with predicted CTR of ${winner === 'A' ? statsA.predictedCtr : statsB.predictedCtr}`,
    });
    showToast('Saved to Vault', 'Variant saved to your Video Idea Vault!', 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                A/B Testing Simulator Lab
              </h1>
              <Badge variant="purple" size="sm">
                Pro Lab
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Simulate and compare two title and thumbnail combinations to predict click-through rates before publishing.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-navy-750 dark:bg-navy-850">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile Feed
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop Feed
            </button>
          </div>
        </div>

        {/* Winner Announcement Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent p-5 text-xs shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Recommended Winner: Variant {winner}
                  </span>
                  <Badge variant="success" size="sm">
                    +{scoreDiff} pts higher potential
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Variant {winner} scores higher in curiosity-gap triggers and optimal character density. It is projected to yield an estimated click-through rate of{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {winner === 'A' ? statsA.predictedCtr : statsB.predictedCtr}
                  </strong>.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => handleSaveToVault(winner === 'A' ? variantA.title : variantB.title)}
            >
              Use Winner in Vault
            </Button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variant A Card */}
          <div
            className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-navy-850 transition-all ${
              winner === 'A'
                ? 'border-emerald-500/50 shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                : 'border-slate-200/80 dark:border-navy-750'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/10 text-xs font-bold text-brand-600 dark:text-brand-400">
                  A
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Variant A (Baseline)</h3>
              </div>
              {winner === 'A' && (
                <Badge variant="success" size="sm">
                  Recommended
                </Badge>
              )}
            </div>

            <div className="mt-4 space-y-4">
              {/* Inputs */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Video Title
                </label>
                <textarea
                  rows={2}
                  value={variantA.title}
                  onChange={(e) => setVariantA({ ...variantA, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-900 dark:text-white"
                />
              </div>

              {/* Thumbnail Preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Thumbnail Preview
                </label>
                <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-100 dark:bg-navy-950">
                  <ThumbnailImage
                    src={variantA.thumbnailUrl}
                    alt="Variant A Thumbnail"
                    title={variantA.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Heuristic Scores */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900">
                  <span className="text-[10px] text-slate-400">Optimization Score</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {statsA.score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900">
                  <span className="text-[10px] text-slate-400">Predicted CTR</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {statsA.predictedCtr}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Length ({statsA.length} chars)</span>
                  <span className={statsA.length >= 40 && statsA.length <= 65 ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
                    {statsA.length >= 40 && statsA.length <= 65 ? 'Optimal (40–65)' : 'Sub-optimal'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curiosity / Power Words</span>
                  <span className={statsA.hasPowerWord ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                    {statsA.hasPowerWord ? 'Present (+15)' : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Specific Numbers</span>
                  <span className={statsA.hasNumber ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                    {statsA.hasNumber ? 'Detected (+10)' : 'Missing'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-navy-750">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCopy(variantA.title)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Title
                </Button>
              </div>
            </div>
          </div>

          {/* Variant B Card */}
          <div
            className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-navy-850 transition-all ${
              winner === 'B'
                ? 'border-emerald-500/50 shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                : 'border-slate-200/80 dark:border-navy-750'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">
                  B
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Variant B (Challenger)</h3>
              </div>
              {winner === 'B' && (
                <Badge variant="success" size="sm">
                  Recommended
                </Badge>
              )}
            </div>

            <div className="mt-4 space-y-4">
              {/* Inputs */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Video Title
                </label>
                <textarea
                  rows={2}
                  value={variantB.title}
                  onChange={(e) => setVariantB({ ...variantB, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-900 dark:text-white"
                />
              </div>

              {/* Thumbnail Preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Thumbnail Preview
                </label>
                <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-100 dark:bg-navy-950">
                  <ThumbnailImage
                    src={variantB.thumbnailUrl}
                    alt="Variant B Thumbnail"
                    title={variantB.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Heuristic Scores */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900">
                  <span className="text-[10px] text-slate-400">Optimization Score</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {statsB.score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900">
                  <span className="text-[10px] text-slate-400">Predicted CTR</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {statsB.predictedCtr}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Length ({statsB.length} chars)</span>
                  <span className={statsB.length >= 40 && statsB.length <= 65 ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
                    {statsB.length >= 40 && statsB.length <= 65 ? 'Optimal (40–65)' : 'Sub-optimal'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curiosity / Power Words</span>
                  <span className={statsB.hasPowerWord ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                    {statsB.hasPowerWord ? 'Present (+15)' : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Specific Numbers</span>
                  <span className={statsB.hasNumber ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                    {statsB.hasNumber ? 'Detected (+10)' : 'Missing'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-navy-750">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCopy(variantB.title)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Title
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Simulator Preview */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                YouTube Feed Mock Simulator ({previewDevice === 'mobile' ? 'Mobile App View' : 'Desktop Grid View'})
              </h3>
              <p className="text-[11px] text-slate-500">
                Inspect how viewers will see your video as they scroll through their YouTube recommendation feed.
              </p>
            </div>
            <Badge variant="cyan" size="sm">
              Live Mockup
            </Badge>
          </div>

          <div
            className={`grid gap-6 ${
              previewDevice === 'mobile'
                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {/* Feed Card A */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Feed Variant A
              </span>
              <div className="aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-navy-950 relative">
                <ThumbnailImage
                  src={variantA.thumbnailUrl}
                  alt="Feed Card A"
                  title={variantA.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[9px] font-mono text-white">
                  12:45
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                {variantA.title}
              </p>
              <p className="text-[10px] text-slate-400">
                Alex Rivera • 42K views • 2 days ago
              </p>
            </div>

            {/* Feed Card B */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-900 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Feed Variant B
              </span>
              <div className="aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-navy-950 relative">
                <ThumbnailImage
                  src={variantB.thumbnailUrl}
                  alt="Feed Card B"
                  title={variantB.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[9px] font-mono text-white">
                  12:45
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                {variantB.title}
              </p>
              <p className="text-[10px] text-slate-400">
                Alex Rivera • 42K views • 2 days ago
              </p>
            </div>
          </div>
        </div>

        {/* Live YouTube Search Feed Simulator & Eye-Tracking Standout Lab */}
        <SearchFeedSimulator variantA={variantA} variantB={variantB} />
      </div>
    </AppShell>
  );
}
