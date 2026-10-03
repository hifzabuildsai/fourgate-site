import { GATE_LABELS } from "./gates";

/**
 * Still image of the gate scene (reduced motion, or no WebGL). Same rules as the
 * animation: UNKNOWN (amber) dropped at gates 1 and 2 and stopped at gate 3,
 * FAIL (red) dropped under gate 3, and only PASS (green) beyond gate 4.
 * Colors come from the theme tokens, so it follows light and dark mode.
 */
const gates = [
  { x: 40, y: 138, w: 200, h: 280 },
  { x: 290, y: 180, w: 150, h: 214 },
  { x: 500, y: 212, w: 115, h: 163 },
  { x: 665, y: 235, w: 88, h: 124 },
];
// Floor line from (10,431) to (790,351): y at a given x.
const floor = (x: number) => 431 - ((x - 10) * 80) / 780;
const metal = "color-mix(in srgb, var(--foreground) 78%, var(--background))";

function Box({ x, y, fill, w = 13, h = 9 }: { x: number; y: number; fill: string; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} />;
}

export default function StaticGates({ numbersOnly = false }: { numbersOnly?: boolean }) {
  return (
    <svg viewBox="0 0 800 470" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="10" y1="431" x2="790" y2="351" stroke="var(--line-strong)" />
      {gates.map((g, i) => (
        <g key={i}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} fill="var(--foreground)" fillOpacity="0.03" />
          <path
            d={`M${g.x} ${g.y + g.h}V${g.y}H${g.x + g.w}V${g.y + g.h}`}
            fill="none"
            stroke={metal}
            strokeWidth={Math.max(3, 7 - i * 1.3)}
            strokeLinejoin="round"
          />
          {numbersOnly ? (
            <text x={g.x + g.w / 2} y={g.y - 16} textAnchor="middle" fill="var(--foreground)" fontSize="30" fontFamily="var(--font-geist-mono)">
              {i + 1}
            </text>
          ) : (
            <text
              x={g.x + g.w / 2}
              y={i % 2 === 0 ? g.y - 16 : g.y + g.h + 26}
              textAnchor="middle"
              fill="var(--foreground)"
              fontSize="14"
              fontFamily="var(--font-geist-sans)"
            >
              <tspan fill="var(--muted)" fontFamily="var(--font-geist-mono)">{i + 1} </tspan>
              {GATE_LABELS[i]}
            </text>
          )}
        </g>
      ))}
      {/* Calls in flight: neutral until a verdict */}
      <Box x={8} y={318} fill="var(--muted)" />
      <Box x={262} y={300} fill="var(--muted)" />
      <Box x={455} y={302} fill="var(--muted)" />
      {/* UNKNOWN dropped at gate 1 (tool returned an error) and gate 2 (field missing) */}
      <Box x={132} y={floor(138) - 12} fill="var(--unknown)" />
      <Box x={362} y={floor(368) - 11} fill="var(--unknown)" />
      {/* UNKNOWN stopped at gate 3 (read-back unreachable) */}
      <Box x={548} y={276} fill="var(--unknown)" />
      {/* FAIL dropped under gate 3: two failed calls on the floor */}
      <Box x={560} y={floor(566) - 10} fill="var(--fail)" />
      <Box x={585} y={floor(591) - 10} fill="var(--fail)" />
      {/* PASS: only these cross gate 4 */}
      <Box x={766} y={292} fill="var(--pass)" w={11} h={8} />
      <Box x={786} y={280} fill="var(--pass)" w={11} h={8} />
    </svg>
  );
}
