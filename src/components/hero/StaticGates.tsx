import { GATE_LABELS } from "./gates";

/**
 * Still image of the gate scene for reduced motion or no WebGL: four gates in
 * perspective, calls in flight, PASS beyond gate 4, a FAIL dropping and an
 * UNKNOWN stopped at gate 3.
 */
const gates = [
  { x: 40, y: 138, w: 200, h: 280 },
  { x: 290, y: 180, w: 150, h: 214 },
  { x: 500, y: 212, w: 115, h: 163 },
  { x: 665, y: 235, w: 88, h: 124 },
];

export default function StaticGates({ numbersOnly = false }: { numbersOnly?: boolean }) {
  return (
    <svg viewBox="0 0 800 470" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="10" y1="431" x2="790" y2="351" stroke="#26303b" />
      {gates.map((g, i) => (
        <g key={i}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} fill="#e9e4d8" fillOpacity="0.03" />
          <path
            d={`M${g.x} ${g.y + g.h}V${g.y}H${g.x + g.w}V${g.y + g.h}`}
            fill="none"
            stroke="#e9e4d8"
            strokeWidth={Math.max(3, 7 - i * 1.3)}
            strokeLinejoin="round"
          />
          {numbersOnly ? (
            <text x={g.x + g.w / 2} y={g.y - 16} textAnchor="middle" fill="#e9e4d8" fontSize="30" fontFamily="var(--font-jetbrains-mono)">
              {i + 1}
            </text>
          ) : (
            <text
              x={g.x + g.w / 2}
              y={i % 2 === 0 ? g.y - 16 : g.y + g.h + 26}
              textAnchor="middle"
              fill="#e9e4d8"
              fontSize="14"
              fontFamily="var(--font-archivo)"
            >
              <tspan fill="#9aa3ad" fontFamily="var(--font-jetbrains-mono)">{i + 1} </tspan>
              {GATE_LABELS[i]}
            </text>
          )}
        </g>
      ))}
      {/* Calls in flight: neutral until a verdict */}
      {[
        [8, 320],
        [130, 300],
        [255, 328],
        [455, 300],
      ].map(([x, y]) => (
        <rect key={`n${x}`} x={x} y={y} width="14" height="10" rx="2" fill="#e9e4d8" />
      ))}
      {/* UNKNOWN: stopped at gate 3 */}
      <rect x="550" y="290" width="12" height="9" rx="2" fill="#f2b84b" />
      {/* FAIL: dropped under gate 3 */}
      <path d="M572 308 Q 578 335 580 356" stroke="#f0645a" strokeOpacity="0.45" strokeDasharray="3 4" fill="none" />
      <rect x="574" y="358" width="12" height="9" rx="2" fill="#f0645a" />
      {/* PASS: beyond gate 4 */}
      {[
        [766, 292],
        [786, 280],
      ].map(([x, y]) => (
        <rect key={`p${x}`} x={x} y={y} width="11" height="8" rx="2" fill="#5fd3a0" />
      ))}
    </svg>
  );
}
