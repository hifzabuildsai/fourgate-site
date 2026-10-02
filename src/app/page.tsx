import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import CodeBlock from "@/components/CodeBlock";
import CtaBand from "@/components/CtaBand";
import FAQ, { type FaqItem } from "@/components/FAQ";
import FlowDiagram from "@/components/FlowDiagram";
import Section, { Container } from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";
import Terminal from "@/components/Terminal";
import { demo, demoCapture } from "@/content/demo";
import { pageMetadata } from "@/lib/metadata";
import { GITHUB_URL, PYPI_URL, VERSION } from "@/site.config";

export const metadata = pageMetadata({
  title: "Fourgate: did your agent's action actually happen?",
  description:
    "Independent outcome verification for consequential AI-agent actions. After an MCP tool reports success, Fourgate reads the system of record back and records PASS, FAIL or UNKNOWN. Open source, runs on your machine.",
  path: "/",
});

const outcomes = [
  {
    status: "PASS" as const,
    text: "An independent read-back confirmed the record exists with the contracted values. The tool's response passes through unchanged.",
  },
  {
    status: "CONFIRMED FAIL" as const,
    text: "The read-back proved the record is missing or different. In enforce mode the agent is told before it can report success.",
  },
  {
    status: "UNKNOWN" as const,
    text: "Fourgate could not confirm either way: a timeout, an auth error, an unreachable API. It is recorded as UNKNOWN and never counted as PASS.",
  },
];

const reasons = [
  {
    title: "Runs on your machine",
    text: "A laptop, a server or your CI. There is no Fourgate cloud service, account, database or telemetry.",
  },
  {
    title: "No code changes",
    text: "Wrap the MCP server's launch command with fourgate guard. Your agent and server code stay as they are; you add a short contract per protected tool.",
  },
  {
    title: "Any HTTP API read-back",
    text: "If the system of record exposes a GET endpoint for the written record, Fourgate can check it. Bearer token, custom header or Basic auth.",
  },
  {
    title: "Shadow first, byte-identical",
    text: "In shadow mode, the default, your agent receives exactly the same bytes it would without Fourgate. Verdicts are only recorded.",
  },
  {
    title: "UNKNOWN is never PASS",
    text: "Timeouts, auth errors and Fourgate's own faults are UNKNOWN and fail open. Nothing uncertain is reported as success.",
  },
  {
    title: "Open source",
    text: "MIT licensed. Read the code, install from PyPI, and verify release artifacts against the SHA-256 digests on GitHub.",
  },
];

const evidence = [
  { value: "4", text: "official vendor MCP servers tested, run locally against the vendors' live APIs using disposable test accounts or deliberately invalid credentials." },
  { value: "3 of 4", text: "surfaced API failures as successful tool results without MCP isError. Each reproduced at least twice and reported upstream." },
  { value: "Exercised", text: "hosted authoritative read-back: a real hosted write verified PASS by an independent HTTPS read-back, with FAIL and UNKNOWN controls behaving as specified." },
  { value: "Exercised", text: "real-agent shadow calls: a real agent client made 2 protected send calls through the runtime wrap in shadow mode against a hosted MCP server; both recorded PASS." },
  { value: "0", text: "naturally occurring read-back-proven silent-success incidents observed so far (a write reported done whose record is missing or wrong)." },
];

