/**
 * PRIVACY & SESSION REPLAY GOVERNANCE CONTROLLER
 * 
 * Strict GDPR / ePrivacy / FTC compliance for session replay and analytics tracking:
 * 1. Session recording is OFF by default.
 * 2. Analytics tracking is OFF by default.
 * 3. Only starts recording after explicit visitor opt-in via Consent Banner.
 * 4. Masks all input fields across third-party recording tools (Hotjar, Clarity, PostHog, FullStory, LogRocket).
 */

export interface ConsentPreferences {
  essential: boolean;     // Always true (auth, routing, local state)
  sessionReplay: boolean; // OFF BY DEFAULT (Hotjar, Clarity, PostHog, FullStory, LogRocket, Smartlook)
  analytics: boolean;     // OFF BY DEFAULT (Usage metrics, traffic diagnostics)
  timestamp: string;      // ISO record of consent
  version: string;        // Policy version
}

const CONSENT_STORAGE_KEY = 'yt_pro_consent_v1';

export const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  sessionReplay: false, // MANDATORY: STRICTLY OFF BY DEFAULT
  analytics: false,     // MANDATORY: STRICTLY OFF BY DEFAULT
  timestamp: '',
  version: '1.0.0',
};

/**
 * Get current stored consent preferences, defaulting to OFF
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_CONSENT;
  }

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      sessionReplay: Boolean(parsed.sessionReplay),
      analytics: Boolean(parsed.analytics),
      timestamp: parsed.timestamp || '',
      version: parsed.version || '1.0.0',
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Save user consent choices and notify listeners
 */
export function saveConsentPreferences(prefs: {
  sessionReplay: boolean;
  analytics: boolean;
}): ConsentPreferences {
  const updated: ConsentPreferences = {
    essential: true,
    sessionReplay: Boolean(prefs.sessionReplay),
    analytics: Boolean(prefs.analytics),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch global event for analytics / session replay hooks
    window.dispatchEvent(
      new CustomEvent('privacy:consent_updated', { detail: updated })
    );

    // Apply or remove session replay trackers accordingly
    applySessionRecordingPolicy(updated);
  }

  return updated;
}

/**
 * Check whether session replay is currently permitted
 */
export function isSessionReplayAllowed(): boolean {
  return getConsentPreferences().sessionReplay;
}

/**
 * Universal Input Masking & Privacy Shield
 * Applies privacy attributes recognized by all major session replay engines:
 * - PostHog: 'ph-no-capture', 'data-attr-ph-no-capture'
 * - Microsoft Clarity: 'data-clarity-mask="true"'
 * - FullStory: 'fs-mask', 'data-fs-mask'
 * - LogRocket: 'data-private="true"'
 * - Hotjar: 'data-hj-suppress'
 * - Generic: 'data-mask="true"'
 */
export function enforceInputMaskingOnDOM(): void {
  if (typeof document === 'undefined') return;

  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((el) => {
    el.setAttribute('data-mask', 'true');
    el.setAttribute('data-clarity-mask', 'true');
    el.setAttribute('ph-no-capture', 'true');
    el.setAttribute('data-private', 'true');
    el.setAttribute('data-hj-suppress', 'true');
    el.classList.add('fs-mask');
  });
}

/**
 * Apply session recording policy across window globals
 */
export function applySessionRecordingPolicy(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  // Always enforce input masking regardless of recording state
  enforceInputMaskingOnDOM();

  // If user declined or has not accepted, strictly disable all session replay tools
  if (!prefs.sessionReplay) {
    // 1. PostHog opt-out
    if ((window as any).posthog) {
      try {
        (window as any).posthog.opt_out_capturing?.();
        (window as any).posthog.stopSessionRecording?.();
      } catch (err) {
        // Safe no-op
      }
    }

    // 2. Microsoft Clarity pause
    if ((window as any).clarity) {
      try {
        (window as any).clarity('pause');
      } catch (err) {
        // Safe no-op
      }
    }

    // 3. LogRocket stop
    if ((window as any).LogRocket) {
      try {
        (window as any).LogRocket.pauseRecording?.();
      } catch (err) {
        // Safe no-op
      }
    }

    // 4. FullStory shutdown
    if ((window as any).FS) {
      try {
        (window as any).FS.shutdown?.();
      } catch (err) {
        // Safe no-op
      }
    }

    // 5. Hotjar opt-out
    if ((window as any).hj) {
      try {
        (window as any).hj('stateChange', 'opt-out');
      } catch (err) {
        // Safe no-op
      }
    }
  }
}
