import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dcmyocraqtvetekxxekg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CuGp0gz5wVGEqd39RZOnMg_Cmd7Jv0k';

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
