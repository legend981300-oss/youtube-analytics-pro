'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Award,
  Download,
  Share2,
  Mail,
  CheckCircle2,
  Users,
  Eye,
  TrendingUp,
  Globe,
  Sparkles,
  DollarSign,
  Copy,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';

export default function MediaKitPage() {
  const { selectedChannel, currentUser, showToast } = useApp();

  // Dynamic Sponsorship Rate Calculator State
  const [projectedViews, setProjectedViews] = useState<number>(45000);
  const [targetCpm, setTargetCpm] = useState<number>(28);

  const midRollRate = Math.round((projectedViews / 1000) * targetCpm);
  const dedicatedRate = Math.round((projectedViews / 1000) * targetCpm * 2.4);
  const preRollRate = Math.round((projectedViews / 1000) * targetCpm * 0.6);
  const shortRate = Math.round((projectedViews / 1000) * targetCpm * 0.45);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPitch = () => {
    const pitch = `Hi [Brand Partnerships Manager],

I'm reaching out on behalf of ${selectedChannel.name} (YouTube Creator Channel, ${formatNumber(selectedChannel.subscribers)} subscribers, ${formatNumber(selectedChannel.totalViews)} verified views).

We specialize in high-retention engineering, software architecture, and developer workflows with an audience primarily based in the US, UK, and EU (52.8% aged 25-34 tech decision-makers).

Our typical integration rate card is calibrated at a verified $${targetCpm} CPM:
• 60-Sec Mid-Roll Integration: ${formatCurrency(midRollRate)} (based on ~${formatNumber(projectedViews)} 30-day views)
• Full Dedicated Video: ${formatCurrency(dedicatedRate)}
• YouTube Short Sponsorship: ${formatCurrency(shortRate)}

View our verified live telemetry media kit: https://ytanalytics.pro/channels/${selectedChannel.handle}

Best regards,
${currentUser.name}
Creator Partnerships • ${selectedChannel.name}
alex@creatorsuite.io`;

    navigator.clipboard.writeText(pitch);
    showToast('Pitch Email Copied', 'Sponsor outreach template copied to your clipboard!', 'success');
  };

  const handleCopyPublicLink = () => {
    const publicUrl = `https://ytanalytics.pro/channels/${selectedChannel.handle}`;
    navigator.clipboard.writeText(publicUrl);
    showToast('Public Link Copied', `Verified link: ${publicUrl}`, 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto print:p-0 print:m-0">
        {/* Screen Header (Hidden on Print) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Verified Creator Media Kit
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                Sponsor Rate Card
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              One-page executive telemetry sheet for brand sponsors, marketing directors, and PR agencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopyPublicLink}>
              <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Link
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopyPitch}>
              <Mail className="h-3.5 w-3.5 mr-1.5" /> Copy Pitch
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Save as PDF
            </Button>
          </div>
        </div>

        {/* The Media Kit Sheet (Styled for Screen & Clean Print) */}
        <div className="pro-card p-6 sm:p-8 space-y-7 print:border-none print:shadow-none print:p-2 print:text-black">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-white/[0.06]">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-100 shadow-sm dark:bg-zinc-900">
                <ThumbnailImage
                  src={selectedChannel.avatar}
                  alt={selectedChannel.name}
                  title={selectedChannel.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                    {selectedChannel.name}
                  </h2>
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 fill-indigo-500/10" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                  {selectedChannel.handle} • {selectedChannel.category} & Technology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono font-medium text-emerald-400">
                ● Verified Active Telemetry
              </span>
            </div>
          </div>

          {/* Key Audience Reach Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Total Subscribers
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {formatNumber(selectedChannel.subscribers)}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">+14.2% MoM Pace</span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Total Channel Views
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {formatNumber(selectedChannel.totalViews)}
              </p>
              <span className="text-[10px] text-zinc-500">Verified Lifetime</span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Avg. Views / Video
              </span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">
                {formatNumber(projectedViews)}
              </p>
              <span className="text-[10px] text-zinc-500">First 30 Days</span>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 text-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Audience Engagement
              </span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                8.4%
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">2.3x Niche Benchmark</span>
            </div>
          </div>

          {/* Demographics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Top Geographic Markets */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-5 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-400" /> Primary Geographic Distribution
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-300">🇺🇸 United States</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">44.2%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '44.2%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-600 dark:text-zinc-300">🇬🇧 United Kingdom</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">18.5%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '18.5%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-600 dark:text-zinc-300">🇩🇪 Germany & EU</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">14.1%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '14.1%' }} />
                </div>
              </div>
            </div>

            {/* Age & Purchasing Power */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.015] p-5 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" /> Buyer Demographics & Age
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-300">25–34 Years Old (Core Tech Buyers)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">52.8%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '52.8%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-600 dark:text-zinc-300">18–24 Years Old (Developers)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">31.4%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '31.4%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-600 dark:text-zinc-300">35–44 Years Old (Tech Leaders)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">11.2%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '11.2%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Rate Calculator (Screen Only) */}
          <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.01] space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                Dynamic Sponsorship Rate Calculator
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">
                Calibrated against category CPM & 30-day velocity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Projected Views per Video</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatNumber(projectedViews)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={250000}
                  step={5000}
                  value={projectedViews}
                  onChange={(e) => setProjectedViews(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Niche Baseline CPM (Tech/SaaS)</span>
                  <span className="font-mono font-semibold text-indigo-400">
                    ${targetCpm} / 1,000 views
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={50}
                  step={1}
                  value={targetCpm}
                  onChange={(e) => setTargetCpm(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Standard Sponsorship Integration Packages */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" /> Standard Sponsorship Rate Card
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              {/* Mid-Roll */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 space-y-2">
                <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400">Integration</span>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">60-Sec Mid-Roll</p>
                <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{formatCurrency(midRollRate)}</p>
                <ul className="text-[11px] text-zinc-500 space-y-1 pt-1.5 border-t border-zinc-200/80 dark:border-white/[0.04]">
                  <li>• Custom verbal integration</li>
                  <li>• Top link in description</li>
                  <li>• Pinned comment link</li>
                </ul>
              </div>

              {/* Dedicated */}
              <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/[0.03] p-4 space-y-2 relative shadow-[0_0_20px_-5px_rgba(99,102,241,0.1)]">
                <span className="absolute top-3 right-3 rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-white uppercase">
                  Flagship
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase text-indigo-400">Full Feature</span>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">Dedicated Video</p>
                <p className="text-xl font-bold font-mono text-indigo-400">{formatCurrency(dedicatedRate)}</p>
                <ul className="text-[11px] text-zinc-400 space-y-1 pt-1.5 border-t border-indigo-500/20">
                  <li>• Full 8–12m deep-dive</li>
                  <li>• Custom thumbnail badge</li>
                  <li>• Multi-platform push</li>
                </ul>
              </div>

              {/* Pre-Roll */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 space-y-2">
                <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400">Opener</span>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">30-Sec Pre-Roll</p>
                <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{formatCurrency(preRollRate)}</p>
                <ul className="text-[11px] text-zinc-500 space-y-1 pt-1.5 border-t border-zinc-200/80 dark:border-white/[0.04]">
                  <li>• First 30s opener hook</li>
                  <li>• Logo watermark on screen</li>
                  <li>• Description tracking link</li>
                </ul>
              </div>

              {/* YouTube Short */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/[0.06] dark:bg-white/[0.015] p-4 space-y-2">
                <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400">Vertical</span>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">YouTube Short</p>
                <p className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(shortRate)}</p>
                <ul className="text-[11px] text-zinc-500 space-y-1 pt-1.5 border-t border-zinc-200/80 dark:border-white/[0.04]">
                  <li>• 60-sec vertical format</li>
                  <li>• Pinned comment CTA</li>
                  <li>• High algorithm reach</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-200/80 dark:border-white/[0.06] text-xs text-zinc-500">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-200">Official Brand Inquiries & Press:</p>
              <p className="text-zinc-500 font-mono text-[11px]">alex@creatorsuite.io • Verified via YouTube Analytics Pro</p>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Verified Telemetry • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
