import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import Callout from "@/components/Callout";
import CtaBand from "@/components/CtaBand";
import Section from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";
import { pageMetadata } from "@/lib/metadata";
import { BOOKING_URL, CONTACT_EMAIL, GITHUB_URL, ISSUES_URL, PAYMENT_URL, PILOT_MD_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Become a design partner",
  description:
    "A Fourgate pilot in five steps: scope call, contracts, test-account scan, shadow run, review. $199/month for one workflow with founder-assisted setup.",
  path: "/design-partner",
});

const steps = [
  {
    title: "Scope",
    meta: "30-minute call",
    text: "Pick 1–3 state-changing tools that matter, and the API that can confirm each write.",
  },
  {
    title: "Contracts",
    meta: "written with you",
    text: "We write the outcome contracts with you; you review and approve them.",
  },
  {
    title: "Test-account scan",
    meta: "fourgate scan",
    text: (
      <>
        Run against a disposable account to prove each contract: a healthy write is <StatusBadge status="PASS" size="sm" />, a
        deliberate mismatch is <StatusBadge status="FAIL" size="sm" />.
      </>
    ),
  },
  {
    title: "Shadow run",
    meta: "fourgate doctor, then guard",
    text: "Check the setup with fourgate doctor using the same arguments, then wrap the server for your real agent traffic in shadow mode. Your agent receives exactly the same bytes.",
  },
  {
    title: "Review",
    meta: "fourgate summary",
    text: "fourgate summary turns outcomes.jsonl into one local page. You choose whether to share it with us.",
  },
];

const youGet = [
  "One workflow, up to three consequential state-changing tools",
  "Founder-assisted setup",
  "Contract creation and review",
  "Shadow-mode rollout",
  "PASS / FAIL / UNKNOWN reports",
  "Direct support and a weekly review",
  "$199/month, cancel anytime",
];

const requirements = [
  "MCP servers launched as local stdio processes. Remote (HTTP) MCP servers are not supported yet.",
  "Read-back is an HTTPS GET to an API that can return the written record, authenticated with a Bearer token, a custom header (e.g. X-Api-Key), Basic auth, or no auth.",
  "Each check is capped at 2000 ms. On a Windows laptop the HTTP verifier measured 1.2–1.6 s per call, so add this latency to protected calls.",
  "Contracts are written by hand and reviewed by a human.",
  "Python 3.10+. Tested on Windows and Linux.",
];

function Ctas() {
  const hasDirect = Boolean(BOOKING_URL || PAYMENT_URL || CONTACT_EMAIL);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ButtonLink href={BOOKING_URL}>Book a 30-minute scope call</ButtonLink>
      <ButtonLink href={PAYMENT_URL} variant={BOOKING_URL ? "secondary" : "primary"}>
        Start the $199/month plan
      </ButtonLink>
      <ButtonLink href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=Fourgate%20design%20partner` : ""} variant="secondary">
        Email {CONTACT_EMAIL}
      </ButtonLink>
      {!hasDirect && GITHUB_URL && (
        <ButtonLink href={ISSUES_URL}>Reach the maintainer on GitHub</ButtonLink>
      )}
    </div>
  );
}

export default function DesignPartnerPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        eyebrow="Founding Design Partner"
        title="Prove your agent's writes land, on one workflow, with us."
        intro={
          <p>
            A pilot is founder-assisted and starts in shadow mode, so your agent sees nothing different while we prove the
            contracts. Everything runs on your machines.
          </p>
        }
      >
        <Ctas />
      </Section>

      <Section id="process" eyebrow="The pilot" title="Five steps, from scope call to review." className="border-t border-border">
        <ol className="grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-border bg-surface p-5">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-2 font-semibold text-text">{s.title}</h3>
              <p className="font-mono text-xs text-subtle">{s.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="details" className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
            <ul className="mt-6 space-y-3">
              {youGet.map((y) => (
                <li key={y} className="flex gap-3 text-sm text-muted">
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-accent">
                    <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {y}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">A short evaluation on a staging environment or a disposable account can be free.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Requirements and limits</h2>
            <ul className="mt-6 space-y-3">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-subtle" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <Callout tone="honest" title="Where your data goes during a pilot">
            <p>
              Nowhere near us unless you choose. There is no Fourgate cloud, account, database or telemetry, and Fourgate never
              stores your credentials. The summary page is built to be shareable, and sharing it is your decision. Full detail:{" "}
              <a href={PILOT_MD_URL} target="_blank" rel="noopener noreferrer">
                PILOT.md<span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              and the <Link href="/security">security page</Link>.
            </p>
          </Callout>
        </div>
      </Section>

      <CtaBand title="Ready when you are." text={<p>Bring one workflow and the API that can confirm its writes.</p>}>
        <Ctas />
      </CtaBand>
    </>
  );
}
