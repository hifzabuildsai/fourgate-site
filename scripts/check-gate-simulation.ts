/*
  Headless check of the hero's packet rules (run: node scripts/check-gate-simulation.ts).
  Steps the real simulation in strict mode for 10 simulated minutes and asserts:
    - red (FAIL) only ever appears at gate 3, amber (UNKNOWN) only at gates 1, 2 or 3;
    - nothing but a green PASS packet is ever beyond gate 4 (strict mode throws otherwise);
    - all three outcomes are visible in every frame, with 2-3 red packets on screen.
*/
import { GATE_Z, GateSimulation, tint } from "../src/components/hero/simulation.ts";

const FPS = 60;
const SECONDS = 600;
const VISIBLE = 0.3;
const near = (z: number, gate: number) => z <= gate + 1e-6 && z >= gate - 0.4;

let failures = 0;
function check(ok: boolean, msg: string) {
  if (!ok) {
    failures++;
    if (failures < 10) console.error("FAIL:", msg);
  }
}

for (const [name, interval] of [["hero", 0.75]] as const) {
  const sim = new GateSimulation(interval, true);
  const packets = sim.packets;
  const counts = { pass: 0, fail: 0, unknown: 0 };
  const minVisible = { pass: Infinity, fail: Infinity, unknown: Infinity };
  const maxVisible = { pass: 0, fail: 0, unknown: 0 };
  const prevTint = packets.map(tint);

  for (let f = 0; f < SECONDS * FPS; f++) {
    const visible = { pass: 0, fail: 0, unknown: 0 };
    sim.step(1 / FPS);
    packets.forEach((p, i) => {
      if (p.phase === "idle") {
        prevTint[i] = "neutral";
        return;
      }
      const t = tint(p);
      if (t === "fail") {
        check(p.kind === "fail3" && near(p.z, GATE_Z[2]), `red away from gate 3: ${JSON.stringify(p)}`);
      }
      if (t === "unknown") {
        const gate = p.kind === "unk1" ? GATE_Z[0] : p.kind === "unk2" ? GATE_Z[1] : GATE_Z[2];
        check(p.kind.startsWith("unk") && near(p.z, gate), `amber away from its gate: ${JSON.stringify(p)}`);
      }
      if (p.z < GATE_Z[3]) check(t === "pass", `non-green packet beyond gate 4: ${JSON.stringify(p)}`);
      if (t !== "neutral" && prevTint[i] === "neutral") counts[t]++;
      prevTint[i] = t;
      if (t !== "neutral" && p.opacity >= VISIBLE) visible[t]++;
    });
    if (f > FPS) {
      for (const k of ["pass", "fail", "unknown"] as const) {
        minVisible[k] = Math.min(minVisible[k], visible[k]);
        maxVisible[k] = Math.max(maxVisible[k], visible[k]);
      }
    }
  }

  const total = counts.pass + counts.fail + counts.unknown;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;
  console.log(
    `${name.padEnd(7)} verdicts: PASS ${pct(counts.pass)}  FAIL ${pct(counts.fail)}  UNKNOWN ${pct(counts.unknown)}` +
      ` | on screen per frame: PASS ${minVisible.pass}-${maxVisible.pass}, FAIL ${minVisible.fail}-${maxVisible.fail}, UNKNOWN ${minVisible.unknown}-${maxVisible.unknown}`,
  );
  check(minVisible.pass >= 1 && minVisible.fail >= 1 && minVisible.unknown >= 1, "an outcome disappeared from the scene");
  check(minVisible.fail >= 2 && maxVisible.fail <= 4, `red on screen ${minVisible.fail}-${maxVisible.fail}, want 2-3`);
}

if (failures) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("gate simulation: all checks passed");
