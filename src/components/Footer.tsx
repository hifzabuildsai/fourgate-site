import Link from "next/link";
import Wordmark from "./Wordmark";
import { externalProps, isExternal } from "@/lib/links";
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
  const cls = "text-small text-muted hover:text-foreground break-all";
  if (href.startsWith("/") && !href.endsWith(".html")) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...externalProps(href)}>
      {label}
      {isExternal(href) && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[76rem] gap-10 px-4 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-4 max-w-sm text-small text-muted">
            Independent outcome verification for consequential AI-agent actions. Open source under the MIT License. Runs on
            your machine.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-2 md:last:col-span-3">
            <h2 className="mb-3 text-small font-medium text-foreground">{col.title}</h2>
            <ul className="space-y-2">
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
      <div className="border-t border-line">
        <p className="mx-auto max-w-[76rem] px-4 py-5 text-cap text-muted sm:px-8">
          This website sets no cookies and runs no analytics.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
