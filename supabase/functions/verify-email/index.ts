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
        const { email, apiKey: bodyApiKey } = await req.json()
        const apiKey = bodyApiKey || Deno.env.get('HUNTER_API_KEY')

        // Mock mode if no API key or specific test email
        if (!apiKey || email.includes('mock')) {
            console.log('Using Mock Validation for:', email)

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            let status = 'valid'
            let score = 95

            if (email.includes('invalid') || email.includes('fail')) {
                status = 'invalid'
                score = 10
            } else if (email.includes('risky') || email.includes('accept')) {
                status = 'risky'
                score = 50
            }

            return new Response(
                JSON.stringify({
                    status,
                    score,
                    _mock: true
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
        }

        // Real API Call to Hunter.io
        const response = await fetch(
            `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
        )
        const data = await response.json()

        if (data.errors) {
            throw new Error(JSON.stringify(data.errors))
        }

        // Map Hunter status to our internal status
        // Hunter statuses: 'valid', 'invalid', 'accept_all' (risky), 'webmail' (risky), 'disposable' (risky), 'unknown'
        let internalStatus = 'unknown'
        const hunterStatus = data.data.status
        const hunterScore = data.data.score

        if (hunterStatus === 'valid') internalStatus = 'valid'
        else if (hunterStatus === 'invalid') internalStatus = 'invalid'
        else internalStatus = 'risky' // accept_all, webmail, disposable, unknown

        return new Response(
            JSON.stringify({
                status: internalStatus,
                score: hunterScore,
                provider_data: data.data
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
