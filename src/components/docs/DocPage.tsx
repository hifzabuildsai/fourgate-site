import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import Toc, { type TocItem } from "./Toc";
import { docBySlug, docHref, docNeighbors, DOCS_TAG, pageSourceUrl, productSourceUrl } from "@/content/docs";
import { externalProps } from "@/lib/links";
import { slugify } from "@/lib/slug";

/** Headings (## and ###) read from the page's own MDX at build time, skipping fenced code. */
function readToc(slug: string): TocItem[] {
  const file = path.join(process.cwd(), "src/app/docs", slug, "page.mdx");
  const out: TocItem[] = [];
  let fenced = false;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (/^```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "");
    out.push({ id: slugify(text), text, level: m[1].length === 2 ? 2 : 3 });
  }
  return out;
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
      <path d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V10M9 2h5v5M14 2 7.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DocPage({ slug, children }: { slug: string; children: ReactNode }) {
  const doc = docBySlug(slug);
  const toc = readToc(slug);
  const { prev, next } = docNeighbors(slug);
  const sourceUrl = pageSourceUrl(slug);

  return (
    <div className="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-12">
      <article className="min-w-0 pb-16">
        <header>
          <p className="text-cap font-medium uppercase tracking-wide text-muted">{doc.group}</p>
          <h1 className="mt-2 font-display text-balance text-[2rem] leading-[1.1] sm:text-[2.5rem]">{doc.title}</h1>
          <p className="mt-4 max-w-[62ch] text-lead text-muted">{doc.description}</p>
          <p className="mt-4">
            <a href={sourceUrl} {...externalProps(sourceUrl)} className="link inline-flex items-center gap-1.5 text-small">
              View source on GitHub
              <ExternalIcon />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </header>

        {toc.length > 0 && (
          <details className="mt-8 rounded-[10px] border border-line xl:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center px-4 text-small text-muted hover:text-foreground">On this page</summary>
            <nav aria-label="On this page" className="border-t border-line p-4">
              <Toc items={toc} />
            </nav>
          </details>
        )}

        <div className="mt-2">{children}</div>

        <aside aria-labelledby="sources-title" className="mt-14 rounded-[10px] border border-line bg-surface p-5">
          <h2 id="sources-title" className="text-small font-medium text-foreground">
            Sources (product repository, tag {DOCS_TAG})
          </h2>
          <ul className="mt-2 space-y-1">
            {doc.sources.map((s) => {
              const url = productSourceUrl(s);
              return (
                <li key={`${s.file}${s.lines ?? ""}`} className="text-small">
                  <a href={url} {...externalProps(url)} className="link font-mono text-cap">
                    {s.file}
                    {s.lines ? `:${s.lines}` : ""}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-cap text-muted">
            Every product claim on this page is listed with its file and lines in the website repository&apos;s CLAIMS.md.
          </p>
        </aside>

        <nav aria-label="Previous and next pages" className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={docHref(prev.slug)} rel="prev" className="group rounded-[10px] border border-line p-4 hover:border-line-strong hover:bg-surface">
              <span className="text-cap text-muted">Previous</span>
              <span className="mt-0.5 block font-medium text-foreground">{prev.slug === "" ? "Overview" : prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={docHref(next.slug)} rel="next" className="group rounded-[10px] border border-line p-4 text-left hover:border-line-strong hover:bg-surface sm:text-right">
              <span className="text-cap text-muted">Next</span>
              <span className="mt-0.5 block font-medium text-foreground">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>

      {toc.length > 0 && (
        <nav aria-label="On this page" className="fg-scroll sticky top-20 hidden max-h-[calc(100dvh-6rem)] self-start overflow-y-auto xl:block">
          <p className="mb-2 text-cap font-medium uppercase tracking-wide text-muted">On this page</p>
          <Toc items={toc} />
        </nav>
      )}
    </div>
  );
}
