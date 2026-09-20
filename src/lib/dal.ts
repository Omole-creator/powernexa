import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./auth";

export type AdminUser = {
  id: number;
  email: string;
  name: string;
};

export const verifySession = cache(async (): Promise<AdminUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, name")
    .eq("id", payload.userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
});

export async function requireAdmin(): Promise<AdminUser> {
  const user = await verifySession();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
