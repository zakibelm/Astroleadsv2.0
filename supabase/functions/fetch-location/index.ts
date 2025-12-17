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
        const { ip, city } = await req.json()

        // 1. IP Lookup (If provided)
        if (ip) {
            const response = await fetch(`http://ip-api.com/json/${ip}`)
            const data = await response.json()

            if (data.status === 'success') {
                return new Response(
                    JSON.stringify({
                        city: data.city,
                        country: data.country,
                        timezone: data.timezone,
                        lat: data.lat,
                        lon: data.lon
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
                )
            }
        }

        // 2. City Lookup (Mock/Simple Logic)
        // If we only have a city name "Paris", we can try to guess or use a mock map
        if (city) {
            const normalizedCity = city.toLowerCase();
            let timezone = 'UTC';
            let country = 'Unknown';

            if (normalizedCity.includes('paris')) { timezone = 'Europe/Paris'; country = 'France'; }
            else if (normalizedCity.includes('london')) { timezone = 'Europe/London'; country = 'UK'; }
            else if (normalizedCity.includes('new york')) { timezone = 'America/New_York'; country = 'USA'; }
            else if (normalizedCity.includes('tokyo')) { timezone = 'Asia/Tokyo'; country = 'Japan'; }
            else if (normalizedCity.includes('montreal')) { timezone = 'America/Toronto'; country = 'Canada'; }
            else if (normalizedCity.includes('california') || normalizedCity.includes('san francisco')) { timezone = 'America/Los_Angeles'; country = 'USA'; }
            else if (normalizedCity.includes('berlin')) { timezone = 'Europe/Berlin'; country = 'Germany'; }

            return new Response(
                JSON.stringify({
                    city: city,
                    country: country,
                    timezone: timezone,
                    _mock: true
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
        }

        return new Response(
            JSON.stringify({ error: 'No IP or City provided' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
