-- ==============================================================================
-- YOUTUBE ANALYTICS PRO - PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- It creates all tables, indexes, triggers, and Row-Level Security (RLS) policies.
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

-- 4. VIDEO ANALYTICS CACHE TABLE
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

-- 5. VIDEO IDEA VAULT (KANBAN)
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

-- 6. USER GOALS TABLE
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

-- 7. EMAIL UNSUBSCRIBES (CAN-SPAM / GDPR COMPLIANCE)
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
ALTER TABLE public.video_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Channels: Users can access only their channels
CREATE POLICY "Users can manage own channels" ON public.channels
  FOR ALL USING (auth.uid() = user_id);

-- Video Cache: Users can view videos belonging to their channels
CREATE POLICY "Users can manage videos of own channels" ON public.video_cache
  FOR ALL USING (
    channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
  );

-- Video Ideas: Users can manage only their own ideas
CREATE POLICY "Users can manage own ideas" ON public.video_ideas
  FOR ALL USING (auth.uid() = user_id);

-- User Goals: Users can manage only their own goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Unsubscribes: Public insert allowed for 1-click unsubscribe without login
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
-- PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);
CREATE INDEX IF NOT EXISTS idx_video_cache_channel_id ON public.video_cache(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_ideas_user_id ON public.video_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON public.email_unsubscribes(email);
