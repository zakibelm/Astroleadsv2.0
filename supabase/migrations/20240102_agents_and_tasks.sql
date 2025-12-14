
-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'idle', -- idle, working, paused, inactive
    model TEXT NOT NULL,
    system_prompt TEXT,
    performance INTEGER DEFAULT 0,
    capabilities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.agents
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.agents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.agents
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create agent_rag_files table
CREATE TABLE IF NOT EXISTS public.agent_rag_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    content TEXT, -- Storing text content directly for simplicity, or URL to storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for rag files
ALTER TABLE public.agent_rag_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.agent_rag_files
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.agent_rag_files
    FOR ALL USING (auth.role() = 'authenticated');

-- Create tasks table (for Agent work items)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'find_leads', 'draft_email'
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
    agent_id UUID REFERENCES public.agents(id),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    priority INTEGER DEFAULT 1,
    input JSONB DEFAULT '{}'::jsonb,
    output JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.tasks
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.tasks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.tasks
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Seed initial agents
INSERT INTO public.agents (name, role, description, status, model, performance, capabilities)
VALUES 
    ('Orchestrator', 'Chef de Projet', 'Coordonne les autres agents et gère le flux de travail.', 'active', 'anthropic/claude-3-sonnet', 98, ARRAY['planification', 'delegation', 'review']),
    ('Scout', 'Lead Researcher', 'Trouve et enrichit les prospects via LinkedIn/Google.', 'active', 'google/gemini-pro', 92, ARRAY['scraping', 'enrichissement', 'validation']),
    ('Copywriter', 'Rédacteur Email', 'Rédige des emails ultra-personnalisés.', 'active', 'anthropic/claude-3-opus', 95, ARRAY['copywriting', 'sentiment-analysis', 'persuasion']),
    ('Analyst', 'Data Analyst', 'Analyse les performances des campagnes.', 'idle', 'google/gemini-pro', 88, ARRAY['analytics', 'reporting', 'predictions']);
