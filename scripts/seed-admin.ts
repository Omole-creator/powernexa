// One-time setup script: creates (or updates) the admin login in Supabase
// from ADMIN_EMAIL / ADMIN_PASSWORD in your environment.
//
// Run with: node --env-file=.env.local scripts/seed-admin.ts

import { createClient } from "@supabase/supabase-js";
import { scryptSync, randomBytes } from "node:crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your environment.");
  }
  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in your environment.");
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  const passwordHash = hashPassword(password);

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash })
      .eq("id", existing.id);
    if (error) throw error;
    console.log(`Updated password for existing admin: ${email}`);
  } else {
    const { error } = await supabase.from("admin_users").insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: "PowerNexa Admin",
    });
    if (error) throw error;
    console.log(`Created admin account: ${email}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
