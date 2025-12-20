# AstroLeads API Documentation

> **Version**: 1.0.0  
> **Base URL**: `https://api.astroleads.app/v1`  
> **Authentication**: API Key (Bearer token)

---

## 🚀 Quick Start

```bash
# Get your API key from Settings
export ASTROLEADS_API_KEY="your_api_key_here"

# Test authentication
curl https://api.astroleads.app/v1/campaigns \
  -H "Authorization: Bearer $ASTROLEADS_API_KEY"
```

**Response**:
```json
{
  "campaigns": [...],
  "total": 5,
  "page": 1
}
```

---

## 📚 Documentation Sections

- **[Authentication](./authentication.md)** - API keys, OAuth, security
- **[Campaigns API](./campaigns.md)** - Create, list, update campaigns
- **[Leads API](./leads.md)** - Import, score, filter leads
- **[Scoring API](./scoring.md)** - Quality scoring and filtering
- **[Webhooks](./webhooks.md)** - Real-time event notifications
- **[Rate Limits](./rate-limits.md)** - Quotas and best practices
- **[Examples](./examples/)** - Code examples (curl, JS, Python)

---

## 🔑 Core Concepts

### Campaigns
A campaign represents a lead generation effort with specific criteria:
- **Type**: B2B, B2C, or Hybrid
- **Criteria**: Qualification rules (company size, followers, etc.)
- **Scoring**: Custom scoring priorities
- **Sources**: Preferred lead sources

### Leads
Individual prospects with quality scores:
- **Score**: 0-100 quality rating
- **Source**: Where the lead was found
- **Status**: Lifecycle stage
- **Enrichment**: Additional data from APIs

### Webhooks
Real-time notifications for:
- New qualified leads
- Campaign milestones
- Score updates
- Bounce/response tracking

---

## 🛠 Integration Templates

### n8n Workflow
Full lead generation pipeline: scrape → score → filter → push to CRM

👉 [Download n8n template](./examples/n8n-lead-pipeline.json)

### Make.com Scenario
Automated lead qualification and outreach

👉 [Download Make template](./examples/make-lead-automation.json)

### Zapier
Connect AstroLeads to 3,000+ apps

👉 [Zapier integration guide](./integrations/zapier.md)

---

## 📊 Rate Limits

| Tier | Requests/minute | Requests/day |
|------|----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |
| Enterprise | Custom | Unlimited |

**Rate limit headers**:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

---

## 🆘 Support

- 📚 [Full Documentation](./index.md)
- 💬 [Discord Community](#)
- 🐛 [Report Issues](https://github.com/zakibelm/Astroleadsv2.0/issues)
- 📧 [Email Support](mailto:support@astroleads.app)

---

**Built for developers** | Made by [@zakibelm](https://github.com/zakibelm)
