import type { Metadata } from "next";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { AddTeammateForm } from "./AddTeammateForm";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default function SettingsPage() {
  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Settings</h1>
        <p className="text-sm text-charcoal/55">Manage your login and add a second account for a business partner.</p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Change your password</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Add a teammate or partner</h2>
        <p className="mt-1 text-sm text-charcoal/55">
          Give your business partner their own login so you both see the exact same leads and
          analytics, with a shared audit trail of who did what.
        </p>
        <div className="mt-4">
          <AddTeammateForm />
        </div>
      </div>
    </div>
  );
}
