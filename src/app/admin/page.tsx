'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { ShieldCheck, Users, Tv2, Activity, Server, Sliders, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface MockUserRow {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Creator';
  channels: number;
  joined: string;
  status: 'active' | 'suspended';
}

const MOCK_USERS: MockUserRow[] = [
  { id: 'u-1', name: 'Alex Rivera', email: 'alex@creatorsuite.io', plan: 'Pro', channels: 3, joined: 'Nov 2023', status: 'active' },
  { id: 'u-2', name: 'Samantha Wu', email: 'sam@devmatrix.com', plan: 'Creator', channels: 8, joined: 'Dec 2023', status: 'active' },
  { id: 'u-3', name: 'David Kim', email: 'david@codecraft.dev', plan: 'Free', channels: 1, joined: 'Jan 2024', status: 'active' },
  { id: 'u-4', name: 'Liam Patel', email: 'liam@techpulse.org', plan: 'Pro', channels: 4, joined: 'Feb 2024', status: 'active' },
  { id: 'u-5', name: 'Elena Rostova', email: 'elena@vloghub.io', plan: 'Free', channels: 1, joined: 'Mar 2024', status: 'suspended' },
];

export default function AdminDashboardPage() {
  const { showToast } = useApp();
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [featureFlags, setFeatureFlags] = useState({
    aiStudioEnabled: true,
    predictiveAiEnabled: true,
    sentimentNlpEnabled: true,
    stripeLivePayments: false,
  });

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFlag = (flag: keyof typeof featureFlags) => {
    const nextVal = !featureFlags[flag];
    setFeatureFlags((prev) => ({ ...prev, [flag]: nextVal }));
    showToast('Feature Flag Updated', `${flag} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'info');
  };

  const toggleUserStatus = (id: string, name: string, currStatus: 'active' | 'suspended') => {
    const nextStatus = currStatus === 'active' ? 'suspended' : 'active';
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: nextStatus }
          : u
      )
    );
    showToast('User Status Changed', `${name} is now ${nextStatus.toUpperCase()}`, 'info');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Platform Admin Command Center
              </h1>
              <Badge variant="purple" size="sm">
                Superuser Console
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Internal SaaS operations, user management, feature flags, and Google API quota consumption.
            </p>
          </div>
        </div>

        {/* 4 Admin KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Registered Creators"
            value="14,820"
            change={18.4}
            icon={Users}
            iconColor="text-blue-500"
            subtitle="+412 new this week"
          />
          <StatCard
            title="Active Sync Channels"
            value="28,490"
            change={21.2}
            icon={Tv2}
            iconColor="text-purple-500"
            subtitle="OAuth tokens valid"
          />
          <StatCard
            title="YouTube API Quota"
            value="18.4%"
            change={-2.1}
            icon={Server}
            iconColor="text-emerald-500"
            subtitle="184,000 / 1,000,000 units"
          />
          <StatCard
            title="Platform MRR"
            value="$42,850"
            change={14.8}
            icon={Activity}
            iconColor="text-rose-500"
            subtitle="Combined SaaS subscriptions"
          />
        </div>

        {/* Feature Flags Manager */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-750">
            <Sliders className="h-4 w-4 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dynamic Feature Flags
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">AI Creative Studio</p>
                <p className="text-[10px] text-slate-400">Gemini & OpenAI generators</p>
              </div>
              <input
                type="checkbox"
                checked={featureFlags.aiStudioEnabled}
                onChange={() => toggleFlag('aiStudioEnabled')}
                className="h-4 w-4 rounded text-brand-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Predictive AI Model</p>
                <p className="text-[10px] text-slate-400">Growth forecasting engine</p>
              </div>
              <input
                type="checkbox"
                checked={featureFlags.predictiveAiEnabled}
                onChange={() => toggleFlag('predictiveAiEnabled')}
                className="h-4 w-4 rounded text-brand-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Comment NLP Engine</p>
                <p className="text-[10px] text-slate-400">Sentiment & question parser</p>
              </div>
              <input
                type="checkbox"
                checked={featureFlags.sentimentNlpEnabled}
                onChange={() => toggleFlag('sentimentNlpEnabled')}
                className="h-4 w-4 rounded text-brand-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Live Payment Gateways</p>
                <p className="text-[10px] text-slate-400">Stripe / LemonSqueezy</p>
              </div>
              <input
                type="checkbox"
                checked={featureFlags.stripeLivePayments}
                onChange={() => toggleFlag('stripeLivePayments')}
                className="h-4 w-4 rounded text-brand-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Creator Directory ({filteredUsers.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage user access tiers and channel links.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creators..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-750 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Creator</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Channels</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-750">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                    <td className="py-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={user.plan === 'Creator' ? 'purple' : user.plan === 'Pro' ? 'cyan' : 'default'}
                        size="sm"
                      >
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      {user.channels} Channels
                    </td>
                    <td className="py-3 text-slate-400">{user.joined}</td>
                    <td className="py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'danger'} size="sm">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id, user.name, user.status)}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

