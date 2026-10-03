import { GITHUB_URL } from "@/site.config";

/** Product release the docs describe. Every product claim is sourced from this tag; see CLAIMS.md. */
export const DOCS_TAG = "v0.3.0";

export type DocSource = {
  /** Path in the product repository at DOCS_TAG. */
  file: string;
  /** Line range, e.g. "20-23" or "88" (optional). */
  lines?: string;
};

export type DocEntry = {
  /** "" is /docs itself. */
  slug: string;
  group: "Start" | "Concepts" | "Guides" | "Reference" | "Security";
  title: string;
  description: string;
  sources: DocSource[];
};

export const docs: DocEntry[] = [
  {
    slug: "",
    group: "Start",
    title: "Fourgate documentation",
    description: "Install Fourgate, run the demo, and protect your first MCP write tool. Written from the v0.3.0 release.",
    sources: [{ file: "README.md" }],
  },
  {
    slug: "quickstart",
    group: "Start",
    title: "Quickstart",
    description: "Install Fourgate v0.3.0, run fourgate demo, and read PASS, FAIL and UNKNOWN.",
    sources: [
      { file: "README.md", lines: "31-58" },
      { file: "README.md", lines: "127-143" },
      { file: "README.md", lines: "119-125" },
    ],
  },
  {
    slug: "concepts",
    group: "Concepts",
    title: "Concepts",
    description: "Outcome contracts, read-back verification, shadow and enforce mode, startup and per-call failure behavior, and why UNKNOWN is never PASS.",
    sources: [
      { file: "README.md", lines: "117-125" },
      { file: "specs/outcome-guard-mvp.md", lines: "24-57" },
      { file: "PILOT.md", lines: "117-128" },
      { file: "SECURITY.md", lines: "37-41" },
    ],
  },
  {
    slug: "guides/first-tool",
    group: "Guides",
    title: "Protect your first tool",
    description: "init, doctor, scan, guard and summary, in order, on one write tool.",
    sources: [
      { file: "README.md", lines: "145-229" },
      { file: "PILOT.md", lines: "130-140" },
    ],
  },
  {
    slug: "guides/http-auth",
    group: "Guides",
    title: "HTTP read-back authentication",
    description: "Send the read credential as a Bearer token, a custom header, or Basic auth.",
    sources: [
      { file: "README.md", lines: "220-227" },
      { file: "OPERATOR.md", lines: "183-211" },
      { file: "SECURITY.md", lines: "13-18" },
    ],
  },
  {
    slug: "guides/github-issues",
    group: "Guides",
    title: "GitHub Issues read-back",
    description: "The github_issue read-back type. A template that still needs a disposable repository and end-to-end acceptance.",
    sources: [
      { file: "specs/scan-contract-v1.md", lines: "54-62" },
      { file: "fixtures/contracts/scan_github_issue.example.json" },
      { file: "README.md", lines: "88-94" },
      { file: "SECURITY.md", lines: "37-41" },
    ],
  },
  {
    slug: "guides/ci",
    group: "Guides",
    title: "Run a scan in CI",
    description: "The GitHub Actions template for fourgate scan: what it does, what to edit, and its limits.",
    sources: [
      { file: "README.md", lines: "96-113" },
      { file: "examples/ci/fourgate-scan.yml" },
    ],
  },
  {
    slug: "guides/windows",
    group: "Guides",
    title: "Windows notes",
    description: "What the v0.3.0 documentation says about Windows: PowerShell syntax, credentials, file permissions and measured latency.",
    sources: [
      { file: "README.md", lines: "31" },
      { file: "README.md", lines: "72-78" },
      { file: "OPERATOR.md", lines: "1-8" },
      { file: "SECURITY.md", lines: "33-35" },
    ],
  },
  {
    slug: "reference/commands",
    group: "Reference",
    title: "Commands and flags",
    description: "Each command and the flags the v0.3.0 documentation describes.",
    sources: [
      { file: "README.md", lines: "49-58" },
      { file: "README.md", lines: "145-218" },
    ],
  },
  {
    slug: "reference/contracts",
    group: "Reference",
    title: "Contract and read-back JSON",
    description: "Fields of the runtime contract, the scan contract and the readback object.",
    sources: [
      { file: "specs/outcome-guard-mvp.md", lines: "24-57" },
      { file: "specs/scan-contract-v1.md", lines: "13-62" },
      { file: "README.md", lines: "185-227" },
    ],
  },
  {
    slug: "reference/outcome-log",
    group: "Reference",
    title: "Outcome log and reason codes",
    description: "What outcomes.jsonl records, the outcome_failed verdict, and the documented reason codes.",
    sources: [
      { file: "PILOT.md", lines: "92-100" },
      { file: "HANDOFF.md", lines: "157-167" },
      { file: "specs/outcome-guard-mvp.md", lines: "81-97" },
      { file: "OPERATOR.md", lines: "344-358" },
    ],
  },
  {
    slug: "reference/exit-codes",
    group: "Reference",
    title: "Exit codes",
    description: "The exit codes the v0.3.0 documentation states, per command.",
    sources: [
      { file: "README.md", lines: "80-86" },
      { file: "README.md", lines: "161" },
      { file: "README.md", lines: "176" },
      { file: "specs/scan-contract-v1.md", lines: "78-80" },
    ],
  },
  {
    slug: "security",
    group: "Security",
    title: "Security summary",
    description: "What runs where, what is stored, and how credentials are handled, with links to the security page and SECURITY.md.",
    sources: [
      { file: "SECURITY.md" },
      { file: "PILOT.md", lines: "52-128" },
    ],
  },
];

export const docHref = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

export function docBySlug(slug: string): DocEntry {
  const d = docs.find((x) => x.slug === slug);
  if (!d) throw new Error(`Unknown doc slug: ${slug}`);
  return d;
}

export function docNeighbors(slug: string): { prev?: DocEntry; next?: DocEntry } {
  const i = docs.findIndex((x) => x.slug === slug);
  return { prev: docs[i - 1], next: docs[i + 1] };
}

export const groups: DocEntry["group"][] = ["Start", "Concepts", "Guides", "Reference", "Security"];

/** Link to a product-repository file at the documented tag, with an optional line anchor. */
export function productSourceUrl(s: DocSource): string {
  const anchor = s.lines ? `#L${s.lines.split("-")[0]}${s.lines.includes("-") ? `-L${s.lines.split("-")[1]}` : ""}` : "";
  return `${GITHUB_URL}/blob/${DOCS_TAG}/${s.file}${anchor}`;
}

/** Link to this page's MDX source in the website repository. */
export function pageSourceUrl(slug: string): string {
  const dir = slug ? `docs/${slug}` : "docs";
  return `https://github.com/hifzabuildsai/fourgate-site/blob/main/src/app/${dir}/page.mdx`;
}
