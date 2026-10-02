import ButtonLink from "@/components/ButtonLink";
import Callout from "@/components/Callout";
import CodeBlock from "@/components/CodeBlock";
import CtaBand from "@/components/CtaBand";
import FlowDiagram from "@/components/FlowDiagram";
import Section from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";
import { pageMetadata } from "@/lib/metadata";
import { GITHUB_URL, PILOT_MD_URL, RELEASE_URL, SECURITY_MD_URL } from "@/site.config";

export const metadata = pageMetadata({
  title: "Security and data flow",
  description:
    "Where Fourgate runs, what it stores, where your data goes, how credentials are isolated, and how it fails. No Fourgate cloud, no database, no telemetry.",
  path: "/security",
});

const stored = [
  {
    item: "Runtime contract",
    file: "runtime.json",
    where: "Your machine or repo",
    contains: "Tool names, which fields to extract, the verifier command, environment variable names",
    never: "Credentials, customer data",
  },
  {
    item: "Read-back config",
    file: "readback.json",
    where: "Your machine or repo",
    contains: "The GET URL template, expected fields, status rules, the environment variable name of the read token",
    never: "The token itself",
  },
  {
    item: "Outcome log",
    file: "outcomes.jsonl",
    where: "Path you choose",
    contains:
      "Per protected call: time, server label, tool name, mode, PASS/FAIL/UNKNOWN, reason code, names of checked fields, time the check added",
    never: "Arguments, field values, record IDs, response bodies, credentials",
  },
  {
    item: "Summary page",
    file: "fourgate-summary.html",
    where: "Path you choose",
    contains: "Counts and charts built from the outcome log",
    never: "Same exclusions as the log; no JavaScript, no network requests",
  },
  {
    item: "Scan reports (optional)",
    file: "fourgate-report.json / .html",
    where: "Only if you pass --report-dir",
    contains:
      "For test-account scans: the contracted request, tool response and read-back evidence for non-passing cases, after best-effort secret redaction",
    never: "Redaction is best effort: review before sharing",
  },
];

const pilotDiagram = ` Your agent (e.g. an MCP client)
        │  tools/call
        ▼
 fourgate guard  ── local process on your machine ──────────────────────┐
        │  forwards the call unchanged                                  │
        ▼                                                               │
 Your MCP server  ──(its own API calls, as today)──►  Your system of record
        │  "success" result                                             ▲
        ▼                                                               │
 guard extracts only the contracted fields (e.g. record ID, title)      │
        │                                                               │
        └─► verifier (local)  ── HTTPS GET with a separate read-only ───┘
                 │               credential
                 ▼
         PASS / FAIL / UNKNOWN  ──►  outcomes.jsonl (local, structure only)
                                            │
                                            ▼
                               fourgate summary  ──►  local HTML page`;

const verifyHashes = `# Linux
sha256sum fourgate-0.3.0-py3-none-any.whl
# Windows PowerShell
Get-FileHash fourgate-0.3.0-py3-none-any.whl -Algorithm SHA256`;

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-4 font-semibold text-text">{title}</h3>
      {children}
    </div>
  );
}

