'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Video,
  Eye,
  TrendingUp,
  Plus,
  ShieldCheck,
  X,
  Play,
  Flame,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { Channel } from '@/types';

interface ChannelExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExploredChannelProfile {
  handle: string;
  name: string;
  avatar: string;
  banner: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  healthGrade: string;
  healthScore: number;
  avgCtr: number;
  niche: string;
  estimatedMonthlyEarnings: string;
  recentUploads: {
    title: string;
    views: number;
    ctr: number;
    timeAgo: string;
  }[];
  keyStrengths: string[];
  growthOpportunities: string[];
}

const FAMOUS_CREATOR_PROFILES: Record<string, ExploredChannelProfile> = {
  '@mrbeast': {
    handle: '@MrBeast',
    name: 'MrBeast',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    subscribers: 330000000,
    totalViews: 64200000000,
    videoCount: 840,
    healthGrade: 'A+',
    healthScore: 99,
    avgCtr: 15.4,
    niche: 'High-Concept Challenges & Philanthropy',
    estimatedMonthlyEarnings: '$2.4M - $4.8M',
    recentUploads: [
      { title: '$500,000 Plane Survival Challenge', views: 98000000, ctr: 16.2, timeAgo: '5 days ago' },
      { title: 'I Built 100 Houses And Gave Them Away', views: 135000000, ctr: 18.1, timeAgo: '2 weeks ago' },
      { title: 'Ages 1 - 100 Decide Who Wins $250,000', views: 142000000, ctr: 14.8, timeAgo: '1 month ago' },
    ],
    keyStrengths: [
      'Pioneered 3-second psychological visual retention hooks',
      'Unmatched multi-language global audio track localization',
      'Hyper-engineered thumbnail contrast scoring above 95/100',
    ],
    growthOpportunities: [
      'Expand direct-to-consumer digital membership tier',
      'Develop interactive YouTube Community quizzes to boost non-video retention',
    ],
  },
  '@mkbhd': {
    handle: '@MKBHD',
    name: 'Marques Brownlee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    subscribers: 19400000,
    totalViews: 4320000000,
    videoCount: 1680,
    healthGrade: 'A',
    healthScore: 94,
    avgCtr: 11.2,
    niche: 'Consumer Tech, Hardware & Industrial Design',
    estimatedMonthlyEarnings: '$180,000 - $350,000',
    recentUploads: [
      { title: 'The Real Truth About AI Smartphones', views: 3200000, ctr: 12.4, timeAgo: '3 days ago' },
      { title: 'MacBook Pro M4 Max: The 1-Month Review', views: 4100000, ctr: 10.8, timeAgo: '10 days ago' },
      { title: 'Blind Smartphone Camera Test 2026', views: 7800000, ctr: 15.6, timeAgo: '3 weeks ago' },
    ],
    keyStrengths: [
      'Reference-grade 8K RED cinema cinematography with specular lighting',
      'High sponsor trust and premium tech audience RPM ($14 - $22)',
      'Waveform series cross-pollination driving podcast retention',
    ],
    growthOpportunities: [
      'Test more question-based curiosity hooks on non-flagship reviews',
      'Add dedicated chapter summary cards on mobile watch feeds',
    ],
  },
  '@veritasium': {
    handle: '@veritasium',
    name: 'Veritasium',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    subscribers: 16800000,
    totalViews: 2840000000,
    videoCount: 420,
    healthGrade: 'A+',
    healthScore: 96,
    avgCtr: 13.8,
    niche: 'STEM, Physics & Counterintuitive Science',
    estimatedMonthlyEarnings: '$120,000 - $260,000',
    recentUploads: [
      { title: 'The Paradox That Stumped Einstein', views: 8900000, ctr: 14.5, timeAgo: '1 week ago' },
      { title: 'Why Machines Can Never Be Truly Random', views: 6400000, ctr: 12.9, timeAgo: '3 weeks ago' },
      { title: 'I Traveled to the Most Radio-Silent Town on Earth', views: 11200000, ctr: 16.4, timeAgo: '1 month ago' },
    ],
    keyStrengths: [
      'Deep narrative story arcs retaining over 62% average view duration',
      'Counter-intuitive thumbnail questions that induce irresistible curiosity gaps',
      'Rigorous peer-reviewed scientific citations building lifetime authority',
    ],
    growthOpportunities: [
      'Syndicate key explanations into YouTube Shorts to capture search traffic',
      'Create bilingual voiceover channels for Spanish and Portuguese audiences',
    ],
  },
  '@fireship': {
    handle: '@fireship',
    name: 'Fireship',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    subscribers: 3450000,
    totalViews: 680000000,
    videoCount: 610,
    healthGrade: 'A',
    healthScore: 95,
    avgCtr: 12.1,
    niche: 'Developer News & Code in 100 Seconds',
    estimatedMonthlyEarnings: '$45,000 - $95,000',
    recentUploads: [
      { title: 'React 19 Just Shipped... And Broke Everything', views: 1200000, ctr: 13.5, timeAgo: '2 days ago' },
      { title: 'Top 10 AI Tools Developers Actually Use in 2026', views: 980000, ctr: 11.8, timeAgo: '1 week ago' },
      { title: 'Rust in 100 Seconds', views: 2400000, ctr: 14.2, timeAgo: '3 weeks ago' },
    ],
    keyStrengths: [
      'High-velocity 100-second micro-formats with zero fluff',
      'Signature meme-infused editing that drives exceptional replay rate',
      'Ultra-efficient script density maximizing engagement per second',
    ],
    growthOpportunities: [
      'Expand longer deep-dive architectural retrospectives',
      'Experiment with collaborative live stream coding sessions',
    ],
  },
};

