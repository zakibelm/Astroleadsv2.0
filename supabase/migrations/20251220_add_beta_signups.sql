-- Migration: Add beta_signups table for beta program
-- Date: 2025-12-20

CREATE TABLE IF NOT EXISTS public.beta_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    use_case TEXT NOT NULL,
    tech_stack TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_beta_signups_email ON public.beta_signups(email);
CREATE INDEX IF NOT EXISTS idx_beta_signups_status ON public.beta_signups(status);
CREATE INDEX IF NOT EXISTS idx_beta_signups_created_at ON public.beta_signups(created_at DESC);

-- RLS policies
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup)
CREATE POLICY "Anyone can insert beta signups"
    ON public.beta_signups
    FOR INSERT
    WITH CHECK (true);

-- Only admins can read (you'll need to create admin role)
-- For now, we disable SELECT publicly
CREATE POLICY "Only service role can read beta signups"
    ON public.beta_signups
    FOR SELECT
    USING (false);

COMMENT ON TABLE public.beta_signups IS 'Beta program signups for early adopter program';
