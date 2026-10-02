import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

/** Native <details>: keyboard and screen-reader accessible without JavaScript. */
export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-b border-line">
      {items.map((item) => (
        <details key={item.q} className="border-t border-line">
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-left text-lead text-bone hover:text-white">
            <span>{item.q}</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="fg-chevron mt-1.5 h-4 w-4 shrink-0 text-muted">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </summary>
          <div className="prose-fg pb-6 text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
