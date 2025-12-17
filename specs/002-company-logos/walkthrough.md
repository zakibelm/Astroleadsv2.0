# Walkthrough: Company Logos Feature (Clearbit)

I have successfully integrated the Clearbit Logo API! 🎨

## Changes Overview

- **New Utility**: `src/utils/domain.ts` intelligently extracts domains from emails and filters out generic providers (Gmail, Yahoo, etc.).
- **New Component**: `CompanyLogo` attempts to fetch the logo from Clearbit. If it fails (404) or is a generic domain, it falls back to the clean "Building" icon.
- **UI Update**: The "Leads" table now displays logos next to company names.

## How to Test

1.  Open the **Prospects** (Leads) page.
2.  Add a new lead or edit one:
    - **Email**: `steve@apple.com` -> You should see the **Apple Logo** 🍎.
    - **Email**: `satya@microsoft.com` -> You should see the **Microsoft Logo**.
    - **Email**: `david@gmail.com` -> You should see the **Building Icon** 🏢 (Generic domain filtered).
    - **Email**: `fake@unknown-startup-xyz.com` -> You should see the **Building Icon** 🏢 (Fallback after load failure).

## Technical Note
This feature uses the **Public** Clearbit API which is free but relies on client-side requests. We do not store these images, they are loaded live from the browser.
