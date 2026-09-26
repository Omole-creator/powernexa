"use client";

import { useState } from "react";

export type RowColumn = {
  key: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
  wide?: boolean;
};

export type Row = Record<string, string>;

const cellClass =
  "w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

// A small editable table (appliances on a load list, equipment with serial
// numbers). Values are kept as strings while typing.
export function RowsEditor({
  columns,
  rows,
  onChange,
  addLabel = "Add row",
}: {
  columns: RowColumn[];
  rows: Row[];
  onChange: (rows: Row[]) => void;
  addLabel?: string;
}) {
  const update = (index: number, key: string, value: string) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const template = `${columns.map((c) => (c.wide ? "minmax(0,2fr)" : "minmax(0,1fr)")).join(" ")} 2rem`;

  return (
    <div className="space-y-2">
      {rows.length > 0 ? (
        <div className="hidden gap-2 text-[11px] font-semibold uppercase tracking-wide text-charcoal/45 sm:grid" style={{ gridTemplateColumns: template }}>
          {columns.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
          <span />
        </div>
      ) : null}
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-2 gap-2 sm:[grid-template-columns:var(--cols)]" style={{ "--cols": template } as React.CSSProperties}>
          {columns.map((c) => (
            <input
              key={c.key}
              aria-label={c.label}
              type={c.type ?? "text"}
              inputMode={c.type === "number" ? "decimal" : undefined}
              min={c.type === "number" ? 0 : undefined}
              step={c.type === "number" ? "any" : undefined}
              placeholder={c.placeholder ?? c.label}
              value={row[c.key] ?? ""}
              onChange={(e) => update(index, c.key, e.target.value)}
              className={`${cellClass} ${c.wide ? "col-span-2 sm:col-span-1" : ""}`}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            aria-label="Remove row"
            className="rounded-lg text-lg leading-none text-charcoal/40 hover:bg-red-50 hover:text-red-600"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, {}])}
        className="rounded-full border border-dashed border-navy/30 px-4 py-1.5 text-xs font-semibold text-navy hover:border-orange hover:text-orange"
      >
        + {addLabel}
      </button>
    </div>
  );
}

// RowsEditor inside a plain form: the rows go up as JSON in a hidden input.
export function RowsField({
  name,
  columns,
  initialRows,
  addLabel,
}: {
  name: string;
  columns: RowColumn[];
  initialRows: Row[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  return (
    <>
      <RowsEditor columns={columns} rows={rows} onChange={setRows} addLabel={addLabel} />
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
    </>
  );
}

export const LOAD_COLUMNS: RowColumn[] = [
  { key: "appliance", label: "Appliance", placeholder: "e.g. Fridge", wide: true },
  { key: "quantity", label: "Qty", type: "number" },
  { key: "watts", label: "Watts each", type: "number" },
  { key: "hours", label: "Hours on battery", type: "number" },
];

export function toRows<T extends object>(items: T[]): Row[] {
  return items.map((item) =>
    Object.fromEntries(
      Object.entries(item)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    )
  );
}
