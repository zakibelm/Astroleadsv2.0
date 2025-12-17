# Tasks: Email Verification

**Feature**: Email Verification Service (001-email-verification)  
**Status**: Ready for Implementation  

## Dependencies

1.  **Phase 1: Setup & Backend** (Must be done first)
2.  **Phase 2: Database & Types**
3.  **Phase 3: Frontend Implementation**
4.  **Phase 4: Integration & Polish**

## Phase 1: Setup & Backend (Supabase)

- [ ] T001 Initialize Supabase Edge Function `verify-email` at `supabase/functions/verify-email/index.ts`
- [ ] T002 Implement Hunter.io API call logic in `verify-email` function (with mock mode for local dev)
- [ ] T003 Add `cors.ts` headers to allow browser requests to the Edge Function

## Phase 2: Database & Types

- [ ] T004 Create SQL migration file `supabase/migrations/TIMESTAMP_add_verification_to_leads.sql`
- [ ] T005 Update `src/types/lead.ts` with `verification_status` and `verification_score`
- [ ] T006 [P] Update `src/stores/leadsStore.ts` (if necessary) to handle new fields

## Phase 3: Frontend Implementation

- [ ] T007 Create `src/services/verificationService.ts` to call the Edge Function
- [ ] T008 Create `src/components/ui/VerificationBadge.tsx` (Visual indicator)
- [ ] T009 [P] Update `src/views/Leads.tsx` to display the Badge in the table
- [ ] T010 Implement "Verify" button click handler in `Leads.tsx` to trigger verification

## Phase 4: Integration & Polish

- [ ] T011 Verify end-to-end flow with a real (or mocked) email
- [ ] T012 Add toast notifications for success/failure of verification
- [ ] T013 Update README with new Environment Variable requirements (`HUNTER_API_KEY`)
