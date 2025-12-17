# Implementation Plan - Email Verification

## User Review Required

> [!IMPORTANT]
> **API Key Required**: You will need a **Hunter.io** (or AbstractAPI) API Key to test this feature.
> Please obtain one and add it to your `.env.local` as `HUNTER_API_KEY`.
>
> **Supabase Edge Function**: This plan requires deploying a new Edge Function. Ensure you have the Supabase CLI configured if you want to deploy to production, otherwise we will mock it for local dev.

## Proposed Changes

### Database Layer

#### [MODIFY] [Supabase Schema]
- Add new columns to the `leads` table:
    - `verification_status`: TEXT (Check constraint: 'valid', 'risky', 'invalid', 'unknown')
    - `verification_score`: INTEGER (0-100)
    - `last_verified_at`: TIMESTAMP WITH TIME ZONE

### Backend (Supabase Edge Functions)

#### [NEW] [supabase/functions/verify-email/index.ts](file:///c:/Users/zakib/Downloads/AstroLeads/supabase/functions/verify-email/index.ts)
- Create a secure proxy function.
- **Input**: `{ email: string }`
- **Logic**:
    1. Check `HUNTER_API_KEY` in env vars.
    2. Call Hunter.io API (`https://api.hunter.io/v2/email-verifier`).
    3. Map response to our standard status (`VALID`, `RISKY`, `INVALID`).
    4. Return standardized JSON.

### Frontend Layer

#### [MODIFY] [src/types/lead.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/types/lead.ts)
- Update `Lead` interface to include the new verification fields.

#### [NEW] [src/services/verificationService.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/services/verificationService.ts)
- `verifyEmail(email: string): Promise<VerificationResult>`
- Calls the Supabase Edge Function via `supabase.functions.invoke`.

#### [NEW] [src/components/ui/VerificationBadge.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/components/ui/VerificationBadge.tsx)
- Reusable component that takes a `status` and displays the correct color/icon (Green Check, Red X).

#### [MODIFY] [src/views/Leads.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/views/Leads.tsx)
- Integrate `VerificationBadge` into the leads table column.
- Add "Verify" button action if status is unknown.

## Verification Plan

### Automated Tests
- **Unit**: Test `verificationService` with mocked Supabase response.
- **Unit**: Test `VerificationBadge` rendering for all statuses.

### Manual Verification
1. Add a lead with a known valid email (e.g., `contact@hunter.io`).
2. Click "Verify".
3. Confirm badge turns Green.
4. Add a lead with a nonsense email (e.g., `faker12345@domainthatdoesnotexist.com`).
5. Click "Verify".
6. Confirm badge turns Red.
