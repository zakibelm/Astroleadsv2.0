# Scoring API

AI-powered lead quality scoring and filtering.

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/scoring/score` | Score a single lead |
| `POST` | `/v1/scoring/batch` | Score multiple leads |
| `GET` | `/v1/scoring/explain/{leadId}` | Get scoring breakdown |

---

## Score a Lead

```bash
POST /v1/scoring/score
```

**Request Body:**

```json
{
  "lead": {
    "email": "marie@techcorp.com",
    "company": "TechCorp SAS",
    "position": "CTO",
    "linkedinUrl": "https://linkedin.com/in/mariedubois"
  },
  "campaignId": "cmp_123"
}
```

**Response:**

```json
{
  "score": 92,
  "breakdown": {
    "emailValidity": 30,
    "profileCompleteness": 18,
    "companyData": 20,
    "sourceReliability": 15,
    "criteriaMatch": 9
  },
  "recommendation": "high_quality",
  "reasoning": "Strong email validity, executive position matches B2B criteria, LinkedIn profile verified"
}
```

---

## Batch Scoring

```bash
POST /v1/scoring/batch
```

**Request Body:**

```json
{
  "leads": [
    {"email": "lead1@company.com", "company": "Company A"},
    {"email": "lead2@startup.io", "company": "Startup B"}
  ],
  "campaignId": "cmp_123"
}
```

**Response:**

```json
{
  "results": [
    {
      "email": "lead1@company.com",
      "score": 87,
      "recommendation": "high_quality"
    },
    {
      "email": "lead2@startup.io",
      "score": 72,
      "recommendation": "medium_quality"
    }
  ],
  "summary": {
    "total": 2,
    "highQuality": 1,
    "mediumQuality": 1,
    "lowQuality": 0
  }
}
```

---

## Get Scoring Explanation

```bash
GET /v1/scoring/explain/{leadId}
```

**Response:**

```json
{
  "leadId": "lead_789xyz",
  "score": 92,
  "breakdown": {
    "emailValidity": {
      "score": 30,
      "maxScore": 30,
      "details": "Email verified via Hunter.io, MX records valid"
    },
    "profileCompleteness": {
      "score": 18,
      "maxScore": 20,
      "details": "Has LinkedIn, company, position. Missing: phone"
    },
    "companyData": {
      "score": 20,
      "maxScore": 20,
      "details": "Company size PME matches criteria, Tech sector matches"
    },
    "sourceReliability": {
      "score": 15,
      "maxScore": 15,
      "details": "LinkedIn source (high reliability)"
    },
    "criteriaMatch": {
      "score": 9,
      "maxScore": 15,
      "details": "Position CTO matches, but revenue data unavailable"
    }
  },
  "recommendations": [
    "High-priority lead - matches all key criteria",
    "Consider immediate outreach"
  ]
}
```

---

## Scoring Criteria

### Email Validity (30 points)
- **30**: Verified, professional domain
- **20**: Valid format, unverified
- **10**: Valid format, personal domain
- **0**: Invalid or disposable

### Profile Completeness (20 points)
- **20**: Full profile (email, name, company, position, LinkedIn, phone)
- **15**: Most fields (missing 1-2)
- **10**: Basic (email, name, company)
- **5**: Minimal (email only)

### Company Data (20 points)
- **20**: Full company match (size, sector, revenue)
- **15**: Partial match (2/3 criteria)
- **10**: Minimal match (1/3 criteria)
- **0**: No match or data unavailable

### Source Reliability (15 points)
- **15**: LinkedIn (verified)
- **12**: Google Maps (business listing)
- **10**: Instagram (verified account)
- **5**: Manual import
- **0**: Unverified source

### Campaign Criteria Match (15 points)
- **15**: Perfect match (all criteria met)
- **10**: Good match (most criteria)
- **5**: Partial match (some criteria)
- **0**: No match

---

## Quality Tiers

| Score Range | Tier | Recommendation |
|-------------|------|----------------|
| 90-100 | Excellent | Immediate outreach |
| 80-89 | High | Priority outreach |
| 70-79 | Medium | Standard outreach |
| 60-69 | Low | Review manually |
| 0-59 | Poor | Skip or verify |

**Default threshold**: 85+ for automated campaigns

---

## Custom Scoring

You can customize scoring weights via campaign settings:

```json
{
  "scoringPriorities": {
    "topPriority": "position",
    "weights": {
      "emailValidity": 25,
      "position": 35,
      "companySize": 20,
      "sector": 20
    }
  }
}
```

---

**Next**: [Webhooks →](./webhooks.md)
