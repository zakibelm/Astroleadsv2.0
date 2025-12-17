# Specification: Email Verification Service

**Feature**: Email Verification Service  
**Status**: Draft  
**Owner**: Development Team  

## 1. Overview

### Problem Statement
Currently, AstroLeads generates emails using AI or scraping without validating them. Sending emails to invalid addresses ("bounces") damages the domain reputation, leading to lower deliverability rates and potential blacklisting by ESPs (Email Service Providers).

### Proposed Solution
Integrate a robust **Email Verification Service** that validates prospect email addresses in real-time or batch. This service will assign a trust score (Valid, Risky, Invalid) to each lead, preventing users from sending emails to bad addresses.

To ensure long-term flexibility and cost optimization, the solution will use an **Adapter Design Pattern**, allowing us to easily switch between providers (e.g., Hunter.io, Abstract, ZeroBounce) without rewriting the core logic.

## 2. User Scenarios

### Scenario 1: Immediate Validation on Lead Capture
**Review**: When a new lead is added (manually or via AI), the system automatically attempts to verify the email address.
**Action**: The user views the "Lead Board".
**Outcome**: A status icon works next to the email:
    - 🟢 (Green Check): Valid. Safe to send.
    - 🟡 (Yellow Warning): Risky/Accept All. Send with caution.
    - 🔴 (Red X): Invalid. Sending blocked/discouraged.

### Scenario 2: Prevention of "Bad" Sends
**Review**: User attempts to launch a campaign to a list of 100 leads.
**Action**: User clicks "Start Campaign".
**Outcome**: The system warns: "5 emails are invalid and have been removed from the queue."

## 3. Functional Requirements

### 3.1 Core Verification Logic
- **FR1**: Implement a generic `EmailVerifier` interface with a method `verify(email: string): Promise<VerificationResult>`.
- **FR2**: Implement the first adapter using a reliable API (Recommend: **Hunter.io** or **Abstract API** due to reliability/cost ratio).
- **FR3**: The `VerificationResult` must normalize responses into three statuses: `VALID`, `RISKY` (catch-all/disposable), `INVALID`.

### 3.2 Data Management & Caching
- **FR4**: Store verification results in the database (`leads` table or separate value object) to avoid re-verifying the same email (cost saving).
- **FR5**: Include a timestamp for verification; allow re-verification if data is > 6 months old.

### 3.3 User Interface
- **FR6**: Add visual indicators (Icons/Badges) in the `LeadBoard` table.
- **FR7**: Add a filter to the Lead Board to show "Only Valid Emails".

## 4. Technical Boundaries (Scope)

- **In Scope**:
    - Integration with one 3rd party provider.
    - Database schema updates.
    - UI updates on Lead Board.
- **Out of Scope**:
    - Building our own STMP checking engine (too complex/risky).
    - Bulk verification of CSV imports (handled sequentially for MVP).

## 5. Success Criteria

- **Quantitative**:
    - Reduce potential bounce rate to < 5%.
    - 100% of new leads have a verification status within 1 minute of creation.
- **Qualitative**:
    - Users feel confident that their campaigns will actually reach the target.
    - "Set and forget" peace of mind regarding domain health.

## 6. Assumptions & Risks

- **Assumption**: The user will provide a valid API key for the chosen provider.
- **Risk**: API Rate limits on free tiers may delay verification for large batches.
- **Mitigation**: Implement a queue system or simple "retry" logic if rate limited.
