
import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseKey } from './apiKeys';

// Fallback to dummy values to prevent app crash if keys aren't set yet
const supabaseUrl = getSupabaseUrl() || 'https://placeholder.supabase.co';
const supabaseKey = getSupabaseKey() || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
