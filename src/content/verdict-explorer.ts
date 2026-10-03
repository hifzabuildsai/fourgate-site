// Inputs and mappings for the VerdictExplorer widget on the "Why UNKNOWN is never PASS" post.
// Every row is a documented mapping from the fourgate v0.3.0 sources; `claim` is its id in CLAIMS.md (section W3).
// A combination that is not documented is not offered.

export type Verdict = "PASS" | "FAIL" | "UNKNOWN";

export type Result = { verdict: Verdict; reason: string; why: string; claim: string };

export type ReportedId = "success-id" | "success-no-id" | "error";

export const reported: { id: ReportedId; label: string; hint: string }[] = [
  { id: "success-id", label: "Success, with the record ID", hint: "No isError, and the contract's ID selector finds an ID." },
  { id: "success-no-id", label: "Success, but no record ID", hint: "No isError, but the ID selector finds nothing." },
  { id: "error", label: "An error", hint: "isError is true, or a JSON-RPC error." },
];

export type ReadbackId = "match" | "mismatch" | "missing-listed" | "missing-unlisted" | "denied" | "other-status" | "shape" | "network";

export const readbacks: { id: ReadbackId; label: string; hint: string }[] = [
  { id: "match", label: "Record found, every field matches", hint: "HTTP 200 and every expected field equals what was sent." },
  { id: "mismatch", label: "Record found, a field differs", hint: "The record exists but a compared field has another value." },
  { id: "missing-listed", label: "A status you listed as \"missing\"", hint: "For example 404 listed in missing_statuses, returned on every attempt." },
  { id: "missing-unlisted", label: "404, not listed as \"missing\"", hint: "The default: you did not opt in to treating 404 as evidence of absence." },
  { id: "denied", label: "401 or 403", hint: "The read key was refused." },
  { id: "other-status", label: "Another status (429, 5xx)", hint: "The GET returned a status that is neither success nor listed as missing." },
  { id: "shape", label: "200, but an expected field is absent", hint: "The response has no value at an expected_fields path." },
  { id: "network", label: "Network failure or out of time", hint: "The GET failed, or the read-back time budget ran out." },
];

/** Verdicts when the tool reported success with an ID: indexed by read-back. */
export const withReadback: Record<ReadbackId, Result> = {
  match: {
    verdict: "PASS",
    reason: "postcondition_satisfied",
    why: "The independent GET found the record and every expected field matched.",
    claim: "W3-1",
  },
  mismatch: {
    verdict: "FAIL",
    reason: "field_mismatch",
    why: "The record exists, but a field differs from what was sent.",
    claim: "W3-2",
  },
  "missing-listed": {
    verdict: "FAIL",
    reason: "record_missing",
    why: "The GET returned a status you listed in missing_statuses on every attempt.",
    claim: "W3-3",
  },
  "missing-unlisted": {
    verdict: "UNKNOWN",
    reason: "readback_unconfirmed",
    why: "A 404 stays UNKNOWN unless you explicitly authorize it as evidence of absence.",
    claim: "W3-4",
  },
  denied: {
    verdict: "UNKNOWN",
    reason: "readback_unconfirmed",
    why: "A 401 or 403 means the read key or its scope is wrong. It says nothing about the record.",
    claim: "W3-5",
  },
  "other-status": {
    verdict: "UNKNOWN",
    reason: "readback_unconfirmed",
    why: "Any other status leaves the outcome unconfirmed.",
    claim: "W3-6",
  },
  shape: {
    verdict: "UNKNOWN",
    reason: "readback_shape_invalid",
    why: "The GET succeeded, but the response cannot be compared with what was sent.",
    claim: "W3-7",
  },
  network: {
    verdict: "UNKNOWN",
    reason: "readback_error or readback_timeout",
    why: "The read-back could not finish, so Fourgate cannot say either way.",
    claim: "W3-8",
  },
};

/** Verdicts that do not depend on the read-back. */
export const withoutReadback: Record<Exclude<ReportedId, "success-id">, Result> = {
  "success-no-id": {
    verdict: "UNKNOWN",
    reason: "success_without_record_id",
    why: "There is no ID to look up, so no read-back is attempted. This does not prove whether a write occurred.",
    claim: "W3-9",
  },
  error: {
    verdict: "UNKNOWN",
    reason: "not_success_result",
    why: "Fourgate checks results the tool reported as success. An error result is not checked.",
    claim: "W3-10",
  },
};
