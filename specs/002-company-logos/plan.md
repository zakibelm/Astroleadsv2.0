# Implementation Plan - Company Logos

## Proposed Changes

### Frontend Utilities

#### [NEW] [src/utils/domain.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/utils/domain.ts)
- `extractDomainFromEmail(email: string): string | null`
- `isGenericDomain(domain: string): boolean` (List: gmail, outlook, yahoo, hotmail, icloud...)

### Frontend Components

#### [NEW] [src/components/ui/CompanyLogo.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/components/ui/CompanyLogo.tsx)
- **Props**: `{ domain?: string, companyName: string, className?: string }`
- **Logic**:
    - If `domain` is valid and not generic: Render `<img src="https://logo.clearbit.com/{domain}" />`
    - If image fails to load or no domain: Render `FallbackIcon` (Building).

### Frontend Views

#### [MODIFY] [src/views/Leads.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/views/Leads.tsx)
- Import `CompanyLogo`.
- In the table row, replace the generic `Building` icon with `<CompanyLogo />`.
- Pass `email` to the extractor to get the domain on the fly (or pre-calculate it).

## Verification Plan

### Manual Verification
1. Add lead `steve@apple.com` -> Expect Apple Logo.
2. Add lead `jeff@google.com` -> Expect Google Logo.
3. Add lead `john@gmail.com` -> Expect Fallback Icon (Building).
4. Add lead `fake@startup-that-doesnt-exist-123.com` -> Expect Fallback Icon (after 404).
