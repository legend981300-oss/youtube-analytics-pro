'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Check, Sparkles, HelpCircle, ShieldCheck, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { getCheckoutUrl, getBillingConfig } from '@/lib/billing-config';

export default function PricingPage() {
  const { currentUser, setCurrentUser, showToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const billingConfig = getBillingConfig();

  const plans = [
    {
      id: 'Free',
      name: 'Free Starter',
      description: 'Essential analytics and keyword discovery for beginner creators.',
      priceMonthly: '$0',
      priceAnnual: '$0',
      features: [
        '1 Connected YouTube Channel',
        '28-Day Historical Analytics',
        'Basic SEO Analyzer',
        '10 AI Video Title Generations / mo',
        'Standard Goal Tracker',
        'Community Support',
      ],
      cta: 'Current Baseline',
      popular: false,
    },
    {
      id: 'Pro',
      name: 'Pro Creator',
      description: 'Full creator operating system with advanced retention & AI tools.',
      priceMonthly: '$29',
      priceAnnual: '$23', // billed annually
      features: [
        'Up to 5 Connected Channels',
        '365-Day Historical Analytics & CSV',
        'Unlimited AI Titles & Description Generator',
        'Thumbnail Computer Vision Analyzer',
        'Full Video Idea Kanban Vault',
        'Audience Active Hours Heatmap',
        'Competitor Benchmark & Gap Analysis',
        'Weekly Automated Reports',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'Creator',
      name: 'Studio Enterprise',
      description: 'Maximum firepower for agencies, media houses, and high-volume networks.',
      priceMonthly: '$79',
      priceAnnual: '$63',
      features: [
        'Unlimited Connected Channels',
        'Full Multi-Year Historical Deep Sync',
        'AI Full Video Script Outliner',
        'Comment NLP Sentiment Analysis',
        'Multi-user Team Collaborators',
        'Direct YouTube OAuth & Supabase DB Sync',
        'Priority Algorithmic Audit Alerts',
        'Dedicated 1-on-1 Creator Success Manager',
      ],
      cta: 'Upgrade to Studio',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    // 1. If live Stripe or Lemon Squeezy checkout link is configured in .env, redirect directly!
    const checkout = getCheckoutUrl(planName as any, currentUser.email);
    if (checkout.isConfigured && checkout.url) {
      window.open(checkout.url, '_blank');
      showToast('Redirecting to Checkout', `Opening secure checkout for ${planName}...`, 'info');
      return;
    }

    // 2. Otherwise open demo plan switcher modal
    setSelectedPlanModal(planName);
  };

  const handleConfirmPlanSwitch = () => {
    if (selectedPlanModal) {
      setCurrentUser({
        ...currentUser,
        plan: selectedPlanModal as any,
      });
      setSelectedPlanModal(null);
      showToast('Plan Upgraded', `Your account is now upgraded to the ${selectedPlanModal} Plan in Demo Mode.`, 'success');
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto py-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="purple" size="md">
            Transparent Pricing
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Supercharge Your YouTube Growth
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Choose the plan tailored to your channel size. Switch or cancel anytime. (Simulated Demo Mode).
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {plans.map((p) => {
            const isCurrent = currentUser.plan === p.id;
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm dark:bg-navy-850 transition-all ${
                  p.popular
                    ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-lg dark:border-brand-500'
                    : 'border-slate-200/80 dark:border-navy-750'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-rose-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-md">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {price}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      / month {billingCycle === 'annual' && '(billed yearly)'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-navy-750 space-y-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Included Features:
                    </p>
                    <ul className="space-y-2 text-xs">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-navy-750">
                  {isCurrent ? (
                    <Button variant="outline" size="md" className="w-full pointer-events-none opacity-60">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={p.popular ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                      onClick={() => handleSelectPlan(p.id)}
                    >
                      {p.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Upgrade Confirmation Modal (Simulated Payment) */}
        <Modal
          isOpen={Boolean(selectedPlanModal)}
          onClose={() => setSelectedPlanModal(null)}
          title={`Upgrade to ${selectedPlanModal} Plan`}
          description="Simulate activating premium subscription tier."
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 p-3.5 text-slate-800 dark:text-slate-200 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                <CreditCard className="h-4 w-4" /> Turnkey Stripe & Lemon Squeezy Integration
              </p>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                To connect live payments, set <code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded font-mono text-brand-500">NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO</code> in your <code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded font-mono">.env.local</code>. This immediately redirects users directly to your live Stripe checkout.
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Currently running in decoupled sandbox mode. You can switch to the <strong>{selectedPlanModal} Plan</strong> immediately for local testing.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-navy-750">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlanModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmPlanSwitch}>
                Switch to {selectedPlanModal} (Demo)
              </Button>
            </div>
          </div>
        </Modal>

        {/* FAQ Accordion */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-brand-500" /> Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">
                How does YouTube Analytics Pro connect to my channel?
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                It uses the official Google YouTube Data API v3 and YouTube Analytics API OAuth 2.0 with read-only permissions. Your account password is never accessed.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Can I manage multiple YouTube channels?
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Yes! The Pro plan supports up to 5 channels, and the Creator plan supports unlimited channels across separate Google logins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

