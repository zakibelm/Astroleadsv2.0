# 🤖 LLM Router API Documentation

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Types & Interfaces](#types--interfaces)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

Le **LLM Router** est un système intelligent de gestion multi-LLM avec:

- ✅ **3 tiers de failover** (OpenRouter → Hugging Face → Ollama)
- ✅ **Circuit breaker pattern** pour prévenir cascading failures
- ✅ **Semantic caching** (80%+ réduction de coûts)
- ✅ **Task-based routing** (meilleur modèle par type de tâche)
- ✅ **Cost optimization** (modèles gratuits prioritaires)
- ✅ **Performance tracking** complet

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│           LLM Router (llmRouter.ts)              │
│  - Multi-provider support                       │
│  - Intelligent failover                         │
│  - Circuit breaker integration                  │
│  - Semantic cache integration                   │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐ ┌──▼────────┐ ┌▼──────────┐
│  OpenRouter  │ │ HuggingFace│ │  Ollama   │
│   (Primary)  │ │ (Secondary)│ │ (Tertiary)│
└──────────────┘ └────────────┘ └───────────┘
```

---

## API Endpoints

### 1. Complete LLM Request

**Endpoint:** `POST /api/trpc/llm.complete`

**Description:** Exécute une requête LLM avec failover automatique

**Input:**
```typescript
{
  taskType: 'qualification' | 'content_generation' | 'verification' | 'analysis' | 'simple',
  messages: Array<{
    role: 'system' | 'user' | 'assistant',
    content: string
  }>,
  options?: {
    temperature?: number,      // 0.0 - 1.0 (default: 0.7)
    maxTokens?: number,        // Max tokens to generate (default: 1000)
    topP?: number,             // Nucleus sampling (default: 0.9)
    bypassCache?: boolean,     // Skip semantic cache (default: false)
    forceProvider?: string,    // Force specific provider
    forceModel?: string        // Force specific model
  }
}
```

**Output:**
```typescript
{
  content: string,                    // Generated text
  model: string,                      // Model used
  provider: string,                   // Provider used
  usage: {
    promptTokens?: number,
    completionTokens?: number,
    totalTokens?: number
  },
  metadata: {
    taskType: string,                 // Task type
    latencyMs: number,                // Response time
    cached: boolean,                  // From cache?
    fallbackAttempts: number,         // Number of failovers
    timestamp: string                 // ISO timestamp
  }
}
```

**Exemple:**
```bash
curl -X POST https://yourdomain.com/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "taskType": "qualification",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un expert en qualification de leads B2B."
      },
      {
        "role": "user",
        "content": "Score ce lead (0-100): Restaurant Le Gourmet, 4.5/5, 200 avis"
      }
    ],
    "options": {
      "temperature": 0.3,
      "maxTokens": 500
    }
  }'
```

---

### 2. Analytics Summary

**Endpoint:** `GET /api/trpc/llmAnalytics.summary?days=7`

**Description:** Récupère les statistiques d'utilisation LLM

**Query Parameters:**
- `days` (optional): Nombre de jours (default: 7)

**Output:**
```typescript
{
  totalCalls: number,
  totalTokens: number,
  totalCostCAD: number,
  totalSavingsCAD: number,        // From cache
  providers: {
    [provider: string]: {
      calls: number,
      tokens: number,
      estimatedCostCAD: number,
      avgLatencyMs: number,
      errorRate: number
    }
  },
  models: {
    [model: string]: {
      provider: string,
      calls: number,
      tokens: number,
      estimatedCostCAD: number,
      avgLatencyMs: number
    }
  },
  taskTypes: {
    [taskType: string]: {
      calls: number,
      tokens: number,
      estimatedCostCAD: number
    }
  },
  dailyUsage: Array<{
    date: string,
    calls: number,
    tokens: number,
    estimatedCostCAD: number
  }>,
  cacheMetrics: {
    hits: number,
    misses: number,
    hitRate: number,              // 0.0 - 1.0
    savingsCAD: number
  },
  circuitBreakerStatus: {
    [provider: string]: {
      state: 'CLOSED' | 'OPEN' | 'HALF_OPEN',
      failureCount: number,
      successCount: number,
      nextAttemptTime: number | null
    }
  }
}
```

**Exemple:**
```bash
curl -X GET "https://yourdomain.com/api/trpc/llmAnalytics.summary?days=30" \
  -H "Cookie: session=..."
