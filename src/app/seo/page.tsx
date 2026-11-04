'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Plus,
  Info,
  Bookmark,
} from 'lucide-react';
import { DEMO_KEYWORDS } from '@/lib/demo-data';
import { KeywordInsight } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { useApp } from '@/context/AppContext';

const POWER_WORDS = [
  'how to',
  'why',
  'secrets',
  'ultimate',
  'guide',
  'complete',
  'full',
  'architecture',
  'roadmap',
  'tested',
  'mistakes',
  'best',
  'fast',
  'simple',
  'step by step',
  'free',
  'fix',
  'stop',
];

export default function SeoPage() {
  const { addIdea, showToast } = useApp();

  // Live URL Inspector state
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isInspecting, setIsInspecting] = useState(false);

  // SEO Analyzer state
  const [title, setTitle] = useState(
    'How I Built a $10k/Month SaaS in 14 Days (Full Architecture)'
  );
  const [description, setDescription] = useState(
    'In this video, I walk through the full stack architecture of my micro-SaaS, covering Next.js 15, PostgreSQL database, Supabase authentication, and Stripe payments.\n\nTimestamps:\n0:00 - Introduction\n01:30 - System Design\n04:15 - Next.js Setup\n12:00 - Deployment\n\nGitHub Repo & Code:\nhttps://github.com/demo/saas-starter'
  );
  const [tags, setTags] = useState('nextjs, saas, typescript, react, startups, webdev');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Keyword tool state
  const [keywordQuery, setKeywordQuery] = useState('');
  const [keywordsList, setKeywordsList] = useState<KeywordInsight[]>(DEMO_KEYWORDS);

  const handleInspectUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = videoUrlInput.trim();
    if (!trimmed) {
      showToast('URL Required', 'Please paste a valid YouTube video link or ID', 'warning');
      return;
    }

    setIsInspecting(true);
    try {
      const res = await fetch(`/api/youtube/video-inspect?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTitle(data.title || title);
        if (data.description) setDescription(data.description);
        if (data.tags) setTags(data.tags);
        showToast(
          data.provider === 'youtube_data_api_v3' ? 'Verified YouTube Metadata Extracted' : 'Video Data Loaded',
          `Imported "${(data.title || '').slice(0, 36)}..." for SEO audit`,
          'success'
        );
      } else {
        showToast('Lookup Notice', data.error || 'Could not fetch video metadata', 'warning');
      }
    } catch (err) {
      showToast('Network Notice', 'Failed to inspect YouTube URL', 'error');
    } finally {
      setIsInspecting(false);
    }
  };

  // Dynamic SEO Analysis Calculations
  const titleLen = title.trim().length;
  const descLen = description.trim().length;
  const tagsList = useMemo(() => {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [tags]);

  const hasGoodTitleLength = titleLen >= 40 && titleLen <= 70;
  const hasNumbers = /\d/.test(title);
  const hasParenthesesOrBrackets = /[()[\]{}]/.test(title);
  const hasPowerWord = POWER_WORDS.some((pw) => title.toLowerCase().includes(pw));
  const hasTimestamps = /0:00|\b\d{1,2}:\d{2}\b/.test(description);
  const hasLinkInDesc = /https?:\/\/|github\.com|twitter\.com|x\.com/.test(description);
  const hasGoodDescLength = descLen >= 150;
  const hasGoodTags = tagsList.length >= 5;

  // Compute live score dynamically (0 - 100)
  const seoScore = useMemo(() => {
    let score = 0;
    if (hasGoodTitleLength) score += 20;
    else if (titleLen >= 25 && titleLen <= 80) score += 10;

    if (hasNumbers) score += 15;
    if (hasParenthesesOrBrackets) score += 10;
    if (hasPowerWord) score += 15;
    if (hasTimestamps) score += 15;
    if (hasGoodDescLength) score += 10;
    if (hasLinkInDesc) score += 5;
    if (hasGoodTags) score += 10;

    return Math.min(score, 100);
  }, [
    hasGoodTitleLength,
    titleLen,
    hasNumbers,
    hasParenthesesOrBrackets,
    hasPowerWord,
    hasTimestamps,
    hasGoodDescLength,
    hasLinkInDesc,
    hasGoodTags,
  ]);

  // Actionable live recommendations based on current input
  const recommendations = useMemo(() => {
    const list: string[] = [];
    if (titleLen < 40) {
      list.push('Lengthen title to 40-70 characters to maximize search click-through rate.');
    } else if (titleLen > 70) {
      list.push(`Title has ${titleLen} characters; truncate below 70 to avoid cut-off on mobile devices.`);
    }
    if (!hasNumbers) {
      list.push('Add a specific number (e.g., "$10k", "14 Days", "5 Tips") to trigger curiosity.');
    }
    if (!hasParenthesesOrBrackets) {
      list.push('Add brackets (e.g., "[Full Architecture]" or "(2026)") to create contrast.');
    }
    if (!hasPowerWord) {
      list.push('Include a high-intent power word (e.g., "Tested", "Step by Step", "How To", "Ultimate").');
    }
    if (!hasTimestamps) {
      list.push('Add chapter timestamps (starting with 0:00) to rank in Google Key Moments.');
    }
    if (!hasGoodDescLength) {
      list.push('Expand description above 150 characters to provide context for semantic search.');
    }
    if (!hasGoodTags) {
      list.push('Add at least 5 targeted comma-separated tags.');
    }
    return list;
  }, [
    titleLen,
    hasNumbers,
    hasParenthesesOrBrackets,
    hasPowerWord,
    hasTimestamps,
    hasGoodDescLength,
    hasGoodTags,
  ]);

  const handleCopyFullMetadata = () => {
    const fullText = `Title:\n${title}\n\nDescription:\n${description}\n\nTags:\n${tags}`;
    navigator.clipboard.writeText(fullText);
    setCopiedKey('full-meta');
    showToast('Metadata Copied', 'Title, description, and tags copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToVault = () => {
    addIdea({
      title,
      category: 'Optimized Concept',
      targetKeywords: tagsList,
      predictedPotential: seoScore >= 80 ? 'Very High' : 'High',
      status: 'idea',
      notes: `SEO Score: ${seoScore}/100\n\n${description.slice(0, 200)}...`,
      tags: tagsList,
    });
    showToast('Saved to Idea Vault', `"${title.slice(0, 30)}..." added to production pipeline`, 'success');
  };

  const handleAddKeywordToTags = (kw: string) => {
    if (tagsList.includes(kw)) {
      showToast('Already Added', `"${kw}" is already in your tags list`, 'warning');
      return;
    }
    const newTags = tags ? `${tags}, ${kw}` : kw;
    setTags(newTags);
    showToast('Tag Added', `Added "${kw}" to metadata editor`, 'success');
  };

  const handleSearchKeywords = () => {
    const q = keywordQuery.trim().toLowerCase();
    if (!q) {
      setKeywordsList(DEMO_KEYWORDS);
      return;
    }

    const matches = DEMO_KEYWORDS.filter(
      (k) =>
        k.keyword.toLowerCase().includes(q) ||
        k.topRelatedTags.some((t) => t.toLowerCase().includes(q))
    );

    if (matches.length > 0) {
      setKeywordsList(matches);
    } else {
      // Generate synthetic related entry
      let hash = 0;
      for (let i = 0; i < q.length; i++) hash = (hash << 5) - hash + q.charCodeAt(i);
      hash = Math.abs(hash);

      const searchVolume = (hash % 120 + 15) * 1000;
      const overallScore = (hash % 45) + 52;
      const cpcValue = ((hash % 400 + 100) / 100).toFixed(2);
      const competition = hash % 3 === 0 ? 'Low' : hash % 3 === 1 ? 'Medium' : 'High';

      setKeywordsList([
        {
          keyword: q,
          searchVolume,
          competition,
          overallScore,
          trend: 'rising',
          cpc: `$${cpcValue}`,
          topRelatedTags: [
            `${q} tutorial`,
            `best ${q}`,
            `${q} 2026`,
            `how to use ${q}`,
            `learn ${q}`,
          ],
        },
        ...DEMO_KEYWORDS,
      ]);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                SEO & Keyword Explorer
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                Live Heuristics
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audit metadata for YouTube Search & Suggested reach with real-time character constraints and scorecards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyFullMetadata}>
              {copiedKey === 'full-meta' ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" /> Copy Metadata
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleSaveToVault}>
              <Bookmark className="h-3 w-3 mr-1" /> Save to Vault
            </Button>
          </div>
        </div>

        {/* Live YouTube URL Inspector Bar */}
        <div className="pro-card p-4">
          <form onSubmit={handleInspectUrl} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                data-mask="true"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Paste any YouTube Video URL to audit (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or youtu.be/...)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white font-mono placeholder:font-sans"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5"
                isLoading={isInspecting}
              >
                <Sparkles className="h-3.5 w-3.5" /> Inspect Live Video
              </Button>
              <button
                type="button"
                onClick={() => {
                  setVideoUrlInput('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                  setTimeout(() => handleInspectUrl(), 50);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline whitespace-nowrap hidden md:inline"
              >
                Try sample
              </button>
            </div>
          </form>
        </div>

        {/* 2-Column Grid: SEO Analyzer + Live Scorecard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Inputs Column (2 Cols) */}
          <div className="lg:col-span-2 pro-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Metadata Editor & Rules Engine
              </h3>
              <span className="font-mono text-[11px] text-slate-400">Real-time dynamic validation</span>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-800 dark:text-slate-200">
                  Video Title
                </label>
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    hasGoodTitleLength
                      ? 'text-emerald-500'
                      : titleLen > 70
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}
                >
                  {titleLen} / 70 chars {hasGoodTitleLength && '✓'}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter compelling video title..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white transition-colors"
              />
              <p className="text-[10px] text-slate-400">
                Recommended: 40-70 characters. Include numbers, clear benefit hooks, and primary keywords at the front.
              </p>
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-800 dark:text-slate-200">
                  Description & Chapters
                </label>
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    hasGoodDescLength ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {descLen} chars {hasGoodDescLength && '✓'}
                </span>
              </div>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write video overview, key timestamps (e.g. 0:00 Intro), resource links, and call to action..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white font-sans leading-relaxed transition-colors"
              />
              <p className="text-[10px] text-slate-400">
                YouTube parses timestamps in the description to create Search Chapters and Google Key Moments.
              </p>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-800 dark:text-slate-200">
                  Comma-Separated Tags
                </label>
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    hasGoodTags ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {tagsList.length} tags {hasGoodTags && '✓'}
                </span>
              </div>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. nextjs, saas, typescript, react, tutorial"
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white transition-colors"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Score Gauge & Live Checklist */}
          <div className="pro-card p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Optimization Score
                </h3>
                <Badge
                  variant={seoScore >= 80 ? 'success' : seoScore >= 60 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {seoScore >= 80 ? 'Optimal' : seoScore >= 60 ? 'Moderate' : 'Needs Work'}
                </Badge>
              </div>

              {/* Dynamic Score Ring */}
              <div className="my-5 flex items-center justify-center">
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-xl border ${
                    seoScore >= 80
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : seoScore >= 60
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'border-rose-500/30 bg-rose-500/10'
                  }`}
                >
                  <div className="text-center font-mono">
                    <span
                      className={`text-2xl font-bold ${
                        seoScore >= 80
                          ? 'text-emerald-500'
                          : seoScore >= 60
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      <AnimatedNumber value={seoScore} />
                    </span>
                    <span className="block text-[9px] text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {hasGoodTitleLength ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={hasGoodTitleLength ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Title Length (40-70 chars)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasNumbers ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={hasNumbers ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Numbers in Title
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasParenthesesOrBrackets ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={hasParenthesesOrBrackets ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Bracket Framing
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasPowerWord ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={hasPowerWord ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    High-Intent Power Words
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasTimestamps ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className={hasTimestamps ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Chapter Timestamps (0:00)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasGoodTags ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className={hasGoodTags ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    At least 5 targeted tags
                  </span>
                </div>
              </div>
            </div>

            {/* Live Actionable Recommendations */}
            {recommendations.length > 0 && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1 text-[11px]">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block">
                  Actionable Steps:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  {recommendations.slice(0, 3).map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <Button size="sm" className="w-full" onClick={handleSaveToVault}>
                <Bookmark className="h-3 w-3 mr-1" /> Save to Vault
              </Button>
            </div>
          </div>
        </div>

        {/* Keyword Suggestions Section */}
        <div className="pro-card p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  High-Volume Keyword Explorer
                </h3>
                <Badge variant="outline" size="sm">
                  Simulated Volume
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Discover search terms, competition ratings, and CPC benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-sm w-full">
              <input
                type="text"
                value={keywordQuery}
                onChange={(e) => setKeywordQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchKeywords()}
                placeholder="Enter topic e.g. nextjs, python, ai..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-1.5 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white transition-colors"
              />
              <Button size="sm" onClick={handleSearchKeywords}>
                Search
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase tracking-wider select-none">
                  <th className="pb-2.5">Keyword</th>
                  <th className="pb-2.5">Monthly Volume</th>
                  <th className="pb-2.5">Competition</th>
                  <th className="pb-2.5">Overall Score</th>
                  <th className="pb-2.5">Est. CPC</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {keywordsList.map((kw) => (
                  <tr
                    key={kw.keyword}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-2.5 font-medium text-slate-900 dark:text-slate-100">
                      {kw.keyword}
                    </td>
                    <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300">
                      {kw.searchVolume.toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-mono text-[10px] font-medium border ${
                          kw.competition === 'Low'
                            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                            : kw.competition === 'Medium'
                            ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                            : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                        }`}
                      >
                        {kw.competition}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {kw.overallScore} / 100
                    </td>
                    <td className="py-2.5 font-mono text-slate-500 dark:text-slate-400">
                      {kw.cpc}
                    </td>
                    <td className="py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddKeywordToTags(kw.keyword)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add to Tags
                      </Button>
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
