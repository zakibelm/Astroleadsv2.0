
import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseKey } from './apiKeys';

const supabaseUrl = getSupabaseUrl();
const supabaseKey = getSupabaseKey();

export const supabase = createClient(supabaseUrl, supabaseKey);