const faq: FaqItem[] = [
  {
    q: "Does Fourgate send my data anywhere?",
    a: (
      <p>
        Not to us. There is no Fourgate cloud, account, database or telemetry. The only new network traffic Fourgate
        adds is the verifier&apos;s GET request to the read-back endpoint you configure. Your MCP server keeps making its own
        API calls, as it does today.
      </p>
    ),
  },
  {
    q: "Does an LLM decide whether a call passed?",
    a: <p>No. The verdict comes from a deterministic read-back check against the system of record. No LLM makes the PASS/FAIL decision.</p>,
  },
  {
    q: "What happens if Fourgate itself fails?",
    a: (
      <p>
        An invalid contract is rejected at startup and the server is not launched. Any per-call problem (verifier timeout,
        network error, internal error) is recorded as UNKNOWN and fails open: the call goes through untouched.
      </p>
    ),
  },
  {
    q: "Will it change what my agent sees?",
    a: (
      <p>
        Not in shadow mode, the default: the agent receives exactly the same bytes. In enforce mode, which you switch on
        only for contracts you have approved, Fourgate adds one attributed verdict before the tool&apos;s original response
        on a confirmed FAIL. Nothing else changes.
      </p>
    ),
  },
  {
    q: "How much latency does it add?",
    a: (
      <p>
        Each check is capped at 2000 ms; anything slower is UNKNOWN. The HTTP verifier measured 1.2–1.6 s per call on a
        Windows laptop, and a first cold call exceeded its budget, so headroom is small on slow networks. Only protected
        calls are checked.
      </p>
    ),
  },
  {
    q: "Is it production-ready?",
    a: (
      <p>
        Not yet. Fourgate is early, pre-alpha. It covers local stdio MCP servers only, contracts are written by hand, and
        the field evidence above is small. That is why we start with a shadow-mode design partnership on a single workflow.
      </p>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <Container className="relative pb-16 pt-14 sm:pb-24 sm:pt-20">
          <p className="mb-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-muted">
            <span>Open source</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <span>Runs on your machine</span>
            <span aria-hidden="true" className="text-subtle">·</span>
            <a href={PYPI_URL} className="text-text underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
              v{VERSION} on PyPI<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl">
            Your agent said &lsquo;done.&rsquo; Fourgate checks whether it actually happened.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Independent outcome verification for consequential AI-agent actions.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-text">Run the demo</p>
              <CodeBlock code="pip install fourgate && fourgate demo" label="local · no API keys · no network" prompt />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/demo" variant="secondary">
                See it in the browser
              </ButtonLink>
              <ButtonLink href="/design-partner">Become a design partner</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Problem */}
      <Section
        id="problem"
        eyebrow="The problem"
        title="A tool saying “success” is not the same as the system changing."
        intro={
          <p>
            An agent that reads a tool result without <code className="font-mono text-text">isError</code> has no
            protocol-level signal that the call failed. Fourgate checks the outcome itself: after a protected tool reports
            success, it reads the system of record back and records one of three results.
          </p>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.status} className="rounded-xl border border-border bg-surface p-6">
              <StatusBadge status={o.status} />
              <p className="mt-4 text-sm leading-relaxed text-muted">{o.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          <span className="font-semibold text-text">No LLM decides.</span> The verdict is a deterministic read-back check.
          UNKNOWN is never shown as PASS.
        </p>
      </Section>

      {/* Terminal */}
      <Section
        id="demo"
        eyebrow="The demo, verbatim"
        title="Five real MCP sessions. One command."
        intro={
          <p>
            This is the exact output of <code className="font-mono text-text">{demoCapture.command}</code> from the released
            package. A simulated connector; a local file stands in for the system of record.
          </p>
        }
        className="border-t border-border"
      >
        <Terminal
          tabs={demo.scenes}
          title={`$ ${demoCapture.command}`}
          footer={
            <span>
              Captured from fourgate {demoCapture.version} on {demoCapture.date}.{" "}
              <Link href="/demo" className="text-accent underline-offset-2 hover:underline">
                Full output, sample report and how to run it yourself
              </Link>
            </span>
          }
        />
      </Section>

      {/* How it works */}
      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="A local guard, an independent read-back, a local record."
        intro={
          <p>
            fourgate guard sits on the local stdio path between your agent and your MCP server. When a protected tool reports
            success, it extracts only the contracted fields and a local verifier reads the record back with a separate,
            read-only credential.
          </p>
        }
        className="border-t border-border"
      >
        <FlowDiagram id="home-flow" />
      </Section>

      {/* Why */}
      <Section id="why" eyebrow="Why Fourgate" title="Built to be checked, not trusted." className="border-t border-border">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-text">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Field evidence */}
      <Section
        id="evidence"
        eyebrow="Field evidence · as of 2026-10-01"
        title="What we have tested, and what we have not seen yet."
        intro={
          <p>
            Operator-run tests against official vendor MCP servers. Vendors are not named. Small numbers, stated as they are.
          </p>
        }
        className="border-t border-border"
      >
        <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {evidence.map((e) => (
            <div key={e.text} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-6">
              <dt className="font-mono text-lg font-semibold text-text">{e.value}</dt>
              <dd className="text-sm leading-relaxed text-muted">{e.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
          The failures found so far are error-reporting bugs, which Fourgate reports as{" "}
          <code className="font-mono text-unknown">UNKNOWN / success_without_record_id</code> rather than PASS. One hosted
          integration does not establish production reliability, and two shadow calls are a smoke test, not production
          traffic.{" "}
          {GITHUB_URL && (
            <a href={`${GITHUB_URL}#field-evidence`} className="text-accent underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
              Read the full field record in the README<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </p>
      </Section>

      {/* Pricing teaser */}
      <Section id="pricing" eyebrow="Pricing" title="Free to run. Paid help to get it right." className="border-t border-border">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-semibold">Open Source</h3>
            <p className="mt-1 font-mono text-2xl font-semibold">Free</p>
            <p className="mt-3 text-sm text-muted">MIT licensed. All six commands. Community support on GitHub.</p>
          </div>
          <div className="rounded-xl border border-accent/50 bg-surface p-6">
            <h3 className="font-semibold">Founding Design Partner</h3>
            <p className="mt-1 font-mono text-2xl font-semibold">
              $199<span className="text-base font-normal text-muted">/month</span>
            </p>
            <p className="mt-3 text-sm text-muted">One workflow, founder-assisted setup, shadow-mode rollout, weekly review.</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-semibold">Enterprise</h3>
            <p className="mt-1 font-mono text-2xl font-semibold">Contact</p>
            <p className="mt-3 text-sm text-muted">More workflows or tools than the design-partner scope.</p>
          </div>
        </div>
        <div className="mt-6">
          <ButtonLink href="/pricing" variant="ghost">
            Compare plans →
          </ButtonLink>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Questions a careful buyer asks." className="border-t border-border">
        <div className="max-w-3xl">
          <FAQ items={faq} />
        </div>
      </Section>

      <CtaBand
        title="Check one workflow, in shadow mode, with us."
        text={<p>Pick 1–3 state-changing tools that matter. We write the contracts with you; your agent sees nothing different.</p>}
      >
        <ButtonLink href="/design-partner">Become a design partner</ButtonLink>
        <ButtonLink href="/demo" variant="secondary">
          Run the demo
        </ButtonLink>
      </CtaBand>
    </>
  );
}
