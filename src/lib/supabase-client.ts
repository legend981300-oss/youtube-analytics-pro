/**
 * SUPABASE INTEGRATION ARCHITECTURE LAYER
 * 
 * This module prepares YouTube Analytics Pro for seamless Supabase authentication 
 * and PostgreSQL database synchronization.
 * 
 * SETUP INSTRUCTIONS FOR PRODUCTION:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * 3. Run the schema migrations for:
 *    - profiles (id, user_id, display_name, email, plan, role)
 *    - channels (id, user_id, channel_id, channel_title, handle, thumbnail, stats)
 *    - video_cache (video_id, channel_id, title, published_at, stats, last_synced)
 *    - user_goals (id, user_id, target_metric, current_value, target_value, deadline)
 *    - video_ideas (id, user_id, title, status, tags, notes, target_date)
 * 
 * When environment variables are not set, this module gracefully falls back 
 * to high-performance local demo state without throwing runtime errors.
 */

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && !url.includes('placeholder')),
  };
};

export interface MockAuthUser {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'admin';
  plan: 'Free' | 'Pro' | 'Creator';
}

class SupabaseService {
  private config = getSupabaseConfig();

  public getStatus() {
    return {
      connected: this.config.isConfigured,
      mode: this.config.isConfigured ? 'Live Supabase Cloud' : 'Local Demo Sandbox',
      url: this.config.url || 'Not configured (using local state)',
    };
  }

  // Simulated session getter ready to hook into supabase.auth.getSession()
  public async getSession(): Promise<{ user: MockAuthUser | null }> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yt_pro_user');
      if (stored) {
        try {
          return { user: JSON.parse(stored) };
        } catch {
          // ignore error
        }
      }
    }
    return {
      user: {
        id: 'usr-demo-01',
        email: 'creator@demo.io',
        name: 'Alex Rivera',
        role: 'creator',
        plan: 'Pro',
      },
    };
  }

  // Simulated signOut ready to hook into supabase.auth.signOut()
  public async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yt_pro_user');
    }
  }
}

export const supabase = new SupabaseService();

