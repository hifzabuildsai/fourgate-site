"use client";

/*
  Four gates in depth; each packet is one agent tool call. The rules live in
  ./simulation.ts (checked headlessly by scripts/check-gate-simulation.ts):
  UNKNOWN at gates 1/2/3, FAIL only at gate 3, and only PASS crosses gate 4.
  Ported from the earlier landing page scene (four portals, flying packets, mouse parallax).
*/

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GATE_Z, GateSimulation, tint } from "./simulation";

export type ScenePalette = {
  bg: string;
  metal: string;
  neutral: string;
  grid: string;
  gridMinor: string;
  pass: string;
  fail: string;
  unknown: string;
  glow: string;
};

export const PALETTES: Record<"dark" | "light", ScenePalette> = {
  dark: {
    bg: "#000000",
    metal: "#d4d4d4",
    neutral: "#ededed",
    grid: "#262626",
    gridMinor: "#141414",
    pass: "#3fcf7f",
    fail: "#ff6166",
    unknown: "#f5a524",
    glow: "#ffffff",
  },
  light: {
    bg: "#ffffff",
    metal: "#3f3f46",
    neutral: "#52525b",
    grid: "#e5e5e5",
    gridMinor: "#f2f2f2",
    pass: "#0f7a3d",
    fail: "#cb2a2f",
    unknown: "#9a5700",
    glow: "#000000",
  },
};

const GATE_TOP = 2.42;
/** Labels alternate above (top) and below (floor) the gates so neighbors never collide. */
const LABEL_SIDE = ["top", "bottom", "top", "bottom"] as const;

type GateMats = { metal: THREE.MeshStandardMaterial[]; pane: THREE.MeshBasicMaterial | null };

type Register = (part: "metal" | "pane", m: THREE.Material | null) => void;

