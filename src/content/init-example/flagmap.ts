// Which `fourgate init` flag produces which JSON keys, per generated file.
// Derived by scripts/derive-init-flagmap.py: the real `fourgate init` 0.3.0 was run
// with the README flags, then with one flag changed at a time, and the three files
// were diffed by JSON path. Paths use "/" separators; array items are indexed.

export type InitFile = "readback.json" | "runtime.json" | "scan.json";

export type InitFlag = { id: string; flag: string; value: string; produces: Partial<Record<InitFile, string[]>> };

export const INIT_FLAGS: InitFlag[] = [
  {
    id: "tool",
    flag: "--tool",
    value: "create_issue",
    produces: { "runtime.json": ["/tools/create_issue"], "scan.json": ["/write_tools/0", "/cases/0/tool"] },
  },
  { id: "account", flag: "--test-account", value: "disposable-demo", produces: { "scan.json": ["/server/test_account"] } },
  {
    id: "id-path",
    flag: "--id-path",
    value: "result.structuredContent.id",
    produces: {
      "runtime.json": ["/tools/create_issue/extract/record_id/path"],
      "scan.json": ["/cases/0/outcome_contract/extract/record_id/path"],
    },
  },
  {
    id: "url",
    flag: "--readback-url",
    value: "'https://api.example.com/issues/{record_id}'",
    produces: { "readback.json": ["/url_template"], "scan.json": ["/cases/0/readback/url_template"] },
  },
  {
    id: "expect",
    flag: "--expect",
    value: "title=title",
    produces: {
      "readback.json": ["/expected_fields/title"],
      "runtime.json": ["/tools/create_issue/extract/title"],
      "scan.json": ["/cases/0/readback/expected_fields/title", "/cases/0/outcome_contract/extract/title"],
    },
  },
  { id: "arg", flag: "--arg", value: "title=FOURGATE-SCAN-TEST", produces: { "scan.json": ["/cases/0/arguments/title"] } },
  {
    id: "token",
    flag: "--token-env",
    value: "READBACK_TOKEN",
    produces: {
      "readback.json": ["/token_env"],
      "runtime.json": ["/tools/create_issue/verifier/secret_env/0"],
      "scan.json": ["/cases/0/readback/token_env"],
    },
  },
  {
    id: "missing",
    flag: "--missing-status",
    value: "404",
    produces: { "readback.json": ["/missing_statuses/0"], "scan.json": ["/cases/0/readback/missing_statuses/0"] },
  },
  { id: "server", flag: "--", value: "python your_server.py", produces: { "scan.json": ["/server/command/0", "/server/command/1"] } },
];
