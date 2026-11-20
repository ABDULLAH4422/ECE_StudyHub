-- ============================================================================
-- FOCUS SESSIONS TABLE SETUP FOR SUPABASE
-- Run this script in the Supabase SQL Editor to enable remote cloud sync
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL DEFAULT 'focus' CHECK (session_type IN ('focus', 'short_break', 'long_break')),
    duration_minutes INTEGER NOT NULL,
    task_description TEXT NOT NULL DEFAULT 'Focused Study',
    subject_tag TEXT DEFAULT 'General',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_completed_at ON public.focus_sessions(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read of sessions or user-specific read
CREATE POLICY "Users can read own focus sessions or anonymous public"
ON public.focus_sessions
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'anon');

-- Allow inserting focus sessions
CREATE POLICY "Users can insert focus sessions"
ON public.focus_sessions
FOR INSERT
WITH CHECK (true);
