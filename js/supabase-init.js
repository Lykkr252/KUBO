// js/supabase-init.js
// ── Setup ──────────────────────────────────────────────────────────────────
// 1. Go to https://supabase.com and create a free project
// 2. Run schema.sql in: Supabase Dashboard → SQL Editor → Run
// 3. Copy your project URL and anon key from: Settings → API
// 4. Paste them below

const SUPABASE_URL     = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
