import type { ReactNode } from "react";

export type Cell = boolean | string | ReactNode;
export type Row = { label: string; values: Cell[] };

function CellView({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1.5 text-text">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-accent">
          <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Included</span>
      </span>
    );
  if (value === false)
    return (
      <span className="text-subtle">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className="text-muted">{value}</span>;
}

/**
 * Feature comparison. A real table from md up; stacked cards on small screens
 * so nothing scrolls sideways at 375px.
 */
export default function ComparisonTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: Row[];
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface">
            <tr>
              <th scope="col" className="w-1/4 px-5 py-4 font-medium text-subtle">
                <span className="sr-only">Feature</span>
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" className="px-5 py-4 font-semibold text-text">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <th scope="row" className="px-5 py-3.5 font-medium text-text">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className="px-5 py-3.5 align-top">
                    <CellView value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {columns.map((c, ci) => (
          <section key={c} className="rounded-xl border border-border bg-surface p-4" aria-label={c}>
            <h3 className="mb-3 font-semibold text-text">{c}</h3>
            <dl className="divide-y divide-border text-sm">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">{r.label}</dt>
                  <dd className="text-right">
                    <CellView value={r.values[ci]} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
