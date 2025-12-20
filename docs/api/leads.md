# Leads API

Retrieve, import, and manage leads programmatically.

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/leads` | List leads |
| `POST` | `/v1/leads` | Import new leads |
| `GET` | `/v1/leads/{id}` | Get lead details |
| `PATCH` | `/v1/leads/{id}` | Update lead |
| `DELETE` | `/v1/leads/{id}` | Delete lead |

---

## List Leads

```bash
GET /v1/leads
```

**Query Parameters:**
- `campaignId` (optional): Filter by campaign
- `minScore` (optional): Minimum quality score (0-100)
- `source` (optional): Filter by source (linkedin, instagram, etc.)
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50, max: 200)

**Example:**

```bash
curl "https://api.astroleads.app/v1/leads?campaignId=cmp_123&minScore=85" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "leads": [
    {
      "id": "lead_789xyz",
      "firstName": "Marie",
      "lastName": "Dubois",
      "email": "marie.dubois@techcorp.com",
      "company": "TechCorp SAS",
      "position": "CTO",
      "qualityScore": 92,
      "source": "linkedin",
      "linkedinUrl": "https://linkedin.com/in/mariedubois",
      "phone": "+33 6 12 34 56 78",
      "website": "https://techcorp.com",
      "status": "new",
      "campaignId": "cmp_123",
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ],
  "total": 287,
  "page": 1,
  "totalPages": 6
}
```

---

## Import Leads

```bash
POST /v1/leads
```

**Request Body:**

```json
{
  "campaignId": "cmp_123",
  "leads": [
    {
      "firstName": "Jean",
      "lastName": "Martin",
      "email": "jean.martin@startup.io",
      "company": "Startup IO",
      "position": "VP Engineering",
      "linkedinUrl": "https://linkedin.com/in/jeanmartin",
      "source": "linkedin"
    }
  ],
  "autoScore": true
}
```

**Parameters:**
- `campaignId` (required): Campaign ID to associate leads
- `leads` (required): Array of lead objects
- `autoScore` (optional): Automatically score leads (default: true)

**Example:**

```bash
curl -X POST https://api.astroleads.app/v1/leads \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "cmp_123",
    "leads": [{
      "firstName": "Jean",
      "email": "jean@startup.io",
      "company": "Startup IO"
    }],
    "autoScore": true
  }'
```

**Response:**

```json
{
  "imported": 1,
  "skipped": 0,
  "errors": [],
  "leads": [
    {
      "id": "lead_456def",
      "qualityScore": 87,
      "status": "new"
    }
  ]
}
```

---

## Get Lead

```bash
GET /v1/leads/{id}
```

**Example:**

```bash
curl https://api.astroleads.app/v1/leads/lead_789xyz \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** Same as individual lead in list response with additional enrichment data.

---

## Update Lead

```bash
PATCH /v1/leads/{id}
```

**Request Body** (partial update):

```json
{
  "status": "contacted",
  "notes": "Sent initial outreach email"
}
```

**Example:**

```bash
curl -X PATCH https://api.astroleads.app/v1/leads/lead_789xyz \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted",
    "notes": "Demo scheduled for Friday"
  }'
```

---

## Delete Lead

```bash
DELETE /v1/leads/{id}
```

**Example:**

```bash
curl -X DELETE https://api.astroleads.app/v1/leads/lead_789xyz \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Bulk Operations

### Bulk Import (CSV)

```bash
POST /v1/leads/import/csv
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: CSV file (max 10MB)
- `campaignId`: Campaign ID
- `mapping`: Column mapping (optional)

**CSV Format:**
```csv
firstName,lastName,email,company,position,linkedinUrl
Marie,Dubois,marie@techcorp.com,TechCorp,CTO,https://linkedin.com/in/mariedubois
```

---

## Lead Statuses

| Status | Description |
|--------|-------------|
| `new` | Newly imported, not contacted |
| `contacted` | Outreach sent |
| `replied` | Lead responded |
| `qualified` | Lead is qualified for sales |
| `converted` | Lead became customer |
| `rejected` | Lead not suitable |

---

## Quality Score

Leads are automatically scored 0-100 based on:
- **Email validity** (30 points)
- **Profile completeness** (20 points)
- **Company data** (20 points)
- **Source reliability** (15 points)
- **Campaign criteria match** (15 points)

**Recommended threshold**: 85+ for high-quality leads

---

**Next**: [Scoring API →](./scoring.md)
