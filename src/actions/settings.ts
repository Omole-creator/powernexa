"use server";

import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/dal";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { requiredString } from "@/lib/validation";

export type SettingsState = {
  error?: string;
  success?: string;
};

export async function changePassword(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const admin = await requireAdmin();
  const currentPassword = requiredString(formData.get("currentPassword"), 200);
  const newPassword = requiredString(formData.get("newPassword"), 200);

  if (!currentPassword || !newPassword) {
    return { error: "Please fill in both password fields." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  const { data: row } = await supabase
    .from("admin_users")
    .select("password_hash")
    .eq("id", admin.id)
    .maybeSingle();

  if (!row || !verifyPassword(currentPassword, row.password_hash)) {
    return { error: "Current password is incorrect." };
  }

  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash: hashPassword(newPassword) })
    .eq("id", admin.id);
  if (error) return { error: "Could not update password. Please try again." };

  await logAudit(admin.email, "change_password");

  return { success: "Password updated." };
}

export async function addTeammate(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const admin = await requireAdmin();
  const email = requiredString(formData.get("email"), 200)?.toLowerCase();
  const name = requiredString(formData.get("name"), 100) ?? "PowerNexa Team";
  const password = requiredString(formData.get("password"), 200);

  if (!email || !password) {
    return { error: "Please fill in email and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { data: existing } = await supabase.from("admin_users").select("id").eq("email", email).maybeSingle();
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const { error } = await supabase.from("admin_users").insert({
    email,
    password_hash: hashPassword(password),
    name,
  });
  if (error) return { error: "Could not create the account. Please try again." };

  await logAudit(admin.email, "add_teammate", `Added teammate account: ${email}`);

  return { success: `Account created for ${email}.` };
}
