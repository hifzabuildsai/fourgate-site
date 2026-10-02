export const GATE_LABELS = [
  "Tool says done",
  "Extract contracted fields",
  "Independent read-back",
  "Verdict",
] as const;

/** One plain sentence per gate: what is checked there (README "Outcome Guard MVP", SECURITY.md). */
export const GATE_TIPS = [
  "Fourgate only checks results the tool reported as success; an error result is recorded as UNKNOWN (not_success_result).",
  "It extracts only the contract-approved fields, such as the record ID; if one is missing, the result is UNKNOWN.",
  "A separate read-only GET asks the system of record for the record: missing or different is FAIL, unreachable is UNKNOWN.",
  "Only a confirmed match is PASS. UNKNOWN is never counted as PASS, and it fails open: the call goes through unchanged.",
] as const;
