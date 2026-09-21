"use client";

import { useActionState, useState, type SVGProps } from "react";
import { login, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M1.5 10s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M2.5 2.5l15 15M8.3 8.4a2.5 2.5 0 0 0 3.4 3.4M6.2 6.3C3.7 7.6 1.5 10 1.5 10s3 6 8.5 6c1.5 0 2.8-.4 3.9-1M15.4 13.5C17 12.1 18.5 10 18.5 10s-3-6-8.5-6c-.7 0-1.4.1-2 .3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-line px-4 py-2.5 pr-11 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-charcoal/40 hover:text-navy"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
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
