import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    "https://wikplrekmljacpeckuvq.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpa3BscmVrbWxqYWNwZWNrdXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjgwNzMsImV4cCI6MjA1MDkwNDA3M30.pz8QoN05CX1WW81i_Q7sYG8Ippadq3CkxnJtBZwxz90"
)