"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Wordmark from "./Wordmark";
import { externalProps, isExternal } from "@/lib/links";
import { GITHUB_URL, PRIMARY_CTA, README_URL, VERSION } from "@/site.config";

type Item = { href: string; label: string; description?: string; external?: boolean };

// "How it works" and "Blog" are intentionally not listed yet.
const productItems: Item[] = [
  { href: "/demo", label: "Demo", description: "Step through the five recorded scenes" },
  { href: "/sample-report.html", label: "Sample report", description: "The summary page the demo wrote, unchanged", external: true },
  { href: "/integrations", label: "Integrations", description: "What Fourgate connects to today" },
];

const mainItems: Item[] = [
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  ...(README_URL ? [{ href: README_URL, label: "Docs", external: true }] : []),
  ...(GITHUB_URL ? [{ href: GITHUB_URL, label: "GitHub", external: true }] : []),
];

function NavLink({ item, className, onNavigate }: { item: Item; className: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const body = (
    <>
      {item.label}
      {item.description && <span className="mt-0.5 block text-cap font-normal text-muted">{item.description}</span>}
    </>
  );
  if (item.external) {
    return (
      <a href={item.href} className={className} onClick={onNavigate} {...externalProps(item.href)}>
        {body}
        {isExternal(item.href) && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate}>
      {body}
    </Link>
  );
}

function ProductMenu() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const links = () => Array.from(wrap.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item] a") ?? []);
  const focusItem = (i: number) => {
    const l = links();
    if (l.length) l[(i + l.length) % l.length].focus();
  };

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const i = links().indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (open) {
        focusItem(i + 1);
      } else {
        setOpen(true);
        requestAnimationFrame(() => focusItem(0));
      }
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      focusItem(i - 1);
    }
  }

  return (
    <div
      ref={wrap}
      className="relative"
      onKeyDown={onMenuKey}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="product-menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-[6px] px-2.5 text-small text-muted hover:text-bone aria-expanded:text-bone"
      >
        Product
        <svg aria-hidden="true" viewBox="0 0 10 10" className={`h-2.5 w-2.5 ${open ? "rotate-180" : ""}`}>
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      <div
        id="product-menu"
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-2 w-72 rounded-[10px] border border-line bg-surface p-1.5"
      >
        <ul>
          {productItems.map((item) => (
            <li key={item.href} data-menu-item>
              <NavLink
                item={item}
                onNavigate={() => setOpen(false)}
                className="block rounded-[6px] px-3 py-2 text-small text-bone hover:bg-night focus-visible:bg-night"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Primary call to action: the scope-call booking page (new tab), or the design-partner page if unset. */
function CtaLink({ className, onClick }: { className: string; onClick?: () => void }) {
  if (isExternal(PRIMARY_CTA.href)) {
    return (
      <a href={PRIMARY_CTA.href} className={className} onClick={onClick} {...externalProps(PRIMARY_CTA.href)}>
        {PRIMARY_CTA.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={PRIMARY_CTA.href} className={className} onClick={onClick}>
      {PRIMARY_CTA.label}
    </Link>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-[6px] focus:bg-bone focus:px-3 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[76rem] items-center gap-4 px-4 sm:px-8">
        <Link href="/" aria-label="Fourgate home" className="mr-2 rounded-[4px]">
          <Wordmark />
        </Link>
        <span className="hidden rounded-[4px] border border-line px-1.5 py-px font-mono text-[0.6875rem] text-muted md:inline">
          v{VERSION}
        </span>

        <div className="ml-4 hidden items-center gap-0.5 lg:flex">
          <ProductMenu />
          {mainItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="inline-flex min-h-9 items-center rounded-[6px] px-2.5 text-small text-muted hover:text-bone aria-[current=page]:text-bone"
            />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <CtaLink className="hidden min-h-9 items-center rounded-[6px] bg-bone px-3.5 text-small font-medium text-night hover:bg-white sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-line text-bone lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
              {mobileOpen ? (
                <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-night lg:hidden"
        onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
      >
        <div className="mx-auto max-w-[76rem] px-4 py-3 sm:px-8">
          <p className="px-3 pb-1 pt-2 text-cap text-muted">Product</p>
          <ul>
            {productItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={() => setMobileOpen(false)} className="block rounded-[6px] px-3 py-2.5 text-bone hover:bg-surface" />
              </li>
            ))}
          </ul>
          <ul className="mt-2 border-t border-line pt-2">
            {mainItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={() => setMobileOpen(false)} className="block rounded-[6px] px-3 py-2.5 text-bone hover:bg-surface" />
              </li>
            ))}
          </ul>
          <CtaLink
            onClick={() => setMobileOpen(false)}
            className="my-3 flex min-h-11 items-center justify-center rounded-[6px] bg-bone px-4 text-small font-medium text-night"
          />
        </div>
      </div>
    </header>
  );
}