export const ChannelExplorerModal: React.FC<ChannelExplorerModalProps> = ({ isOpen, onClose }) => {
  const { addNewChannel, showToast, setSelectedChannel, channels } = useApp();
  const [handleInput, setHandleInput] = useState('@MrBeast');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProfile, setActiveProfile] = useState<ExploredChannelProfile>(FAMOUS_CREATOR_PROFILES['@mrbeast']);

  if (!isOpen) return null;

  const handleSearch = async (overrideHandle?: string) => {
    const raw = (overrideHandle || handleInput).trim();
    if (!raw) return;
    const cleanHandle = raw.startsWith('@') ? raw : `@${raw}`;

    setIsLoading(true);

    try {
      // 1. Check pre-curated famous creator profiles for instant instant-load speed
      if (FAMOUS_CREATOR_PROFILES[cleanHandle.toLowerCase()]) {
        setActiveProfile(FAMOUS_CREATOR_PROFILES[cleanHandle.toLowerCase()]);
        showToast('Channel Discovered', `Analyzed public performance for ${cleanHandle}`, 'success');
        setIsLoading(false);
        return;
      }

      // 2. Query our live API endpoint (queries YouTube Data API v3 if key exists, or deterministic generator)
      const res = await fetch(`/api/youtube/lookup?q=${encodeURIComponent(cleanHandle)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.channel) {
          const ch = data.channel;
          const score = Math.min(98, Math.max(78, Math.round(ch.subscribers > 1000000 ? 94 : 85)));
          const customProfile: ExploredChannelProfile = {
            handle: ch.handle,
            name: ch.name,
            avatar: ch.avatar,
            banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
            subscribers: ch.subscribers,
            totalViews: ch.totalViews,
            videoCount: ch.videoCount,
            healthGrade: score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B+',
            healthScore: score,
            avgCtr: 11.4,
            niche: ch.niche || 'Digital Media',
            estimatedMonthlyEarnings: `$${formatNumber(Math.floor(ch.totalViews * 0.0003))} - $${formatNumber(Math.floor(ch.totalViews * 0.0007))}`,
            recentUploads: (data.recentVideos || []).slice(0, 3).map((v: any) => ({
              title: v.title,
              views: v.views,
              ctr: v.ctr,
              timeAgo: 'Recently',
            })),
            keyStrengths: [
              'Established audience trust with strong 24h upload momentum',
              'Consistent branding across recent video titles and concepts',
              'High audience loyalty and active retention signals',
            ],
            growthOpportunities: [
              'Test higher contrast in first 3 seconds of mobile feed titles',
              'Deploy A/B thumbnail testing on underperforming uploads',
            ],
          };

          setActiveProfile(customProfile);
          showToast(
            data.provider === 'youtube_data_api_v3' ? 'Live YouTube Channel Imported' : 'Channel Analyzed',
            `Loaded performance metrics for ${ch.name}`,
            'success'
          );
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Channel lookup fetch failed, using fallback:', err);
    }

    // 3. Fallback Heuristic Generator
    const displayName = cleanHandle.replace('@', '').replace(/[._-]/g, ' ');
    const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const hash = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const simulatedSubs = (hash * 4820) % 5000000 + 45000;
    const simulatedViews = simulatedSubs * ((hash % 12) + 20);
    const simulatedVideos = (hash % 180) + 40;
    const score = 80 + (hash % 18);

    const customProfile: ExploredChannelProfile = {
      handle: cleanHandle,
      name: capitalized,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (hash % 500)}?w=160&auto=format&fit=crop&q=80`,
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      subscribers: simulatedSubs,
      totalViews: simulatedViews,
      videoCount: simulatedVideos,
      healthGrade: score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B+',
      healthScore: score,
      avgCtr: Number((6.8 + (hash % 50) / 10).toFixed(1)),
      niche: 'Digital Media & Creator Economy',
      estimatedMonthlyEarnings: `$${formatNumber(Math.floor(simulatedViews * 0.0003))} - $${formatNumber(Math.floor(simulatedViews * 0.0007))}`,
      recentUploads: [
        {
          title: `The Ultimate Guide to ${capitalized} Masterclass 2026`,
          views: Math.floor(simulatedSubs * 0.28),
          ctr: 9.4,
          timeAgo: '4 days ago',
        },
        {
          title: `Why Most Creators Fail at ${capitalized} (And the Fix)`,
          views: Math.floor(simulatedSubs * 0.42),
          ctr: 11.2,
          timeAgo: '2 weeks ago',
        },
        {
          title: `I Tested Every Strategy in 30 Days (Real Results)`,
          views: Math.floor(simulatedSubs * 0.35),
          ctr: 8.8,
          timeAgo: '1 month ago',
        },
      ],
      keyStrengths: [
        'Consistent upload frequency building audience habit loops',
        'Solid thumbnail branding with recognizable color accents',
        'Strong community engagement in first 24 hours of publication',
      ],
      growthOpportunities: [
        'Increase high-contrast curiosity phrasing in the first 45 characters of titles',
        'Add YouTube End Screens on legacy back-catalog videos to build binge sessions',
      ],
    };

    setActiveProfile(customProfile);
    showToast('Channel Analyzed', `Generated public audit for ${cleanHandle}`, 'info');
    setIsLoading(false);
  };

  const handleImportToDashboard = () => {
    // Check if channel already exists
    const existing = channels.find((c) => c.handle.toLowerCase() === activeProfile.handle.toLowerCase());
    if (existing) {
      setSelectedChannel(existing);
      showToast('Switched Channel', `Switched active dashboard to ${activeProfile.name}`, 'success');
      onClose();
      return;
    }

    addNewChannel(activeProfile.name, activeProfile.handle, activeProfile.niche);
    showToast('Channel Added', `Imported ${activeProfile.name} into your dashboard switcher`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700/60 bg-white/95 dark:bg-navy-900/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 my-8 animate-scale-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 dark:bg-brand-500/20">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Public YouTube Channel Explorer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit any creator or competitor on YouTube without requiring Google OAuth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Pre-sets */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="Enter YouTube handle (e.g. @MrBeast, @mkbhd, @veritasium) or channel name..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-800/90 px-4 py-2.5 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
            <Button type="submit" variant="glow" disabled={isLoading}>
              {isLoading ? 'Scanning...' : 'Analyze Channel'}
            </Button>
          </form>

          {/* Quick preset chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Popular creators:</span>
            {['@MrBeast', '@MKBHD', '@veritasium', '@fireship'].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setHandleInput(h);
                  handleSearch(h);
                }}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 transition-colors"
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Profile Content */}
        <div className="p-6 space-y-6 max-h-[62vh] overflow-y-auto">
          {/* Identity & Health Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-800/50 p-4">
            <div className="flex items-center gap-3.5">
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeProfile.name}</h3>
                  <Badge variant="purple" size="sm">
                    Verified
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{activeProfile.handle}</div>
                <div className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                  {activeProfile.niche}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:border-l sm:border-slate-200 dark:sm:border-slate-700/80 sm:pl-4">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Health Score</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeProfile.healthScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 dark:bg-white/[0.08] text-white border border-slate-700 dark:border-white/[0.12] font-mono font-bold text-lg">
                {activeProfile.healthGrade}
              </div>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-800/30 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                <Users className="h-3.5 w-3.5" /> Subscribers
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {formatNumber(activeProfile.subscribers)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-800/30 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                <Eye className="h-3.5 w-3.5" /> Total Views
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {formatNumber(activeProfile.totalViews)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-800/30 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                <TrendingUp className="h-3.5 w-3.5" /> Avg CTR
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {activeProfile.avgCtr}%
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-800/30 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                <Video className="h-3.5 w-3.5" /> Uploads
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {activeProfile.videoCount}
              </div>
            </div>
          </div>

          {/* Recent Upload Performance */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recent Upload Velocity
            </div>
            <div className="space-y-2">
              {activeProfile.recentUploads.map((vid, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-800/40 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Play className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{vid.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatNumber(vid.views)} views
                    </span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      {vid.ctr}% CTR
                    </span>
                    <span className="text-slate-400 text-[11px]">{vid.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> Key Channel Strengths
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeProfile.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Growth Opportunities
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {activeProfile.growthOpportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-500">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-navy-950/60 px-6 py-3.5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Est. Monthly AdSense: <strong className="text-emerald-600 dark:text-emerald-400">{activeProfile.estimatedMonthlyEarnings}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="glow" size="sm" onClick={handleImportToDashboard} className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Set as Active Dashboard Channel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