function Portal({ z, palette, register }: { z: number; palette: ScenePalette; register: Register }) {
  const metalRef = (m: THREE.MeshStandardMaterial | null) => register("metal", m);
  return (
    <group position={[0, 0, z]}>
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]}>
          <boxGeometry args={[0.12, 2.3, 0.12]} />
          <meshStandardMaterial ref={metalRef} color={palette.metal} metalness={0.25} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 2.36, 0]}>
        <boxGeometry args={[2.42, 0.12, 0.12]} />
        <meshStandardMaterial ref={metalRef} color={palette.metal} metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <planeGeometry args={[2.18, 2.18]} />
        <meshBasicMaterial
          ref={(m) => register("pane", m)}
          color={palette.metal}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 0.05]} />
        <meshBasicMaterial color={palette.metal} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Packets({ palette, sim }: { palette: ScenePalette; sim: GateSimulation }) {
  const group = useRef<THREE.Group>(null);
  const colors = useMemo(
    () => ({
      neutral: new THREE.Color(palette.neutral),
      pass: new THREE.Color(palette.pass),
      fail: new THREE.Color(palette.fail),
      unknown: new THREE.Color(palette.unknown),
    }),
    [palette],
  );

  useFrame((_, delta) => {
    const root = group.current;
    if (!root) return;
    sim.step(delta);
    sim.packets.forEach((p, i) => {
      const mesh = root.children[i] as THREE.Mesh | undefined;
      if (!mesh) return;
      mesh.visible = p.phase !== "idle" && p.opacity > 0.01;
      if (!mesh.visible) return;
      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.y = p.z * 0.4;
      // Unlit and not tone-mapped, so verdict colors render exactly as the tokens.
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.copy(colors[tint(p)]);
      mat.opacity = p.opacity;
    });
  });

  return (
    <group ref={group}>
      {sim.packets.map((_, i) => (
        <mesh key={i} visible={false}>
          <boxGeometry args={[0.17, 0.17, 0.3]} />
          <meshBasicMaterial color={palette.neutral} transparent fog={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Projects each gate's anchor onto the canvas and moves the matching DOM label there. */
function LabelProjector({ anchors, labels }: { anchors: RefObject<(THREE.Object3D | null)[]>; labels: RefObject<(HTMLElement | null)[]> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    anchors.current?.forEach((a, i) => {
      const el = labels.current?.[i];
      if (!a || !el) return;
      a.getWorldPosition(v);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const shift = LABEL_SIDE[i] === "top" ? "translate(-50%, calc(-100% - 10px))" : "translate(-50%, 10px)";
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) ${shift}`;
      el.style.opacity = "1";
    });
  });
  return null;
}

type Framing = { fov: number; pos: [number, number, number]; look: [number, number, number] };

/** Camera framing per layout; values checked by projecting the gate corners for common sizes. */
function framing(overlay: boolean, aspect: number): Framing {
  const pos: [number, number, number] = [8.5, 3.4, 9.5];
  if (overlay) {
    // Gates sit to the right of the headline; aim further left as the canvas widens.
    const lookX = aspect < 1.44 ? -5 - 6.25 * (aspect - 1.28) : -6 - 2.5 * (aspect - 1.44);
    return { fov: 40, pos, look: [Math.min(-4.5, Math.max(-7.5, lookX)), 0.9, -3] };
  }
  if (aspect < 0.95) return { fov: 34, pos, look: [-1, 1, -3] };
  return { fov: 34, pos, look: [-1.2, 1, -3] };
}

function Rig({
  labels,
  highlight,
  overlay,
  palette,
}: {
  labels: RefObject<(HTMLElement | null)[]>;
  highlight: RefObject<number | null>;
  overlay: boolean;
  palette: ScenePalette;
}) {
  const group = useRef<THREE.Group>(null);
  const anchors = useRef<(THREE.Object3D | null)[]>([]);
  const gateMats = useRef<GateMats[]>(GATE_Z.map(() => ({ metal: [], pane: null })));
  const registers = useMemo<Register[]>(
    () =>
      GATE_Z.map((_, i) => (part, m) => {
        const g = gateMats.current[i];
        if (!m) return;
        if (part === "pane") g.pane = m as THREE.MeshBasicMaterial;
        else if (!g.metal.includes(m as THREE.MeshStandardMaterial)) g.metal.push(m as THREE.MeshStandardMaterial);
      }),
    [],
  );
  const mouse = useRef({ x: 0, y: 0 });
  const size = useThree((s) => s.size);
  const f = framing(overlay, size.width / Math.max(1, size.height));
  const applied = useRef("");
  const sim = useMemo(() => new GateSimulation(0.75, process.env.NODE_ENV !== "production"), []);
  const glow = useMemo(() => new THREE.Color(palette.glow), [palette]);

  // Apply framing in the frame loop, only when it changes.
  useFrame(({ camera }) => {
    const key = JSON.stringify(f);
    if (applied.current === key) return;
    applied.current = key;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = f.fov;
    cam.position.set(...f.pos);
    cam.lookAt(...f.look);
    cam.updateProjectionMatrix();
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.current.x * 0.22, 2.4, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.08 + mouse.current.y * -0.1, 2.4, d);
    // Gate highlight from the hovered/focused label: a soft glow on that gate only.
    gateMats.current.forEach((m, i) => {
      const on = highlight.current === i;
      m.metal.forEach((mat) => {
        mat.emissive.copy(glow);
        mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, on ? 0.45 : 0, 10, d);
      });
      if (m.pane) m.pane.opacity = THREE.MathUtils.damp(m.pane.opacity, on ? 0.14 : 0.03, 10, d);
    });
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {GATE_Z.map((z, i) => (
        <group key={z}>
          <Portal z={z} palette={palette} register={registers[i]} />
          <object3D
            position={[0, LABEL_SIDE[i] === "top" ? GATE_TOP : 0, z]}
            ref={(el) => {
              anchors.current[i] = el;
            }}
          />
        </group>
      ))}
      <Packets palette={palette} sim={sim} />
      <gridHelper args={[30, 44, palette.grid, palette.gridMinor]} />
      <LabelProjector anchors={anchors} labels={labels} />
    </group>
  );
}

export default function GateScene({
  labels,
  highlight,
  active,
  small,
  overlay,
  theme,
}: {
  labels: RefObject<(HTMLElement | null)[]>;
  highlight: RefObject<number | null>;
  active: boolean;
  small: boolean;
  overlay: boolean;
  theme: "dark" | "light";
}) {
  const palette = PALETTES[theme];
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={small ? 1 : [1, 1.5]}
      camera={{ position: [8.5, 3.4, 9.5], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: !small, alpha: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", display: "block" }}
      aria-hidden="true"
    >
      <color attach="background" args={[palette.bg]} />
      {/* Fog matches the page background in both themes. */}
      <fog attach="fog" args={[palette.bg, 14, 32]} />
      <ambientLight intensity={theme === "dark" ? 0.55 : 0.9} />
      <directionalLight position={[4, 7, 5]} intensity={theme === "dark" ? 1.5 : 1.1} />
      <directionalLight position={[-5, 3, -6]} intensity={0.35} />
      <Rig labels={labels} highlight={highlight} overlay={overlay} palette={palette} />
    </Canvas>
  );
}
