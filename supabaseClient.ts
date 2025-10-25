import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite env vars.
// Local development: create a `.env.local` with the variables below (this file should be gitignored).
// Example (.env.example) is included in the repo and contains placeholder names only.
const metaEnv = (import.meta as any).env as Record<string, unknown>;
const supabaseUrl = (metaEnv.VITE_SUPABASE_URL ?? '') as string;
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY ?? '') as string;

const arePlaceholders = !supabaseUrl || !supabaseAnonKey ||
    supabaseUrl === 'https://xyzabc.supabase.co' ||
    supabaseAnonKey === 'REPLACE_ME_ANON_KEY';

if (arePlaceholders) {
    // eslint-disable-next-line no-console
    console.warn('Supabase credentials appear to be missing or are placeholders.\n' +
        'Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env.local for local development\n' +
        'and in your hosting provider environment variables for production.');
}

let supabaseInstance: any;

if (!arePlaceholders) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Provide a safe stub that matches the minimal supabase client API used by the app.
    // This prevents createClient from throwing when env vars are missing and allows
    // the app to render its built-in error UI when requests fail.
    const errorResult = async () => ({ data: null, error: new Error('Missing Supabase credentials') });

    const fromStub = () => ({
        select: async () => ({ data: null, error: new Error('Missing Supabase credentials') }),
        insert: async () => ({ data: null, error: new Error('Missing Supabase credentials') }),
        eq: () => ({ select: async () => ({ data: null, error: new Error('Missing Supabase credentials') }), single: async () => ({ data: null, error: new Error('Missing Supabase credentials') }) }),
        single: async () => ({ data: null, error: new Error('Missing Supabase credentials') }),
        order: () => ({ select: async () => ({ data: null, error: new Error('Missing Supabase credentials') }) })
    });

    supabaseInstance = {
        from: fromStub,
        auth: {
            // onAuthStateChange should return an object with a subscription.unsubscribe method
            onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signOut: async () => ({ error: new Error('Missing Supabase credentials') })
        }
    };
}

export const supabase = supabaseInstance;

export const areCredentialsPlaceholders = () => arePlaceholders;