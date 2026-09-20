"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { requiredString } from "@/lib/validation";

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = requiredString(formData.get("email"), 200)?.toLowerCase();
  const password = requiredString(formData.get("password"), 200);

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const { data: user } = await supabase
    .from("admin_users")
    .select("id, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Incorrect email or password." };
  }

  const token = createSessionToken({ userId: user.id, email: user.email, issuedAt: Date.now() });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  await logAudit(user.email, "login");
  redirect("/admin");
}

export async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
