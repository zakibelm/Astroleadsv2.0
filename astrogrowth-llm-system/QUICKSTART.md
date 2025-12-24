# 🚀 AstroGrowth LLM System - Quick Start Guide

## ⚡ Setup en 5 Minutes

### 1. Configuration Minimale

```bash
cd /home/user/astrogrowth

# Copier .env
cp .env.example .env

# Éditer avec vos clés (MINIMUM requis ci-dessous)
nano .env
```

**Variables MINIMUM requises:**
```bash
# LLM Provider (au moins un)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Redis
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=mysql://user:pass@localhost:3306/astrogrowth

# Encryption (générer avec: openssl rand -base64 32)
ENCRYPTION_KEY=your-32-char-encryption-key-here
```

### 2. Démarrer les Services

```bash
# Option A: Tout avec Docker Compose
docker-compose up -d

# Option B: Services séparés
# Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Ollama (optionnel - fallback local)
docker run -d --name ollama -p 11434:11434 -v ollama:/root/.ollama ollama/ollama

# MySQL (si pas déjà running)
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql:8
```

### 3. Database Setup

```bash
# Run migrations
pnpm db:push

# (Optionnel) Seed demo data
node seed-demo-data.mjs
```

### 4. Start Application

```bash
# Development
pnpm dev

# Production
pnpm build && pnpm start
```

### 5. Vérifier que tout fonctionne

```bash
# Test 1: LLM Router
curl -X POST http://localhost:3000/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "simple",
    "messages": [
      {"role": "user", "content": "What is 2+2? Answer with just the number."}
    ]
  }' | jq

# Test 2: Analytics
curl http://localhost:3000/api/trpc/llmAnalytics.summary?days=7 | jq

# Test 3: Circuit Breaker Status
curl http://localhost:3000/api/trpc/llmAnalytics.circuitBreakerStatus | jq

# Test 4: Cache Metrics
curl http://localhost:3000/api/trpc/llmAnalytics.cacheMetrics | jq
```

**Expected output:**
```json
{
  "content": "4",
  "model": "google/gemini-2.0-flash-exp:free",
  "provider": "openrouter",
  "metadata": {
    "taskType": "simple",
    "latencyMs": 1234,
    "cached": false,
    "fallbackAttempts": 0
  }
}
```

---

## 🧪 Tests

### Run All Tests

```bash
pnpm test
```

### Run Specific Test

```bash
pnpm test llmRouter.test.ts
```

### Expected Results

```
✓ should complete a simple task (1234ms)
✓ should cache and retrieve identical requests (2345ms)
✓ should have multiple providers configured (1ms)
✓ should process multiple requests in batch (3456ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

---

## 📊 Premier Test Complet - Workflow

### 1. Qualifier un Lead

```bash
curl -X POST http://localhost:3000/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "qualification",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un expert en qualification de leads B2B."
      },
      {
        "role": "user",
        "content": "Donne un score 0-100 pour: Restaurant Le Gourmet, 4.5/5 étoiles, 200 avis, Montréal. Juste le nombre."
      }
    ],
    "options": {
      "temperature": 0.3
    }
  }' | jq
```

### 2. Générer du Contenu

```bash
curl -X POST http://localhost:3000/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "content_generation",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un expert en marketing pour PME québécoises."
      },
      {
        "role": "user",
        "content": "Génère un post LinkedIn (100 mots) pour Restaurant Le Gourmet, 4.5/5, Montréal."
      }
    ],
    "options": {
      "temperature": 0.8,
      "maxTokens": 500
    }
  }' | jq
```

### 3. Vérifier les Analytics

```bash
# Summary
curl http://localhost:3000/api/trpc/llmAnalytics.summary?days=1 | jq

# Tu devrais voir:
# - totalCalls: 2
# - cacheMetrics.hits: 0 (première fois)
# - providers.openrouter.calls: 2
# - estimatedCostCAD: ~0.02 (si Claude Sonnet utilisé)
```

### 4. Tester le Cache

```bash
# Répète la même requête qualification
curl -X POST http://localhost:3000/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "qualification",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un expert en qualification de leads B2B."
      },
      {
        "role": "user",
        "content": "Donne un score 0-100 pour: Restaurant Le Gourmet, 4.5/5 étoiles, 200 avis, Montréal. Juste le nombre."
      }
    ]
  }' | jq

# metadata.cached devrait être: true
# metadata.latencyMs devrait être: < 100ms (vs ~1500ms avant)
```

### 5. Vérifier Cache Metrics

```bash
curl http://localhost:3000/api/trpc/llmAnalytics.cacheMetrics | jq

