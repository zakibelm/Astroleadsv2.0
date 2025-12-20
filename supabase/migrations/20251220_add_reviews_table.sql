-- Migration: Add reviews table for social proof system
-- Date: 2025-12-20

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    trigger TEXT,  -- 'firstQualifiedLead', 'milestone', 'manual'
    incentive_claimed BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,  -- Admin approves for public display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_public ON public.reviews(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- RLS policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
    ON public.reviews
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can read their own reviews
CREATE POLICY "Users can read own reviews"
    ON public.reviews
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.reviews IS 'User reviews with incentive tracking for social proof system';
