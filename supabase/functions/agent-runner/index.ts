
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { agentId, taskType, input } = await req.json();

        // Initialize Supabase Client
        const supabaseClient = createClient(
            // Supabase API injected automatically in Edge Runtime
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 1. Fetch Agent Config
        const { data: agent, error: agentError } = await supabaseClient
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agentError || !agent) throw new Error('Agent not found');

        // 2. Set Agent to Working
        await supabaseClient
            .from('agents')
            .update({ status: 'working', current_task: taskType })
            .eq('id', agentId);

        // 3. Prepare AI Request
        const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

        let aiResponseText = "";

        // Mocking AI call for now to ensure architecture works
        // In production, fetch specific provider based on agent.model
        if (openRouterKey) {
            // Real call to LLM would go here
            // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", ...)
            aiResponseText = `Results for ${taskType}: Analysis completed successfully based on system prompt: ${agent.system_prompt?.substring(0, 20)}...`;
        } else {
            aiResponseText = "Simulation: AI Key missing, but workflow validated.";
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Create Task Record
        const { data: task, error: taskError } = await supabaseClient
            .from('tasks')
            .insert({
                agent_id: agentId,
                type: taskType,
                status: 'completed',
                input: input,
                output: { result: aiResponseText },
                completed_at: new Date().toISOString()
            })
            .select()
            .single();

        // 5. Reset Agent Status
        await supabaseClient
            .from('agents')
            .update({ status: 'active', current_task: 'En attente...' })
            .eq('id', agentId);

        return new Response(
            JSON.stringify({ success: true, task }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
