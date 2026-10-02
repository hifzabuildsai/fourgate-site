import ButtonLink from "@/components/ButtonLink";
import CodeBlock from "@/components/CodeBlock";
import ContactCtas from "@/components/ContactCtas";
import CtaBand from "@/components/CtaBand";
import FAQ, { type FaqItem } from "@/components/FAQ";
import FlowDiagram from "@/components/FlowDiagram";
import HeroScene from "@/components/hero/HeroScene";
import Section, { Container } from "@/components/Section";
import VerdictSimulator from "@/components/VerdictSimulator";
import WorkflowStepper from "@/components/WorkflowStepper";
import WrapToggle from "@/components/WrapToggle";
import { demo, demoCapture } from "@/content/demo";
import { workflow } from "@/content/workflow";
import { pageMetadata } from "@/lib/metadata";
import { externalProps } from "@/lib/links";
import { GITHUB_URL, PRIMARY_CTA, PYPI_URL, VERSION } from "@/site.config";

export const metadata = pageMetadata({
  title: "Fourgate: did your agent's action actually happen?",
  description:
    "Independent outcome verification for consequential AI-agent actions. After an MCP tool reports success, Fourgate reads the system of record back and records PASS, FAIL or UNKNOWN. Open source, runs on your machine.",
  path: "/",
});

const legend = [
  { word: "PASS", cls: "text-pass", dot: "bg-pass", text: "The read-back found the record the tool reported, with the contracted values." },
  { word: "FAIL", cls: "text-fail", dot: "bg-fail", text: "The read-back proved the record is missing or different." },
  { word: "UNKNOWN", cls: "text-unknown", dot: "bg-unknown", text: "Fourgate could not confirm either way. It never reports this as success." },
];

const outcomes = [
  {
    word: "PASS",
    cls: "text-pass",
    text: "An independent read-back confirmed the record exists with the contracted values. The tool's response passes through unchanged.",
  },
  {
    word: "CONFIRMED FAIL",
    cls: "text-fail",
    text: "The read-back proved the record is missing or different. In enforce mode the agent is told before it can report success.",
  },
  {
    word: "UNKNOWN",
    cls: "text-unknown",
    text: "A timeout, an auth error, an unreachable API: Fourgate could not confirm either way. Recorded as UNKNOWN, never counted as PASS, and the call is not blocked.",
  },
];

const reasons = [
  { title: "Runs on your machine", text: "A laptop, a server or your CI. There is no Fourgate cloud service, account, database or telemetry." },
  {
    title: "No code changes",
    text: "Wrap the MCP server's launch command with fourgate guard. Your agent and server code stay as they are; you add a short contract per protected tool.",
  },
  {
    title: "Any HTTP API read-back",
    text: "If the system of record exposes a GET endpoint for the written record, Fourgate can check it, with a Bearer token, a custom header or Basic auth.",
  },
  {
    title: "Shadow first, byte-identical",
    text: "In shadow mode, the default, your agent receives exactly the same bytes it would without Fourgate. Verdicts are only recorded.",
  },
  { title: "UNKNOWN is never PASS", text: "Timeouts, auth errors and Fourgate's own faults are UNKNOWN and fail open. Nothing uncertain is reported as success." },
  { title: "Open source", text: "MIT licensed. Read the code, install from PyPI, and check release files against the SHA-256 digests GitHub lists." },
];

const evidence = [
  { value: "4", text: "official vendor MCP servers tested, run locally against the vendors' live APIs using disposable test accounts or deliberately invalid credentials." },
  { value: "3 of 4", text: "surfaced API failures as successful tool results without MCP isError. Each was reproduced at least twice and reported upstream." },
  { value: "Exercised", text: "Hosted authoritative read-back: a real hosted write verified PASS by an independent HTTPS read-back, with FAIL and UNKNOWN controls behaving as specified." },
  { value: "Exercised", text: "Real-agent shadow calls: a real agent client made 2 protected send calls through the runtime wrap in shadow mode against a hosted MCP server. Both recorded PASS." },
  { value: "0", text: "naturally occurring read-back-proven silent-success incidents observed so far: no write reported as done whose record turned out missing or wrong." },
];

