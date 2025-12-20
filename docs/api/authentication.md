# Authentication

AstroLeads API uses **Bearer token authentication** with API keys.

---

## Getting Your API Key

1. Log in to [AstroLeads](https://astroleads.app)
2. Go to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy and store securely (shown only once)

---

## Authentication Methods

### Bearer Token (Recommended)

Include your API key in the `Authorization` header:

```bash
curl https://api.astroleads.app/v1/campaigns \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Query Parameter (Not Recommended)

Only for testing:

```bash
curl "https://api.astroleads.app/v1/campaigns?api_key=YOUR_API_KEY"
```

⚠️ **Security**: Never expose API keys in client-side code or public repositories.

---

## API Key Management

### Rotate Keys

Rotate keys regularly for security:

```bash
POST /v1/api-keys/rotate
Authorization: Bearer OLD_KEY

Response:
{
  "newKey": "ask_new_key_here",
  "expiresAt": "2025-01-20T00:00:00Z"
}
```

### Revoke Keys

```bash
DELETE /v1/api-keys/{keyId}
Authorization: Bearer YOUR_KEY
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Invalid API key",
  "code": "UNAUTHORIZED"
}
```

**Fix**: Check your API key is correct and active.

### 403 Forbidden

```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

**Fix**: Upgrade your plan or contact support.

---

## Best Practices

1. ✅ **Use environment variables** for API keys
2. ✅ **Rotate keys** every 90 days
3. ✅ **Use HTTPS** always
4. ✅ **Monitor usage** in dashboard
5. ❌ **Never commit** keys to git
6. ❌ **Never use** in client-side JavaScript

---

**Next**: [Campaigns API →](./campaigns.md)
