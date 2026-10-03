"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
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

function NavLink({
  item,
  className,
  onNavigate,
  onFocus,
  onMouseEnter,
  children,
}: {
  item: Item;
  className: string;
  onNavigate?: () => void;
  onFocus?: () => void;
  onMouseEnter?: () => void;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const body = (
    <>
      {children}
      <span className="relative">{item.label}</span>
      {item.description && <span className="relative mt-0.5 block text-cap font-normal text-muted">{item.description}</span>}
    </>
  );
  const shared = { className, onClick: onNavigate, onFocus, onMouseEnter };
  if (item.external) {
    return (
      <a href={item.href} {...shared} {...externalProps(item.href)}>
        {body}
        {isExternal(item.href) && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={item.href} {...shared} aria-current={pathname === item.href ? "page" : undefined}>
      {body}
    </Link>
  );
}

/** The pill that slides between hovered or focused nav items. */
function Highlight({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  if (!show) return null;
  return (
    <motion.span
      layoutId="nav-highlight"
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
      className="absolute inset-0 rounded-[8px] bg-raised"
      aria-hidden="true"
    />
  );
}

function ProductMenu({ hovered, setHovered }: { hovered: string | null; setHovered: (k: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const focusFirstOnOpen = useRef(false);
  const reduce = useReducedMotion();

  // Opening with ArrowDown moves focus to the first item once the menu has rendered.
  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    wrap.current?.querySelector<HTMLAnchorElement>("[data-menu-item] a")?.focus();
  }, [open]);

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
      if (open && links().length) {
        focusItem(i + 1);
      } else {
        focusFirstOnOpen.current = true;
        setOpen(true);
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
        onMouseEnter={() => setHovered("product")}
        onFocus={() => setHovered("product")}
        className="relative inline-flex min-h-9 items-center gap-1.5 rounded-[8px] px-3 text-small text-muted hover:text-foreground aria-expanded:text-foreground"
      >
        <Highlight show={hovered === "product"} />
        <span className="relative">Product</span>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className="relative h-2.5 w-2.5"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="product-menu"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.16, ease: "easeOut" } }}
            exit={reduce ? undefined : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1 } }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-[12px] border border-line bg-background p-1.5 shadow-[0_8px_30px_rgb(0_0_0/0.08)] dark:shadow-none"
          >
            <ul>
              {productItems.map((item) => (
                <li key={item.href} data-menu-item>
                  <NavLink
                    item={item}
                    onNavigate={() => setOpen(false)}
                    className="block rounded-[8px] px-3 py-2 text-small text-foreground hover:bg-raised focus-visible:bg-raised"
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  // Already home: scroll to the hero (instant under reduced motion) and drop any #hash.
  function onLogo(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-[6px] focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[76rem] items-center gap-4 px-4 sm:px-8">
        <Link href="/" aria-label="Fourgate home" onClick={onLogo} className="mr-1 rounded-[4px]">
          <Wordmark />
        </Link>
        <span className="hidden rounded-full border border-line px-2 py-px font-mono text-[0.6875rem] text-muted md:inline">
          v{VERSION}
        </span>

        <LayoutGroup id="nav">
          <div
            className="ml-3 hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null);
            }}
          >
            <ProductMenu hovered={hovered} setHovered={setHovered} />
            {mainItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                className="relative inline-flex min-h-9 items-center rounded-[8px] px-3 text-small text-muted hover:text-foreground aria-[current=page]:text-foreground"
              >
                <Highlight show={hovered === item.href} />
              </NavLink>
            ))}
          </div>
        </LayoutGroup>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <CtaLink className="fg-sweep hidden min-h-9 items-center rounded-[8px] bg-foreground px-3.5 text-small font-medium text-background hover:bg-foreground/85 sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-line text-foreground lg:hidden"
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

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : 0.22 } }}
            exit={reduce ? undefined : { height: 0, opacity: 0, transition: { duration: 0.16 } }}
            className="overflow-hidden border-t border-line bg-background lg:hidden"
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          >
            <div className="mx-auto max-h-[calc(100dvh-3.5rem)] max-w-[76rem] overflow-y-auto px-4 py-3 sm:px-8">
              <p className="px-3 pb-1 pt-2 text-cap text-muted">Product</p>
              <ul>
                {productItems.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} onNavigate={() => setMobileOpen(false)} className="block rounded-[8px] px-3 py-2.5 text-foreground hover:bg-raised" />
                  </li>
                ))}
              </ul>
              <ul className="mt-2 border-t border-line pt-2">
                {mainItems.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} onNavigate={() => setMobileOpen(false)} className="block rounded-[8px] px-3 py-2.5 text-foreground hover:bg-raised" />
                  </li>
                ))}
              </ul>
              <CtaLink
                onClick={() => setMobileOpen(false)}
                className="my-3 flex min-h-11 items-center justify-center rounded-[8px] bg-foreground px-4 text-small font-medium text-background"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
