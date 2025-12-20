-- Migration: Create founding_member_signups table directly
-- Date: 2025-12-20
-- Note: Simplified version - creates table directly instead of renaming

-- Create founding_member_signups table
CREATE TABLE IF NOT EXISTS public.founding_member_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    use_case TEXT NOT NULL,
    tech_stack TEXT,
    language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_founding_member_signups_email ON public.founding_member_signups(email);
CREATE INDEX IF NOT EXISTS idx_founding_member_signups_status ON public.founding_member_signups(status);
CREATE INDEX IF NOT EXISTS idx_founding_member_signups_created_at ON public.founding_member_signups(created_at DESC);

-- Enable RLS
ALTER TABLE public.founding_member_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup form)
CREATE POLICY "Anyone can insert founding member signups"
    ON public.founding_member_signups
    FOR INSERT
    WITH CHECK (true);

-- Only service role can read (admin only)
CREATE POLICY "Only service role can read founding member signups"
    ON public.founding_member_signups
    FOR SELECT
    USING (false);

-- Add comment
COMMENT ON TABLE public.founding_member_signups IS 'Founding Member Program signups for early adopter program with multi-language support';
