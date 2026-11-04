-- ==============================================================================
-- MIGRATION: 20261104_multi_tenant_rls.sql
-- DESCRIPTION: Multi-Tenant Architecture & Strict Row Level Security (RLS)
-- TARGET: Supabase PostgreSQL (YouTube Analytics Pro)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CHANNEL STATS (HISTORICAL TELEMETRY)
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

-- 3. A/B TESTING LAB (TITLE & THUMBNAIL EXPERIMENTS)
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

-- 4. USER TOKENS (SECURE OAUTH STORAGE FOR CRON AUTOMATION)
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

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL NEW & EXISTING TABLES
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

-- ==============================================================================
-- STRICT MULTI-TENANT ISOLATION POLICIES (auth.uid() = user_id)
-- ==============================================================================

-- Drop existing policies if they exist to prevent duplicates
DROP POLICY IF EXISTS "Users can view own channel stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Users can insert own channel stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Users can update own channel stats" ON public.channel_stats;
DROP POLICY IF EXISTS "Users can delete own channel stats" ON public.channel_stats;

-- 1. CHANNEL STATS POLICIES
CREATE POLICY "Users can view own channel stats" ON public.channel_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channel stats" ON public.channel_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channel stats" ON public.channel_stats
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own channel stats" ON public.channel_stats
  FOR DELETE USING (auth.uid() = user_id);

-- 2. A/B TESTS POLICIES
DROP POLICY IF EXISTS "Users can view own ab tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can insert own ab tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can update own ab tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can delete own ab tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Service role manages ab tests" ON public.ab_tests;

CREATE POLICY "Users can view own ab tests" ON public.ab_tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ab tests" ON public.ab_tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ab tests" ON public.ab_tests
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ab tests" ON public.ab_tests
  FOR DELETE USING (auth.uid() = user_id);

-- Service role bypass for background Cron execution
CREATE POLICY "Service role manages ab tests" ON public.ab_tests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. USER TOKENS POLICIES
DROP POLICY IF EXISTS "Users can view own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can insert own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can delete own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Service role manages tokens" ON public.user_tokens;

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

-- ==============================================================================
-- PERFORMANCE & ISOLATION INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_channel_stats_user_id ON public.channel_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_stats_channel_date ON public.channel_stats(channel_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_last_rotated ON public.ab_tests(last_rotated_at);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);
