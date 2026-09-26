// Dates behind each installed customer's promises: the free check-ups, the
// carry guarantee window and the workmanship warranty. Pure, shared by the
// admin and the customer's My System page.

import { PROMISE_TERMS } from "./promises";
import { addDays, addMonths } from "./quote";

export type SystemEventKind = "checkup" | "repair" | "visit" | "note";

export const EVENT_KINDS: { value: SystemEventKind; label: string }[] = [
  { value: "checkup", label: "Free check-up" },
  { value: "repair", label: "Repair" },
  { value: "visit", label: "Other visit" },
  { value: "note", label: "Note" },
];

export function eventKindLabel(kind: string): string {
  return EVENT_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export type Checkup = { number: number; dueOn: string; doneOn: string | null };

// Check-ups are matched to completed "checkup" events in date order: the
// first one logged counts as check-up 1, and so on.
export function checkupSchedule(installedOn: string | null, events: { kind: string; event_date: string }[]): Checkup[] {
  if (!installedOn) return [];
  const done = events
    .filter((e) => e.kind === "checkup")
    .map((e) => e.event_date)
    .sort();
  return PROMISE_TERMS.checkupMonths.map((months, index) => ({
    number: index + 1,
    dueOn: addMonths(installedOn, months),
    doneOn: done[index] ?? null,
  }));
}

export function carryGuaranteeEnds(installedOn: string): string {
  return addDays(installedOn, PROMISE_TERMS.carryGuaranteeDays);
}

export function workmanshipWarrantyEnds(installedOn: string): string {
  return addMonths(installedOn, PROMISE_TERMS.workmanshipYears * 12);
}

export function todayLagos(): string {
  // Lagos is UTC+1 all year.
  return new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10);
}
