'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation */}
      <nav className="border-b border-[#1f1f23] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              Y
            </div>
            <span className="font-semibold tracking-tight text-sm text-zinc-100">YouTube Analytics Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">
              Pricing
            </a>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-zinc-100 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              Go to Dashboard <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          ✨ Built for Next-Gen Creator Networks
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 max-w-3xl leading-[1.15]">
          Predict Virality. Optimize CTR. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
            Automate YouTube Growth.
          </span>
        </h1>
        <p className="mt-6 text-zinc-400 max-w-xl text-base md:text-lg leading-relaxed">
          The elite telemetry hub running cron-driven asset optimization, retention drop-off analytics, and instant multi-channel metadata updates.
        </p>

        {/* Hero Button Triggers to hit local dashboard paths */}
        <div className="mt-10 flex gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-500 text-zinc-50 text-sm font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Start Free Pilot
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-zinc-900 border border-[#1f1f23] hover:bg-zinc-800 text-zinc-300 text-sm font-medium px-6 py-3 rounded-xl transition-colors"
          >
            View Live Sandbox
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1f1f23]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight">Engineered for Data Domination</h2>
          <p className="text-sm text-zinc-400 mt-2">Bypass typical dashboard limits with localized workflows and intelligent routing.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#09090b] border border-[#1f1f23] p-6 rounded-2xl flex flex-col gap-3 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
              🎛️
            </div>
            <h3 className="text-base font-semibold text-zinc-100">A/B Testing Lab</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated 24-hour thumbnail and title rotation mapping direct conversion changes locally with two-proportion Z-test significance.
            </p>
            <Link href="/ab-testing" className="mt-auto text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 pt-2">
              Explore Lab →
            </Link>
          </div>

          <div className="bg-[#09090b] border border-[#1f1f23] p-6 rounded-2xl flex flex-col gap-3 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              📈
            </div>
            <h3 className="text-base font-semibold text-zinc-100">Retention Telemetry</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Isolate drop-off parameters to the exact timestamp window to optimize audience loops and algorithmic velocity multipliers.
            </p>
            <Link href="/videos" className="mt-auto text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 pt-2">
              View Catalog →
            </Link>
          </div>

          <div className="bg-[#09090b] border border-[#1f1f23] p-6 rounded-2xl flex flex-col gap-3 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
              🤖
            </div>
            <h3 className="text-base font-semibold text-zinc-100">Headless SEO Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated batch updating handles core metadata profiles instantly across entire catalogs with AI studio variants.
            </p>
            <Link href="/seo" className="mt-auto text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 pt-2">
              Inspect SEO →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1f1f23] mb-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight">Flexible Commercial Tiers</h2>
          <p className="text-sm text-zinc-400 mt-2">Scale fluidly as your channel ecosystem or network matrix expands.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Tier 1 */}
          <div className="bg-[#09090b] border border-[#1f1f23] p-8 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Starter</p>
              <div className="mt-4 flex items-baseline text-zinc-50">
                <span className="text-3xl font-bold tracking-tight">$29</span>
                <span className="text-sm text-zinc-500 ml-1">/mo</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> 1 Channel Matrix Sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Core Recharts Telemetry</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Basic Performance Metrics</li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-8 w-full bg-zinc-900 border border-[#1f1f23] text-zinc-300 text-xs font-medium py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Tier 2 - Featured */}
          <div className="bg-[#09090b] border-2 border-indigo-500 p-8 rounded-2xl flex flex-col justify-between relative shadow-2xl shadow-indigo-600/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-500 text-zinc-50">
              Most Popular
            </span>
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Creator Pro</p>
              <div className="mt-4 flex items-baseline text-zinc-50">
                <span className="text-3xl font-bold tracking-tight">$79</span>
                <span className="text-sm text-zinc-500 ml-1">/mo</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> 5 Channel Matrix Syncs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Full Cron A/B Lab Modules</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Retention Telemetry Alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Priority API Pipeline Routing</li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-8 w-full bg-indigo-600 text-zinc-50 text-xs font-semibold py-2.5 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#09090b] border border-[#1f1f23] p-8 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Network Enterprise</p>
              <div className="mt-4 flex items-baseline text-zinc-50">
                <span className="text-3xl font-bold tracking-tight">$199</span>
                <span className="text-sm text-zinc-500 ml-1">/mo</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Unlimited Multi-Tenant Syncs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Complete Headless Automation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> Custom Webhook Integrations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" /> 24/7 Dedicated Infrastructure</li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-8 w-full bg-zinc-900 border border-[#1f1f23] text-zinc-300 text-xs font-medium py-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#1f1f23] py-10 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} YouTube Analytics Pro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
            <Link href="/ab-testing" className="hover:text-zinc-300 transition-colors">A/B Testing</Link>
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
            <Link href="/settings" className="hover:text-zinc-300 transition-colors">Settings</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