```

---

### 3. Cost Forecast

**Endpoint:** `GET /api/trpc/llmAnalytics.forecast?horizonDays=30`

**Description:** Prévision des coûts LLM basée sur tendances

**Output:**
```typescript
{
  currentMonthlyCAD: number,
  projectedMonthlyCAD: number,
  dailyForecast: Array<{
    day: number,
    estimatedCostCAD: number
  }>
}
```

---

### 4. Cache Metrics

**Endpoint:** `GET /api/trpc/llmAnalytics.cacheMetrics`

**Description:** Statistiques du cache sémantique

**Output:**
```typescript
{
  hits: number,
  misses: number,
  hitRate: number,                // 0.0 - 1.0
  estimatedSavingsUSD: number
}
```

---

### 5. Cache Invalidation

**Endpoint:** `POST /api/trpc/llmAnalytics.cacheInvalidate`

**Description:** Invalider le cache (pattern optionnel)

**Input:**
```typescript
{
  pattern?: string    // Redis pattern (default: all)
}
```

**Output:**
```typescript
{
  invalidated: number   // Number of cache entries deleted
}
```

**Exemple:**
```bash
# Invalider tout le cache
curl -X POST https://yourdomain.com/api/trpc/llmAnalytics.cacheInvalidate \
  -H "Cookie: session=..." \
  -d '{}'

# Invalider pattern spécifique
curl -X POST https://yourdomain.com/api/trpc/llmAnalytics.cacheInvalidate \
  -H "Cookie: session=..." \
  -d '{ "pattern": "llm:cache:qualification:*" }'
```

---

### 6. Circuit Breaker Status

**Endpoint:** `GET /api/trpc/llmAnalytics.circuitBreakerStatus`

**Description:** État actuel des circuit breakers

**Output:**
```typescript
{
  [provider: string]: {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN',
    failureCount: number,
    successCount: number,
    nextAttemptTime: number | null
  }
}
```

---

### 7. Circuit Breaker Reset

**Endpoint:** `POST /api/trpc/llmAnalytics.circuitBreakerReset`

**Description:** Réinitialiser circuit breaker(s)

**Input:**
```typescript
{
  provider?: string   // Specific provider or all
}
```

**Exemple:**
```bash
# Reset all
curl -X POST https://yourdomain.com/api/trpc/llmAnalytics.circuitBreakerReset \
  -H "Cookie: session=..." \
  -d '{}'

# Reset specific provider
curl -X POST https://yourdomain.com/api/trpc/llmAnalytics.circuitBreakerReset \
  -H "Cookie: session=..." \
  -d '{ "provider": "openrouter" }'
