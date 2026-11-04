'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<'Free' | 'Pro' | 'Creator'>('Pro');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: name || 'New Creator',
        email: email || 'creator@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        plan,
        channelsCount: 1,
        joinedDate: 'Today',
        role: 'creator',
      });
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090a0f] p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" href="/" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Create your creator account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start optimizing your YouTube channel with algorithmic intelligence.
          </p>
        </div>

        {/* Temporary Auth Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-500" /> Demo Sandbox Registration
          </p>
          <p className="leading-relaxed text-[11px]">
            Registration is fully functional in local demo mode. No credit card or real email verification required.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Selected Plan
              </label>
              <select
                value={plan}
                onChange={(e: any) => setPlan(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              >
                <option value="Free">Free Starter ($0/mo)</option>
                <option value="Pro">Pro Creator ($29/mo)</option>
                <option value="Creator">Studio Enterprise ($79/mo)</option>
              </select>
            </div>

            <Button type="submit" size="md" className="w-full" isLoading={isLoading}>
              Create Account & Launch
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-750 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

