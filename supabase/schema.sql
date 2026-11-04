-- ==============================================================================
-- YOUTUBE ANALYTICS PRO - PRODUCTION POSTGRESQL MASTER SCHEMA (SUPABASE)
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- It creates all tables, indexes, triggers, and Row-Level Security (RLS) policies.
-- Fully compliant with Multi-Tenant Data Isolation (auth.uid() = user_id).
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'Free' CHECK (plan IN ('Free', 'Pro', 'Creator')),
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'admin')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHANNELS TABLE
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  handle TEXT NOT NULL,
  thumbnail_url TEXT,
  subscribers BIGINT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  video_count INT DEFAULT 0,
  niche TEXT DEFAULT 'Creator Media',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- 4. CHANNEL HISTORICAL STATS (DAILY AGGREGATIONS)
CREATE TABLE IF NOT EXISTS public.channel_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  views BIGINT DEFAULT 0,
  watch_hours NUMERIC(10, 2) DEFAULT 0,
  subscribers_gained INT DEFAULT 0,
  subscribers_lost INT DEFAULT 0,
  estimated_revenue NUMERIC(10, 2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  ctr NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, date)
);

-- 5. VIDEO ANALYTICS CACHE TABLE
CREATE TABLE IF NOT EXISTS public.video_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  youtube_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  views BIGINT DEFAULT 0,
  watch_hours NUMERIC(10, 2) DEFAULT 0,
  ctr NUMERIC(5, 2) DEFAULT 0,
  retention_rate NUMERIC(5, 2) DEFAULT 0,
  revenue NUMERIC(10, 2) DEFAULT 0,
  outlier_multiplier NUMERIC(5, 2) DEFAULT 1.0,
  upload_rank INT DEFAULT 1,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, youtube_video_id)
);

-- 6. A/B TESTING LAB (TITLE & THUMBNAIL EXPERIMENTS)
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  title_a TEXT NOT NULL,
  title_b TEXT NOT NULL,
  thumbnail_a_url TEXT NOT NULL,
  thumbnail_b_url TEXT NOT NULL,
  current_variant TEXT DEFAULT 'A' CHECK (current_variant IN ('A', 'B')),
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  variant_a_views INT DEFAULT 0,
  variant_b_views INT DEFAULT 0,
  variant_a_impressions INT DEFAULT 0,
  variant_b_impressions INT DEFAULT 0,
  variant_a_ctr NUMERIC(5, 2) DEFAULT 0,
  variant_b_ctr NUMERIC(5, 2) DEFAULT 0,
  confidence_score NUMERIC(5, 2) DEFAULT 0,
  winner_variant TEXT CHECK (winner_variant IN ('A', 'B', 'inconclusive')),
  rotation_interval_hours INT DEFAULT 24,
  last_rotated_at TIMESTAMPTZ DEFAULT NOW(),
  test_duration_days INT DEFAULT 14,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER TOKENS (SECURE OAUTH STORAGE FOR CRON AUTOMATION)
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  channel_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VIDEO IDEA VAULT (KANBAN)
CREATE TABLE IF NOT EXISTS public.video_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'scripting', 'recording', 'editing', 'scheduled')),
  target_keywords TEXT[] DEFAULT '{}',
  predicted_potential TEXT DEFAULT 'High',
  target_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER GOALS TABLE
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_metric TEXT NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  target_value NUMERIC NOT NULL,
  deadline DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EMAIL UNSUBSCRIBES (CAN-SPAM / GDPR COMPLIANCE)
CREATE TABLE IF NOT EXISTS public.email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  scope TEXT DEFAULT 'all' CHECK (scope IN ('all', 'marketing')),
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Channels
CREATE POLICY "Users can manage own channels" ON public.channels
  FOR ALL USING (auth.uid() = user_id);

-- 3. Channel Stats
CREATE POLICY "Users can view own channel stats" ON public.channel_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channel stats" ON public.channel_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channel stats" ON public.channel_stats
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own channel stats" ON public.channel_stats
  FOR DELETE USING (auth.uid() = user_id);

-- 4. A/B Tests
CREATE POLICY "Users can view own ab tests" ON public.ab_tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ab tests" ON public.ab_tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ab tests" ON public.ab_tests
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ab tests" ON public.ab_tests
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role manages ab tests" ON public.ab_tests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. User Tokens
CREATE POLICY "Users can view own tokens" ON public.user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON public.user_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON public.user_tokens
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens" ON public.user_tokens
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role manages tokens" ON public.user_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Video Cache
CREATE POLICY "Users can manage videos of own channels" ON public.video_cache
  FOR ALL USING (
    channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
  );

-- 7. Video Ideas
CREATE POLICY "Users can manage own ideas" ON public.video_ideas
  FOR ALL USING (auth.uid() = user_id);

-- 8. User Goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- 9. Email Unsubscribes
CREATE POLICY "Public can insert unsubscribes" ON public.email_unsubscribes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view unsubscribes" ON public.email_unsubscribes
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, plan, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'),
    'Free',
    'creator'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- PERFORMANCE & ISOLATION INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_stats_user_id ON public.channel_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_stats_channel_date ON public.channel_stats(channel_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_last_rotated ON public.ab_tests(last_rotated_at);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_video_cache_channel_id ON public.video_cache(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_ideas_user_id ON public.video_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON public.email_unsubscribes(email);
