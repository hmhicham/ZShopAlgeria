
import { createClient } from '@supabase/supabase-js';

// Use Vite's official environment variable system for robust production access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pgsjphhplxadbobeowxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc2pwaGhwbHhhZGJvYmVvd3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY3NDQsImV4cCI6MjA4NTI3Mjc0NH0.9Wzt2Dh7VyjsybbfvA8poWpuVvAwAGOfrv3I4gxrreY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
