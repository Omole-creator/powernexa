import type { Metadata } from "next";
import Link from "next/link";
import { CUSTOMER_SYSTEMS_SQL, listSystems } from "@/lib/customer-systems";
import { checkupSchedule, todayLagos, workmanshipWarrantyEnds } from "@/lib/aftercare";
import { addDays, formatDate } from "@/lib/quote";
import { SystemForm } from "@/components/admin/systems/SystemForm";

export const metadata: Metadata = { title: "My System Pages", robots: { index: false } };

const ERRORS: Record<string, string> = {
  quote: "That quote link was incomplete, so no page was created.",
  save: "Could not create the page. Has the My System SQL below been run in Supabase?",
};

export default async function AdminSystemsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { systems, events, tableMissing } = await listSystems();
  const today = todayLagos();
  const soon = addDays(today, 30);

  const rows = systems.map((system) => {
    const schedule = checkupSchedule(
      system.installed_on,
      events.filter((e) => e.system_id === system.id)
    );
    return { system, next: schedule.find((c) => !c.doneOn) ?? null };
  });
  const due = rows
    .filter((r) => r.next && r.next.dueOn <= soon)
    .sort((a, b) => a.next!.dueOn.localeCompare(b.next!.dueOn));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">My System pages</h1>
        <p className="text-sm text-charcoal/55">
          One private page per installed customer: their system, warranty and check-up dates, load list, photos,
          service history and quote. Create one from a customer quote, or add it here.
        </p>
      </div>

      {error && ERRORS[error] ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{ERRORS[error]}</p>
      ) : null}

      {tableMissing ? (
        <div className="rounded-2xl border border-orange/40 bg-orange/5 p-5 text-sm text-navy">
          <p className="font-semibold">One-time setup needed</p>
          <p className="mt-1 text-charcoal/70">Paste this into the Supabase SQL editor and run it once.</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-navy p-4 text-xs text-white">{CUSTOMER_SYSTEMS_SQL}</pre>
        </div>
      ) : null}

      {due.length > 0 ? (
        <div className="rounded-2xl border-2 border-orange/30 bg-white p-5">
          <h2 className="font-display text-base font-bold text-navy">Free check-ups due in the next 30 days</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {due.map(({ system, next }) => (
              <li key={system.id} className="flex flex-wrap justify-between gap-2 py-2">
                <Link href={`/admin/systems/${system.id}`} className="font-medium text-navy hover:text-orange">
                  {system.customer_name}
                  {system.address ? <span className="font-normal text-charcoal/50"> · {system.address}</span> : null}
                </Link>
                <span className={next!.dueOn < today ? "font-semibold text-red-600" : "text-charcoal/70"}>
                  Check-up {next!.number} {next!.dueOn < today ? "overdue since" : "due"} {formatDate(next!.dueOn)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-charcoal/45">
            <tr className="border-b border-line">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">System</th>
              <th className="px-4 py-3">Installed</th>
              <th className="px-4 py-3">Next check-up</th>
              <th className="px-4 py-3">Workmanship warranty ends</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-charcoal/50">
                  No My System pages yet.
                </td>
              </tr>
            ) : (
              rows.map(({ system, next }) => (
                <tr key={system.id}>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/systems/${system.id}`} className="font-medium text-navy hover:text-orange">
                      {system.customer_name}
                    </Link>
                    {system.address ? <span className="block text-xs text-charcoal/50">{system.address}</span> : null}
                  </td>
                  <td className="px-4 py-2.5 text-charcoal/70">{system.system_summary}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/70">
                    {system.installed_on ? formatDate(system.installed_on) : <span className="text-orange">Not yet</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/70">
                    {next ? (
                      <>
                        {next.number}: {formatDate(next.dueOn)}
                        <span className={`block text-xs ${next.dueOn < today ? "font-semibold text-red-600" : "text-charcoal/50"}`}>
                          {countdown(next.dueOn, today)}
                        </span>
                      </>
                    ) : system.installed_on ? (
                      "Both done"
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-charcoal/70">
                    {system.installed_on ? formatDate(workmanshipWarrantyEnds(system.installed_on)) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!tableMissing ? (
        <details className="rounded-2xl border border-line bg-white p-5">
          <summary className="cursor-pointer font-display text-base font-bold text-navy">
            Add a customer without a quote
          </summary>
          <p className="mt-1 text-xs text-charcoal/55">For customers installed before quotes were made here.</p>
          <div className="mt-4">
            <SystemForm />
          </div>
        </details>
      ) : null}
    </div>
  );
}

function countdown(dueOn: string, today: string): string {
  const days = Math.round((Date.parse(`${dueOn}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  if (days < 0) return `${-days} days overdue`;
  if (days === 0) return "Due today";
  return `In ${days} day${days === 1 ? "" : "s"}`;
}
