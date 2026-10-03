"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { docHref, docs, groups } from "@/content/docs";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-6">
      {groups.map((g) => (
        <li key={g}>
          <p className="px-3 text-cap font-medium uppercase tracking-wide text-muted">{g}</p>
          <ul className="mt-1.5">
            {docs
              .filter((d) => d.group === g)
              .map((d) => {
                const href = docHref(d.slug);
                const current = pathname === href;
                return (
                  <li key={d.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={current ? "page" : undefined}
                      className={`block rounded-[8px] px-3 py-1.5 text-small hover:bg-raised hover:text-foreground ${
                        current ? "bg-raised font-medium text-foreground" : "text-muted"
                      }`}
                    >
                      {d.slug === "" ? "Overview" : d.title}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** Left sidebar on wide screens; a disclosure above the page below `lg`. */
export default function DocsSidebar() {
  // The list is open only for the page it was opened on, so it closes by itself after navigating.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openFor === pathname;

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-nav-mobile"
          onClick={() => setOpenFor(open ? null : pathname)}
          className="flex min-h-11 w-full items-center justify-between rounded-[10px] border border-line px-4 text-small text-foreground"
        >
          <span>Documentation menu</span>
          <svg aria-hidden="true" viewBox="0 0 10 10" className={`h-2.5 w-2.5 ${open ? "rotate-180" : ""}`}>
            <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
        {open && (
          <nav id="docs-nav-mobile" aria-label="Documentation" className="mt-2 rounded-[10px] border border-line p-3">
            <NavList onNavigate={() => setOpenFor(null)} />
          </nav>
        )}
      </div>
      <nav aria-label="Documentation" className="fg-scroll sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2 lg:block">
        <NavList />
      </nav>
    </>
  );
}
