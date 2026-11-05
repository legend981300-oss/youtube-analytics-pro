'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, setIsAuthenticated, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('required=true')) {
      setIsRequired(true);
    }
  }, []);

  const handleLoginWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    const username = email.split('@')[0];
    const capitalized = username.charAt(0).toUpperCase() + username.slice(1);

    setTimeout(() => {
      const existingUser = {
        id: `usr-${Date.now()}`,
        name: capitalized,
        email: email.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        plan: 'Pro' as const,
        channelsCount: 1,
        joinedDate: 'Active Session',
        role: 'creator' as const,
      };

      setCurrentUser(existingUser);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('yt_pro_is_authenticated', 'true');
        localStorage.setItem('yt_pro_current_user', JSON.stringify(existingUser));
      } catch {}

      showToast('Signed In', `Welcome back, ${capitalized}!`, 'success');
      setIsLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleLoginWithGoogle = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const googleUser = {
        id: `usr-google-${Date.now()}`,
        name: 'Google Creator',
        email: 'creator@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        plan: 'Pro' as const,
        channelsCount: 1,
        joinedDate: 'Active Session',
        role: 'creator' as const,
      };

      setCurrentUser(googleUser);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('yt_pro_is_authenticated', 'true');
        localStorage.setItem('yt_pro_current_user', JSON.stringify(googleUser));
      } catch {}

      showToast('Signed in with Google', 'Welcome to your creator dashboard.', 'success');
      setIsGoogleLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0f] p-4 font-sans text-zinc-100">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="lg" href="/" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
            Welcome back
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in to access your YouTube analytics command center.
          </p>
        </div>

        {/* Auth Required Notice */}
        {isRequired && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-white">Sign In Required:</strong> Please sign in with Google or Email to view your dashboard.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Auth Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-xl backdrop-blur-sm space-y-4">
          {/* 1. Continue with Google Button */}
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900/90 py-2.5 px-4 text-xs font-semibold text-zinc-100 hover:bg-zinc-800 hover:border-zinc-600 transition-all shadow-sm disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800" />
            <span className="bg-zinc-950 px-2 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              or continue with email
            </span>
            <div className="w-full border-t border-zinc-800" />
          </div>

          {/* 2. Email & Password Form */}
          <form onSubmit={handleLoginWithEmail} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-xs text-zinc-500">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
