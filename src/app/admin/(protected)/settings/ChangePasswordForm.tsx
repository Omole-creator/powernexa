"use client";

import { useActionState } from "react";
import { changePassword, type SettingsState } from "@/actions/settings";

const initialState: SettingsState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal/80">Current password</label>
        <input
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal/80">New password</label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm font-medium text-green-600">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-ink disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update password"}
      </button>
    </form>
  );
}
