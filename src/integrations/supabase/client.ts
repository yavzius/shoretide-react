// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bnxxzhsmkzndgwqvicpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueHh6aHNta3puZGd3cXZpY3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMzgyMTYsImV4cCI6MjA1MjkxNDIxNn0.rVlP4zZ_nEcwJ8IbRtNPS53-3IF2TPAhUImEbYYec0M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);