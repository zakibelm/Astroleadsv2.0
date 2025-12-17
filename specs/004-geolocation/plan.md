# Implementation Plan - Geolocation

## User Review Required

> [!NOTE]
> We will use **IP-API.com** as the default provider as it allows free non-commercial use without a key for IP lookups. We will also support simulating locations for leads without IPs.

## Proposed Changes

### Database Schema
#### [MODIFY] [supabase/migrations/20251216..._add_geo.sql]
- Add columns to `leads`:
  - `location` (TEXT) - e.g. "Paris, France" (Already exists? Check types)
  - `timezone` (TEXT) - e.g. "Europe/Paris"
  - `ip_address` (TEXT) - Optional, for exact lookups.

### Backend (Supabase Edge Functions)
#### [NEW] [supabase/functions/fetch-location/index.ts](file:///c:/Users/zakib/Downloads/AstroLeads/supabase/functions/fetch-location/index.ts)
- Accepts `{ ip, city }`.
- call `http://ip-api.com/json/{ip}` or mock if city provided.
- Returns timezone and formatted location.

### Frontend Layer
#### [MODIFY] [src/types/index.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/types/index.ts)
- Add `timezone` to `Lead` interface.

#### [NEW] [src/components/ui/LocalTimeBadge.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/components/ui/LocalTimeBadge.tsx)
- Props: `{ timezone }`.
- Calculates current time in that timezone.
- Renders badge with specific color (Green = Business Hours, Red = Night).

#### [MODIFY] [src/views/Leads.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/views/Leads.tsx)
- Add `LocalTimeBadge` to the location column.

#### [MODIFY] [src/stores/leadStore.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/stores/leadStore.ts)
- Update mock data to include diverse timezones (e.g. New York, London, Tokyo) to demonstrate the feature.

## Verification Plan

### Manual Verification
1. Check the Lead Board.
2. Verify "Sarah Connor" (US) shows appropriate time.
3. Verify "Tokyo Lead" shows night time (if applicable).
4. Verify visual indicator (Moon/Sun icon).
