# Claims register

Every product claim on this site, and where it comes from. Sources are files in the
product repository [hifzabuildsai/fourgate](https://github.com/hifzabuildsai/fourgate)
at `origin/main` commit `1d7b900` (2026-10-01). Line numbers refer to that commit.

Abbreviations: **R** = `README.md`, **P** = `PILOT.md`, **S** = `SECURITY.md`,
**F** = `specs/field-observations.md`.

If a source line changes, update the site copy and this file together. If a claim
cannot be sourced, it does not go on the site.

## Positioning

| Claim (as used on the site) | Where | Source |
|---|---|---|
| "Open source. Runs on your machine. Version 0.3.0 on PyPI." | Hero | R306, P9, R31–36 |
| "Independent outcome verification for consequential AI-agent actions." | Hero, footer, meta | `pyproject.toml` `description`; v0.3.0 release notes (not one of the four source files; see *Other sources*) |
| Fourgate checks whether a tool's reported success actually happened | Hero | R3 |
| Early, pre-alpha | Home FAQ | R5 |
| v0.3.0 is on PyPI; `pip install fourgate` | Hero badge, demo | R31–36, R41–49 |
| Open source, MIT License | Hero badge, Why, pricing, footer | R306; `LICENSE` |

## Problem and verdicts

| Claim | Where | Source |
|---|---|---|
| A result without `isError` gives the agent no protocol-level signal that the call failed | Home problem | R20–21 |
| Three outcomes: PASS (response unchanged), CONFIRMED FAIL (enforce prepends an attributed `outcome_failed` verdict), UNKNOWN (fails open, response unchanged) | Home problem, security | R128–132 |
| No LLM makes the PASS/FAIL decision; deterministic read-back | Home, security, FAQ | R126, P83 |
| UNKNOWN is never counted as PASS | Home, FAQ, Why | R92, R148 |
| PASS / FAIL meaning (record exists with contracted values / proven missing or different) | Home problem | R16, R256–262; demo summary page "Reasons" text |

## Demo

| Claim | Where | Source |
|---|---|---|
| Simulator panels, verdicts, reasons and raw output are lines of the `fourgate demo --pace 0` output | Home and /demo simulator, /demo full output | Captured run, see *Other sources*; `src/content/demo.ts` verifies it against the original (only the two shortened paths may differ) and splits it losslessly at build time |
| Only five connector/mode combinations exist (S1 broken/without, S2 broken/enforce, S3 healthy/enforce, S4 broken/shadow, S5 outage/enforce) | Simulator | The capture itself (scene headers) and R144–148 |
| No API keys, no network; five real MCP sessions; guarded scenes through a real `fourgate guard` process; local summary page; `--pace 2` for recording | /demo | R142 |
| Scene descriptions S1–S5 | Terminal captions | R144–148 and the captured output itself |
| Simulated connector; a local file stands in for the system of record | /demo, home | R150 |
| `python -m fourgate` works if `fourgate` is not on PATH | /demo | R38–39 |
| Python 3.10–3.13, Linux or Windows | /demo | R31 |
| Summary page has no JavaScript, makes no network requests, contains structure only | /demo | R222–227 |

## Hero (illustration)

| Claim | Where | Source |
|---|---|---|
| Gate 1 "Tool says done": only results the tool reported as success are checked; an error result is UNKNOWN (`not_success_result`) | Hero labels, tooltip, scene | R126 ("After a connector reports success"); `fourgate/readback.py` `evaluate()` at `1d7b900` (returns `unknown / not_success_result` when `result.isError`) |
| Gate 2 "Extract contracted fields": only contract-approved fields; a missing field or record ID is UNKNOWN | Hero labels, tooltip, scene | R126, P32; R132 ("missing selector"), R21 (`success_without_record_id`); `readback.py` `evaluate()` (extraction error -> unknown) |
| Gate 3 "Independent read-back": separate read-only GET; missing or different is FAIL, unreachable is UNKNOWN | Hero labels, tooltip, scene | R126, P34–35; R144–147 (`record_missing`), R261 (`field_mismatch`); R148, S38 (unreachable / 401 / 403 -> UNKNOWN) |
| Gate 4 "Verdict": only a confirmed match is PASS; UNKNOWN is never PASS and fails open | Hero labels, tooltip, scene | R92, R128–132, P81–82 |
| Only PASS packets cross gate 4 (enforced in code) | Hero scene | Illustration of R92; `src/components/hero/simulation.ts` `assertVerdictGate`, checked by `npm run check:hero` |
| Legend: PASS = read-back found the record with the contracted values; FAIL = proved missing or different; UNKNOWN = could not confirm, never reported as success | Hero legend | R16, R128–132, R92; reason texts in the demo summary page |
| Mix (60% PASS, 20% FAIL, 20% UNKNOWN) and motion are illustrative, not measured | Hero | Stated in README "What's real vs. illustrative" |

## Interactive components

| Claim | Where | Source |
|---|---|---|
| Wrapped command `fourgate guard --contracts … --mode shadow --server … --log outcomes.jsonl -- python your_server.py` | Wrap toggle | R177–183 |
| Shadow first; verdicts recorded, agent sees nothing different | Wrap toggle intro | R134, P16–18 |
| `runtime.json` is the contract file init writes | Wrap toggle note | R160 |
| Client config file name and shape vary by client | Wrap toggle note | Labeled "Illustrative client config"; not a product claim |
| Six commands and their one-line purposes | Workflow stepper | R61–66 |
| init command and its printed output | Workflow stepper | R157 (command); `src/content/fourgate-init-output.txt` (captured output) |
| doctor command and its printed output | Workflow stepper | R167 (form of the command); `src/content/fourgate-doctor-output.txt` (captured output) |
| scan: bundled-fixture commands; expected FAIL / record_missing (exit 1), PASS on healthy (exit 0), UNKNOWN never PASS, invalid config exits 2 | Workflow stepper | R75–78 (commands), R89–92 (result) |
| guard: command; enforce only after clean shadow traffic; exits 2 on invalid contracts; per-call faults UNKNOWN and fail open; stdout carries only MCP traffic | Workflow stepper | R177–183 (command), R185 (result) |
| summary: command; what the page contains; no JavaScript, no network requests | Workflow stepper | R219 (command), R222–226 |
| Bento visuals (decorative, aria-hidden): "tool call" timing out at "2000 ms" into "? UNKNOWN", a struck "PASS" marked "never"; laptop/server/CI with a struck cloud; the `python your_server.py` -> `fourgate guard … -- python your_server.py` diff; "verifier" "GET" and a returned record; two identical byte rows "= same bytes"; "MIT", "v0.3.0" and the wheel digest `sha256:0f5d48f9ea93…99efefd3b` | Home "Built to be checked, not trusted." | R290 (2000 ms cap), R92/R148 (never PASS); P9 (laptop, server, CI; no cloud); R177–183 (guard wraps the command); R229–234, P101–103 (GET read-back); P16–18 (same bytes); R306 (MIT); v0.3.0 release asset digest (see *Other sources*) |
| Data-flow node details ("Holds" / "Never contains") | /security interactive diagram | P26–35 (what runs where), P43–45 (only new traffic), P49–55 (what is stored), P62–70 (credentials), P74–83 (failure behavior) |

## How it works and integrations

| Claim | Where | Source |
|---|---|---|
| Data-flow diagram (agent → guard → MCP server → system of record; verifier GET; outcomes.jsonl; summary) | Home, /security | P20–41 |
| Guard extracts only the contracted fields; verifier uses a separate read-only credential | Home, /security | P32–35, P62–66 |
| Wrap the server's launch command; no change to agent or server code; you add a contract per tool | Why ("No code changes") | R174–185 (guard wraps the command), P57–58 (point the client back at the original command to uninstall), R288 (contracts are hand-authored) |
| Local stdio MCP servers only; no remote MCP transport | /integrations, design partner | R291, P99–100 |
| HTTP GET read-back; Bearer by default, custom header, Basic auth, or no auth; static non-secret headers | Why, /integrations, design partner | R229–234, P101–103, S14–18 |
| GitHub Issue read-back; the GitHub contract is a template still needing a disposable repo, tokens and end-to-end acceptance | /integrations | R98–103 |
| Local command verifier; bundled `fourgate.verify_http` is a generic HTTP GET read-back | /integrations | R99, R289 |
| CI template; fails on FAIL or UNKNOWN; Fourgate CI runs it against the demo fixture; not yet run against a hosted connector | /integrations | R105–122 |
| `fourgate init` writes and validates readback/runtime/scan files, never reads secrets, starts the server or contacts an endpoint | /integrations | R160–162 |
| `secret_env` removes the read credential from the wrapped server's environment; the verifier still receives it | /integrations, /security | R187–192, P63–66 |
| Read-back `timeout_ms` at most 1500; runtime verifier cap 2000 ms | /integrations | R229–230, R290 |
| Not supported yet: remote MCP transport, database adapters, contract generation, dashboard/alerting/gateway/retry/compensation | /integrations | R288–292 |
| Flow above the integration cards: agent -> fourgate guard -> MCP server -> system of record, "independent read-only GET, back to fourgate guard" | /integrations "Works with any system…" | P20–41 (what runs where; verifier GET with a separate read-only credential) |
| Type chips (Runtime, Read-back, Verifier, CI) and "Template" on GitHub Issues read-back and the CI template only | /integrations cards | Classification of the existing card text; "Template" restates R102–103 (GitHub contract is a template) and R120–122 (CI template not yet run against a hosted connector) |
| Which `fourgate init` flag produced which JSON key (hover highlights) | /integrations "One write tool, one read-back, two small files." | Derived, not authored: `scripts/derive-init-flagmap.py` ran the real `fourgate init` 0.3.0 with the R157 flags, then once per changed flag, and diffed the three files by JSON path; result in `src/content/init-example/flagmap.ts` |
| `fourgate-config/scan.json` (third tab) | /integrations | The same `fourgate init` run as the other two files (captured in `C:g-example`), unedited; the build fails if the displayed JSON differs from any file |
| Configuration example files | /integrations | Generated by `fourgate init` with the flags from R157, see *Other sources*; labeled on the page as an example, not a tested integration |

## Security

| Claim | Where | Source |
|---|---|---|
| Runs entirely on your machines (laptop, server, CI); no Fourgate cloud, account, database or telemetry | /security, Why, FAQ | P9–10, S27–28 |
| "No sub-processors and nothing for us to leak" | /security | Derived from P9–10 and S27–28 (nothing is sent to or stored by Fourgate) |
| Never stores credentials; env vars set by you; files contain variable names only | /security, design partner | P11–13, P67–70 |
| Nothing is sent to Fourgate; summary page is built to be shareable; you choose whether to share | /security, design partner | P14–15, P94–95 |
| Only new network traffic is the verifier's GET to the configured endpoint; never writes, deletes or retries a write | /security, FAQ | P43–45, S3–7 |
| "Nothing leaves the machine" is true only for a fully local setup, not with HTTP read-back; the MCP server makes its own requests | /security | S23–25 |
| What-is-stored table (five items, contents, exclusions) | /security | P49–55 |
| No other state; uninstall steps | /security | P57–58 |
| Verifier inherits the full operator environment; only trusted verifier commands belong in contracts | /security | S11–13, S19–22 |
| Rejects redirects, dynamic hosts, non-HTTPS URLs outside loopback | /security | S37–38 |
| HTTP 401/403 is UNKNOWN | /security | S38 |
| Ambiguous 404 is UNKNOWN by default; FAIL only by explicit opt-in (`missing_statuses`) | /security, /integrations | S38–41; confirmed in `fourgate/readback.py` (`missing_statuses`, `readback_unconfirmed`) |
| Invalid configuration refuses to start (exit 2, server not launched) | /security, FAQ | R185, P79–80 |
| Per-call faults are UNKNOWN and fail open | /security, FAQ | R132, P81–82 |
| Shadow mode is the default and byte-identical | Why, /security, FAQ | R134, P16–18 (applies without the legacy `--baseline` flag of `wrap.py`) |
| Enforce only adds one attributed verdict before the original response, on a confirmed FAIL | /security, FAQ | P76–78 |
| Scan performs real writes; disposable accounts only; cannot tell whether an account is a test account | /security | S3–7 |
| Report redaction is best effort; review before sharing; POSIX mode 0600; Windows follows directory ACL | /security | S28–35 |
| "Audit it yourself": link cards (Source code, SECURITY.md, PILOT.md, v0.3.0 release and digests); hash commands for Linux and Windows PowerShell | /security | Same links and commands as before; digests are on the GitHub release page (see *Other sources*) |
| Digest-match illustration ("release page" / "your download", "= match") | /security | Illustrative only, labeled "Illustration with placeholder digests"; the strings contain "placeholder" and non-hex characters, never a real digest |
| No SOC 2 / ISO certification claimed | /security | Statement of absence; nothing in the repo claims one |

## Field evidence

| Claim | Where | Source |
|---|---|---|
| As of 2026-10-01 | Home | R7 |
| 4 official vendor MCP servers (4 companies), run locally against live APIs, disposable accounts or invalid credentials; vendors not named | Home | R9–11, R22 |
| 3 of 4 returned API failures as successful tool results without `isError`; each reproduced at least twice and reported upstream | Home | R15, R275–282 |
| Reported by Fourgate as `UNKNOWN / success_without_record_id` | Home | R21–22, R280–281 |
| Hosted authoritative read-back exercised: PASS, with FAIL and UNKNOWN controls behaving as specified | Home | R16, R256–264 |
| Real-agent shadow calls exercised: 2 protected send calls through the runtime wrap in shadow mode, both PASS; a smoke test | Home | R17, R266–273 |
| 0 naturally occurring read-back-proven silent-success incidents observed so far | Home | R18, R263, R282–284 |
| "not observed yet" tag on the 0 row; 3-of-4 pips (3 filled, 1 empty); check chips on the "Exercised" rows | Home field evidence (presentation only) | R18 (0 observed so far); R15 (3 of 4); R16–17 (exercised) |
| One integration does not establish production reliability | Home | R263–264 |

`specs/field-observations.md` (F) was read and is consistent with the above (24 real
`tools/call` results, zero `silent_empty`, F94–95); none of its numbers are shown on
the site.

## Latency and requirements

| Claim | Where | Source |
|---|---|---|
| Each check capped at 2000 ms; HTTP verifier measured 1.2–1.6 s per call on a Windows laptop; a first cold call exceeded its budget | FAQ, design partner | R290, P104–105 |
| Pilot steps: scope call (30 min, up to three write tools), contracts reviewed with you, test-account scan (PASS on a healthy write, FAIL on a deliberate mismatch), CI job added through a pull request you merge, fix report with evidence and a review call at day 30 | /design-partner | Scope call, contracts and scan: P85–95; CI job: CI template R105–122; fix report and day-30 call: founder-set pilot terms (see Pricing row) |
| Requirements and limits (stdio, HTTPS GET, 2000 ms, hand-written contracts, Python 3.10+, Windows and Linux) | /design-partner, pricing FAQ | P97–107 |

## Other sources (not the four product files)

| Item | Source |
|---|---|
| Tagline | `pyproject.toml` `description` at `1d7b900`; v0.3.0 GitHub release notes |
| SHA-256 digests on the release page | GitHub Releases API for `v0.3.0`: wheel `0f5d48f9…fd3b`, sdist `faa3d644…6f5a` |
| Demo output and `public/sample-report.html` | A run of `fourgate demo --pace 0`, fourgate 0.3.0 from PyPI, fresh venv outside `%TEMP%`, Windows 11, Python 3.14.6, 2026-10-02, exit 0. The sample report is that run's `fourgate-demo-summary.html`, byte-identical (`.gitattributes` keeps it from line-ending conversion). The text capture had a PowerShell BOM and CRLF line endings removed, and the two absolute local paths in its closing summary shortened to `./fourgate-demo/demo-outcomes.jsonl` and `./fourgate-demo/fourgate-demo-summary.html` (noted on the site as "paths shortened"). The build checks the rest against a SHA-256 of the original. |
| `src/content/fourgate-init-output.txt`, `fourgate-doctor-output.txt` | `fourgate init` (README R157 flags) and `fourgate doctor --contracts fourgate-config/runtime.json --server server --log outcomes.jsonl -- python -m fourgate.demo.server`, fourgate 0.3.0, run in `C:g-example` with `READBACK_TOKEN` set to a dummy value, 2026-10-02, both exit 0. Unedited apart from CRLF line endings. |
| `src/content/init-example/*.json` | `fourgate init` 0.3.0 run with the flags in R157 |
| Pricing: Open Source free; Fourgate Founding Pilot $300 one-time and its inclusions (founder-assisted setup, outcome contracts for up to three write tools, CI job via a pull request you merge, PASS / FAIL / UNKNOWN fix report with evidence, day-30 review call), invoiced after the scope call (no online checkout); nothing renews automatically; ongoing support optional, by agreement; Enterprise by contact; free short evaluation | Commercial terms set by the founder for this site (home teaser, /pricing card, comparison, FAQ "What happens after the pilot?", /design-partner "What you get"). These are offers, not product claims. The CI job rests on the CI template (R105–122; fails on FAIL or UNKNOWN, not yet run against a hosted connector); checks run against a test account you create (S3–7). No refund, subscription or ongoing-support terms are offered. |

## W2: docs and blog (product repository tag v0.3.0)

Sources for this section are files in [hifzabuildsai/fourgate](https://github.com/hifzabuildsai/fourgate)
at tag `v0.3.0` (commit `f8a03f9`). **Line numbers here refer to that tag**, not to the
`1d7b900` commit used by the sections above, so the same README line can have a different
number. Extra abbreviations: **SC** = `specs/scan-contract-v1.md`, **OG** = `specs/outcome-guard-mvp.md`,
**H** = `HANDOFF.md`, **O** = `OPERATOR.md`, **CI** = `examples/ci/fourgate-scan.yml`,
**GH** = `fixtures/contracts/scan_github_issue.example.json`.

| Page | Claim | Source |
|---|---|---|
| /docs | Catches MCP tools that say success when nothing happened; pre-alpha; v0.3.0 | R3, R5 |
| /docs | Local stdio only; hand-authored contracts; `verify_http` generic GET, no database adapters; no dashboard, alerting, gateway, retry, compensation | R279–283, P144–145 |
| /docs/quickstart | Python 3.10–3.13, Linux or Windows; git install from tag; wheel on the release; `fourgate --version`; `pip install .` from checkout | R31–47 |
| /docs/quickstart | `fourgate demo`: no keys, no network, five real MCP sessions, guarded through real `fourgate guard`, self-check, summary at `./fourgate-demo/fourgate-demo-summary.html`; `--pace 2`; the five scenes; simulated connector | R133–141 |
| /docs/quickstart | Fixture scan commands; expected `FAIL / record_missing`, exit 1; healthy exit 0; reports written | R62–86 |
| /docs/quickstart, /docs/concepts | PASS unchanged; FAIL prepends `outcome_failed` in enforce; UNKNOWN (crash, timeout, malformed output, missing selector, internal fault) fails open, unchanged; UNKNOWN never PASS | R119–123, R83, R139 |
| /docs/concepts | Only contracted tools protected; extract allowlist; verifier stdin/stdout protocol; `allowed_failure_reasons`; mandatory capped `timeout_ms` (cap 2000 ms) | OG26, OG49–55, OG103–107, OG121 |
| /docs/concepts | Contract example JSON | R185–205 |
| /docs/concepts | LLM may draft contracts, a human must approve; generation not implemented | OG56, R279 |
| /docs/concepts | Deterministic read-back, no LLM; `verify_http` is the scan's bounded GET; GET only, never writes, deletes or retries a write | R117, R178–181, P88–90 |
| /docs/concepts | PASS needs matching authoritative response; FAIL = confirmed mismatch or operator-approved missing status; other uncertainty UNKNOWN | H26–30 |
| /docs/concepts | Separate read-only credential; `secret_env` removed from server env | P105–115, R181–183, OG57 |
| /docs/concepts | Correlation by JSON-RPC id | OG61–63, OG135 |
| /docs/concepts | Shadow default, unchanged bytes; enforce changes only on confirmed FAIL; four-key verdict; example; structural evidence only; enforce after clean shadow traffic | R125, P61–63, OG65–97, OG113, R176 |
| /docs/concepts | Invalid contracts: guard exits 2, server not launched; per-call faults UNKNOWN, fail open; outer guard bounds an internal hang | R176, P124–128, OG115, OG134 |
| /docs/concepts | UNKNOWN cases: 401/403; GitHub 404 by default (missing access and missing record look alike); generic 404 only if `missing_statuses`; `success_without_record_id` does not prove whether a write occurred | S37–41, SC51–58, SC74–77 |
| /docs/concepts | scan exits 1 on UNKNOWN; CI fails on FAIL or UNKNOWN; summary counts PASS/FAIL/UNKNOWN | R83, R101–102, R214 |
| /docs/guides/first-tool | scan performs real writes, disposable accounts, label confirmation, no extra tools, no retry of a timed-out write | S3–7, R88, SC1–6 |
| /docs/guides/first-tool | init command, three files, `--dir`, `--force`, validation, next steps, no secrets, never reads values, never starts server or contacts endpoint | R148–153 |
| /docs/guides/first-tool | doctor command, checks, exit 0/1/2, never sends tools/call or makes requests, limits | R158–164 |
| /docs/guides/first-tool | scan validates before launching, lists tools, calls only contracted names; reports only with `--report-dir`; healthy PASS / deliberate mismatch FAIL | SC71–73, S28–32, P135–136 |
| /docs/guides/first-tool | guard command; stderr summary; point client at the wrapper / back at original | R168–176, H145, P102–103 |
| /docs/guides/first-tool | `readback.json` `timeout_ms` ≤ 1500; list read credentials in `secret_env` | R220–225 |
| /docs/guides/first-tool | Verifier dry run and stderr example | H134–144 |
| /docs/guides/first-tool | summary command and contents; `--json` | R210–218 |
| /docs/guides/http-auth | Bearer default; header, prefix and Basic variants (table) | R220–225, O183–202 |
| /docs/guides/http-auth | Static non-secret `headers`; credential-looking and transport names rejected; `expected_fields` dot paths; 404 stays UNKNOWN unless `missing_statuses` | S16–18, O204–211, O213–228 |
| /docs/guides/http-auth | HTTPS off loopback only, static host, no redirects, 401/403 UNKNOWN; least-privilege read token | S37–38, SC48–62, S43 |
| /docs/guides/github-issues | Template needs disposable repo, tokens, e2e acceptance; not validated e2e | R93–94, SC8–11, SC82–84, H180 |
| /docs/guides/github-issues | `github_issue` fields, attempts/interval/timeout ranges, GET only; 404 UNKNOWN, `missing_is_fail` | SC54–62 |
| /docs/guides/github-issues | Template JSON | GH 1–39 |
| /docs/guides/ci | What the workflow does; edit points; two secrets; real writes; private repo; own CI against demo fixture; not run against a hosted connector | R98–113 |
| /docs/guides/ci | Workflow text; triggers, concurrency, exit codes, advice against `pull_request` | CI 1–100 |
| /docs/guides/windows | Windows and Linux, Python 3.10–3.13; PowerShell fixture scan | R31, R72–78, P152 |
| /docs/guides/windows | Operator guide is PowerShell 5.1; credential prompt, `setx` warning, redaction by variable name | O1–6, O107–137 |
| /docs/guides/windows | BOM error and .NET save; blocked scripts/executables on the author's machine | O230–247, O454, O44–54 |
| /docs/guides/windows | POSIX 0600, Windows ACL; case-insensitive `secret_env` on Windows; 1.2–1.6 s measured on one Windows laptop | S33–35, OG57, R281, H185–187 |
| /docs/reference/commands | Command list and purposes | R49–58 |
| /docs/reference/commands | Flags: `--pace 2` (R133); init flags (R148–153); doctor (R158–164); scan (R68–70, S28–29, SC3–6); guard (R168–176); summary (R210–218); `verify_http` (R178–180, H98–106); legacy `wrap.py` flags (H149, OG65–66) | as listed |
| /docs/reference/contracts | Runtime contract fields, selectors, verifier protocol, `evidence` on FAIL | OG28–57, SC30–44, O174–179, H91–94, H120–133 |
| /docs/reference/contracts | Scan contract fields and ranges | SC13–29, SC71–80 |
| /docs/reference/contracts | Read-back object fields and ranges; `readback_unconfirmed` evidence | SC46–69, O195–208, R220–225 |
| /docs/reference/outcome-log | Log contents and exclusions; one line per call; `status`, `reason_code`, `gate_ms` | P98, H157–167 |
| /docs/reference/outcome-log | `outcome_failed` four keys and example | OG83–97, OG113 |
| /docs/reference/outcome-log | Reason codes and meanings | O344–358, H159–164, R21, SC75–77 |
| /docs/reference/exit-codes | scan 0/1/2 (+ launch failure, report I/O); doctor 0/1/2; guard 2; verify_http | SC79–80, R80–86, O321–323, H58–60, R161, R176, H103–106, H139–141 |
| /docs/security | Runs on your machines; no telemetry; GET only; nothing-leaves caveat; what is stored; credentials; read-back safety; scan writes; redaction; 0600 | P54–63, P88–115, S1–45 |
| /blog/mcp-servers-field-record | 4 vendor servers from 4 companies, local stdio, live APIs, disposable accounts or invalid credentials; results table; no `isError` signal; `UNKNOWN / success_without_record_id`; vendors not named; 0 read-back-proven silent success | R9–23, R266–275 |
| /blog/mcp-servers-field-record | Honest-limits paragraph | Verbatim copy of the home-page evidence paragraph (`src/app/page.tsx`) |
| /blog/unknown-is-never-pass | Three outcomes, UNKNOWN cases, scene 5, scan/CI/summary behavior, fail open vs startup, latency | R119–123, R139, R83, R101–102, R214, R281, S37–41, P124–128, H142–144 |

Not in the v0.3.0 source, so omitted: see the "Gaps" list in the pull request description.

## W3: install via PyPI and the VerdictExplorer widget

Same source as W2 (tag `v0.3.0`, abbreviations as above). Widget mappings live in
`src/content/verdict-explorer.ts`; the id in the first column is its `claim` field.

| Id | Claim | Source |
|---|---|---|
| W3-0 | `fourgate` 0.3.0 is on PyPI; `python -m pip install fourgate` is the primary install (git tag and wheel remain as alternatives). The v0.3.0 README says "Fourgate is not on PyPI yet" (R39–40), which is out of date | PyPI project page <https://pypi.org/project/fourgate/> (checked 2026-10-03: latest and only release 0.3.0); install alternatives R33–39 |
| W3-1 | Success with ID + every expected field matches → PASS / `postcondition_satisfied` | O346, O269 |
| W3-2 | Record exists, a field differs → FAIL / `field_mismatch` | O347, H28–29 |
| W3-3 | GET returned a status listed in `missing_statuses` on every attempt → FAIL / `record_missing` | O348, SC49–51 |
| W3-4 | 404 not listed in `missing_statuses` → UNKNOWN (`readback_unconfirmed`) | SC50–53, O209–211, O349 |
| W3-5 | 401/403 → UNKNOWN (`readback_unconfirmed`) | S38, O349, O460 |
| W3-6 | Any other status (429/5xx) → UNKNOWN (`readback_unconfirmed`) | O349 |
| W3-7 | 200 but an `expected_fields` path is absent → UNKNOWN / `readback_shape_invalid` | O356 |
| W3-8 | Network failure or read-back budget exhausted → UNKNOWN / `readback_error`, `readback_timeout` | O357 |
| W3-9 | Success without `isError` but no record ID → UNKNOWN / `success_without_record_id`, zero read-back attempts, does not prove whether a write occurred | SC75–77, O350, R21 |
| W3-10 | `isError: true` or JSON-RPC error → UNKNOWN / `not_success_result`; Fourgate verifies results after a connector reports success | O351, O298–299, R117 |
| W3-11 | scan exit code 0 only when every case is PASS, 1 for any FAIL or UNKNOWN; UNKNOWN never counted as PASS | SC79–80, R83 |
| W3-12 | Under `guard`, a failing or timed-out verifier is recorded as `verifier_error` / `verifier_timeout` and the call goes through | H161–164, P126–128 |
| Post 1 table | Five-row field record, identical wording to the home page `evidence` list (`src/app/page.tsx`) | R9–23, R266–275 |
