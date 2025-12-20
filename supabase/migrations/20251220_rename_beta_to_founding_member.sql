-- Migration: Rename beta_signups to founding_member_signups
-- Date: 2025-12-20

-- Rename table
ALTER TABLE IF EXISTS public.beta_signups RENAME TO founding_member_signups;

-- Add language column
ALTER TABLE public.founding_member_signups
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en'));

-- Update comment
COMMENT ON TABLE public.founding_member_signups IS 'Founding Member Program signups for early adopter program';
