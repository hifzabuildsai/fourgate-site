import Link from "next/link";
import Wordmark from "./Wordmark";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  PILOT_MD_URL,
  PYPI_URL,
  RELEASES_URL,
  SECURITY_MD_URL,
  X_URL,
} from "@/site.config";

type FooterLink = { href: string; label: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/demo", label: "Demo" },
      { href: "/sample-report.html", label: "Sample report" },
      { href: "/integrations", label: "Integrations" },
      { href: "/security", label: "Security" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: GITHUB_URL, label: "GitHub" },
      { href: PYPI_URL, label: "PyPI" },
      { href: GITHUB_URL ? RELEASES_URL : "", label: "Releases" },
      { href: GITHUB_URL ? SECURITY_MD_URL : "", label: "SECURITY.md" },
      { href: GITHUB_URL ? PILOT_MD_URL : "", label: "PILOT.md" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/design-partner", label: "Design partner" },
      { href: "/privacy", label: "Privacy" },
      { href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "", label: CONTACT_EMAIL },
      { href: LINKEDIN_URL, label: "LinkedIn" },
      { href: X_URL, label: "X" },
    ],
  },
];

function FooterAnchor({ href, label }: FooterLink) {
  const cls = "text-sm text-muted hover:text-text break-all";
  if (href.startsWith("/") && !href.endsWith(".html")) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  const newTab = href.startsWith("http");
  return (
    <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Independent outcome verification for consequential AI-agent actions. Open source, MIT licensed, runs on
            your machine.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-subtle">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links
                .filter((l) => l.href && l.label)
                .map((l) => (
                  <li key={l.label}>
                    <FooterAnchor {...l} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-subtle sm:px-6">
          This website sets no cookies and runs no analytics.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-text">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
