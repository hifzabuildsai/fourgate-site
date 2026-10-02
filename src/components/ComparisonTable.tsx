import type { ReactNode } from "react";

export type Cell = boolean | string | ReactNode;
export type Row = { label: string; values: Cell[] };

function CellView({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="text-bone">Included</span>
    );
  if (value === false)
    return (
      <span className="text-muted">
        <span aria-hidden="true">–</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className="text-muted">{value}</span>;
}

/** A real table from md up; one stacked list per column on small screens (no sideways scroll). */
export default function ComparisonTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: Row[] }) {
  return (
    <>
      <table className="hidden w-full border-collapse text-left text-small md:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-bone/60">
            <th scope="col" className="w-[28%] py-3 pr-4 font-normal text-muted">
              <span className="sr-only">Feature</span>
            </th>
            {columns.map((c) => (
              <th key={c} scope="col" className="py-3 pr-4 font-medium text-bone">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line">
              <th scope="row" className="py-3.5 pr-4 font-normal text-bone">
                {r.label}
              </th>
              {r.values.map((v, i) => (
                <td key={i} className="py-3.5 pr-4 align-top">
                  <CellView value={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-10 md:hidden">
        {columns.map((c, ci) => (
          <section key={c} aria-label={c}>
            <h3 className="border-b border-bone/60 pb-2 font-medium text-bone">{c}</h3>
            <dl className="text-small">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 border-b border-line py-2.5">
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
