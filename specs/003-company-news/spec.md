# Specification: Company News (NewsAPI)

**Feature**: Company News Context  
**Status**: Draft  
**Owner**: Development Team  

## 1. Overview

### Problem Statement
Effective B2B outreach requires "Icebreakers" – verifying you know who you are talking to. Manually searching Google News for every prospect is slow. AI needs context to generate good emails; generic emails get deleted.

### Proposed Solution
Integrate **NewsAPI** to automatically fetch the top 3 recent news articles about a prospect's company. This data will be displayed in the UI for the user and eventually fed into the AI Email Generator to create hyper-personalized intro lines (e.g., "Congrats on your Series B funding...").

## 2. User Scenarios

### Scenario 1: Lead Contextualization
**Action**: User clicks on a Lead in the dashboard.
**Outcome**: A side panel or modal opens showing "Company Insights". 
**Display**: A list of recent headlines (e.g., "Apple releases new iPhone 18").

### Scenario 2: AI Preparation (Future)
**Action**: System generating an email.
**Outcome**: System fetches news in the background to instruct the LLM.

## 3. Functional Requirements

### 3.1 Fetching Logic
- **FR1**: Create a backend proxy (Edge Function) to call NewsAPI.
- **FR2**: Search query should be the `companyName`.
- **FR3**: Limit results to top 3 articles sorted by relevance/date.
- **FR4**: Mock Mode: If no API key is provided, return simulated "Generic Good News" (Partnership, Product Launch, etc.).

### 3.2 UI Display
- **FR5**: Create a `NewsFeed` component to display articles (Title, Source, Date, Link).
- **FR6**: Handle "No news found" gracefully.

## 4. Technical Boundaries

- **In Scope**:
    - Supabase Edge Function `fetch-news`.
    - `NewsFeed` React component.
    - Integration into `LeadDetails` (to be created/modified).
- **Out of Scope**:
    - Storing news in DB (live fetch is fine for now to avoid stale data).
    - Sentiment analysis (v2).

## 5. Success Criteria

- **Qualitative**:
    - Users can see at least one relevant article for major companies.
    - Mock mode feels realistic enough for demos.

## 6. Assumptions & Risks

- **Risk**: NewsAPI Free tier is limited to *recent* news and blocks CORS from browser (hence Edge Function requirement).
- **Risk**: Common company names might return irrelevant results (e.g., "Apple" fruit vs company).
- **Mitigation**: Add keywords like "business", "technology" to query if needed.
