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
| Gate 1 "Tool says done": the check starts after a connector reports success | Hero labels | R126 ("After a connector reports success") |
| Gate 2 "Extract contracted fields" | Hero labels | R126 ("extracts only the minimum contract-approved fields"), P32 |
| Gate 3 "Independent read-back" | Hero labels | R126 ("deterministic authoritative verifier"), P34–35 |
| Gate 4 "Verdict": PASS / FAIL / UNKNOWN | Hero labels | R128–132 |
| FAIL packets turn red at the read-back and drop; UNKNOWN packets turn amber there, stop, and never continue or turn green | Hero scene | R92 and R148 (UNKNOWN is never PASS); R132, P81–82 (fails open; the call is not blocked) |
| Legend: PASS = read-back found the record with the contracted values; FAIL = proved missing or different; UNKNOWN = could not confirm, never reported as success | Hero legend | R16, R128–132, R92; reason texts in the demo summary page |
| Packet ratio and motion are illustrative, not measured | Hero | Stated in README "What's real vs. illustrative" |

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
| One integration does not establish production reliability | Home | R263–264 |

`specs/field-observations.md` (F) was read and is consistent with the above (24 real
`tools/call` results, zero `silent_empty`, F94–95); none of its numbers are shown on
the site.

## Latency and requirements

| Claim | Where | Source |
|---|---|---|
| Each check capped at 2000 ms; HTTP verifier measured 1.2–1.6 s per call on a Windows laptop; a first cold call exceeded its budget | FAQ, design partner | R290, P104–105 |
| Pilot steps: scope (30 min), contracts, test-account scan, shadow run (doctor first), review | /design-partner | P85–95 |
| Requirements and limits (stdio, HTTPS GET, 2000 ms, hand-written contracts, Python 3.10+, Windows and Linux) | /design-partner, pricing FAQ | P97–107 |

## Other sources (not the four product files)

| Item | Source |
|---|---|
| Tagline | `pyproject.toml` `description` at `1d7b900`; v0.3.0 GitHub release notes |
| SHA-256 digests on the release page | GitHub Releases API for `v0.3.0`: wheel `0f5d48f9…fd3b`, sdist `faa3d644…6f5a` |
| Demo output and `public/sample-report.html` | A run of `fourgate demo --pace 0`, fourgate 0.3.0 from PyPI, fresh venv outside `%TEMP%`, Windows 11, Python 3.14.6, 2026-10-02, exit 0. The sample report is that run's `fourgate-demo-summary.html`, byte-identical (`.gitattributes` keeps it from line-ending conversion). The text capture had a PowerShell BOM and CRLF line endings removed, and the two absolute local paths in its closing summary shortened to `./fourgate-demo/demo-outcomes.jsonl` and `./fourgate-demo/fourgate-demo-summary.html` (noted on the site as "paths shortened"). The build checks the rest against a SHA-256 of the original. |
| `src/content/fourgate-init-output.txt`, `fourgate-doctor-output.txt` | `fourgate init` (README R157 flags) and `fourgate doctor --contracts fourgate-config/runtime.json --server server --log outcomes.jsonl -- python -m fourgate.demo.server`, fourgate 0.3.0, run in `C:g-example` with `READBACK_TOKEN` set to a dummy value, 2026-10-02, both exit 0. Unedited apart from CRLF line endings. |
| `src/content/init-example/*.json` | `fourgate init` 0.3.0 run with the flags in R157 |
| Pricing: Open Source free; Founding Design Partner $199/month and its inclusions; Enterprise by contact; free short evaluation | Commercial terms set by the founder for this site. These are offers, not product claims. |
