// src/utils/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://aksivmmdbqudlmhaeftb.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrc2l2bW1kYnF1ZGxtaGFlZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MjExMzksImV4cCI6MjA0MzE5NzEzOX0.TYsu--T-aYK-efzG6xb7K-yTQgYBZXMDnsRI_Nhs7hw';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
