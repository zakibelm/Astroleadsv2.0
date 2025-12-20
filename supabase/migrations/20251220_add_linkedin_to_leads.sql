-- Add linkedin_url column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add index for better performance on searches
CREATE INDEX IF NOT EXISTS idx_leads_linkedin_url ON public.leads(linkedin_url);

-- Add notes column for additional lead information (useful for AI context)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add phone column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add website column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS website TEXT;
