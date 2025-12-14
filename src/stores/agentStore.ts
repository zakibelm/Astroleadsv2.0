import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AI_MODELS } from '@/services/aiService';

export interface AgentRAGFile {
    id: string;
    name: string;
    type: 'pdf' | 'png' | 'csv' | 'json';
    size: number;
    uploadedAt: string;
    content?: string; // Base64 or parsed content
}

export interface AIAgent {
    id: string;
    name: string;
    role: string;
    description: string;
    model: string;
    systemPrompt: string;
    status: 'active' | 'inactive' | 'offline';
    currentTask: string;
    performance: number;
    capabilities: string[];
    ragFiles: AgentRAGFile[];
    createdAt: string;
    updatedAt: string;
}

interface AgentState {
    agents: AIAgent[];
    selectedAgentId: string | null;

    // Actions
    setAgents: (agents: AIAgent[]) => void;
    addAgent: (agent: Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateAgent: (id: string, updates: Partial<AIAgent>) => void;
    deleteAgent: (id: string) => void;
    selectAgent: (id: string | null) => void;
    updateModel: (id: string, model: string) => void;
    updateSystemPrompt: (id: string, prompt: string) => void;
    addRAGFile: (agentId: string, file: Omit<AgentRAGFile, 'id' | 'uploadedAt'>) => void;
    removeRAGFile: (agentId: string, fileId: string) => void;
    getAgentById: (id: string) => AIAgent | undefined;
}

// Default agents
const DEFAULT_AGENTS: AIAgent[] = [
    {
        id: 'agent-orchestrator',
        name: 'Orchestrateur Maître',
        role: 'Coordination & Supervision',
        description: 'Agent principal qui coordonne tous les autres agents, supervise les pipelines de prospection et optimise les flux de travail. Il analyse les performances et redistribue les tâches en temps réel.',
        model: 'anthropic/claude-3.5-sonnet',
        systemPrompt: 'Tu es un orchestrateur IA expert en coordination de systèmes multi-agents. Tu optimises les workflows, priorises les tâches et assures la cohérence des opérations de prospection B2B.',
        status: 'active',
        currentTask: 'Coordination des requêtes entrantes',
        performance: 98,
        capabilities: ['Orchestration', 'Planification', 'Délégation', 'Monitoring'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'agent-linkedin-scout',
        name: 'Éclaireur LinkedIn',
        role: 'Scraping & Qualification LinkedIn',
        description: 'Spécialisé dans l\'exploration et la qualification de profils LinkedIn. Extrait les informations clés des prospects, analyse leur potentiel et enrichit les données de contact.',
        model: 'anthropic/claude-3.5-sonnet',
        systemPrompt: 'Tu es un expert en analyse de profils LinkedIn pour la prospection B2B. Tu extrais les informations pertinentes, qualifies les prospects selon leur potentiel et identifies les décideurs clés.',
        status: 'active',
        currentTask: 'Scraping CTOs Paris',
        performance: 94,
        capabilities: ['Scraping', 'Qualification', 'Enrichissement', 'Profiling'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'agent-email-validator',
        name: 'Validateur Email',
        role: 'Vérification & Validation Emails',
        description: 'Vérifie la validité et la déliverabilité des adresses email. Calcule les scores de risque et identifie les emails à risque pour optimiser les taux de délivrabilité.',
        model: 'openai/gpt-4o-mini',
        systemPrompt: 'Tu es un expert en validation d\'emails. Tu analyses les patterns d\'adresses, vérifes la syntaxe, estimes la déliverabilité et identifies les emails potentiellement invalides.',
        status: 'active',
        currentTask: 'Vérification batch en cours',
        performance: 99,
        capabilities: ['Validation', 'Deliverability', 'Risk Scoring', 'Pattern Analysis'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'agent-copywriter',
        name: 'Rédacteur Cold Email',
        role: 'Génération de Contenu',
        description: 'Expert en rédaction d\'emails de prospection à froid. Génère des messages personnalisés, optimise les objets et adapte le ton selon l\'audience cible.',
        model: 'anthropic/claude-3.5-sonnet',
        systemPrompt: 'Tu es un copywriter expert en cold emailing B2B. Tu rédiges des emails de prospection percutants, personnalisés et qui convertissent. Tu maîtrises les techniques de persuasion et d\'accroche.',
        status: 'active',
        currentTask: 'Rédaction emails campagne SaaS',
        performance: 91,
        capabilities: ['Copywriting', 'Personnalisation', 'A/B Testing', 'Optimisation'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'agent-analyst',
        name: 'Analyste Performance',
        role: 'Analytics & Optimisation',
        description: 'Analyse les métriques de campagnes, identifie les tendances et propose des optimisations. Génère des rapports détaillés et des recommandations data-driven.',
        model: 'google/gemini-flash-1.5',
        systemPrompt: 'Tu es un analyste data expert en marketing B2B. Tu analyses les KPIs, identifies les patterns de performance et génères des insights actionnables pour optimiser les campagnes.',
        status: 'inactive',
        currentTask: 'En attente de données',
        performance: 87,
        capabilities: ['Analytics', 'Reporting', 'Optimisation', 'Forecasting'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'agent-lead-scorer',
        name: 'Qualificateur Lead',
        role: 'Scoring & Priorisation',
        description: 'Score et qualifie les leads entrants selon leur potentiel de conversion. Utilise des modèles prédictifs pour identifier les prospects les plus prometteurs.',
        model: 'openai/gpt-4o',
        systemPrompt: 'Tu es un expert en lead scoring B2B. Tu analyses les caractéristiques des prospects, évalues leur fit avec l\'ICP et attribues des scores de qualification précis.',
        status: 'active',
        currentTask: 'Scoring leads entreprise',
        performance: 95,
        capabilities: ['Lead Scoring', 'ICP Matching', 'Priorisation', 'Segmentation'],
        ragFiles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const useAgentStore = create<AgentState>()(
    persist(
        (set, get) => ({
            agents: DEFAULT_AGENTS,
            selectedAgentId: null,

            setAgents: (agents) => set({ agents }),

            addAgent: (agentData) => {
                const newAgent: AIAgent = {
                    ...agentData,
                    id: `agent-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({ agents: [...state.agents, newAgent] }));
            },

            updateAgent: (id, updates) => {
                set((state) => ({
                    agents: state.agents.map((agent) =>
                        agent.id === id
                            ? { ...agent, ...updates, updatedAt: new Date().toISOString() }
                            : agent
                    ),
                }));
            },

            deleteAgent: (id) => {
                set((state) => ({
                    agents: state.agents.filter((agent) => agent.id !== id),
                    selectedAgentId: state.selectedAgentId === id ? null : state.selectedAgentId,
                }));
            },

            selectAgent: (id) => set({ selectedAgentId: id }),

            updateModel: (id, model) => {
                get().updateAgent(id, { model });
            },

            updateSystemPrompt: (id, prompt) => {
                get().updateAgent(id, { systemPrompt: prompt });
            },

            addRAGFile: (agentId, fileData) => {
                const newFile: AgentRAGFile = {
                    ...fileData,
                    id: `rag-${Date.now()}`,
                    uploadedAt: new Date().toISOString(),
                };
                set((state) => ({
                    agents: state.agents.map((agent) =>
                        agent.id === agentId
                            ? { ...agent, ragFiles: [...agent.ragFiles, newFile], updatedAt: new Date().toISOString() }
                            : agent
                    ),
                }));
            },

            removeRAGFile: (agentId, fileId) => {
                set((state) => ({
                    agents: state.agents.map((agent) =>
                        agent.id === agentId
                            ? {
                                ...agent,
                                ragFiles: agent.ragFiles.filter((f) => f.id !== fileId),
                                updatedAt: new Date().toISOString(),
                            }
                            : agent
                    ),
                }));
            },

            getAgentById: (id) => get().agents.find((a) => a.id === id),
        }),
        {
            name: 'astroleads-agents',
        }
    )
);
