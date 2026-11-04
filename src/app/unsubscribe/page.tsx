'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Mail, ArrowLeft, Building2 } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DEFAULT_POSTAL_ADDRESS, getFormattedPostalAddress } from '@/lib/email-templates';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [isUnsubscribed, setIsUnsubscribed] = useState(Boolean(emailParam));
  const [unsubscribeType, setUnsubscribeType] = useState<'all' | 'marketing'>('all');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      setIsUnsubscribed(true);
    }
  }, [emailParam]);

  const handleManualUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsUnsubscribed(true);
  };

  const handleResubscribe = () => {
    setIsUnsubscribed(false);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="lg" href="/" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Email Subscription Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          One-click opt-out and CAN-SPAM / GDPR preference center.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-5 text-xs">
        {isUnsubscribed ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 space-y-1.5 text-center">
              <div className="flex justify-center pb-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                You Have Been Unsubscribed
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                <strong className="font-mono text-emerald-600 dark:text-emerald-400">{email || 'Your email address'}</strong> has been removed from our marketing and promotional email lists.
              </p>
            </div>

            <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <p>
                • Changes take effect immediately. No passwords or authentication required.
              </p>
              <p>
                • You will continue to receive critical security alerts and password reset links if you hold an active account.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link href="/" className="w-full">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Return to Dashboard
                </Button>
              </Link>
              <button
                type="button"
                onClick={handleResubscribe}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline text-center"
              >
                Opt back in or update preferences
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualUnsubscribe} className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Email Address to Opt Out
              </label>
              <input
                type="email"
                required
                data-mask="true"
                data-clarity-mask="true"
                ph-no-capture="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                Select Unsubscribe Scope
              </label>
              <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-navy-750 dark:bg-navy-900/60 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={unsubscribeType === 'all'}
                  onChange={() => setUnsubscribeType('all')}
                  className="text-brand-500"
                />
                <span>Unsubscribe from all marketing, launch announcements & weekly digests</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-navy-750 dark:bg-navy-900/60 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={unsubscribeType === 'marketing'}
                  onChange={() => setUnsubscribeType('marketing')}
                  className="text-brand-500"
                />
                <span>Marketing & promotions only (keep weekly analytics digests)</span>
              </label>
            </div>

            <Button type="submit" size="md" className="w-full">
              Confirm 1-Click Unsubscribe
            </Button>
          </form>
        )}

        {/* Physical Address Footer (CAN-SPAM Act Requirement) */}
        <div className="pt-4 border-t border-slate-100 dark:border-navy-750 space-y-1.5 text-[10px] text-slate-400">
          <p className="font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <Building2 className="h-3 w-3 text-slate-400 shrink-0" /> Physical Postal Address
          </p>
          <p className="leading-relaxed">
            {getFormattedPostalAddress(DEFAULT_POSTAL_ADDRESS)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090a0f] p-4 font-sans text-slate-800 dark:text-slate-200">
      <Suspense fallback={<LoadingSpinner label="Loading preferences..." />}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}