const faq: FaqItem[] = [
  {
    q: "Does Fourgate send my data anywhere?",
    a: (
      <p>
        Not to us. There is no Fourgate cloud, account, database or telemetry. The only new network traffic Fourgate adds is
        the verifier&apos;s GET request to the read-back endpoint you configure. Your MCP server keeps making its own API calls,
        as it does today.
      </p>
    ),
  },
  { q: "Does an LLM decide whether a call passed?", a: <p>No. The verdict comes from a deterministic read-back check against the system of record.</p> },
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
        Not in shadow mode, the default: the agent receives exactly the same bytes. In enforce mode, which you switch on only
        for contracts you have approved, Fourgate adds one attributed verdict before the tool&apos;s original response on a
        confirmed FAIL. Nothing else changes.
      </p>
    ),
  },
  {
    q: "How much latency does it add?",
    a: (
      <p>
        Each check is capped at 2000 ms; anything slower is UNKNOWN. The HTTP verifier measured 1.2–1.6 s per call on a
        Windows laptop, and a first cold call exceeded its budget, so headroom is small on slow networks. Only protected calls
        are checked.
      </p>
    ),
  },
  {
    q: "Is it production-ready?",
    a: (
      <p>
        Not yet. Fourgate is early, pre-alpha. It covers local stdio MCP servers only, contracts are written by hand, and the
        field evidence is small. That is why we start with a shadow-mode design partnership on a single workflow.
      </p>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex flex-col overflow-hidden xl:min-h-[calc(100svh-3.5rem)] xl:justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,var(--night)_0%,var(--night)_34%,color-mix(in_srgb,var(--night)_78%,transparent)_48%,transparent_66%)] xl:block"
        />
        <Container className="relative z-10 pb-8 pt-12 sm:pt-16 xl:py-20">
          <div className="max-w-[40rem]">
            <p className="text-small text-muted">
              Open source. Runs on your machine.{" "}
              <a href={PYPI_URL} {...externalProps(PYPI_URL)} className="text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone">
                Version {VERSION} on PyPI.
              </a>
            </p>
            <h1 className="font-display mt-6 text-[2.5rem] leading-[1.02] text-balance sm:text-[3.5rem] lg:text-[4rem]">
              Your agent said &lsquo;done.&rsquo; Fourgate checks whether it actually happened.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lead text-muted sm:text-[1.3125rem] sm:leading-[1.5]">
              Independent outcome verification for consequential AI-agent actions.
            </p>

            <div className="mt-9 max-w-[30rem]">
              <CodeBlock code="pip install fourgate && fourgate demo" label="Run the demo locally. No API keys, no network." prompt />
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/demo" variant="secondary">
                See it in the browser
              </ButtonLink>
              <ButtonLink href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ButtonLink>
            </div>

            <dl className="mt-10 max-w-[34rem] space-y-2.5 border-t border-line pt-5 text-small">
              {legend.map((l) => (
                <div key={l.word} className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className={`flex items-center gap-2 font-mono ${l.cls}`}>
                    <span aria-hidden="true" className={`h-2 w-3 rounded-[2px] ${l.dot}`} />
                    {l.word}
                  </dt>
                  <dd className="text-muted">{l.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
        <div className="relative h-[58svh] min-h-[22rem] max-h-[40rem] xl:absolute xl:inset-0 xl:h-auto xl:max-h-none">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-[linear-gradient(180deg,var(--night),transparent)] xl:hidden" />
          <HeroScene />
        </div>
      </section>

      {/* Problem */}
      <Section
        id="problem"
        title="A tool saying “success” is not the same as the system changing."
        intro={
          <p>
            An agent that reads a tool result without <code className="code-inline">isError</code> has no protocol-level
            signal that the call failed. Fourgate checks the outcome itself: after a protected tool reports success, it reads
            the system of record back and records one of three results. No LLM decides.
          </p>
        }
      >
        <dl>
          {outcomes.map((o) => (
            <div key={o.word} className="grid gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[13rem_1fr] sm:gap-8">
              <dt className={`font-display text-h4 ${o.cls}`}>{o.word}</dt>
              <dd className="max-w-[60ch] text-muted">{o.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Simulator */}
      <Section
        id="simulator"
        layout="stack"
        title="Pick a connector and a mode. See what really happened."
        intro={
          <p>
            Every value below comes from one recorded run of <code className="code-inline">{demoCapture.command}</code>{" "}
            (fourgate {demoCapture.version}): a simulated connector, with a local file standing in for the system of record.
            Only the five recorded combinations can be selected.
          </p>
        }
      >
        <VerdictSimulator scenes={demo.scenes} preamble={demo.preamble} />
      </Section>

      {/* How it works */}
      <Section
        id="how-it-works"
        layout="stack"
        title="A local guard, an independent read-back, a local record."
        intro={
          <p>
            fourgate guard sits on the local stdio path between your agent and your MCP server. When a protected tool reports
            success, it extracts only the contracted fields, and a local verifier reads the record back with a separate,
            read-only credential.
          </p>
        }
      >
        <FlowDiagram id="home-flow" />
      </Section>

      <Section
        id="wrap"
        title="Wrap the command. Leave the server alone."
        intro={
          <p>
            Fourgate goes in front of the command your MCP client already runs. Start in shadow mode: verdicts are recorded and
            the agent sees nothing different.
          </p>
        }
      >
        <WrapToggle />
      </Section>

      {/* Workflow */}
      <Section
        id="workflow"
        layout="stack"
        title="Six commands, in order."
        intro={<p>Each step shows the real command. Where we captured a run, you see its exact output; where we did not, you see what the README says to expect.</p>}
      >
        <WorkflowStepper steps={workflow} />
      </Section>

      {/* Why */}
      <Section id="why" title="Built to be checked, not trusted.">
        <dl className="grid sm:grid-cols-2 sm:gap-x-10">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-line py-5">
              <dt className="font-medium text-bone">{r.title}</dt>
              <dd className="mt-1.5 text-small text-muted">{r.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Field evidence */}
      <Section
        id="evidence"
        title="What we have tested, and what we have not seen yet."
        intro={<p>Operator-run tests against official vendor MCP servers, as of 2026-10-01. Vendors are not named. Small numbers, stated as they are.</p>}
      >
        <dl>
          {evidence.map((e) => (
            <div key={e.text} className="grid gap-1 border-t border-line py-5 last:border-b sm:grid-cols-[8.5rem_1fr] sm:gap-8">
              <dt className="font-display text-h3 text-bone">{e.value}</dt>
              <dd className="max-w-[62ch] text-small text-muted">{e.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[68ch] text-small text-muted">
          The failures found so far are error-reporting bugs, which Fourgate reports as{" "}
          <code className="code-inline">UNKNOWN / success_without_record_id</code> rather than PASS. One hosted integration does
          not establish production reliability, and two shadow calls are a smoke test, not production traffic.{" "}
          {GITHUB_URL && (
            <a href={`${GITHUB_URL}#field-evidence`} {...externalProps(GITHUB_URL)} className="text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone">
              The full field record is in the README.
            </a>
          )}
        </p>
      </Section>

      {/* Pricing teaser */}
      <Section id="pricing" title="Free to run. Paid help to get it right.">
        <div className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {[
            { name: "Open Source", price: "Free", text: "MIT licensed. All six commands. Community support on GitHub." },
            { name: "Founding Design Partner", price: "$199 a month", text: "One workflow, founder-assisted setup, shadow-mode rollout, weekly review." },
            { name: "Enterprise", price: "Contact us", text: "More workflows or tools than the design-partner scope." },
          ].map((p, i) => (
            <div key={p.name} className={`py-6 md:px-6 ${i === 0 ? "md:pl-0" : ""} ${i > 0 ? "border-t border-line md:border-t-0" : ""}`}>
              <p className="text-small text-muted">{p.name}</p>
              <p className="font-display mt-1 text-h3">{p.price}</p>
              <p className="mt-3 text-small text-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href="/pricing" variant="text">
            Compare plans
          </ButtonLink>
        </div>
      </Section>

      <Section id="faq" title="Questions a careful buyer asks.">
        <FAQ items={faq} />
      </Section>

      <CtaBand
        title="Check one workflow, in shadow mode, with us."
        text={<p>Pick 1–3 state-changing tools that matter. We write the contracts with you; your agent sees nothing different.</p>}
      >
        <ContactCtas />
      </CtaBand>
    </>
  );
}
