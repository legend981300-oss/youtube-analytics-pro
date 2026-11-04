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
  ArrowRight,
  Info,
  HelpCircle,
  FileText,
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
      list.push('Add brackets or parentheses like [Step-by-Step] or (2026 Edition) to frame viewer value.');
    }
    if (!hasPowerWord) {
      list.push('Include a high-intent keyword hook (e.g., "Full Architecture", "How To", "Ultimate Guide").');
    }
    if (!hasTimestamps) {
      list.push('Add structured timestamps starting with 0:00 to unlock YouTube search chapters.');
    }
    if (!hasGoodDescLength) {
      list.push('Write at least 150 characters in description to give the algorithm context for recommendations.');
    }
    if (!hasLinkInDesc) {
      list.push('Add a resource link or call-to-action URL to drive viewers to external assets.');
    }
    if (tagsList.length < 5) {
      list.push(`You currently have ${tagsList.length} tag(s). Add at least 5 targeted tags separated by commas.`);
    }
    return list;
  }, [
    titleLen,
    hasNumbers,
    hasParenthesesOrBrackets,
    hasPowerWord,
    hasTimestamps,
    hasGoodDescLength,
    hasLinkInDesc,
    tagsList.length,
  ]);

  const handleCopyTags = (tagItems: string[]) => {
    navigator.clipboard.writeText(tagItems.join(', '));
    setCopiedKey('tags');
    showToast('Tags Copied', `${tagItems.length} tags copied to clipboard`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullMetadata = () => {
    const fullText = `TITLE:\n${title}\n\nDESCRIPTION:\n${description}\n\nTAGS:\n${tagsList.join(', ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedKey('full-meta');
    showToast('Metadata Copied', 'Full title, description, and tags copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToVault = () => {
    addIdea({
      title: title || 'Untitled SEO Concept',
      category: 'SEO Optimized',
      targetKeywords: tagsList.length ? tagsList : ['seo'],
      predictedPotential: seoScore >= 80 ? 'Very High' : 'High',
      status: 'scripting',
      notes: `SEO Score: ${seoScore}/100.\n\nDescription summary:\n${description.slice(0, 160)}...`,
      tags: tagsList,
    });
    showToast('Saved to Idea Vault', `"${title.slice(0, 30)}..." saved with SEO metadata`, 'success');
  };

  // Deterministic Keyword Generation for demo searches
  const handleSearchKeywords = () => {
    const q = keywordQuery.trim().toLowerCase();
    if (!q) {
      setKeywordsList(DEMO_KEYWORDS);
      return;
    }

    const matches = DEMO_KEYWORDS.filter((k) =>
      k.keyword.toLowerCase().includes(q)
    );

    if (matches.length > 0) {
      setKeywordsList(matches);
    } else {
      // Deterministic synthetic calculation based on string character codes
      const hash = q.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const searchVolume = 15000 + (hash % 85) * 1000;
      const overallScore = 65 + (hash % 30);
      const cpcValue = (1.5 + (hash % 45) / 10).toFixed(2);
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                YouTube SEO & Keyword Explorer
              </h1>
              <Badge variant="cyan" size="sm">
                Algorithm Heuristics
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audit metadata for YouTube Search & Suggested rankings with live character counts and actionable recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyFullMetadata}>
              {copiedKey === 'full-meta' ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Full Metadata
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleSaveToVault}>
              <Bookmark className="h-3.5 w-3.5 mr-1" /> Save to Vault
            </Button>
          </div>
        </div>

        {/* 2-Column Grid: SEO Analyzer + Live Scorecard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Inputs Column (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-750">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Video Metadata Editor
              </h3>
              <span className="text-xs text-slate-400">Updates live score in real-time</span>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Video Title
                </label>
                <span
                  className={`font-semibold ${
                    hasGoodTitleLength
                      ? 'text-emerald-500'
                      : titleLen > 70
                      ? 'text-rose-500 font-bold'
                      : 'text-amber-500'
                  }`}
                >
                  {titleLen} / 70 chars {hasGoodTitleLength && '✓ Ideal'}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter compelling video title..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white transition-colors"
              />
              <p className="text-[10px] text-slate-400">
                Recommended: 40-70 characters. Include numbers, clear benefit hooks, and primary keywords at the front.
              </p>
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Description & Chapters
                </label>
                <span
                  className={`font-semibold ${
                    hasGoodDescLength ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {descLen} chars {hasGoodDescLength && '(Good Length)'}
                </span>
              </div>
              <textarea
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write video overview, key timestamps (e.g. 0:00 Intro), resource links, and call to action..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white font-sans leading-relaxed transition-colors"
              />
              <p className="text-[10px] text-slate-400">
                YouTube parses timestamps in the description to create Search Chapters and Google Key Moments.
              </p>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Comma-Separated Tags
                </label>
                <span
                  className={`font-semibold ${
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white transition-colors"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-200/70 dark:bg-navy-750 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Score Gauge & Live Checklist */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-750">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Optimization Score
                </h3>
                <Badge
                  variant={seoScore >= 80 ? 'success' : seoScore >= 60 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {seoScore >= 80 ? 'Optimized' : seoScore >= 60 ? 'Moderate' : 'Needs Work'}
                </Badge>
              </div>

              {/* Dynamic Score Ring */}
              <div className="my-4 flex items-center justify-center">
                <div
                  className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${
                    seoScore >= 80
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : seoScore >= 60
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-rose-500 bg-rose-500/10'
                  }`}
                >
                  <div className="text-center">
                    <span
                      className={`text-3xl font-black ${
                        seoScore >= 80
                          ? 'text-emerald-500'
                          : seoScore >= 60
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      <AnimatedNumber value={seoScore} />
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {hasGoodTitleLength ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span className={hasGoodTitleLength ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Ideal Title Length (40-70 chars)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasNumbers ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span className={hasNumbers ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Numbers in Title (Boosts CTR)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasParenthesesOrBrackets ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span className={hasParenthesesOrBrackets ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Brackets / Framing Hooks
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasPowerWord ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span className={hasPowerWord ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    High-Intent Power Words
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasTimestamps ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  )}
                  <span className={hasTimestamps ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    Chapter Timestamps (0:00 included)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasGoodTags ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  )}
                  <span className={hasGoodTags ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}>
                    At least 5 targeted tags
                  </span>
                </div>
              </div>
            </div>

            {/* Live Actionable Recommendations */}
            {recommendations.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5 text-[11px]">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">
                  Actionable Recommendations:
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

            <div className="pt-3 border-t border-slate-100 dark:border-navy-750 space-y-2">
              <Button size="sm" className="w-full" onClick={handleSaveToVault}>
                <Bookmark className="h-3.5 w-3.5 mr-1" /> Save Concept to Video Vault
              </Button>
            </div>
          </div>
        </div>

        {/* Keyword Suggestions Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  High-Volume Keyword Explorer
                </h3>
                <Badge variant="purple" size="sm">
                  Simulated Data
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discover trending search terms, competition ratings, and simulated CPC benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-sm w-full">
              <input
                type="text"
                value={keywordQuery}
                onChange={(e) => setKeywordQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchKeywords()}
                placeholder="Enter topic e.g. nextjs, python, ai..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white transition-colors"
              />
              <Button size="sm" onClick={handleSearchKeywords}>
                Search
              </Button>
            </div>
          </div>

          {/* Transparency Disclaimer Notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-[11px] text-slate-600 dark:text-slate-300">
            <Info className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Simulated Keyword Metrics:</strong> Monthly search volume, competition tiers, and CPC estimates shown below are modelled approximations for product demonstration. When launched with Google Keyword Planner API or YouTube Data API OAuth, live historical search metrics will be populated.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-750 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Keyword</th>
                  <th className="pb-3">Monthly Vol. (Simulated)</th>
                  <th className="pb-3">Competition</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Est. CPC</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-750">
                {keywordsList.map((kw) => (
                  <tr key={kw.keyword} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {kw.keyword}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {kw.searchVolume.toLocaleString()} / mo*
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          kw.competition === 'Low'
                            ? 'success'
                            : kw.competition === 'Medium'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {kw.competition}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span className="font-extrabold text-brand-600 dark:text-brand-400">
                        {kw.overallScore} / 100
                      </span>
                    </td>
                    <td className="py-3 text-emerald-500 font-semibold">
                      {kw.cpc}*
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyTags(kw.topRelatedTags)}
                          title="Copy tags to clipboard"
                        >
                          {copiedKey === 'tags' ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            addIdea({
                              title: `Mastering ${kw.keyword} in 2026`,
                              category: 'SEO Opportunity',
                              targetKeywords: [kw.keyword],
                              predictedPotential: 'High',
                              status: 'idea',
                              notes: `Search volume: ${kw.searchVolume}/mo. Competition: ${kw.competition}`,
                              tags: kw.topRelatedTags,
                            });
                            showToast(
                              'Added to Vault',
                              `"${kw.keyword}" added to your Video Idea Vault`,
                              'success'
                            );
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Vault
                        </Button>
                      </div>
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
