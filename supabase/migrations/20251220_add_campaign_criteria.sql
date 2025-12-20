-- Migration: Add campaign qualification criteria to campaigns table
-- Date: 2025-12-20

-- Add new JSONB columns for campaign criteria
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS b2b_criteria JSONB,
ADD COLUMN IF NOT EXISTS b2c_criteria JSONB,
ADD COLUMN IF NOT EXISTS exclusion_criteria JSONB,
ADD COLUMN IF NOT EXISTS budget JSONB,
ADD COLUMN IF NOT EXISTS scoring_priorities JSONB;

-- Add comments for documentation
COMMENT ON COLUMN public.campaigns.b2b_criteria IS 'B2B qualification criteria: company size, sectors, positions, seniority, revenue';
COMMENT ON COLUMN public.campaigns.b2c_criteria IS 'B2C qualification criteria: min followers, engagement, verified, categories, age, languages';
COMMENT ON COLUMN public.campaigns.exclusion_criteria IS 'Exclusion rules: personal emails, keywords, already contacted';
COMMENT ON COLUMN public.campaigns.budget IS 'Budget settings: max credits, target lead count, urgency';
COMMENT ON COLUMN public.campaigns.scoring_priorities IS 'Scoring priorities: top priority criterion, minimum score';

-- Create indexes for better query performance on JSONB fields
CREATE INDEX IF NOT EXISTS idx_campaigns_b2b_sectors ON public.campaigns USING GIN ((b2b_criteria->'sectors'));
CREATE INDEX IF NOT EXISTS idx_campaigns_b2c_categories ON public.campaigns USING GIN ((b2c_criteria->'categories'));
CREATE INDEX IF NOT EXISTS idx_campaigns_min_score ON public.campaigns ((scoring_priorities->>'minScore'));
