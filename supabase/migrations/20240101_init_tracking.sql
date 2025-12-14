
-- Create Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID -- Optional if using Auth later
);

-- Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  position TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, interested, converted, rejected
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ
);

-- Create Email Logs / Interactions Table
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id),
  type TEXT NOT NULL, -- email_sent, email_opened, reply_received, note
  details JSONB, -- stores email subject, body, or note content
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create simple view for Lead Board
CREATE OR REPLACE VIEW public.lead_board AS
SELECT 
  l.*,
  c.name as campaign_name,
  (SELECT COUNT(*) FROM interactions i WHERE i.lead_id = l.id AND i.type = 'email_sent') as email_count
FROM leads l
LEFT JOIN campaigns c ON l.campaign_id = c.id;

-- Enable RLS (Row Level Security) - permissive for now for ease of use
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (since we use anon key)
CREATE POLICY "Public Access Campaigns" ON public.campaigns FOR ALL USING (true);
CREATE POLICY "Public Access Leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Public Access Interactions" ON public.interactions FOR ALL USING (true);
