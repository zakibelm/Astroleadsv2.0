# Specification: Company Logos (Clearbit)

**Feature**: Company Logos Integration  
**Status**: Draft  
**Owner**: Development Team  

## 1. Overview

### Problem Statement
The "Lead Board" is currently text-heavy. Users scan lists of companies but have to read text to identify them. Visual logos allow for much faster recognition (e.g., recognizing the "Google" 'G' or "Spotify" logo instantly).

### Proposed Solution
Integrate the **Clearbit Logo API** to automatically fetch and display company logos next to the company name.
We will infer the company domain from the lead's email address (e.g., `bill@microsoft.com` -> `microsoft.com`) or use the website field if available.

## 2. User Scenarios

### Scenario 1: Visual Scanning
**Action**: User opens the "Prospects" page.
**Outcome**: Next to each company name, a small (24x24 or 32x32) logo appears.
**Exception**: If no logo is found, a generic "Building" icon is shown (current behavior).

## 3. Functional Requirements

### 3.1 Domain Extraction
- **FR1**: Create a helper to extract the domain from an email address (everything after `@`).
- **FR2**: Exclude generic domains (gmail.com, yahoo.com, hotmail.com) from logo fetching to avoid showing the email provider's logo instead of the company's.

### 3.2 Logo Component
- **FR3**: Create a `CompanyLogo` component that accepts `domain` or `companyName` as props.
- **FR4**: Use `https://logo.clearbit.com/{domain}` as the image source.
- **FR5**: Handle `onError` events to switch to a fallback icon if Clearbit returns 404.

## 4. Technical Boundaries

- **In Scope**:
    - Frontend changes only (Direct image loading).
    - Helper utility for domain extraction.
- **Out of Scope**:
    - Storing/Caching logos in our own database (we rely on browser cache).
    - Paying for Clearbit premium API (we use the free public endpoint).

## 5. Success Criteria

- **Qualitative**:
    - Limits visual clutter (failed logos shouldn't show broken image icons).
    - Improves "Premium" feel of the dashboard.

## 6. Assumptions & Risks

- **Risk**: Clearbit may rate limit if we load 100s of logos at once.
- **Mitigation**: Browser automatically handles some caching, and lazy loading (native `loading="lazy"`) can help.
