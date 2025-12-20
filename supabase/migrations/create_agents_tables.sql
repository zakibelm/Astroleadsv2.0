-- ===========================================
-- MIGRATION: CREATE AGENTS TABLES
-- ===========================================
-- Description: Crée les tables pour le système d'agents IA
-- Date: 2024-12-17
-- ===========================================

-- 1. Créer la table agents
-- ===========================================

CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'anthropic/claude-3.5-sonnet',
    system_prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inactive' 
        CHECK (status IN ('active', 'inactive', 'offline', 'working', 'idle', 'paused')),
    current_task TEXT DEFAULT 'En attente...',
    performance INTEGER NOT NULL DEFAULT 50 
        CHECK (performance >= 0 AND performance <= 100),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at);

-- Fonction pour auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-update updated_at
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================

-- 2. Créer la table agent_rag_files
-- ===========================================

CREATE TABLE IF NOT EXISTS public.agent_rag_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'png', 'csv', 'json')),
    size INTEGER NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_agent_rag_files_agent_id ON public.agent_rag_files(agent_id);

-- ===========================================

-- 3. Activer Row Level Security (RLS)
-- ===========================================

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_rag_files ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Lecture publique (tous les utilisateurs authentifiés)
CREATE POLICY "Allow read access to all authenticated users"
    ON public.agents
    FOR SELECT
    TO authenticated
    USING (true);

-- Politique RLS : Modification pour utilisateurs authentifiés
CREATE POLICY "Allow full access to authenticated users"
    ON public.agents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique RLS pour agent_rag_files
CREATE POLICY "Allow read access to all authenticated users"
    ON public.agent_rag_files
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow full access to authenticated users"
    ON public.agent_rag_files
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ===========================================

-- 4. Seed les 6 agents par défaut
-- ===========================================

INSERT INTO public.agents (name, role, description, model, system_prompt, status, performance, capabilities)
VALUES
  (
    'Agent Orchestrateur',
    'Chef d''Orchestre IA',
    'Coordonne l''ensemble de l''équipe d''agents IA pour optimiser la génération de leads. Distribue les tâches, surveille les performances et assure la cohérence stratégique.',
    'anthropic/claude-3.5-sonnet',
    'Tu es l''orchestrateur principal d''une équipe d''agents IA spécialisés en prospection B2B. Ton rôle est de coordonner les tâches, analyser les résultats et optimiser les workflows. Tu prends des décisions stratégiques basées sur les données de performance.',
    'active',
    92,
    ARRAY['Coordination', 'Stratégie', 'Analyse', 'Optimisation']
  ),
  (
    'LinkedIn Scout',
    'Prospecteur LinkedIn',
    'Expert en recherche de prospects sur LinkedIn. Identifie les décideurs, analyse les profils et extrait les informations pertinentes pour le ciblage B2B.',
    'openai/gpt-4o',
    'Tu es un expert en prospection LinkedIn B2B. Tu identifies les décideurs clés, analyses leurs profils professionnels et extrais les informations pertinentes (poste, entreprise, industrie). Tu priorises les prospects à fort potentiel.',
    'active',
    88,
    ARRAY['LinkedIn', 'Prospection', 'Sourcing', 'Qualification']
  ),
  (
    'Email Validator',
    'Validateur d''Emails',
    'Vérifie la validité et la délivrabilité des adresses email. Utilise Hunter.io et d''autres outils pour garantir des taux de rebond minimaux.',
    'openai/gpt-4o-mini',
    'Tu es un expert en validation d''emails. Tu vérifies la syntaxe, le domaine et la délivrabilité des adresses email. Tu utilises des APIs comme Hunter.io pour confirmer l''existence des adresses et minimiser les bounces.',
    'active',
    95,
    ARRAY['Validation', 'Hunter.io', 'Délivrabilité', 'Vérification']
  ),
  (
    'Copywriter IA',
    'Rédacteur Persuasif',
    'Génère des emails de prospection personnalisés et percutants. Maîtrise le copywriting B2B et adapte le ton selon le profil du prospect.',
    'anthropic/claude-3.5-sonnet',
    'Tu es un copywriter expert en cold emailing B2B. Tu rédiges des messages personnalisés, accrocheurs et orientés conversion. Tu adaptes le ton (professionnel, décontracté, technique) selon le prospect et l''industrie.',
    'active',
    90,
    ARRAY['Copywriting', 'Personnalisation', 'Cold Email', 'Conversion']
  ),
  (
    'Analyste de Données',
    'Spécialiste Analytics',
    'Analyse les performances des campagnes, identifie les tendances et génère des insights actionnables pour améliorer les taux de conversion.',
    'google/gemini-pro-1.5',
    'Tu es un analyste de données spécialisé en marketing B2B. Tu analyses les métriques de campagnes (taux d''ouverture, clics, conversions), identifies les patterns et recommandes des optimisations basées sur les données.',
    'active',
    87,
    ARRAY['Analytics', 'Métriques', 'Insights', 'Reporting']
  ),
  (
    'Lead Scorer',
    'Qualificateur de Prospects',
    'Évalue et score automatiquement les leads selon des critères prédéfinis. Priorise les prospects à fort potentiel pour maximiser le ROI.',
    'openai/gpt-4o-mini',
    'Tu es un expert en qualification de leads B2B. Tu scores les prospects selon leur poste, industrie, taille d''entreprise et niveau d''engagement. Tu assignes un score de 0 à 100 et fournis une justification claire.',
    'active',
    93,
    ARRAY['Scoring', 'Qualification', 'Priorisation', 'ICP']
  );

-- ===========================================

-- 5. Vérification
-- ===========================================

SELECT 
    id, 
    name, 
    role, 
    status, 
    performance,
    array_length(capabilities, 1) as nb_capabilities
FROM public.agents 
ORDER BY created_at;

-- Devrait afficher 6 agents !
