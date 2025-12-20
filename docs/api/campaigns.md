# Campaigns API

Manage lead generation campaigns programmatically.

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/campaigns` | List all campaigns |
| `POST` | `/v1/campaigns` | Create new campaign |
| `GET` | `/v1/campaigns/{id}` | Get campaign details |
| `PATCH` | `/v1/campaigns/{id}` | Update campaign |
| `DELETE` | `/v1/campaigns/{id}` | Delete campaign |

---

## List Campaigns

```bash
GET /v1/campaigns
```

**Query Parameters:**
- `status` (optional): Filter by status (`DRAFT`, `ACTIVE`, `PAUSED`, `COMPLETED`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Example:**

```bash
curl "https://api.astroleads.app/v1/campaigns?status=ACTIVE&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "campaigns": [
    {
      "id": "cmp_123abc",
      "name": "Q1 2025 SaaS Outreach",
      "campaignType": "b2b",
      "status": "ACTIVE",
      "leadsCount": 287,
      "qualifiedLeadsCount": 142,
      "avgQualityScore": 89,
      "createdAt": "2025-01-15T10:00:00Z",
      "b2bCriteria": {
        "companySize": ["PME", "ETI"],
        "sectors": ["Tech & SaaS"],
        "targetPositions": ["CTO", "VP Engineering"]
      },
      "scoringPriorities": {
        "topPriority": "position",
        "minScore": 85
      }
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

## Create Campaign

```bash
POST /v1/campaigns
```

**Request Body:**

```json
{
  "name": "SaaS CTO Outreach",
  "campaignType": "b2b",
  "targetAudience": "CTOs at SaaS companies",
  "productName": "AstroLeads",
  "preferredSources": ["🔗 LinkedIn", "📍 Google Maps"],
  "b2bCriteria": {
    "companySize": ["PME", "ETI"],
    "sectors": ["Tech & SaaS", "Finance & Banque"],
    "targetPositions": ["CTO", "VP Engineering"],
    "minSeniority": "VP"
  },
  "scoringPriorities": {
    "topPriority": "position",
    "minScore": 85
  },
  "budget": {
    "maxCredits": 1000,
    "targetLeadCount": 500
  }
}
```

**Example:**

```bash
curl -X POST https://api.astroleads.app/v1/campaigns \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SaaS CTO Outreach",
    "campaignType": "b2b",
    "b2bCriteria": {
      "companySize": ["PME"],
      "sectors": ["Tech & SaaS"]
    }
  }'
```

**Response:**

```json
{
  "id": "cmp_456def",
  "name": "SaaS CTO Outreach",
  "status": "DRAFT",
  "createdAt": "2025-01-20T14:30:00Z"
}
```

---

## Get Campaign

```bash
GET /v1/campaigns/{id}
```

**Example:**

```bash
curl https://api.astroleads.app/v1/campaigns/cmp_123abc \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** Same as individual campaign in list response.

---

## Update Campaign

```bash
PATCH /v1/campaigns/{id}
```

**Request Body** (partial update):

```json
{
  "status": "ACTIVE",
  "scoringPriorities": {
    "minScore": 90
  }
}
```

**Example:**

```bash
curl -X PATCH https://api.astroleads.app/v1/campaigns/cmp_123abc \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

---

## Delete Campaign

```bash
DELETE /v1/campaigns/{id}
```

**Example:**

```bash
curl -X DELETE https://api.astroleads.app/v1/campaigns/cmp_123abc \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

## Error Responses

### 404 Not Found

```json
{
  "error": "Campaign not found",
  "code": "NOT_FOUND"
}
```

### 400 Bad Request

```json
{
  "error": "Invalid campaign type",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "campaignType",
    "message": "Must be one of: b2b, b2c, hybrid"
  }
}
```

---

**Next**: [Leads API →](./leads.md)
