'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertOctagon, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [isEuUk, setIsEuUk] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [plan, setPlan] = useState<'Free' | 'Pro' | 'Creator'>('Pro');
  const [isLoading, setIsLoading] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  // Exact age calculation based on current date
  const calculatedAge = useMemo(() => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [dob]);

  const isUnder13 = calculatedAge !== null && calculatedAge < 13;
  const isUnder16InEuUk = calculatedAge !== null && calculatedAge >= 13 && calculatedAge < 16 && isEuUk;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);

    // 1. Strict Under 13 COPPA & Global Child Safety Check
    // If under 13, HARD BLOCK signup and DO NOT store anything about them
    if (calculatedAge === null) {
      setBlockError('Please specify your date of birth to confirm age eligibility.');
      return;
    }

    if (calculatedAge < 13) {
      setBlockError(
        'Registration Blocked: Individuals under 13 cannot create an account under COPPA and digital safety regulations. No account or personal data has been recorded.'
      );
      // Ensure zero data storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      return;
    }

    // 2. Strict Under 16 in EU / UK GDPR Article 8 Check
    if (isEuUk && calculatedAge < 16) {
      if (!parentalConsent || !parentEmail.trim()) {
        setBlockError(
          'Parental Consent Required: In accordance with GDPR Article 8 and UK GDPR, users under 16 residing in the EU/UK must provide verified parental/guardian consent and parent contact email to register.'
        );
        return;
      }
    }

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

        {/* Auth Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-500" /> Demo Sandbox Registration
          </p>
          <p className="leading-relaxed text-[11px]">
            Registration is fully functional in local demo mode. No credit card required.
          </p>
        </div>

        {/* Hard Block Error Banner (COPPA / GDPR Age Block) */}
        {blockError && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-700 dark:text-red-400 space-y-1 animate-in fade-in">
            <p className="font-bold flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" /> Age Verification Block
            </p>
            <p className="leading-relaxed text-[11px]">{blockError}</p>
          </div>
        )}

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
                data-mask="true"
                data-clarity-mask="true"
                ph-no-capture="true"
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
                data-mask="true"
                data-clarity-mask="true"
                ph-no-capture="true"
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
                data-mask="true"
                data-clarity-mask="true"
                ph-no-capture="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            {/* AGE VERIFICATION SECTION */}
            <div className="pt-2 border-t border-slate-100 dark:border-navy-750 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  {calculatedAge !== null && (
                    <span
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                        calculatedAge < 13
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : calculatedAge < 16 && isEuUk
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      Age: {calculatedAge}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  required
                  data-mask="true"
                  data-clarity-mask="true"
                  ph-no-capture="true"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white font-mono"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Required to comply with child safety laws (COPPA & GDPR Article 8). Minimum age is 13.
                </p>
              </div>

              {/* Jurisdiction: EU / UK Toggle */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-navy-750 dark:bg-navy-900/60 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={isEuUk}
                  onChange={(e) => setIsEuUk(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded text-brand-500 focus:ring-brand-500 dark:border-navy-700 dark:bg-navy-950"
                />
                <span className="text-slate-700 dark:text-slate-300 leading-tight">
                  I reside in the European Union (EU) or the United Kingdom (UK)
                </span>
              </label>

              {/* HARD BLOCK NOTICE IF UNDER 13 */}
              {isUnder13 && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-700 dark:text-red-400 space-y-1">
                  <p className="font-bold text-[11px] flex items-center gap-1.5">
                    <AlertOctagon className="h-3.5 w-3.5 text-red-500" /> Account Creation Not Allowed
                  </p>
                  <p className="text-[10px] leading-relaxed">
                    Users under the age of 13 cannot register for YouTube Analytics Pro under COPPA. No data has been stored.
                  </p>
                </div>
              )}

              {/* PARENTAL CONSENT BOX FOR UNDER 16 IN EU/UK */}
              {isUnder16InEuUk && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2.5 text-amber-900 dark:text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <UserCheck className="h-3.5 w-3.5 text-amber-500" /> Parental / Guardian Consent Required (GDPR Art. 8)
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Under EU/UK GDPR regulations, creators between 13 and 15 years old require verified parental or guardian authorization.
                  </p>

                  <div className="space-y-1">
                    <label className="font-semibold text-[11px] block">
                      Parent / Legal Guardian Email
                    </label>
                    <input
                      type="email"
                      required={isUnder16InEuUk}
                      data-mask="true"
                      data-clarity-mask="true"
                      ph-no-capture="true"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="guardian@example.com"
                      className="w-full rounded-lg border border-amber-500/30 bg-white dark:bg-navy-950 p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-[10px] leading-tight pt-1">
                    <input
                      type="checkbox"
                      checked={parentalConsent}
                      onChange={(e) => setParentalConsent(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>
                      I confirm that my parent or legal guardian has reviewed and authorized this account creation and terms of service.
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-1 pt-1">
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

            <Button
              type="submit"
              size="md"
              className="w-full"
              isLoading={isLoading}
              disabled={isUnder13 || (isUnder16InEuUk && (!parentalConsent || !parentEmail.trim()))}
            >
              {isUnder13 ? 'Registration Blocked (<13)' : 'Create Account & Launch'}
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


