declare global {
  interface Window {
    google?: any;
  }
}

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '188216790887-rvrhe1ovbtvam05eldhkd68ri03rvqjp.apps.googleusercontent.com';

export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if (window.google?.accounts?.oauth2) return resolve();

    const existing = document.getElementById('google-gsi-client');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

export function promptGoogleLogin(
  onSuccess: (profile: GoogleUserProfile) => void,
  onError: (err: any) => void
) {
  loadGoogleScript().then(() => {
    if (!window.google?.accounts?.oauth2) {
      onError(new Error('Google Identity Services failed to load'));
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (response: any) => {
        if (response.error) {
          onError(response);
          return;
        }

        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          });

          if (!userInfoRes.ok) {
            throw new Error('Failed to fetch userinfo from Google');
          }

          const profile: GoogleUserProfile = await userInfoRes.json();
          onSuccess(profile);
        } catch (fetchErr) {
          onError(fetchErr);
        }
      },
    });

    client.requestAccessToken();
  });
}