export default function SecurityPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        eyebrow="Security"
        title="No Fourgate cloud, no database, no telemetry."
        intro={
          <p>
            So there are no sub-processors and nothing for us to leak. Fourgate runs entirely on your machines (a laptop, a
            server, or your CI) and nothing is sent to Fourgate. This page is written for whoever reviews Fourgate for
            security; it follows{" "}
            <a href={PILOT_MD_URL} className="text-accent underline underline-offset-2" target="_blank" rel="noopener noreferrer">
              PILOT.md<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            and{" "}
            <a href={SECURITY_MD_URL} className="text-accent underline underline-offset-2" target="_blank" rel="noopener noreferrer">
              SECURITY.md<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        }
      >
        <FlowDiagram
          id="security-flow"
          labels={{
            call: "tools/call",
            forward: "unchanged",
            write: "its own calls",
            extract: "contracted fields only",
            readback: "HTTPS GET, read-only credential",
            record: "structure only",
            summarize: "local HTML",
          }}
        />
        <details className="mt-4 rounded-xl border border-border bg-surface">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-3 text-sm font-medium text-text">
            The same diagram as written in PILOT.md
            <svg aria-hidden="true" viewBox="0 0 16 16" className="fg-chevron h-4 w-4 shrink-0 text-subtle">
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </summary>
          <pre className="overflow-x-auto border-t border-border p-4 font-mono text-[0.75rem] leading-snug text-muted">
            {pilotDiagram}
          </pre>
        </details>
        <div className="mt-6">
          <Callout tone="honest" title="Exactly what leaves your machine">
            <p>
              The only new network traffic Fourgate adds is the verifier&apos;s GET request to the read-back endpoint you
              configure, carrying the read credential you named. It never writes, deletes, or retries a write. Your MCP
              server keeps making its own outbound requests, as it does today. So &ldquo;nothing leaves the machine&rdquo;
              is true only for a fully local setup such as the demo, not once HTTP read-back is configured.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        id="stored"
        eyebrow="What stays on your machine"
        title="Every file Fourgate writes, and what it never contains."
        intro={<p>Fourgate keeps no other state. To uninstall: pip uninstall fourgate, point your MCP client back at the original server command, and delete these files.</p>}
        className="border-t border-border"
      >
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Files Fourgate writes</caption>
            <thead className="bg-surface text-text">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">Item</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Where</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Contains</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Never contains</th>
              </tr>
            </thead>
            <tbody>
              {stored.map((s) => (
                <tr key={s.item} className="border-t border-border align-top">
                  <th scope="row" className="px-5 py-4 font-medium text-text">
                    {s.item}
                    <code className="mt-1 block font-mono text-xs font-normal text-subtle">{s.file}</code>
                  </th>
                  <td className="px-5 py-4 text-muted">{s.where}</td>
                  <td className="px-5 py-4 text-muted">{s.contains}</td>
                  <td className="px-5 py-4 text-muted">{s.never}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4 md:hidden">
          {stored.map((s) => (
            <section key={s.item} className="rounded-xl border border-border bg-surface p-4" aria-label={s.item}>
              <h3 className="font-semibold">{s.item}</h3>
              <code className="font-mono text-xs text-subtle">{s.file}</code>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-subtle">Where</dt>
                  <dd className="text-muted">{s.where}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Contains</dt>
                  <dd className="text-muted">{s.contains}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Never contains</dt>
                  <dd className="text-muted">{s.never}</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>
      </Section>

      <Section id="controls" eyebrow="Controls" title="Credentials, read-back safety and failure behavior." className="border-t border-border">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Credential isolation">
            <List
              items={[
                "The MCP server keeps its own write credential, exactly as today.",
                "The verifier uses a separate, read-only credential that you create. Both are environment variables you set; contracts, logs and the summary contain only the variable names.",
                <>
                  List the read credential in <code className="font-mono text-text">verifier.secret_env</code> and fourgate
                  guard removes it from the MCP server&apos;s environment, so the server under test cannot see or use it.
                </>,
                "The verifier itself inherits the full operator environment, so only trusted verifier commands belong in contracts.",
                "Fourgate never stores credentials.",
              ]}
            />
          </Card>
          <Card title="Read-back safety">
            <List
              items={[
                "GET requests only. Fourgate never writes, deletes, or automatically retries a write, because the write may already have happened.",
                "Redirects are rejected. Dynamic hosts are rejected. Non-HTTPS URLs are rejected outside loopback.",
                <>
                  HTTP 401/403 is <StatusBadge status="UNKNOWN" size="sm" />.
                </>,
                <>
                  An ambiguous 404 (missing access and a missing record can look alike) is{" "}
                  <StatusBadge status="UNKNOWN" size="sm" /> by default. Treating it as FAIL is an explicit opt-in.
                </>,
                "Static extra headers are validated to be non-secret, so a token can only come from an environment variable.",
              ]}
            />
          </Card>
          <Card title="Failure semantics">
            <List
              items={[
                "Invalid configuration refuses to start: fourgate guard reports the problem and does not launch the server.",
                <>
                  Per-call faults (verifier timeout, network error, internal error) are <StatusBadge status="UNKNOWN" size="sm" />{" "}
                  and fail open: the call goes through untouched.
                </>,
                "Shadow mode, the default, is byte-identical: the agent receives exactly what it would without Fourgate.",
                <>
                  Enforce mode only adds one attributed verdict, before the tool&apos;s original response, on a{" "}
                  <StatusBadge status="CONFIRMED FAIL" size="sm" />. Nothing else changes.
                </>,
                "No LLM makes the PASS/FAIL decision.",
              ]}
            />
          </Card>
        </div>
        <div className="mt-6">
          <Callout tone="warn" title="fourgate scan performs real writes">
            <p>
              Scan executes the contracted write tools on the server you configure. Run it only against disposable test
              accounts, with the exact account-label confirmation; it cannot tell whether an account is really a test account.
              Scan reports are redacted on a best-effort basis: an arbitrary secret in an unmarked text field may remain, so
              review reports before sharing. On POSIX, files are created with mode 0600; on Windows, permissions follow the
              directory ACL.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        id="audit"
        eyebrow="Audit it yourself"
        title="Don't take our word for it."
        intro={
          <p>
            Fourgate is MIT licensed. Read the code, read the security notes, and check
            the release artifacts against the SHA-256 digests GitHub lists on the release page.
          </p>
        }
        className="border-t border-border"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={GITHUB_URL} variant="secondary">
            Source code
          </ButtonLink>
          <ButtonLink href={SECURITY_MD_URL} variant="secondary">
            SECURITY.md
          </ButtonLink>
          <ButtonLink href={PILOT_MD_URL} variant="secondary">
            PILOT.md
          </ButtonLink>
          <ButtonLink href={RELEASE_URL} variant="secondary">
            v0.3.0 release and SHA-256 digests
          </ButtonLink>
        </div>
        <div className="mt-6 max-w-2xl">
          <CodeBlock code={verifyHashes} label="compare with the digest on the release page" />
        </div>
        <div className="mt-8">
          <Callout tone="honest" title="Certifications">
            <p>
              Fourgate does not claim SOC 2, ISO 27001 or any other certification. Because it runs on your infrastructure
              and stores nothing with us, your existing controls apply to it like any other open-source tool you run.
            </p>
          </Callout>
        </div>
      </Section>

      <CtaBand title="Reviewing Fourgate for your team?" text={<p>We can walk your security reviewer through the data flow on the scope call.</p>}>
        <ButtonLink href="/design-partner">Become a design partner</ButtonLink>
      </CtaBand>
    </>
  );
}
