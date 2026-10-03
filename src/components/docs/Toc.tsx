"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** "On this page" with a scroll-spy. The list itself is rendered on the server; the spy only adds aria-current. */
export default function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -65% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <ul className="space-y-1.5 border-l border-line">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            aria-current={active === i.id ? "location" : undefined}
            className={`-ml-px block border-l py-0.5 text-cap hover:text-foreground ${i.level === 3 ? "pl-6" : "pl-3"} ${
              active === i.id ? "border-foreground text-foreground" : "border-transparent text-muted"
            }`}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
