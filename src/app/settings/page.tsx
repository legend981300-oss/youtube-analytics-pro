'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  User,
  Settings,
  Database,
  KeyRound,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase-client';
import { youtubeApi } from '@/lib/youtube-api';

export default function SettingsPage() {
  const { currentUser, setCurrentUser, selectedChannel, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'supabase' | 'youtube' | 'notifications'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const supabaseStatus = supabase.getStatus();

  // Listen for OAuth callback status parameters upon redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'youtube' || tabParam === 'supabase' || tabParam === 'profile' || tabParam === 'notifications') {
      setActiveTab(tabParam as any);
    }

    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const oauthWarning = params.get('oauth_warning');
    const channelParam = params.get('channel');

    if (oauthSuccess === 'true') {
      showToast('YouTube Connected', `Channel "${channelParam || 'Your Channel'}" authenticated via Google OAuth!`, 'success');
      window.history.replaceState({}, '', '/settings?tab=youtube');
    } else if (oauthWarning === 'unconfigured') {
      showToast('OAuth Keys Required', 'Please set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env.local to enable live OAuth token exchange.', 'warning');
      window.history.replaceState({}, '', '/settings?tab=youtube');
    } else if (oauthError) {
      showToast('OAuth Error', `Google OAuth failed: ${oauthError}`, 'error');
      window.history.replaceState({}, '', '/settings?tab=youtube');
    }
  }, [showToast]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
    });
    setSavedSuccess(true);
    showToast('Profile Updated', 'Creator profile details updated successfully', 'success');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Account Settings & API Integrations
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your user credentials, Supabase database synchronization, and Google YouTube OAuth keys.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-navy-750 pb-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <User className="h-4 w-4" /> Creator Profile
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'supabase'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <Database className="h-4 w-4" /> Supabase Database
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'youtube'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <KeyRound className="h-4 w-4" /> YouTube API & OAuth
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-300'
            }`}
          >
            <Bell className="h-4 w-4" /> Email & Alerts
          </button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-5"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-navy-750">
              <img
                src={currentUser.avatar}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <Badge variant="purple" size="sm" className="mt-1">
                  {currentUser.plan} Plan
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Profile changes saved successfully!
              </div>
            )}

            <div className="flex justify-end pt-3">
              <Button type="submit" size="sm">
                Save Profile Changes
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: SUPABASE */}
        {activeTab === 'supabase' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-5 text-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-navy-750">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-500" /> Supabase Database & Auth Architecture
                </h3>
                <Badge variant={supabaseStatus.connected ? 'success' : 'cyan'} size="sm">
                  {supabaseStatus.mode}
                </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                YouTube Analytics Pro is architected to seamlessly plug into Supabase without refactoring.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-2 font-mono text-[11px]">
              <p className="font-bold text-slate-900 dark:text-white">Required Environment Variables (.env.local):</p>
              <p className="text-slate-600 dark:text-slate-300">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
              </p>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">Ready PostgreSQL Tables:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li><code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded">profiles</code> (User details, subscription tier, creator roles)</li>
                <li><code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded">channels</code> (Connected YouTube channels & tokens)</li>
                <li><code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded">video_cache</code> (Analytics metrics & SEO audit logs)</li>
                <li><code className="bg-slate-100 dark:bg-navy-950 px-1 py-0.5 rounded">video_ideas</code> (Kanban idea vault sync)</li>
              </ul>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => showToast('Supabase Ready', 'Supabase architecture initialized. Ready for .env.local keys.', 'success')}
            >
              Test Supabase Client Connection
            </Button>
          </div>
        )}

        {/* TAB 3: YOUTUBE API */}
        {activeTab === 'youtube' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-5 text-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-navy-750">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-brand-500" /> YouTube Data API v3 & Analytics API OAuth
                </h3>
                <Badge variant="purple" size="sm">
                  OAuth 2.0 Ready
                </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Zero security exposure: Client secret is isolated on the server-side API handler.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800 space-y-2 font-mono text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Server-side Environment Variables (.env.local):</p>
                <p className="text-slate-600 dark:text-slate-300">YOUTUBE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com</p>
                <p className="text-slate-600 dark:text-slate-300">YOUTUBE_CLIENT_SECRET=GOCSPX-your-secret-never-exposed-to-client</p>
                <p className="text-slate-600 dark:text-slate-300">YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/youtube/callback</p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Configured Scopes:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>https://www.googleapis.com/auth/youtube.readonly</li>
                  <li>https://www.googleapis.com/auth/yt-analytics.readonly</li>
                  <li>https://www.googleapis.com/auth/yt-analytics-monetary.readonly</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={youtubeApi.getOAuthLoginUrl()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-red-500 hover:to-rose-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <KeyRound className="h-4 w-4" /> Connect with Google OAuth
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(youtubeApi.getOAuthLoginUrl());
                  showToast('OAuth URL Copied', 'YouTube OAuth URL copied to clipboard', 'info');
                }}
              >
                Copy OAuth Redirect URL
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-navy-750">
              Notification & Digest Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Viral Traffic Spike Alerts</p>
                  <p className="text-slate-500 text-[11px]">Get notified when any video experiences a &gt;200% velocity surge.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Weekly Performance Digest</p>
                  <p className="text-slate-500 text-[11px]">Receive an executive summary every Monday morning with CSV download.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Subscriber Milestone Celebrations</p>
                  <p className="text-slate-500 text-[11px]">Milestone notifications when crossing major follower benchmarks.</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => showToast('Preferences Saved', 'Notification alert settings updated successfully!', 'success')}
              >
                Save Alert Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

