"use client";

import { useActionState } from "react";
import { addTeammate, type SettingsState } from "@/actions/settings";

const initialState: SettingsState = {};

export function AddTeammateForm() {
  const [state, formAction, pending] = useActionState(addTeammate, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal/80">Name</label>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal/80">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal/80">Temporary password</label>
        <input
          name="password"
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
        className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