# Expected:
# - hits: 1
# - misses: 2
# - hitRate: 0.33
# - estimatedSavingsUSD: ~0.01
```

---

## 🎯 Test de Failover (Avancé)

### Simuler une Panne OpenRouter

```bash
# 1. Forcer l'utilisation d'un provider invalide pour tester failover
curl -X POST http://localhost:3000/api/trpc/llm.complete \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "simple",
    "messages": [
      {"role": "user", "content": "Test"}
    ],
    "options": {
      "forceProvider": "huggingface",
      "forceModel": "mistralai/Mistral-7B-Instruct-v0.2"
    }
  }' | jq

# Devrait fallback automatiquement sur Hugging Face
```

### Vérifier Circuit Breaker

```bash
curl http://localhost:3000/api/trpc/llmAnalytics.circuitBreakerStatus | jq

# Tous les providers devraient être "CLOSED"
```

---

## 📈 Monitoring en Production

### Dashboard 1: Overview

```bash
watch -n 5 'curl -s http://localhost:3000/api/trpc/llmAnalytics.summary?days=1 | jq ".totalCalls, .totalCostCAD, .cacheMetrics.hitRate"'
```

### Dashboard 2: Provider Health

```bash
watch -n 5 'curl -s http://localhost:3000/api/trpc/llmAnalytics.circuitBreakerStatus | jq'
```

### Dashboard 3: Cost Tracking

```bash
curl http://localhost:3000/api/trpc/llmAnalytics.forecast?horizonDays=30 | jq
```

---

## 🔥 Load Test (Optionnel)

### Test 100 Requests Concurrentes

```bash
# Install Apache Bench (si pas installé)
sudo apt install apache2-utils

# Run load test
ab -n 100 -c 10 -p request.json -T 'application/json' \
  http://localhost:3000/api/trpc/llm.complete

# request.json:
{
  "taskType": "simple",
  "messages": [
    {"role": "user", "content": "Test"}
  ]
}
```

**Expected Results:**
- Requests per second: 5-15
- Time per request: 100-500ms (avec cache)
- Failed requests: 0
- Cache hit rate: > 90% (après warm-up)

---

## 🐛 Debugging

### Enable Debug Logs

```bash
# .env
LOG_LEVEL=debug
DEBUG=true

# Restart
pnpm dev

# Logs vont montrer:
# [LLMRouter] Trying openrouter/gemini-flash...
# [SemanticCache] Cache HIT
# [CircuitBreaker:openrouter] Success
```

### Check Redis

```bash
# Connect to Redis
docker exec -it redis redis-cli

# Check cache keys
KEYS llm:cache:*

# Check metrics
GET llm:metrics:hits
GET llm:metrics:misses

# Check circuit breaker status
GET llm:health:openrouter
```

### Check Logs

```bash
# Error logs
tail -f logs/error.log

# Combined logs
tail -f logs/combined.log

# Grep specific errors
grep -i "circuit breaker" logs/error.log
grep -i "cache" logs/combined.log
```

---

## ✅ Success Checklist

Avant de dire "ça marche":

- [ ] LLM complete request retourne 200
- [ ] Cache hit après 2ème requête identique
- [ ] Analytics summary montre des données
- [ ] Circuit breakers sont tous CLOSED
- [ ] Tests passent (pnpm test)
- [ ] Logs ne montrent pas d'erreurs critiques
- [ ] Redis est accessible
- [ ] Database est accessible
- [ ] Au moins 1 provider LLM configuré
- [ ] Encryption key set (32+ chars)

---

## 🆘 Common Issues

### "Circuit breaker is OPEN"

```bash
# Reset
curl -X POST http://localhost:3000/api/trpc/llmAnalytics.circuitBreakerReset

# Check logs
tail -f logs/error.log
```

### "Redis connection refused"

```bash
# Check Redis running
docker ps | grep redis

# Start Redis
docker-compose up -d redis
```

### "Database connection failed"

```bash
# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
mysql -h localhost -u user -p -D astrogrowth
```

### "OpenRouter 401 Unauthorized"

```bash
# Check API key
echo $OPENROUTER_API_KEY

# Verify sur https://openrouter.ai/keys
```

---

## 🎓 Next Steps

1. ✅ **Intégrer dans n8n**
   - Import `n8n-workflows/*.json`
   - Tester workflows

2. ✅ **Setup Monitoring**
   - Sentry pour errors
   - Analytics dashboard

3. ✅ **Scale Testing**
   - Load test
   - Optimize cache TTL

4. ✅ **Production Deploy**
   - Docker compose
   - Reverse proxy (nginx)
   - SSL certificates

---

**Besoin d'aide?** 📧 support@astrogrowth.ca

**ENJOY! 🚀**
