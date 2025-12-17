# Walkthrough: Email Verification Feature

I have successfully implemented the Email Verification feature! 🚀

## Changes Overview

### Backend (Supabase)
- **Edge Function**: `verify-email` creates a secure proxy to Hunter.io.
- **Mock Mode**: If no API key is present, it simulates responses based on keywords:
  - `mock` + `invalid` -> **Email Invalide** 🔴
  - `mock` + `risky` -> **Email Risqué** 🟡
  - `mock` -> **Email Valide** 🟢
- **Database**: Added `verification_status` and `score` columns to `leads`.

### Frontend
- **UI**: Added `VerificationBadge` component with status icons.
- **Interaction**: Clicking "Verifier" (gray badge) triggers the check.
- **Feedback**: Toast notifications show the result immediately.

## How to Test

1.  Open the **Prospects** (Leads) page.
2.  Locate the first lead (Sarah Connor) - You should see a **Valide** badge (automatically set in mock data).
3.  Create a NEW lead or edit an existing one to have these emails to test the logic:
    - `test.mock@example.com` -> Click Verify -> Should turn **Green** (Valid)
    - `fail.mock@example.com` -> Click Verify -> Should turn **Red** (Invalid)
    - `risky.mock@example.com` -> Click Verify -> Should turn **Yellow** (Risky)

## Next Steps
- Add your real Hunter.io API key to Supabase secrets to go live.
- Run the SQL migration using Supabase Dashboard or CLI.
