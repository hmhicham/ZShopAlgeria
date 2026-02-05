
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Note: In a real environment, these would be in your .env file.
// Assuming the environment provides these variables.
const supabaseUrl = (window as any).env?.SUPABASE_URL || 'https://pgsjphhplxadbobeowxk.supabase.co';
const supabaseAnonKey = (window as any).env?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc2pwaGhwbHhhZGJvYmVvd3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY3NDQsImV4cCI6MjA4NTI3Mjc0NH0.9Wzt2Dh7VyjsybbfvA8poWpuVvAwAGOfrv3I4gxrreY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
