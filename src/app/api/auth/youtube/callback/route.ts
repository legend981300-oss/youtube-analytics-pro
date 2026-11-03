import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

interface YouTubeChannelItem {
  id: string;
  snippet?: {
    title?: string;
    customUrl?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
    };
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
}

/**
 * Google YouTube OAuth 2.0 Callback Route Handler
 * Endpoint: GET /api/auth/youtube/callback
 * 
 * Handles redirect from Google Accounts, securely exchanges the authorization code
 * for access/refresh tokens on the server, verifies channel identity, and sets an HTTP-only
 * session cookie without exposing any secrets or tokens to the browser.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Base fallback redirect URL to the settings page
  const settingsUrl = new URL('/settings', origin);
  settingsUrl.searchParams.set('tab', 'youtube');

  // 1. Handle user cancellation or OAuth authorization denial
  if (error) {
    // Log sanitized error code only; never log secrets or sensitive parameters
    console.warn(`[YouTube OAuth] Authorization denied or failed by Google: ${error}`);
    settingsUrl.searchParams.set('oauth_error', error);
    if (errorDescription) {
      settingsUrl.searchParams.set('oauth_desc', errorDescription);
    }
    return NextResponse.redirect(settingsUrl);
  }

  // 2. Validate authorization code presence
  if (!code) {
    settingsUrl.searchParams.set('oauth_error', 'missing_code');
    return NextResponse.redirect(settingsUrl);
  }

  // 3. Resolve server-side OAuth credentials
  const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${origin}/api/auth/youtube/callback`;

  // 4. Handle unconfigured environment variables gracefully (preserves demo mode)
  if (!clientId || !clientSecret || clientId === 'DEMO_CLIENT_ID' || clientSecret.includes('never-exposed')) {
    console.warn('[YouTube OAuth] Credentials not configured in .env.local; redirecting with setup notice.');
    settingsUrl.searchParams.set('oauth_warning', 'unconfigured');
    return NextResponse.redirect(settingsUrl);
  }

  try {
    // 5. Secure server-to-server token exchange with Google
    // YOUTUBE_CLIENT_SECRET is sent strictly from server to Google OAuth server
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      // Log HTTP status only; never print response body that could contain raw error dumps with secrets
      console.error(`[YouTube OAuth] Token exchange failed with HTTP status ${tokenResponse.status}`);
      settingsUrl.searchParams.set('oauth_error', 'token_exchange_failed');
      return NextResponse.redirect(settingsUrl);
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      settingsUrl.searchParams.set('oauth_error', 'invalid_token_payload');
      return NextResponse.redirect(settingsUrl);
    }

    // 6. Fetch authenticated creator channel identity via YouTube Data API v3
    let channelTitle = 'Connected YouTube Channel';
    let channelId = '';
    let subscriberCount = '0';
    let channelThumbnail = '';

    try {
      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      if (channelResponse.ok) {
        const channelJson = await channelResponse.json();
        const firstChannel: YouTubeChannelItem | undefined = channelJson.items?.[0];
        if (firstChannel) {
          channelId = firstChannel.id || '';
          channelTitle = firstChannel.snippet?.title || channelTitle;
          subscriberCount = firstChannel.statistics?.subscriberCount || '0';
          channelThumbnail = firstChannel.snippet?.thumbnails?.default?.url || '';
        }
      }
    } catch (channelErr) {
      // Non-fatal: if metadata query fails, token exchange was still successful
      console.warn('[YouTube OAuth] Channel metadata retrieval could not complete, continuing with connection status.');
    }

    // 7. Security: Never expose access_token or refresh_token in browser URLs or client-accessible scripts
    settingsUrl.searchParams.set('oauth_success', 'true');
    settingsUrl.searchParams.set('channel', channelTitle);

    const response = NextResponse.redirect(settingsUrl);

    // 8. Establish secure HTTP-only session cookie
    response.cookies.set({
      name: 'yt_oauth_session',
      value: JSON.stringify({
        connected: true,
        channelId,
        channelTitle,
        channelThumbnail,
        subscriberCount,
        hasRefreshToken: Boolean(tokenData.refresh_token),
        connectedAt: new Date().toISOString(),
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('[YouTube OAuth] Unexpected callback server error');
    settingsUrl.searchParams.set('oauth_error', 'server_error');
    return NextResponse.redirect(settingsUrl);
  }
}

