# Implementation Plan - Company News

## User Review Required

> [!IMPORTANT]
> **API Key Required**: You need a **NewsAPI.org** API Key.
> Add it to Settings page `newsApiKey`.

## Proposed Changes

### Backend (Supabase Edge Functions)

#### [NEW] [supabase/functions/fetch-news/index.ts](file:///c:/Users/zakib/Downloads/AstroLeads/supabase/functions/fetch-news/index.ts)
- **Input**: `{ company: string, apiKey?: string }`
- **Logic**:
    1. Check for API key (Body or Env).
    2. If no key, return MOCK data (3 articles about "Innovation", "Growth").
    3. If key, call `https://newsapi.org/v2/everything?q={company}&sortBy=relevance&domains=techcrunch.com,wired.com,bloomberg.com...`.
    4. Return simplified JSON `[{ title, url, source, publishedAt }]`.

### Frontend Layer

#### [NEW] [src/services/newsService.ts](file:///c:/Users/zakib/Downloads/AstroLeads/src/services/newsService.ts)
- `fetchCompanyNews(company: string): Promise<Article[]>`
- Calls `supabase.functions.invoke('fetch-news', ...)`.
- Retrieves `newsApiKey` from local storage settings.

#### [NEW] [src/components/ui/NewsFeed.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/components/ui/NewsFeed.tsx)
- Displays a list of `Article` cards.
- Loading skeletons.
- "No news found" state.

#### [MODIFY] [src/views/Leads.tsx](file:///c:/Users/zakib/Downloads/AstroLeads/src/views/Leads.tsx)
- We need a place to show this. 
- **Plan**: Add a "Quick View" modal or expander row for the lead.
- *Decision*: Let's implement a simple **Modal** that opens when you click the Company Name or a new "Info" button.

## Verification Plan

### Manual Verification
1. Open Settings, ensure `newsApiKey` is empty (to test mock).
2. Go to Leads.
3. Click "Info/News" on a lead.
4. Verify mock news appears.
5. (Optional) Enter real API key, verify real news for "Tesla" or "Google".
