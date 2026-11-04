'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, EyeOff, SlidersHorizontal, Check, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  getConsentPreferences,
  saveConsentPreferences,
  enforceInputMaskingOnDOM,
  ConsentPreferences,
} from '@/lib/privacy-consent';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [allowReplay, setAllowReplay] = useState(false); // OFF BY DEFAULT
  const [allowAnalytics, setAllowAnalytics] = useState(false); // OFF BY DEFAULT

  useEffect(() => {
    // 1. Enforce universal DOM input masking immediately
    enforceInputMaskingOnDOM();

    // 2. Check if the visitor has already submitted consent
    const stored = localStorage.getItem('yt_pro_consent_v1');
    if (!stored) {
      setIsVisible(true);
    } else {
      const prefs = getConsentPreferences();
      setAllowReplay(prefs.sessionReplay);
      setAllowAnalytics(prefs.analytics);
    }

    // Set up mutation observer to maintain input masking as new dynamic components mount
    const observer = new MutationObserver(() => {
      enforceInputMaskingOnDOM();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleAcceptAll = () => {
    saveConsentPreferences({ sessionReplay: true, analytics: true });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    // Strictly turn session recording OFF
    saveConsentPreferences({ sessionReplay: false, analytics: false });
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    saveConsentPreferences({
      sessionReplay: allowReplay,
      analytics: allowAnalytics,
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Session Replay Consent"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="rounded-2xl border border-slate-200/90 dark:border-navy-700 bg-white/95 dark:bg-[#0e1017]/95 p-5 shadow-2xl backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                Privacy & Session Replay Consent
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Session recording is strictly <strong className="text-slate-900 dark:text-white">disabled by default</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={handleRejectAll}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Close and keep disabled"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Masking Security Notice */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300">
          <EyeOff className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>
            Input Masking Active: All form fields, passwords, and sensitive keystrokes are masked automatically.
          </span>
        </div>

        {/* Granular Preferences Accordion */}
        {showDetails && (
          <div className="rounded-xl border border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-950 p-3 space-y-3 animate-in fade-in">
            {/* Category 1: Essential */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-slate-400" /> Essential Operations
                </p>
                <p className="text-[10px] text-slate-500">Authentication, routing, and local state security.</p>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-navy-800 px-2 py-0.5 rounded">
                Always Active
              </span>
            </div>

            {/* Category 2: Session Replay (OFF BY DEFAULT) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-navy-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Session Replay & Diagnostics
                </p>
                <p className="text-[10px] text-slate-500">
                  Off by default. Record mouse movements and UI clicks with all inputs masked.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowReplay}
                onChange={(e) => setAllowReplay(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>

            {/* Category 3: Analytics */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-navy-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Anonymous Performance Analytics
                </p>
                <p className="text-[10px] text-slate-500">
                  Off by default. Page load timing and UI performance counters.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowAnalytics}
                onChange={(e) => setAllowAnalytics(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors self-start sm:self-center"
          >
            <SlidersHorizontal className="h-3 w-3" />
            {showDetails ? 'Hide Details' : 'Preferences'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showDetails ? (
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={handleSaveCustom}>
                Save Preferences
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="w-full sm:w-auto text-slate-600 dark:text-slate-300" onClick={handleRejectAll}>
                Essential Only (Keep Off)
              </Button>
            )}
            <Button size="sm" className="w-full sm:w-auto" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
