import Link from "next/link";
import ContactCtas from "@/components/ContactCtas";
import CtaBand from "@/components/CtaBand";
import Section from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";
import { externalProps } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL, EMAIL_HREF, PILOT_MD_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Become a design partner",
  description:
    "A Fourgate pilot in five steps: scope call, contracts, test-account scan, CI job, fix report. The Fourgate Founding Pilot is $300 one-time, with founder-assisted setup.",
  path: "/design-partner",
});

const steps = [
  { title: "Scope", meta: "30-minute call", text: "Pick up to three state-changing write tools that matter, and the API that can confirm each write." },
  { title: "Contracts", meta: "written with you", text: "We write the outcome contracts for those tools with you; you review and approve them." },
  {
    title: "Test-account scan",
    meta: "fourgate scan",
    text: (
      <>
        Run against a test account you create to prove each contract: a healthy write is <StatusBadge status="PASS" size="sm" />,
        a deliberate mismatch is <StatusBadge status="FAIL" size="sm" />.
      </>
    ),
  },
  { title: "CI job", meta: "pull request you merge", text: "We add the checks to your CI through a pull request you review and merge. They run against your test account." },
  { title: "Fix report", meta: "review call at day 30", text: "We send a fix report with evidence for anything that says success without doing it, and review it with you on a call at day 30." },
];

const youGet = [
  "Founder-assisted setup",
  "Outcome contracts for up to three write tools, reviewed with you",
  "A CI job added through a pull request you merge",
  "Fix report with evidence: PASS / FAIL / UNKNOWN",
  "A review call at day 30",
  "Fourgate Founding Pilot: $300 one-time, invoiced after the scope call. Ongoing support after the pilot is optional, by agreement.",
];

const requirements = [
  "MCP servers launched as local stdio processes. Remote (HTTP) MCP servers are not supported yet.",
  "Read-back is an HTTPS GET to an API that can return the written record, authenticated with a Bearer token, a custom header (e.g. X-Api-Key), Basic auth, or no auth.",
  "Each check is capped at 2000 ms. On a Windows laptop the HTTP verifier measured 1.2–1.6 s per call, so add this latency to protected calls.",
  "Contracts are written by hand and reviewed by a human.",
  "Python 3.10+. Tested on Windows and Linux.",
];

function Ctas() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ContactCtas />
    </div>
  );
}

export default function DesignPartnerPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        layout="stack"
        rule={false}
        title="Prove your agent's writes land, on one workflow, with us."
        intro={
          <p>
            A pilot is founder-assisted: we write outcome checks for up to three of your state-changing write tools, add them to
            your CI against a test account you create, and send a fix report with evidence. Everything runs on your machines.
          </p>
        }
      >
        <Ctas />
        {CONTACT_EMAIL && (
          <p className="mt-4 text-small text-muted">
            Prefer email? Write to{" "}
            <a href={EMAIL_HREF} className="link">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        )}
      </Section>

      <Section id="process" layout="stack" title="Five steps, from scope call to review.">
        <ol className="grid gap-0 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-line py-5 md:border-l md:border-t-0 md:py-0 md:pl-5 md:pr-3 md:first:border-l-0 md:first:pl-0">
              <span className="font-mono text-cap text-muted">{i + 1}</span>
              <h3 className="mt-2 font-medium text-foreground">{s.title}</h3>
              <p className="font-mono text-cap text-muted">{s.meta}</p>
              <p className="mt-3 text-small text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="details" layout="stack">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-h3">What you get</h2>
            <ul className="mt-6">
              {youGet.map((y) => (
                <li key={y} className="border-t border-line py-3 text-foreground">
                  {y}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-muted">A short evaluation on a staging environment or a disposable account can be free.</p>
          </div>
          <div>
            <h2 className="font-display text-h3">Requirements and limits</h2>
            <ul className="mt-6">
              {requirements.map((r) => (
                <li key={r} className="border-t border-line py-3 text-small text-muted">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="prose-fg mt-12 border-t border-line pt-6 text-muted">
          <p>
            <span className="text-foreground">Where your data goes during a pilot.</span> Nowhere near us unless you choose. There is no
            Fourgate cloud, account, database or telemetry, and Fourgate never stores your credentials. The summary page is built
            to be shareable, and sharing it is your decision. Full detail: <a href={PILOT_MD_URL} {...externalProps(PILOT_MD_URL)}>
              PILOT.md
            </a> and the{" "}
            <Link href="/security">security page</Link>.
          </p>
        </div>
      </Section>

      <CtaBand title="Ready when you are." text={<p>Bring one workflow and the API that can confirm its writes.</p>}>
        <Ctas />
      </CtaBand>
    </>
  );
}
