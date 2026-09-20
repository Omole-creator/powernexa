"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-charcoal/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      {state?.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-orange px-6 py-3 font-semibold text-white transition hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
