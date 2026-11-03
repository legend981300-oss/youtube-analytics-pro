'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Image as ImageIcon, Sparkles, CheckCircle2, AlertTriangle, Eye, Monitor, Smartphone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { DEMO_VIDEOS } from '@/lib/demo-data';

export default function ThumbnailAnalyzerPage() {
  const [selectedThumb, setSelectedThumb] = useState(DEMO_VIDEOS[0].thumbnail);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [feedTheme, setFeedTheme] = useState<'dark' | 'light'>('dark');

  const presetThumbnails = DEMO_VIDEOS.map((v) => ({
    title: v.title,
    url: v.thumbnail,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Thumbnail & Clickability Analyzer
            </h1>
            <Badge variant="purple" size="sm">
              Heuristic Vision Model (Demo)
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Audit contrast, text legibility, facial focal points, and preview how your thumbnail competes in live YouTube feeds.
          </p>
        </div>

        {/* 2-Column: Upload/Select + AI Vision Scorecard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Selected Thumbnail View */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Thumbnail Asset
              </h3>
              <span className="text-xs text-slate-400">1280 x 720 (16:9 standard)</span>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-navy-700 shadow-md">
              <ThumbnailImage
                src={selectedThumb}
                alt="Selected thumbnail"
                duration="14:28"
                title="Active Thumbnail"
                className="h-full w-full"
              />
            </div>

            {/* Quick Picker from existing library */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Or select from your recent video catalog:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetThumbnails.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumb(item.url)}
                    className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                      selectedThumb === item.url
                        ? 'border-brand-500 ring-2 ring-brand-500/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ThumbnailImage
                      src={item.url}
                      alt={item.title}
                      title={item.title}
                      className="h-full w-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Scorecard & Vision Diagnostics */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-navy-750">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vision Diagnostics Score
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clickability Pattern: <strong className="text-emerald-500">Heuristic Rating: Very High (Demo)</strong>
              </p>
            </div>

            <div className="flex items-center justify-center my-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border-4 border-emerald-500">
                <span className="text-3xl font-black text-emerald-500">92</span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    High Color Contrast
                  </span>
                  <span className="text-emerald-500 font-bold">96%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Mobile Text Readability
                  </span>
                  <span className="text-emerald-500 font-bold">88%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Focal Point Clarity (Rule of Thirds)
                  </span>
                  <span className="text-emerald-500 font-bold">94%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-navy-800 p-3 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-navy-750">
                <p className="font-bold text-slate-900 dark:text-white">Recommendation:</p>
                <p>
                  Avoid placing text in the lower right corner, as YouTube’s duration badge overlay (14:28) will obscure it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Simulator */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live YouTube Feed Comparison Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                See how your thumbnail stands out right next to competitor videos in the recommendation feed.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-slate-100 dark:bg-navy-950 p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                    previewMode === 'desktop'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-navy-750 dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                    previewMode === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-navy-750 dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
              </div>

              <div className="flex items-center rounded-lg bg-slate-100 dark:bg-navy-950 p-1">
                <button
                  onClick={() => setFeedTheme('dark')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    feedTheme === 'dark'
                      ? 'bg-navy-900 text-white'
                      : 'text-slate-500'
                  }`}
                >
                  YT Dark
                </button>
                <button
                  onClick={() => setFeedTheme('light')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    feedTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  YT Light
                </button>
              </div>
            </div>
          </div>

          {/* Feed Preview Box */}
          <div
            className={`mt-4 rounded-2xl p-5 border transition-colors ${
              feedTheme === 'dark'
                ? 'bg-[#0f0f0f] border-zinc-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`grid gap-5 ${
                previewMode === 'desktop'
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'max-w-xs mx-auto grid-cols-1'
              }`}
            >
              {/* Card 1: Your Thumbnail */}
              <div className="space-y-2 relative ring-2 ring-brand-500 rounded-xl p-1 bg-brand-500/5">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img src={selectedThumb} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white">
                    18:42
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold line-clamp-2">
                      Your Video Title Appears Here in the Feed
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      TechPulse Studio • 148K views • 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Competitor 1 */}
              <div className="space-y-2 opacity-90">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white">
                    24:10
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold line-clamp-2">
                      Next.js 15 Full Crash Course for 2026
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      ByteCode Academy • 450K views • 2 weeks ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Competitor 2 */}
              <div className="space-y-2 opacity-90">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1677442136019-21780efad99a?w=640&auto=format&fit=crop&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white">
                    12:05
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold line-clamp-2">
                      Building an AI Agent from Scratch with Python
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      DevMatrix Official • 310K views • 1 week ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

