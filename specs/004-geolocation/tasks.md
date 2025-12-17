# Tasks: Geolocation

**Feature**: Lead Geolocation (004-geolocation)  
**Status**: Ready for Implementation  

## Phase 1: Data & Backend

- [ ] T001 Update `Lead` type definition in `src/types/index.ts` (add `timezone`, `ip_address`).
- [ ] T002 Create Supabase Edge Function `fetch-location` (Mock/IP-API).
- [ ] T003 Update `leadStore` mock data with timezones.

## Phase 2: Frontend UI

- [ ] T004 Create `LocalTimeBadge` component.
- [ ] T005 Integrate `LocalTimeBadge` into `Leads.tsx`.
- [ ] T006 Integrate `LocalTimeBadge` into `LeadDetailsModal.tsx`.

## Phase 3: Integration

- [ ] T007 Verify and adjust timezone logic.
