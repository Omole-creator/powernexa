import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set both in .env.local (see .env.example)."
  );
}

// This client uses the SERVICE ROLE key and must never be imported into a
// Client Component or exposed to the browser. Every read and write in this
// app goes through this trusted server-side client, which is why Supabase's
// Row Level Security policies are left as deny-all: the browser never talks
// to Supabase directly.
export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
