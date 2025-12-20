-- ===========================================
-- SEED AGENTS - PROCÉDURE COMPLÈTE
-- ===========================================

-- ÉTAPE 1: Vérifier le schéma de la table agents
-- ===============================================
-- Copiez cette requête dans Supabase SQL Editor
-- Elle affiche toutes les colonnes de la table 'agents'

SELECT column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'agents'
ORDER BY ordinal_position;

-- Vérifiez que vous avez:
-- - capabilities avec data_type = 'ARRAY' (ou udt_name = '_text')
-- - status avec data_type compatible (text, varchar)
-- - performance avec data_type numérique (integer, smallint)

-- ===========================================

-- ÉTAPE 2: Test avec UN seul agent
-- ===========================================
-- Si le schéma est correct, testez avec cet INSERT

INSERT INTO agents (name, role, description, model, system_prompt, status, performance, capabilities)
VALUES (
  'Agent Orchestrateur',
  'Chef d''Orchestre IA',
  'Coordonne l''ensemble de l''équipe d''agents IA.',
  'anthropic/claude-3.5-sonnet',
  'Tu es l''orchestrateur principal.',
  'active',
  92,
  ARRAY['Coordination', 'Stratégie']
);

-- Si cette requête passe → Continuez à l'ÉTAPE 3
-- Si erreur → Partagez l'erreur pour diagnostic

-- ===========================================

-- ÉTAPE 3: Seed complet des 6 agents
-- ===========================================
-- Une fois le test passé, lancez le seed complet:

INSERT INTO agents (name, role, description, model, system_prompt, status, performance, capabilities)
VALUES
  -- Agent 1: Orchestrator
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
  
  -- Agent 2: LinkedIn Scout  
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

  -- Agent 3: Email Validator
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

  -- Agent 4: Copywriter
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

  -- Agent 5: Data Analyst
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

  -- Agent 6: Lead Scorer
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

-- ÉTAPE 4: Vérifier le résultat
-- ===========================================

SELECT id, name, role, status, performance
FROM agents 
ORDER BY created_at;

-- Vous devriez voir 6 agents !
