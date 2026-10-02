import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

/** Native <details>: keyboard and screen-reader accessible with no JavaScript. */
export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left font-medium text-text hover:bg-surface-2">
            <span>{item.q}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="fg-chevron mt-1 h-4 w-4 shrink-0 text-subtle"
            >
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="prose-fg px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
