'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Monitor,
  Smartphone,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
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

  // SVG Radial Gauge Geometry: Radius 38, Circumference = 2 * PI * 38 ≈ 238.76
  const score = 92;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Confident Header */}
        <div className="pb-3 border-b border-zinc-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Thumbnail & Clickability Analyzer
            </h1>
            <span className="font-mono text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              Heuristic Vision Model
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Audit packaging contrast, mobile text legibility, facial focal points, and live YouTube feed competition.
          </p>
        </div>

        {/* 2-Column: Upload/Select + AI Vision Scorecard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Selected Thumbnail View */}
          <div className="lg:col-span-2 pro-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Active Thumbnail Asset
              </h3>
              <span className="font-mono text-xs text-zinc-400">1280 × 720 (16:9 standard)</span>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-white/[0.08] shadow-sm bg-black">
              <ThumbnailImage
                src={selectedThumb}
                alt="Selected thumbnail"
                duration="14:28"
                title="Active Thumbnail"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Quick Picker from existing library */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Select from recent video catalog:
                </p>
                <span className="text-[10px] font-mono text-zinc-400">
                  {presetThumbnails.length} assets available
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {presetThumbnails.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumb(item.url)}
                    className={`relative aspect-video overflow-hidden rounded-lg border transition-all ${
                      selectedThumb === item.url
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10 opacity-100 scale-[1.02]'
                        : 'border-zinc-200/80 dark:border-white/[0.08] opacity-60 hover:opacity-100 hover:border-zinc-400 dark:hover:border-white/[0.2]'
                    }`}
                  >
                    <ThumbnailImage
                      src={item.url}
                      alt={item.title}
                      title={item.title}
                      className="h-full w-full object-cover"
                    />
                    {selectedThumb === item.url && (
                      <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Scorecard & Vision Diagnostics */}
          <div className="pro-card p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-1 pb-3 border-b border-zinc-200/80 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Vision Diagnostics Score
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Clickability Pattern:{' '}
                <strong className="text-teal-400 font-mono font-medium">Very High (92/100)</strong>
              </p>
            </div>

            {/* Linear-Style SVG Radial Stroke Gauge */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 96 96">
                  {/* Subtle Background Track */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-zinc-200 dark:stroke-zinc-800"
                    strokeWidth="5.5"
                    fill="transparent"
                  />
                  {/* Glowing Emerald/Teal Stroke */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="#0d9488"
                    strokeWidth="5.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Center Value */}
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                    {score}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">
                    Score
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Metrics Bars */}
            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-700 dark:text-zinc-300">High Color Contrast</span>
                  <span className="text-teal-400 font-semibold">96%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0d9488] rounded-full w-[96%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-700 dark:text-zinc-300">Mobile Text Readability</span>
                  <span className="text-teal-400 font-semibold">88%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0d9488] rounded-full w-[88%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-700 dark:text-zinc-300">Focal Point Clarity (Rule of Thirds)</span>
                  <span className="text-teal-400 font-semibold">94%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0d9488] rounded-full w-[94%]" />
                </div>
              </div>
            </div>

            {/* Polished Recommendation Card */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Packaging Advisory
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Avoid placing focal text in the lower-right quadrant; YouTube’s video timestamp badge (<span className="font-mono text-zinc-300">14:28</span>) overlaps and impairs mobile CTR glanceability.
              </p>
            </div>
          </div>
        </div>

        {/* Live Feed Simulator */}
        <div className="pro-card p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-zinc-200/80 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Live YouTube Feed Comparison Simulator
                <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08] px-2 py-0.5 rounded uppercase">
                  Feed Glance Test
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Inspect how your packaging stands out directly against competing videos in real user recommendation feeds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-white/[0.06]">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
              </div>

              <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-white/[0.06]">
                <button
                  onClick={() => setFeedTheme('dark')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    feedTheme === 'dark'
                      ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Dark Feed
                </button>
                <button
                  onClick={() => setFeedTheme('light')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    feedTheme === 'light'
                      ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  Light Feed
                </button>
              </div>
            </div>
          </div>

          {/* Feed Preview Box */}
          <div
            className={`mt-2 rounded-xl p-5 border transition-colors ${
              feedTheme === 'dark'
                ? 'bg-[#0f0f11] border-zinc-800 text-white'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div
              className={`grid gap-5 ${
                previewMode === 'desktop'
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'max-w-xs mx-auto grid-cols-1'
              }`}
            >
              {/* Card 1: Your Thumbnail with Subtle Indigo Focus */}
              <div className="space-y-2 relative border border-indigo-500/40 rounded-xl p-2 bg-indigo-500/[0.02] shadow-[0_0_20px_-5px_rgba(99,102,241,0.12)]">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img src={selectedThumb} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] text-white">
                    18:42
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                    T
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold line-clamp-2">
                      Your Video Title Appears Here in the Feed
                    </p>
                    <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
                      TechPulse Studio • 148K views • 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Competitor 1 */}
              <div className="space-y-2 opacity-85 hover:opacity-100 transition-opacity">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] text-white">
                    24:10
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                    B
                  </div>
                  <div className="text-xs">
                    <p className="font-medium line-clamp-2 text-zinc-300">
                      Next.js 15 Full Crash Course for 2026
                    </p>
                    <p className="font-mono text-[11px] text-zinc-500 mt-0.5">
                      ByteCode Academy • 450K views • 2 weeks ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Competitor 2 */}
              <div className="space-y-2 opacity-85 hover:opacity-100 transition-opacity">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1677442136019-21780efad99a?w=640&auto=format&fit=crop&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] text-white">
                    12:05
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                    D
                  </div>
                  <div className="text-xs">
                    <p className="font-medium line-clamp-2 text-zinc-300">
                      Building an AI Agent from Scratch with Python
                    </p>
                    <p className="font-mono text-[11px] text-zinc-500 mt-0.5">
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
