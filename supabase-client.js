// Ozeil — Supabase client init.
// SUPABASE_URL and SUPABASE_ANON_KEY are safe to be public (protected by RLS
// policies in supabase/schema.sql, not by secrecy).
var SUPABASE_URL = "https://iqhhabnjehwuqjxirbsm.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaGhhYm5qZWh3dXFqeGlyYnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzY4NTEsImV4cCI6MjEwMzcxMjg1MX0.27ewluqpPKpRzLuMD0ILjxdcF2kC9R43QRg6RKmqVmQ";

var ozeilSupabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!ozeilSupabase) {
  console.warn("Ozeil: Supabase n'est pas encore configuré (voir supabase-client.js).");
}
