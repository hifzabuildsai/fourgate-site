/*
  Packet rules for the four-gates hero. Pure TypeScript (no three.js), so the
  rules can be checked headlessly: node scripts/check-gate-simulation.ts

  Gates, nearest first; packets (tool calls) travel toward -z:
    1 "Tool says done"            unk1: tool returned isError (not_success_result) -> UNKNOWN, drops
    2 "Extract contracted fields" unk2: required field / record ID missing          -> UNKNOWN, drops
    3 "Independent read-back"     fail3: record missing or field mismatch           -> FAIL, drops
                                  unk3: read-back unreachable                       -> UNKNOWN, stops, fades
    4 "Verdict"                   pass: only PASS packets ever cross this gate       -> PASS

  Calls leave a conveyor at a fixed interval, following a 20-call sequence:
  12 PASS (60%), 4 FAIL (20%, all at gate 3), 4 UNKNOWN (20%: gate 1, gate 2,
  and twice at gate 3). Positions in the sequence are chosen so each outcome's
  on-screen window overlaps the next one of its kind: all three outcomes are
  always visible, with 2-3 failed calls lying under gate 3.
*/

export const GATE_Z = [1.2, -1.6, -4.4, -7.2] as const;
export const SPAWN_Z = GATE_Z[0] + 2.2;
export const PASS_END = -10.2;
const FLOOR_Y = 0.09;
const SPEED = 1.3;

export type Kind = "pass" | "fail3" | "unk1" | "unk2" | "unk3";
export type Phase = "idle" | "travel" | "drop" | "halt" | "passed";
export type Tint = "neutral" | "pass" | "fail" | "unknown";

export type Packet = {
  kind: Kind;
  phase: Phase;
  x: number;
  y: number;
  z: number;
  vy: number;
  t: number;
  opacity: number;
};

// Index:          0        1       2       3       4       5        6       7       8       9
const SEQUENCE: Kind[] = [
  "fail3", "pass", "unk2", "pass", "pass", "fail3", "pass", "unk3", "pass", "pass",
  "fail3", "pass", "unk3", "pass", "pass", "fail3", "pass", "unk1", "pass", "pass",
];

/** Seconds a packet stays after its verdict, before fading. */
const LINGER = { fail: 8, unknownDrop: 5, unknownHalt: 2.5 } as const;
const FADE = 1.4;

export function tint(p: Packet): Tint {
  if (p.phase === "passed") return "pass";
  if (p.phase === "drop") return p.kind === "fail3" ? "fail" : "unknown";
  if (p.phase === "halt") return "unknown";
  return "neutral";
}

export function gateOf(kind: Kind): number {
  return kind === "unk1" ? GATE_Z[0] : kind === "unk2" ? GATE_Z[1] : kind === "pass" ? GATE_Z[3] : GATE_Z[2];
}

export class GateInvariantError extends Error {}

/**
 * The verdict rule, enforced on every step: nothing but a PASS packet is ever
 * beyond gate 4, and only PASS packets can be in the "passed" phase.
 * Strict mode (development, tests) throws; otherwise the packet is removed.
 */
export function assertVerdictGate(p: Packet, strict: boolean) {
  if (p.phase === "idle") return;
  const beyondVerdict = p.z < GATE_Z[3];
  const bad = (beyondVerdict && !(p.kind === "pass" && p.phase === "passed")) || (p.phase === "passed" && p.kind !== "pass");
  if (!bad) return;
  if (strict) throw new GateInvariantError(`non-PASS packet beyond the verdict gate: ${JSON.stringify(p)}`);
  p.phase = "idle";
  p.opacity = 0;
}

function stepPacket(p: Packet, d: number) {
  switch (p.phase) {
    case "travel": {
      p.z -= SPEED * d;
      p.opacity = Math.min(1, (SPAWN_Z - p.z) / 0.9);
      if (p.kind !== "pass" && p.z <= gateOf(p.kind)) {
        p.z = gateOf(p.kind);
        p.phase = p.kind === "unk3" ? "halt" : "drop";
        p.t = 0;
      } else if (p.kind === "pass" && p.z <= GATE_Z[3]) {
        p.phase = "passed";
        p.t = 0;
      }
      break;
    }
    case "drop": {
      p.t += d;
      if (p.y > FLOOR_Y) {
        p.vy -= 6 * d;
        p.y = Math.max(FLOOR_Y, p.y + p.vy * d);
        // A little forward momentum while falling, never past the gate it failed at.
        p.z = Math.max(p.z - SPEED * 0.15 * d, gateOf(p.kind) - 0.35);
      }
      const linger = p.kind === "fail3" ? LINGER.fail : LINGER.unknownDrop;
      p.opacity = p.t < linger ? 1 : Math.max(0, 1 - (p.t - linger) / FADE);
      if (p.opacity <= 0) p.phase = "idle";
      break;
    }
    case "halt": {
      p.t += d;
      p.opacity = p.t < LINGER.unknownHalt ? 1 : Math.max(0, 1 - (p.t - LINGER.unknownHalt) / FADE);
      if (p.opacity <= 0) p.phase = "idle";
      break;
    }
    case "passed": {
      p.t += d;
      p.z -= SPEED * d;
      p.opacity = Math.max(0, Math.min(1, (p.z - PASS_END) / 1.2));
      if (p.z <= PASS_END) p.phase = "idle";
      break;
    }
  }
}

export class GateSimulation {
  readonly packets: Packet[];
  private readonly interval: number;
  private readonly strict: boolean;
  private seq = 0;
  private clock = 0;

  constructor(interval = 0.75, strict = false, poolSize = 32) {
    this.interval = interval;
    this.strict = strict;
    this.packets = Array.from({ length: poolSize }, () => ({
      kind: "pass" as Kind,
      phase: "idle" as Phase,
      x: 0,
      y: 0,
      z: SPAWN_Z,
      vy: 0,
      t: 0,
      opacity: 0,
    }));
    // Pre-roll so the scene starts in its steady state, with every outcome on screen.
    for (let i = 0; i < 40 * 30; i++) this.step(1 / 30);
  }

  private spawn() {
    const p = this.packets.find((q) => q.phase === "idle");
    if (!p) return;
    const n = this.seq++;
    p.kind = SEQUENCE[n % SEQUENCE.length];
    p.phase = "travel";
    p.x = Math.sin(n * 1.7) * 0.5;
    p.y = 0.5 + ((n * 0.37) % 1.3);
    p.z = SPAWN_Z;
    p.vy = 0;
    p.t = 0;
    p.opacity = 0;
  }

  step(dt: number) {
    const d = Math.min(dt, 0.05);
    this.clock += d;
    while (this.clock >= this.interval) {
      this.clock -= this.interval;
      this.spawn();
    }
    for (const p of this.packets) {
      stepPacket(p, d);
      assertVerdictGate(p, this.strict);
    }
  }
}
