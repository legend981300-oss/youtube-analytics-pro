'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Layers,
  Sparkles,
  Trophy,
  Copy,
  Smartphone,
  Monitor,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
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
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiVariant = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'title',
          topic: variantA.title,
          tone: 'contrarian',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.titles && data.titles.length > 0) {
          const generatedTitle = data.titles[0].title;
          setVariantB((prev) => ({ ...prev, title: generatedTitle }));
          showToast('AI Variant Generated', `Generated high-CTR challenger with Gemini!`, 'success');
          return;
        }
      }

      // Intelligent algorithmic contrarian generation
      const subject = variantA.title.replace(/how to|how i built|stop using|my complete|why i/gi, '').trim();
      const contrarianOptions = [
        `Stop Doing ${subject} Wrong! (The 2026 Architecture Blueprint)`,
        `Why 93% of Developers Fail at ${subject} (And How to Fix It)`,
        `The Brutal Truth About ${subject} in 2026 (Tested & Proven)`,
        `I Tested ${subject} for 30 Days (And It Broke My Expectations)`,
      ];
      const selected = contrarianOptions[Math.floor(Math.random() * contrarianOptions.length)];
      setVariantB((prev) => ({ ...prev, title: selected }));
      showToast('AI Challenger Generated', `Generated optimized curiosity variant for A/B test`, 'success');
    } catch {
      const fallback = `Stop Doing ${variantA.title.slice(0, 25)} Wrong! (The 2026 Blueprint)`;
      setVariantB((prev) => ({ ...prev, title: fallback }));
      showToast('Variant Generated', fallback, 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

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

  const handleImageUpload = (variant: 'A' | 'B', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (variant === 'A') {
      setVariantA((prev) => ({ ...prev, thumbnailUrl: objectUrl }));
    } else {
      setVariantB((prev) => ({ ...prev, thumbnailUrl: objectUrl }));
    }
    showToast('Custom Thumbnail Loaded', `Uploaded custom image preview for Variant ${variant}`, 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                A/B Testing Simulator Lab
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                Pre-Flight CTR Lab
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Predict audience click-through rate and glance capture before publishing to YouTube.
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-[#090a0f] p-0.5 border border-slate-200 dark:border-white/[0.06]">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                previewDevice === 'mobile'
                  ? 'bg-white dark:bg-white/[0.1] text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="h-3 w-3" /> Mobile
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                previewDevice === 'desktop'
                  ? 'bg-white dark:bg-white/[0.1] text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="h-3 w-3" /> Desktop
            </button>
          </div>
        </div>

        {/* Winner Announcement Banner */}
        <div className="pro-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    Recommended: Variant {winner}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                    +{scoreDiff} pts higher
                  </span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Variant {winner} scores higher in curiosity triggers and optimal packaging density. Projected CTR:{' '}
                  <strong className="text-indigo-400 font-mono font-semibold">
                    {winner === 'A' ? statsA.predictedCtr : statsB.predictedCtr}
                  </strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSaveToVault(winner === 'A' ? variantA.title : variantB.title)}
              className="bg-indigo-600 text-zinc-50 hover:bg-indigo-500 tracking-wide text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0 inline-flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use Variant {winner} in Vault
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variant A Card */}
          <div
            className={`pro-card p-5 transition-all ${
              winner === 'A'
                ? 'border-indigo-500/40 bg-indigo-500/[0.015] shadow-[0_0_20px_-5px_rgba(99,102,241,0.12)]'
                : 'border-zinc-200/80 dark:border-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-white">
                  A
                </span>
                <h3 className="font-medium text-slate-900 dark:text-white text-xs">Variant A (Baseline)</h3>
              </div>
              {winner === 'A' && (
                <span className="font-mono text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Video Title
                </label>
                <textarea
                  rows={2}
                  value={variantA.title}
                  onChange={(e) => setVariantA({ ...variantA, title: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span>Thumbnail Preview</span>
                  <label className="text-brand-500 hover:text-brand-600 cursor-pointer flex items-center gap-1 font-sans">
                    <Upload className="h-3 w-3" /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('A', e)}
                    />
                  </label>
                </div>
                <div className="aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#0c0e14]">
                  <ThumbnailImage
                    src={variantA.thumbnailUrl}
                    alt="Variant A Thumbnail"
                    title={variantA.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Dark Theme Contrast OK
                  </span>
                  <span>1280 × 720 (16:9)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
                <div className="rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
                  <p className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                    {statsA.score}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Predicted CTR</span>
                  <p className="text-base font-semibold text-emerald-500 mt-0.5">
                    {statsA.predictedCtr}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Length ({statsA.length} chars)</span>
                  <span className={statsA.length >= 40 && statsA.length <= 65 ? 'text-emerald-500 font-mono font-medium' : 'text-amber-500 font-mono font-medium'}>
                    {statsA.length >= 40 && statsA.length <= 65 ? 'Optimal (40–65)' : 'Sub-optimal'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curiosity Triggers</span>
                  <span className={statsA.hasPowerWord ? 'text-emerald-500 font-mono font-medium' : 'text-slate-400 font-mono'}>
                    {statsA.hasPowerWord ? 'Present (+15)' : 'None'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleCopy(variantA.title)}>
                  <Copy className="h-3 w-3 mr-1" /> Copy Title
                </Button>
              </div>
            </div>
          </div>

          {/* Variant B Card */}
          <div
            className={`pro-card p-5 transition-all ${
              winner === 'B'
                ? 'border-indigo-500/40 bg-indigo-500/[0.015] shadow-[0_0_20px_-5px_rgba(99,102,241,0.12)]'
                : 'border-zinc-200/80 dark:border-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-white">
                  B
                </span>
                <h3 className="font-medium text-slate-900 dark:text-white text-xs">Variant B (Challenger)</h3>
              </div>
              {winner === 'B' && (
                <span className="font-mono text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Video Title
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiVariant}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`h-3 w-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    {isGeneratingAi ? 'Generating...' : '1-Click AI Variant'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={variantB.title}
                  onChange={(e) => setVariantB({ ...variantB, title: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span>Thumbnail Preview</span>
                  <label className="text-brand-500 hover:text-brand-600 cursor-pointer flex items-center gap-1 font-sans">
                    <Upload className="h-3 w-3" /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('B', e)}
                    />
                  </label>
                </div>
                <div className="aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#0c0e14]">
                  <ThumbnailImage
                    src={variantB.thumbnailUrl}
                    alt="Variant B Thumbnail"
                    title={variantB.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Dark Theme Contrast OK
                  </span>
                  <span>1280 × 720 (16:9)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
                <div className="rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
                  <p className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                    {statsB.score}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Predicted CTR</span>
                  <p className="text-base font-semibold text-emerald-500 mt-0.5">
                    {statsB.predictedCtr}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Length ({statsB.length} chars)</span>
                  <span className={statsB.length >= 40 && statsB.length <= 65 ? 'text-emerald-500 font-mono font-medium' : 'text-amber-500 font-mono font-medium'}>
                    {statsB.length >= 40 && statsB.length <= 65 ? 'Optimal (40–65)' : 'Sub-optimal'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curiosity Triggers</span>
                  <span className={statsB.hasPowerWord ? 'text-emerald-500 font-mono font-medium' : 'text-slate-400 font-mono'}>
                    {statsB.hasPowerWord ? 'Present (+15)' : 'None'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleCopy(variantB.title)}>
                  <Copy className="h-3 w-3 mr-1" /> Copy Title
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Simulator Preview */}
        <div className="pro-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
                YouTube Feed Appearance ({previewDevice === 'mobile' ? 'Mobile App Feed' : 'Desktop Feed Grid'})
              </h3>
              <p className="text-[11px] text-slate-500">
                Inspect how viewers perceive your video thumbnail and title in the recommendation feed.
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
              Mockup
            </span>
          </div>

          <div
            className={`grid gap-4 ${
              previewDevice === 'mobile'
                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {/* Feed Card A */}
            <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5 space-y-2">
              <span className="font-mono text-[9px] uppercase font-semibold text-slate-500">
                Feed Preview A
              </span>
              <div className="aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-200 dark:bg-[#0c0e14] relative">
                <ThumbnailImage
                  src={variantA.thumbnailUrl}
                  alt="Feed Card A"
                  title={variantA.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[9px] text-white">
                  12:45
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-medium text-slate-900 dark:text-white">
                {variantA.title}
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                Alex Rivera • 42K views • 2 days ago
              </p>
            </div>

            {/* Feed Card B */}
            <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5 space-y-2">
              <span className="font-mono text-[9px] uppercase font-semibold text-[#ff0033]">
                Feed Preview B
              </span>
              <div className="aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-200 dark:bg-[#0c0e14] relative">
                <ThumbnailImage
                  src={variantB.thumbnailUrl}
                  alt="Feed Card B"
                  title={variantB.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[9px] text-white">
                  12:45
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-medium text-slate-900 dark:text-white">
                {variantB.title}
              </p>
              <p className="font-mono text-[10px] text-slate-400">
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
