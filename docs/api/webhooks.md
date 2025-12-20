# Webhooks

Real-time notifications for AstroLeads events.

---

## Overview

Webhooks allow you to receive HTTP POST requests when specific events occur in your AstroLeads account.

**Base URL**: Your webhook endpoint (HTTPS required)

---

## Setup

### 1. Configure Webhook Endpoint

Go to **Settings** → **Webhooks** → **Add Webhook**

```json
{
  "url": "https://your-app.com/webhooks/astroleads",
  "events": ["lead.qualified", "campaign.completed"],
  "secret": "your_webhook_secret"
}
```

### 2. Verify Signature

All webhooks include a signature header for security:

```
X-AstroLeads-Signature: sha256=...
```

**Verify in Node.js:**

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}
```

---

## Events

### lead.qualified

Triggered when a lead scores above your threshold.

**Payload:**

```json
{
  "event": "lead.qualified",
  "timestamp": "2025-01-20T10:30:00Z",
  "data": {
    "leadId": "lead_789xyz",
    "campaignId": "cmp_123",
    "email": "marie@techcorp.com",
    "firstName": "Marie",
    "lastName": "Dubois",
    "company": "TechCorp",
    "qualityScore": 92,
    "source": "linkedin"
  }
}
```

---

### lead.created

Triggered when a new lead is imported.

**Payload:**

```json
{
  "event": "lead.created",
  "timestamp": "2025-01-20T09:15:00Z",
  "data": {
    "leadId": "lead_456def",
    "campaignId": "cmp_123",
    "email": "jean@startup.io",
    "qualityScore": 78
  }
}
```

---

### campaign.completed

Triggered when a campaign finishes processing.

**Payload:**

```json
{
  "event": "campaign.completed",
  "timestamp": "2025-01-20T18:00:00Z",
  "data": {
    "campaignId": "cmp_123",
    "name": "Q1 SaaS Outreach",
    "totalLeads": 500,
    "qualifiedLeads": 142,
    "avgScore": 84.5
  }
}
```

---

### email.bounced

Triggered when an email hard bounces.

**Payload:**

```json
{
  "event": "email.bounced",
  "timestamp": "2025-01-20T11:00:00Z",
  "data": {
    "leadId": "lead_123abc",
    "email": "invalid@example.com",
    "bounceType": "hard",
    "reason": "Mailbox does not exist"
  }
}
```

---

### email.replied

Triggered when a lead replies to your outreach.

**Payload:**

```json
{
  "event": "email.replied",
  "timestamp": "2025-01-20T14:30:00Z",
  "data": {
    "leadId": "lead_789xyz",
    "email": "marie@techcorp.com",
    "subject": "Re: Partnership opportunity",
    "snippet": "Hi, I'd be interested in learning more..."
  }
}
```

---

## Event Types

| Event | Description | Typical Use Case |
|-------|-------------|------------------|
| `lead.qualified` | High-score lead detected | Send to CRM, notify sales team |
| `lead.created` | New lead imported | Log in analytics |
| `campaign.completed` | Campaign finished | Send summary report |
| `email.sent` | Email successfully sent | Update tracking |
| `email.bounced` | Email hard bounced | Remove from list |
| `email.replied` | Lead replied | Trigger follow-up workflow |
| `score.updated` | Lead score changed | Re-evaluate priority |

---

## Example Handlers

### n8n Webhook

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "astroleads",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Filter Qualified",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{$json.event}}",
            "value2": "lead.qualified"
          }]
        }
      }
    },
    {
      "name": "Add to HubSpot",
      "type": "n8n-nodes-base.hubspot"
    }
  ]
}
```

### Express.js Handler

```javascript
const express = require('express');
const app = express();

app.post('/webhooks/astroleads', express.json(), (req, res) => {
    // Verify signature
    const signature = req.headers['x-astroleads-signature'];
    if (!verifyWebhook(JSON.stringify(req.body), signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).send('Invalid signature');
    }

    const { event, data } = req.body;

    switch (event) {
        case 'lead.qualified':
            // Send to CRM
            await crm.createContact(data);
            // Notify sales team
            await slack.send(`New qualified lead: ${data.email} (Score: ${data.qualityScore})`);
            break;
        
        case 'email.bounced':
            // Mark as invalid
            await db.updateLead(data.leadId, { status: 'invalid' });
            break;
    }

    res.status(200).send('OK');
});
```

---

## Best Practices

1. ✅ **Respond quickly** (< 5s) to avoid timeouts
2. ✅ **Verify signatures** for security
3. ✅ **Use HTTPS** (required)
4. ✅ **Handle retries** (we retry 3× on failure)
5. ✅ **Log events** for debugging
6. ❌ **Don't** process synchronously (queue long tasks)

---

## Testing

Use our webhook tester:

```bash
curl -X POST https://api.astroleads.app/v1/webhooks/test \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookId": "wh_123abc",
    "event": "lead.qualified"
  }'
```

---

**Previous**: [Scoring API ←](./scoring.md) | **Next**: [Rate Limits →](./rate-limits.md)
