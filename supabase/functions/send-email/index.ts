import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Extract user-friendly error message from Resend API response
function getResendErrorMessage(data: any): string {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    return JSON.stringify(data);
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Parse request body
        let payload: EmailPayload;
        try {
            payload = await req.json();
        } catch (parseError) {
            console.error("❌ Invalid JSON payload:", parseError);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid JSON payload"
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const { to, subject, html, text, from, replyTo } = payload;

        // Validate required parameters
        if (!to || !subject || !html) {
            console.error("❌ Missing required fields");
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing required fields: to, subject, and html are required"
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Validate email format
        if (!isValidEmail(to)) {
            console.error(`❌ Invalid email format: ${to}`);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Invalid email format: ${to}`
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Check API key
        if (!RESEND_API_KEY) {
            console.error("❌ RESEND_API_KEY not configured in Edge Function secrets");
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "RESEND_API_KEY not configured. Please add it in Supabase Edge Functions Secrets."
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        console.log(`📨 [Resend] Sending email to ${to}`);
        console.log(`📋 [Resend] Subject: ${subject}`);
        console.log(`🔑 [Resend] API Key configured: ${RESEND_API_KEY.substring(0, 10)}...`);

        // Call Resend API
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: from || "AstroLeads <onboarding@resend.dev>",
                to: [to],
                subject: subject,
                html: html,
                text: text,
                reply_to: replyTo,
            }),
        });

        const resendData = await resendResponse.json();

        // Handle non-200 responses from Resend
        if (!resendResponse.ok) {
            const errorMessage = getResendErrorMessage(resendData);

            console.error(`❌ [Resend] API Error (Status ${resendResponse.status}):`, resendData);
            console.error(`🔍 [Resend] Error Message: ${errorMessage}`);

            // Map common Resend error status codes
            let statusCode = 400;
            let userMessage = errorMessage;

            switch (resendResponse.status) {
                case 401:
                    statusCode = 401;
                    userMessage = "Invalid Resend API key. Please check your configuration.";
                    console.error("💡 [Resend] Tip: Verify RESEND_API_KEY in Edge Functions Secrets");
                    break;
                case 403:
                    statusCode = 403;
                    userMessage = "Access forbidden. Check your Resend API key permissions.";
                    break;
                case 422:
                    statusCode = 422;
                    userMessage = `Validation error: ${errorMessage}`;
                    console.error("💡 [Resend] Tip: Check email format and required fields");
                    break;
                case 429:
                    statusCode = 429;
                    userMessage = "Rate limit exceeded. Please try again later.";
                    console.error("💡 [Resend] Tip: You've hit Resend's rate limit");
                    break;
                default:
                    userMessage = `Resend API error: ${errorMessage}`;
            }

            return new Response(
                JSON.stringify({
                    success: false,
                    error: userMessage,
                    details: resendData,
                    statusCode: resendResponse.status
                }),
                {
                    status: statusCode,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Success
        console.log(`✅ [Resend] Email sent successfully!`);
        console.log(`📬 [Resend] Email ID: ${resendData.id}`);

        return new Response(
            JSON.stringify({
                success: true,
                id: resendData.id
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        // Catch any unexpected errors
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ [Function] Unexpected Error:", errorMessage);
        console.error("📚 [Function] Stack:", error instanceof Error ? error.stack : "N/A");

        return new Response(
            JSON.stringify({
                success: false,
                error: `Internal server error: ${errorMessage}`
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
