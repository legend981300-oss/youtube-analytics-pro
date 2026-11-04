'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('alex@creatorsuite.io');
  const [password, setPassword] = useState('demo123456');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  const handleQuickDemoLogin = (role: 'creator' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser({
        id: role === 'admin' ? 'usr-admin-01' : 'usr-8821',
        name: role === 'admin' ? 'Admin Operator' : 'Alex Rivera',
        email: role === 'admin' ? 'admin@ytanalytics.pro' : 'alex@creatorsuite.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        plan: role === 'admin' ? 'Creator' : 'Pro',
        channelsCount: 3,
        joinedDate: 'November 2023',
        role,
      });
      setIsLoading(false);
      router.push(role === 'admin' ? '/admin' : '/');
    }, 400);
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
            Welcome back, Creator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your YouTube analytics command center.
          </p>
        </div>

        {/* Mock Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-500" /> Temporary Mock Authentication
          </p>
          <p className="leading-relaxed text-[11px]">
            This is a mock login layer ready for Supabase Auth in production. You can click the one-click demo shortcuts below to enter instantly!
          </p>
        </div>

        {/* Quick Demo Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('creator')}
            className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-brand-500 hover:bg-slate-50 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-brand-500 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">
              One-Click
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              Creator Demo
            </p>
            <p className="text-[10px] text-slate-400">Pro Plan • 3 Channels</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-purple-500 hover:bg-slate-50 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-purple-500 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
              One-Click
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              Admin Demo
            </p>
            <p className="text-[10px] text-slate-400">Platform Control Room</p>
          </button>
        </div>

        {/* Login Card Form */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Password
                </label>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 cursor-pointer">
                  Forgot? (Demo)
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <Button type="submit" size="md" className="w-full" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-750 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

