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
    "A Fourgate pilot in five steps: scope call, contracts, test-account scan, shadow run, review. $199/month for one workflow with founder-assisted setup.",
  path: "/design-partner",
});

const steps = [
  { title: "Scope", meta: "30-minute call", text: "Pick 1–3 state-changing tools that matter, and the API that can confirm each write." },
  { title: "Contracts", meta: "written with you", text: "We write the outcome contracts with you; you review and approve them." },
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
  { title: "Review", meta: "fourgate summary", text: "fourgate summary turns outcomes.jsonl into one local page. You choose whether to share it with us." },
];

const youGet = [
  "One workflow, up to three consequential state-changing tools",
  "Founder-assisted setup",
  "Contract creation and review",
  "Shadow-mode rollout",
  "PASS / FAIL / UNKNOWN reports",
  "Direct support and a weekly review",
  "$199 a month, invoiced after the scope call, cancel anytime",
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
            A pilot is founder-assisted and starts in shadow mode, so your agent sees nothing different while we prove the
            contracts. Everything runs on your machines.
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
