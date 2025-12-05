import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key not found in environment variables');
}

// Fallback safe initialization to prevent app crash if env vars are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            insert: async () => ({ error: { message: 'Supabase no configurado (Faltan variables de entorno)' } }),
            select: async () => ({ data: [], error: { message: 'Supabase no configurado' } })
        })
    } as any;
