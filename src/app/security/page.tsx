import { Fragment } from "react";
import Callout from "@/components/Callout";
import ContactCtas from "@/components/ContactCtas";
import CtaBand from "@/components/CtaBand";
import FlowDiagram from "@/components/FlowDiagram";
import Section from "@/components/Section";
import StatusBadge from "@/components/StatusBadge";
import DigestMatch from "@/components/DigestMatch";
import Reveal from "@/components/Reveal";
import RunTerminal, { type OsCommands } from "@/components/RunTerminal";
import TabbedGroups from "@/components/TabbedGroups";
import { externalProps } from "@/lib/links";
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
    strike: true,
    file: "runtime.json",
    where: "Your machine or repo",
    contains: "Tool names, which fields to extract, the verifier command, environment variable names",
    never: "Credentials, customer data",
  },
  {
    item: "Read-back config",
    strike: true,
    file: "readback.json",
    where: "Your machine or repo",
    contains: "The GET URL template, expected fields, status rules, the environment variable name of the read token",
    never: "The token itself",
  },
  {
    item: "Outcome log",
    strike: true,
    file: "outcomes.jsonl",
    where: "Path you choose",
    contains:
      "Per protected call: time, server label, tool name, mode, PASS/FAIL/UNKNOWN, reason code, names of checked fields, time the check added",
    never: "Arguments, field values, record IDs, response bodies, credentials",
  },
  {
    item: "Summary page",
    strike: false,
    file: "fourgate-summary.html",
    where: "Path you choose",
    contains: "Counts and charts built from the outcome log",
    never: "Same exclusions as the log; no JavaScript, no network requests",
  },
  {
    item: "Scan reports (optional)",
    strike: false,
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

const hashCommands: OsCommands[] = [
  { id: "linux", label: "Linux", lines: ["sha256sum fourgate-0.3.0-py3-none-any.whl"] },
  { id: "windows", label: "Windows PowerShell", lines: ["Get-FileHash fourgate-0.3.0-py3-none-any.whl -Algorithm SHA256"] },
];

const link = "link";

export default function SecurityPage() {
  return (
    <>
      <Section
        id="top"
        as="h1"
        layout="stack"
        rule={false}
        title="No Fourgate cloud, no database, no telemetry."
        intro={
          <p>
            So there are no sub-processors and nothing for us to leak. Fourgate runs entirely on your machines (a laptop, a
            server, or your CI) and nothing is sent to Fourgate. This page is written for whoever reviews Fourgate for security.
            It follows{" "}
            <a href={PILOT_MD_URL} {...externalProps(PILOT_MD_URL)} className={link}>
              PILOT.md
            </a>{" "}
            and{" "}
            <a href={SECURITY_MD_URL} {...externalProps(SECURITY_MD_URL)} className={link}>
              SECURITY.md
            </a>
            .
          </p>
        }
      >
        <FlowDiagram
          id="security-flow"
          variant="panel"
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
        <details className="mt-4 rounded-[10px] border border-line">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-small text-muted hover:text-foreground">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="fg-chevron h-3.5 w-3.5">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            The same diagram as written in PILOT.md
          </summary>
          <pre className="fg-scroll overflow-x-auto border-t border-line p-4 font-mono text-[0.75rem] leading-snug text-muted">{pilotDiagram}</pre>
        </details>
        <div className="mt-8 max-w-3xl">
          <Callout title="Exactly what leaves your machine">
            <p>
              The only new network traffic Fourgate adds is the verifier&apos;s GET request to the read-back endpoint you
              configure, carrying the read credential you named. It never writes, deletes, or retries a write. Your MCP server
              keeps making its own outbound requests, as it does today. So &ldquo;nothing leaves the machine&rdquo; is true only
              for a fully local setup such as the demo, not once HTTP read-back is configured.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        id="stored"
        layout="stack"
        title="Every file Fourgate writes, and what it never contains."
        intro={
          <p>
            Fourgate keeps no other state. To uninstall, run <code className="code-inline">pip uninstall fourgate</code>, point
            your MCP client back at the original server command, and delete these files.
          </p>
        }
      >
        <ul className="space-y-3">
          {stored.map((row, i) => (
            <Reveal as="li" key={row.item} index={i}>
              <article
                aria-label={row.item}
                className="grid gap-4 rounded-[14px] border border-line p-4 transition-colors hover:bg-surface sm:p-5 lg:grid-cols-[15rem_1fr_1fr] lg:gap-6"
              >
                <div>
                  <h3 className="font-medium text-foreground">{row.item}</h3>
                  <code className="mt-1 block font-mono text-cap text-muted">{row.file}</code>
                  <span className="mt-2 inline-block rounded-full border border-line-strong px-2 py-0.5 font-mono text-[0.6875rem] text-muted">
                    <span className="sr-only">Where: </span>
                    {row.where}
                  </span>
                </div>
                <div>
                  <p className="text-cap text-muted">Contains</p>
                  <p className="mt-1 text-small text-foreground">{row.contains}</p>
                </div>
                <div className="rounded-[10px] border border-dashed border-line-strong p-3">
                  <p className="text-cap text-muted">Never contains</p>
                  <p className={`mt-1 text-small text-muted ${row.strike ? "line-through decoration-muted/60" : ""}`}>{row.never}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="controls" layout="stack" title="Credentials, read-back safety and failure behavior.">
        <TabbedGroups
          label="Security controls"
          groups={[
            { title: "Credential isolation", items: [
              "The MCP server keeps its own write credential, exactly as today.",
              "The verifier uses a separate, read-only credential that you create. Both are environment variables you set; contracts, logs and the summary contain only the variable names.",
              <Fragment key="r1">
                List the read credential in <code className="code-inline">verifier.secret_env</code> and fourgate guard removes
                it from the MCP server&apos;s environment, so the server under test cannot see or use it.
              </Fragment>,
              "The verifier itself inherits the full operator environment, so only trusted verifier commands belong in contracts.",
              "Fourgate never stores credentials.",
            ] },
            { title: "Read-back safety", items: [
              "GET requests only. Fourgate never writes, deletes, or automatically retries a write, because the write may already have happened.",
              "Redirects are rejected. Dynamic hosts are rejected. Non-HTTPS URLs are rejected outside loopback.",
              <Fragment key="r2">
                HTTP 401/403 is <StatusBadge status="UNKNOWN" size="sm" />.
              </Fragment>,
              <Fragment key="r3">
                An ambiguous 404 (missing access and a missing record can look alike) is <StatusBadge status="UNKNOWN" size="sm" />{" "}
                by default. Treating it as FAIL is an explicit opt-in.
              </Fragment>,
              "Static extra headers are validated to be non-secret, so a token can only come from an environment variable.",
            ] },
            { title: "Failure semantics", items: [
              "Invalid configuration refuses to start: fourgate guard reports the problem and does not launch the server.",
              <Fragment key="r4">
                Per-call faults (verifier timeout, network error, internal error) are <StatusBadge status="UNKNOWN" size="sm" /> and
                fail open: the call goes through untouched.
              </Fragment>,
              "Shadow mode, the default, is byte-identical: the agent receives exactly what it would without Fourgate.",
              <Fragment key="r5">
                Enforce mode only adds one attributed verdict, before the tool&apos;s original response, on a{" "}
                <StatusBadge status="CONFIRMED FAIL" size="sm" />. Nothing else changes.
              </Fragment>,
              "No LLM makes the PASS/FAIL decision.",
            ] },
          ]}
        />
        <div className="mt-10 max-w-3xl">
          <Callout tone="caution" title="fourgate scan performs real writes">
            <p>
              Scan executes the contracted write tools on the server you configure. Run it only against disposable test accounts,
              with the exact account-label confirmation; it cannot tell whether an account is really a test account. Scan
              reports are redacted on a best-effort basis: an arbitrary secret in an unmarked text field may remain, so review
              reports before sharing. On POSIX, files are created with mode 0600; on Windows, permissions follow the directory
              ACL.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        id="audit"
        title="Audit it yourself."
        intro={<p>Fourgate is MIT licensed. Read the code, read the security notes, and check the release files against the SHA-256 digests GitHub lists on the release page.</p>}
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { href: GITHUB_URL, label: "Source code" },
            { href: SECURITY_MD_URL, label: "SECURITY.md" },
            { href: PILOT_MD_URL, label: "PILOT.md" },
            { href: RELEASE_URL, label: "v0.3.0 release and digests" },
          ]
            .filter((l) => l.href)
            .map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...externalProps(l.href)}
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-[12px] border border-line px-4 py-3 text-foreground transition-colors hover:border-line-strong hover:bg-surface"
                >
                  <span className="font-medium">{l.label}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                  >
                    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
        </ul>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-cap text-muted">Compare with the digest on the release page</p>
            <RunTerminal variants={hashCommands} copyLabel="Copy" />
          </div>
          <div className="lg:pt-6">
            <DigestMatch />
          </div>
        </div>
        <div className="mt-8">
          <Callout title="Certifications">
            <p>
              Fourgate does not claim SOC 2, ISO 27001 or any other certification. It runs on your infrastructure and stores
              nothing with us.
            </p>
          </Callout>
        </div>
      </Section>

      <CtaBand title="Reviewing Fourgate for your team?" text={<p>We can walk your security reviewer through the data flow on the scope call.</p>}>
        <ContactCtas subject="Fourgate security review" />
      </CtaBand>
    </>
  );
}
