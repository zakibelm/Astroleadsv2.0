# Specification: Lead Geolocation & Timezone

**Feature**: Lead Geolocation  
**Status**: Draft  
**Owner**: Development Team  

## 1. Overview

### Problem Statement
Sales representatives often call or email prospects at inappropriate times (e.g., calling a London lead at 3 AM PST). Knowing the lead's location and *current local time* increases connection rates and effective engagement.

### Proposed Solution
Integrate a Geolocation API (Ipify Geo or IP-API) to determine a lead's location and timezone.
Display a "Local Time" badge on the lead card.
Visually warn users if it's currently outside business hours (e.g., "Late Night" warning).

## 2. User Scenarios

### Scenario 1: Outreach Timing
**Action**: User views the Lead Board.
**Outcome**: Next to the Lead's location, a clock icon shows "14:30 (Paris, FR)".
**Logic**: If time is < 8 AM or > 6 PM, display in red/orange.

### Scenario 2: Data Enrichment
**Action**: User adds a new lead with an IP address (or city).
**Outcome**: System automatically resolves the Timezone.

## 3. Functional Requirements

### 3.1 Backend
- **FR1**: Create `fetch-location` Edge Function.
- **FR2**: Input: IP address OR City Name (if API supports it) OR Mock trigger.
- **FR3**: Output: `{ city, country, timezone, currentTime }`.

### 3.2 Frontend
- **FR4**: Add `LocalTimeBadge` component.
- **FR5**: Integrate into `LeadDetailsModal` and `Leads` table.

## 4. Technical Boundaries

- **API Provider**: Use **IP-API.com** (free, no key for non-commercial) or **Ipify** (if user key provided).
- **Default**: Since we might not have IPs for all leads, we will match based on `lead.company` logic or mock data for the demo.
- **Mock Mode**: Essential if no internet or API rate limits.

## 5. Success Criteria

- Application correctly calculates time differences.
- "Late Night" warning appears for leads in different timezones.

## 6. Assumptions & Risks

- **Assumption**: Leads have a `location` or `ip` field (we might need to add one or use `location` string).
- **Risk**: Timezone math can be tricky (DST). Use `Intl.DateTimeFormat` or a robust library.
