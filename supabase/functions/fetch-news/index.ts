import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { company, apiKey: bodyApiKey } = await req.json()
        const apiKey = bodyApiKey || Deno.env.get('NEWS_API_KEY')

        // Mock mode if no API key
        if (!apiKey) {
            console.log('Using Mock News for:', company)
            await new Promise(resolve => setTimeout(resolve, 600))

            const mockNews = [
                {
                    title: `${company} announces record growth in Q3`,
                    url: 'https://example.com/news/1',
                    source: { name: 'TechDaily' },
                    publishedAt: new Date().toISOString()
                },
                {
                    title: `Why ${company} is leading the industry transformation`,
                    url: 'https://example.com/news/2',
                    source: { name: 'Business Insider Mock' },
                    publishedAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    title: `New partnership revealed between ${company} and AI Giant`,
                    url: 'https://example.com/news/3',
                    source: { name: 'MarketWatch Mock' },
                    publishedAt: new Date(Date.now() - 172800000).toISOString()
                }
            ]

            return new Response(
                JSON.stringify({ articles: mockNews, _mock: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
        }

        // Real API Call
        // Restrict domains to high quality business/tech news to reduce noise
        const domains = 'techcrunch.com,businessinsider.com,bloomberg.com,reuters.com,wired.com,forbes.com,wsj.com,cnbc.com'
        const query = encodeURIComponent(`${company} business`)

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&domains=${domains}&sortBy=relevance&pageSize=3&apiKey=${apiKey}`
        )
        const data = await response.json()

        if (data.status === 'error') {
            throw new Error(data.message || 'NewsAPI Error')
        }

        return new Response(
            JSON.stringify({
                articles: data.articles,
                totalResults: data.totalResults
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
