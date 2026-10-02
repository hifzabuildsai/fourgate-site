"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Wordmark from "./Wordmark";
import { ExternalIcon } from "./ButtonLink";
import { GITHUB_URL, README_URL } from "@/site.config";

type Item = { href: string; label: string; description?: string; external?: boolean };

// "How it works" and "Blog" are intentionally not listed yet.
const productItems: Item[] = [
  { href: "/demo", label: "Demo", description: "The five real demo scenes, and how to run them" },
  { href: "/sample-report.html", label: "Sample report", description: "The summary page the demo produced, unchanged", external: true },
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
  const current = !item.external && pathname === item.href;
  if (item.external) {
    const newTab = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        className={className}
        onClick={onNavigate}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="inline-flex items-center gap-1.5">
          {item.label}
          {newTab && (
            <>
              <ExternalIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </>
          )}
        </span>
        {item.description && <span className="mt-0.5 block text-xs font-normal text-subtle">{item.description}</span>}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} aria-current={current ? "page" : undefined} onClick={onNavigate}>
      {item.label}
      {item.description && <span className="mt-0.5 block text-xs font-normal text-subtle">{item.description}</span>}
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

  function focusItem(index: number) {
    const links = wrap.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item] a");
    if (!links?.length) return;
    links[(index + links.length) % links.length].focus();
  }

  function onButtonKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  }

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const links = Array.from(wrap.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item] a") ?? []);
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === "ArrowUp") {
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
        onKeyDown={onButtonKey}
        className="inline-flex min-h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted hover:text-text"
      >
        Product
        <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${open ? "rotate-180" : ""}`}>
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div
        id="product-menu"
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-surface p-2 shadow-2xl"
      >
        <ul>
          {productItems.map((item) => (
            <li key={item.href} data-menu-item>
              <NavLink
                item={item}
                onNavigate={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-text focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Fourgate home" className="rounded-md">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <ProductMenu />
          {mainItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted hover:text-text aria-[current=page]:text-text"
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/design-partner"
            className="hidden min-h-10 items-center rounded-lg bg-text px-4 text-sm font-semibold text-bg hover:bg-white sm:inline-flex"
          >
            Become a design partner
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              {mobileOpen ? (
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden"
        onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <p className="px-3 pb-1 font-mono text-xs uppercase tracking-[0.14em] text-subtle">Product</p>
          <ul className="mb-3">
            {productItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  onNavigate={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-text hover:bg-surface"
                />
              </li>
            ))}
          </ul>
          <ul className="border-t border-border pt-3">
            {mainItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  onNavigate={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-text hover:bg-surface"
                />
              </li>
            ))}
          </ul>
          <Link
            href="/design-partner"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-text px-4 text-sm font-semibold text-bg"
          >
            Become a design partner
          </Link>
        </div>
      </div>
    </header>
  );
}
