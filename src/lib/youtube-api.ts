/**
 * YOUTUBE API SERVICE & ARCHITECTURAL INTEGRATION LAYER
 * 
 * Supports:
 * - YouTube Data API v3 (Channels, Videos, Search, Playlists, Comments)
 * - YouTube Analytics API (Daily reports, Retention curves, Demographics, Geography, Revenue)
 * 
 * SECURITY BEST PRACTICE:
 * Client credentials and API secrets (YOUTUBE_CLIENT_SECRET, YOUTUBE_API_KEY) must NEVER 
 * be bundled into client-side code. They are configured via server-side environment variables
 * and executed via Next.js API Routes (/api/youtube/*).
 * 
 * REQUIRED OAUTH 2.0 SCOPES FOR FULL FUNCTIONALITY:
 * - https://www.googleapis.com/auth/youtube.readonly
 * - https://www.googleapis.com/auth/yt-analytics.readonly
 * - https://www.googleapis.com/auth/yt-analytics-monetary.readonly
 */

import { DEMO_CHANNELS, DEMO_DAILY_DATA, DEMO_VIDEOS } from './demo-data';

export interface YouTubeConnectionStatus {
  connected: boolean;
  channelId: string | null;
  channelTitle: string | null;
  scopesGranted: string[];
  expiresAt: string | null;
  authMethod: 'demo' | 'oauth2';
}

export class YouTubeApiService {
  private static instance: YouTubeApiService;

  public static getInstance(): YouTubeApiService {
    if (!YouTubeApiService.instance) {
      YouTubeApiService.instance = new YouTubeApiService();
    }
    return YouTubeApiService.instance;
  }

  /**
   * Returns current connection state
   */
  public async getConnectionStatus(): Promise<YouTubeConnectionStatus> {
    return {
      connected: true,
      channelId: DEMO_CHANNELS[0].id,
      channelTitle: DEMO_CHANNELS[0].name,
      scopesGranted: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
      ],
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      authMethod: 'demo',
    };
  }

  /**
   * Mock channel stats fetcher
   */
  public async getChannelOverview(channelId?: string) {
    const channel = DEMO_CHANNELS.find((c) => c.id === channelId) || DEMO_CHANNELS[0];
    return {
      channel,
      dailyTrend: DEMO_DAILY_DATA,
      recentVideos: DEMO_VIDEOS,
    };
  }

  /**
   * OAuth initiation helper URL generator for production
   */
  public getOAuthLoginUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || 'DEMO_CLIENT_ID';
    const redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/api/auth/youtube/callback` 
      : 'http://localhost:3000/api/auth/youtube/callback';

    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
    ].join(' ');

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  }
}

export const youtubeApi = YouTubeApiService.getInstance();

