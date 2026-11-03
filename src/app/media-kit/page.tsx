'use client';

import React from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/utils';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';

export default function MediaKitPage() {
  const { selectedChannel, currentUser, showToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPitch = () => {
    const pitch = `Hi [Brand Manager],\n\nI'm reaching out from ${selectedChannel.name} (YouTube Creator Channel, ${formatNumber(selectedChannel.subscribers)} subscribers, ${formatNumber(selectedChannel.totalViews)} total views).\n\nWe specialize in high-retention, educational and tech content with an audience primarily based in the US and Europe (72% aged 25-34). We'd love to explore an authentic integration with [Brand Name] for our upcoming video.\n\nOur full verified media kit and rates can be viewed here: https://ytanalytics.pro/channels/${selectedChannel.id}\n\nBest regards,\n${currentUser.name}`;
    navigator.clipboard.writeText(pitch);
    showToast('Pitch Email Copied', 'Sponsor outreach template copied to your clipboard!', 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto print:p-0 print:m-0">
        {/* Screen Header (Hidden on Print) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Creator Sponsor Media Kit
              </h1>
              <Badge variant="purple" size="sm">
                Brand Deals
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              One-page verified executive media kit to share with brand sponsors, PR managers, and marketing agencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopyPitch}>
              <Mail className="h-4 w-4 mr-1.5" /> Copy Pitch Email
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="h-4 w-4 mr-1.5" /> Save as PDF / Print
            </Button>
          </div>
        </div>

        {/* The Media Kit Sheet (Styled for Screen & Clean Print) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-8 print:border-none print:shadow-none print:p-4 print:text-black">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-navy-750">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-brand-500/20 bg-slate-100 shadow-sm dark:bg-navy-950">
                <ThumbnailImage
                  src={selectedChannel.avatar}
                  alt={selectedChannel.name}
                  title={selectedChannel.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                    {selectedChannel.name}
                  </h2>
                  <CheckCircle2 className="h-5 w-5 text-brand-500 fill-brand-500/20" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedChannel.handle} • {selectedChannel.category} & Tech Creator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                🟢 Verified Active Channel (Demo)
              </span>
            </div>
          </div>

          {/* Key Audience Reach Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-navy-750 dark:bg-navy-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Subscribers
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatNumber(selectedChannel.subscribers)}
              </p>
              <span className="text-[10px] text-emerald-500 font-bold">+14.2% MoM</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-navy-750 dark:bg-navy-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Views
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatNumber(selectedChannel.totalViews)}
              </p>
              <span className="text-[10px] text-slate-400">High Retention</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-navy-750 dark:bg-navy-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Avg. Views / Video
              </span>
              <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                42,800
              </p>
              <span className="text-[10px] text-slate-400">First 30 Days</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-navy-750 dark:bg-navy-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Engagement Rate
              </span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                8.4%
              </p>
              <span className="text-[10px] text-emerald-500 font-bold">2.3x Industry Avg</span>
            </div>
          </div>

          {/* Demographics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Top Geographic Markets */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-navy-750 dark:bg-navy-900 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-500" /> Top Audience Geographies
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">🇺🇸 United States</span>
                  <span className="font-bold text-slate-900 dark:text-white">44.2%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: '44.2%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-600 dark:text-slate-300">🇬🇧 United Kingdom</span>
                  <span className="font-bold text-slate-900 dark:text-white">18.5%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: '18.5%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-600 dark:text-slate-300">🇩🇪 Germany & EU</span>
                  <span className="font-bold text-slate-900 dark:text-white">14.1%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: '14.1%' }} />
                </div>
              </div>
            </div>

            {/* Age & Purchasing Power */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-navy-750 dark:bg-navy-900 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" /> Age & Purchasing Demographics
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">25–34 Years Old (Core Tech Buyers)</span>
                  <span className="font-bold text-slate-900 dark:text-white">52.8%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '52.8%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-600 dark:text-slate-300">18–24 Years Old (Students & Developers)</span>
                  <span className="font-bold text-slate-900 dark:text-white">31.4%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '31.4%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-600 dark:text-slate-300">35–44 Years Old (Engineering Leaders)</span>
                  <span className="font-bold text-slate-900 dark:text-white">11.2%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '11.2%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Standard Sponsorship Integration Packages */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" /> Standard Sponsorship Packages & Rate Card
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-navy-750 dark:bg-navy-900 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Package 1</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">60-Sec Mid-Roll</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">$1,200</p>
                <ul className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-navy-750">
                  <li>• Custom verbal endorsement</li>
                  <li>• Top link in video description</li>
                  <li>• Pinned comment with tracking URL</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-brand-500/40 bg-brand-500/5 p-4 dark:border-brand-500/30 dark:bg-brand-500/10 space-y-2 relative">
                <span className="absolute top-3 right-3 rounded-md bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  Most Popular
                </span>
                <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">Package 2</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Dedicated Video</p>
                <p className="text-xl font-black text-brand-600 dark:text-brand-400">$2,800</p>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 pt-1 border-t border-brand-500/20">
                  <li>• Full 8–12 minute dedicated review</li>
                  <li>• Custom thumbnail logo inclusion</li>
                  <li>• Multi-platform social amplification</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-navy-750 dark:bg-navy-900 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Package 3</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">30-Sec Pre-Roll</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">$750</p>
                <ul className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-navy-750">
                  <li>• First 30 seconds of video</li>
                  <li>• Logo watermark & on-screen title</li>
                  <li>• Description tracking link</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-navy-750 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Business Partnerships & Press Inquiries:</p>
              <p className="text-slate-500">alex@creatorsuite.io • Verified via YouTube Analytics Pro</p>
            </div>
            <p className="text-[11px] text-slate-400">
              Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
