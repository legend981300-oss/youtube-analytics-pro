'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Trophy,
  Sparkles,
  Flame,
  Printer,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';

interface MilestoneCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    cardBg: 'from-amber-500/20 via-navy-950 to-navy-900 border-amber-500/40 text-amber-400',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'youtube-crimson',
    name: 'YouTube Crimson',
    cardBg: 'from-brand-600/25 via-navy-950 to-navy-900 border-brand-500/40 text-brand-400',
    accentText: 'text-brand-400',
    badgeBg: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
  },
  {
    id: 'cyberpunk-violet',
    name: 'Cyberpunk Violet',
    cardBg: 'from-purple-600/25 via-navy-950 to-indigo-950 border-purple-500/40 text-purple-400',
    accentText: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'emerald-surge',
    name: 'Emerald Surge',
    cardBg: 'from-emerald-600/25 via-navy-950 to-navy-900 border-emerald-500/40 text-emerald-400',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

export const MilestoneCardModal: React.FC<MilestoneCardModalProps> = ({ isOpen, onClose }) => {
  const { selectedChannel, showToast } = useApp();
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [metricNumber, setMetricNumber] = useState('100,000');
  const [milestoneLabel, setMilestoneLabel] = useState('Total Channel Views Reached');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePreset = (num: string, label: string) => {
    setMetricNumber(num);
    setMilestoneLabel(label);
  };

  const shareText = `🚀 Milestone Unlocked on @YouTube! \n\nWe just officially hit ${metricNumber} ${milestoneLabel} on ${selectedChannel.name}! \n\nTracking our algorithmic velocity & retention curves with @legend981300-oss YouTube Analytics Pro. \n\n#YouTubeCreator #BuildInPublic #Milestone #YouTubeAnalytics`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    showToast('Post Copied', 'Social media share text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/60 bg-white/95 dark:bg-navy-900/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 my-8 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Social Milestone Celebration Card
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-contrast social cards to share your channel growth on X, LinkedIn & Discord
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Milestone Presets:</span>
            <button
              onClick={() => handlePreset('100,000', 'Total Channel Views')}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-1 font-medium hover:border-brand-500 transition-colors"
            >
              100k Views
            </button>
            <button
              onClick={() => handlePreset('10,000', 'Subscribers Milestone')}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-1 font-medium hover:border-brand-500 transition-colors"
            >
              10k Subs
            </button>
            <button
              onClick={() => handlePreset('94 / 100', 'Top 1% Health Audit Grade')}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-1 font-medium hover:border-brand-500 transition-colors"
            >
              94 Health Score
            </button>
            <button
              onClick={() => handlePreset('4,000h', 'Monetization Watch Hours')}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-1 font-medium hover:border-brand-500 transition-colors"
            >
              4k Watch Hours
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Palette:</span>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                    selectedTheme.id === t.id
                      ? 'border-white/30 bg-white/[0.12] text-white'
                      : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Branded Milestone Card Preview (Target for Screenshot/Share) */}
          <div
            id="milestone-card-target"
            className={`relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br ${selectedTheme.cardBg} p-6 sm:p-8 shadow-2xl backdrop-blur-xl`}
          >
            {/* Ambient Watermark Logo */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              {/* Card Top: Channel Identity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedChannel.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white text-base sm:text-lg">
                      <span>{selectedChannel.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-300">{selectedChannel.handle}</div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider border ${selectedTheme.badgeBg}`}
                >
                  Verified Milestone
                </span>
              </div>

              {/* Card Middle: Hero Number */}
              <div className="py-4 text-center sm:text-left">
                <div className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-1">
                  {milestoneLabel}
                </div>
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  {metricNumber}
                </div>
              </div>

              {/* Card Bottom: Timestamp & Brand Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-brand-400" />
                  <span>Powered by YouTube Analytics Pro</span>
                </div>
                <div className="font-mono text-slate-400">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-navy-950/60 px-6 py-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Copy pre-formatted text or take a quick screenshot to post
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handlePrintCard} className="flex-1 sm:flex-none flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </Button>
            <Button variant="glow" size="sm" onClick={handleCopyText} className="flex-1 sm:flex-none flex items-center gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied Post Text!' : 'Copy Share Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
