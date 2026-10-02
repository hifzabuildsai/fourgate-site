import Link from "next/link";
import Section from "@/components/Section";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL, ISSUES_URL, GITHUB_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "This website sets no cookies and uses no analytics.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section id="top" as="h1" eyebrow="Privacy" title="This website sets no cookies and uses no analytics.">
      <div className="prose-fg max-w-2xl space-y-4 text-muted">
        <p>
          This is a static website. It has no forms that submit anywhere, no tracking scripts, no third-party fonts or
          scripts loaded at runtime, and no backend of its own. Your browser fetches the pages and nothing else is recorded
          by us.
        </p>
        <p>
          The hosting provider that serves these files may keep standard server logs (such as IP address and requested URL)
          to operate and secure the service. We do not use them for analytics.
        </p>
        <p>
          Links to GitHub, PyPI and other sites take you to services with their own privacy policies.
        </p>
        <p>
          The Fourgate software itself is separate from this website. It runs on your machines and sends no telemetry; see
          the <Link href="/security">security page</Link>.
        </p>
        {CONTACT_EMAIL ? (
          <p>
            Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        ) : (
          GITHUB_URL && (
            <p>
              Questions: open an issue on <a href={ISSUES_URL}>GitHub</a>.
            </p>
          )
        )}
      </div>
    </Section>
  );
}