```

---

## Types & Interfaces

### TaskType

```typescript
enum TaskType {
  QUALIFICATION = 'qualification',       // Lead scoring
  CONTENT_GENERATION = 'content_generation',  // Marketing content
  VERIFICATION = 'verification',         // Quality checks
  ANALYSIS = 'analysis',                 // Data analysis
  SIMPLE = 'simple'                      // Basic tasks
}
```

### LLMProvider

```typescript
enum LLMProvider {
  OPENROUTER = 'openrouter',    // Primary tier
  HUGGINGFACE = 'huggingface',  // Secondary tier
  OLLAMA = 'ollama'             // Tertiary tier (local)
}
```

### Routing Strategy

```typescript
// Qualification: FREE models prioritized
QUALIFICATION: [
  { provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free' },  // 0$ CAD
  { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' },  // 0$ CAD
  { provider: 'huggingface', model: 'mistralai/Mistral-7B-Instruct-v0.2' },  // 0$ CAD
  { provider: 'ollama', model: 'llama3.2:3b' }  // 0$ CAD (local)
]

// Content Generation: Quality prioritized
CONTENT_GENERATION: [
  { provider: 'openrouter', model: 'anthropic/claude-sonnet-4' },  // Premium quality
  { provider: 'openrouter', model: 'openai/gpt-4o-mini' },  // Good fallback
  { provider: 'huggingface', model: 'mistralai/Mixtral-8x7B-Instruct-v0.1' },  // 0$ CAD
  { provider: 'ollama', model: 'llama3.2:3b' }  // 0$ CAD (emergency)
]

// Verification: FREE sufficient
VERIFICATION: [
  { provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free' },
  { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' },
  { provider: 'huggingface', model: 'HuggingFaceH4/zephyr-7b-beta' },
  { provider: 'ollama', model: 'phi3:mini' }
]
```

---

## Exemples d'utilisation

### Example 1: Qualification de Lead

```typescript
import { llmRouter, TaskType } from './services/llmRouter';

const qualifyLead = async (leadData: any) => {
  const response = await llmRouter.complete(
    TaskType.QUALIFICATION,
    [
      {
        role: 'system',
        content: 'Tu es un expert en qualification de leads B2B.'
      },
      {
        role: 'user',
        content: `Analyse ce lead et retourne un JSON avec: score (0-100), priority (high/medium/low), pain_points (array).

Lead: ${JSON.stringify(leadData)}`
      }
    ],
    {
      temperature: 0.3,  // Low temperature for consistent scoring
      maxTokens: 800
    }
  );

  return {
    qualification: JSON.parse(response.content),
    metadata: response.metadata
  };
};
```

### Example 2: Génération de Contenu Marketing

```typescript
const generateMarketingPost = async (leadData: any) => {
  const response = await llmRouter.complete(
    TaskType.CONTENT_GENERATION,
    [
      {
        role: 'system',
        content: 'Tu es un expert en marketing de contenu pour PME québécoises.'
      },
      {
        role: 'user',
        content: `Génère un post LinkedIn engageant pour:

Entreprise: ${leadData.businessName}
Type: ${leadData.businessType}
Ville: ${leadData.city}
Rating: ${leadData.googleRating}/5

Format JSON: { title, body, hashtags (3-5), cta }`
      }
    ],
    {
      temperature: 0.8,  // Higher for creativity
      maxTokens: 1500
    }
  );

  return {
    content: JSON.parse(response.content),
    provider: response.provider,
    model: response.model,
    cached: response.metadata.cached,
    costEstimate: calculateCost(response)
  };
};
```

### Example 3: Batch Processing

```typescript
const processLeadsBatch = async (leads: any[]) => {
  const requests = leads.map(lead => ({
    taskType: TaskType.QUALIFICATION,
    messages: [
      {
        role: 'user',
        content: `Score this lead (0-100): ${JSON.stringify(lead)}`
      }
    ]
  }));

  // Process in parallel with concurrency control
  const results = await llmRouter.batchComplete(requests, 5);

  return results.map((r, i) => ({
    lead_id: leads[i].id,
    score: parseInt(r.content),
    provider: r.provider,
    cached: r.metadata.cached
  }));
};
```

---

## Monitoring & Analytics

### Dashboard Metrics à Surveiller

1. **Cache Hit Rate** (target: > 60%)
   - Indique l'efficacité du cache sémantique
   - Hit rate faible = opportunité d'optimisation

2. **Provider Distribution**
   - Idéal: Majorité sur modèles gratuits (OpenRouter free, HuggingFace)
   - Si trop de Claude Sonnet 4 = coûts élevés

3. **Circuit Breaker State**
   - Tous CLOSED = healthy
   - OPEN = provider down, investigate

4. **Average Latency**
   - < 2s = excellent
   - 2-5s = acceptable
   - > 5s = investigate (provider slow?)

5. **Cost Trends**
   - Comparer actual vs forecast
   - Alerter si > budget mensuel

---

## Troubleshooting

### Issue: "Circuit breaker is OPEN"

**Cause:** Trop d'échecs consécutifs sur un provider

**Solution:**
```bash
# Check status
curl https://yourdomain.com/api/trpc/llmAnalytics.circuitBreakerStatus

# Reset specific provider
curl -X POST https://yourdomain.com/api/trpc/llmAnalytics.circuitBreakerReset \
  -d '{ "provider": "openrouter" }'
```

### Issue: Cache non performant

**Vérifier:**
```bash
curl https://yourdomain.com/api/trpc/llmAnalytics.cacheMetrics
```

**Si hit rate < 40%:**
- Vérifier que `bypassCache: false` par défaut
- Vérifier TTL (peut-être trop court)
- Analyzer si queries sont trop variables

### Issue: Coûts trop élevés

**Analyser:**
```bash
curl https://yourdomain.com/api/trpc/llmAnalytics.summary?days=30
```

**Optimisations:**
1. Vérifier distribution modèles (priorité aux gratuits?)
2. Augmenter cache TTL pour queries similaires
3. Réduire `maxTokens` si possible
4. Utiliser `temperature: 0.3` pour tasks déterministes

### Issue: Latence élevée

**Diagnostiquer:**
- Check `metadata.latencyMs` dans responses
- Analyser `fallbackAttempts` (> 2 = problème?)
- Vérifier circuit breaker status
- Test latency par provider

**Optimiser:**
- Warmer le cache avec queries communes
- Utiliser batch processing pour volume
- Considérer augmenter concurrency limit

---

## Best Practices

### ✅ DO

- ✅ Utiliser semantic cache par défaut
- ✅ Choisir le bon `TaskType` (routing optimal)
- ✅ Monitorer les metrics quotidiennement
- ✅ Warmer le cache avec queries fréquentes
- ✅ Utiliser batch processing pour volume
- ✅ Logger les failover attempts

### ❌ DON'T

- ❌ Bypass cache sans raison
- ❌ Force provider (sauf debug)
- ❌ Ignorer circuit breaker warnings
- ❌ Utiliser temperature > 0.9 (coûteux)
- ❌ Dépasser rate limits providers

---

## Support

Questions? Issues?

- 📧 Email: support@astrogrowth.ca
- 🐛 GitHub Issues: [Link]
- 📚 Docs: https://docs.astrogrowth.ca

---

**Construit avec ❤️ par l'équipe AstroGrowth**
