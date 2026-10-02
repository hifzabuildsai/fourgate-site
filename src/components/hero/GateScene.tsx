"use client";

/*
  Four gates in depth; each packet is one agent tool call.
  Gate 1 "Tool says done" -> 2 "Extract contracted fields" -> 3 "Independent read-back" -> 4 "Verdict".
  - pass:    crosses all four gates, then turns PASS green.
  - fail:    turns FAIL red at gate 3 and drops.
  - unknown: turns UNKNOWN amber at gate 3, stops, fades out. It never continues and never turns green.
  Ported from the earlier landing page scene (four portals, flying packets, mouse parallax).
*/

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const C = {
  night: "#0e1218",
  bone: "#e9e4d8",
  line: "#26303b",
  pass: "#5fd3a0",
  fail: "#f0645a",
  unknown: "#f2b84b",
} as const;

/** Gate planes along z, nearest first. Packets travel toward -z. */
export const GATE_Z = [1.2, -1.6, -4.4, -7.2] as const;
const GATE_TOP = 2.42;
const PASS_END = -10.2;
/** Labels alternate above (top) and below (floor) the gates so neighbors never collide. */
const LABEL_SIDE = ["top", "bottom", "top", "bottom"] as const;

type Kind = "pass" | "fail" | "unknown";
type Phase = "travel" | "drop" | "halt" | "passed";
// Per seven calls: five pass, one fail, one unknown.
const PATTERN: Kind[] = ["pass", "pass", "fail", "pass", "pass", "unknown", "pass"];

type Packet = {
  kind: Kind;
  phase: Phase;
  x: number;
  y: number;
  z: number;
  vy: number;
  t: number;
  speed: number;
  opacity: number;
};

function Portal({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]}>
          <boxGeometry args={[0.12, 2.3, 0.12]} />
          <meshStandardMaterial color={C.bone} metalness={0.25} roughness={0.42} />
        </mesh>
      ))}
      <mesh position={[0, 2.36, 0]}>
        <boxGeometry args={[2.42, 0.12, 0.12]} />
        <meshStandardMaterial color={C.bone} metalness={0.25} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <planeGeometry args={[2.18, 2.18]} />
        <meshBasicMaterial color={C.bone} transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 0.05]} />
        <meshBasicMaterial color={C.bone} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Packets({ count, spawnZ }: { count: number; spawnZ: number }) {
  const group = useRef<THREE.Group>(null);
  const colors = useMemo(
    () => ({
      bone: new THREE.Color(C.bone),
      pass: new THREE.Color(C.pass),
      fail: new THREE.Color(C.fail),
      unknown: new THREE.Color(C.unknown),
    }),
    [],
  );

  const packets = useMemo<Packet[]>(() => {
    const span = spawnZ - PASS_END;
    return Array.from({ length: count }, (_, i) => ({
      kind: PATTERN[i % PATTERN.length],
      phase: "travel" as Phase,
      x: Math.sin(i * 1.7) * 0.5,
      y: 0.5 + ((i * 0.37) % 1.3),
      z: spawnZ - (i * span) / count,
      vy: 0,
      t: 0,
      speed: 1.25 + (i % 4) * 0.12,
      opacity: 1,
    }));
  }, [count, spawnZ]);

  useFrame((_, delta) => {
    const root = group.current;
    if (!root) return;
    const d = Math.min(delta, 0.05);
    packets.forEach((p, i) => {
      if (p.phase === "travel") {
        p.z -= p.speed * d;
        p.opacity = Math.min(1, (spawnZ - p.z) / 1.5);
        if (p.z <= GATE_Z[2] && p.kind === "fail") {
          p.phase = "drop";
          p.t = 0;
        } else if (p.z <= GATE_Z[2] && p.kind === "unknown") {
          p.phase = "halt";
          p.z = GATE_Z[2];
          p.t = 0;
        } else if (p.z <= GATE_Z[3]) {
          p.phase = "passed";
          p.t = 0;
        }
      } else if (p.phase === "drop") {
        p.t += d;
        p.vy -= 5.5 * d;
        p.y += p.vy * d;
        p.z -= p.speed * 0.2 * d;
        p.opacity = Math.max(0, 1 - p.t / 1.3);
      } else if (p.phase === "halt") {
        p.t += d;
        p.opacity = Math.max(0, 1 - Math.max(0, p.t - 0.5) / 1.2);
      } else {
        p.t += d;
        p.z -= p.speed * d;
        p.opacity = Math.max(0, Math.min(1, (p.z - PASS_END) / 1.5));
      }

      const done = p.opacity <= 0 || p.y < -0.6 || p.z < PASS_END;
      if (done) {
        p.phase = "travel";
        p.z = spawnZ;
        p.y = 0.5 + ((i * 0.37) % 1.3);
        p.vy = 0;
        p.t = 0;
        p.opacity = 0;
      }

      const mesh = root.children[i] as THREE.Mesh | undefined;
      if (!mesh) return;
      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.y = p.z * 0.4;
      // Unlit, so verdict colors render exactly as the tokens.
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.copy(
        p.phase === "drop" ? colors.fail : p.phase === "halt" ? colors.unknown : p.phase === "passed" ? colors.pass : colors.bone,
      );
      mat.opacity = p.opacity;
    });
  });

  return (
    <group ref={group}>
      {packets.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.17, 0.17, 0.3]} />
          <meshBasicMaterial color={C.bone} transparent fog={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Projects each gate's top onto the canvas and moves the matching DOM label there. */
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

function Rig({ labels, count, overlay }: { labels: RefObject<(HTMLElement | null)[]>; count: number; overlay: boolean }) {
  const group = useRef<THREE.Group>(null);
  const anchors = useRef<(THREE.Object3D | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const size = useThree((s) => s.size);
  const f = framing(overlay, size.width / Math.max(1, size.height));
  const applied = useRef("");

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
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {GATE_Z.map((z, i) => (
        <group key={z}>
          <Portal z={z} />
          <object3D
            position={[0, LABEL_SIDE[i] === "top" ? GATE_TOP : 0, z]}
            ref={(el) => {
              anchors.current[i] = el;
            }}
          />
        </group>
      ))}
      <Packets count={count} spawnZ={GATE_Z[0] + 3.2} />
      <gridHelper args={[30, 44, C.line, "#19202a"]} />
      <LabelProjector anchors={anchors} labels={labels} />
    </group>
  );
}

export default function GateScene({
  labels,
  active,
  small,
  overlay,
}: {
  labels: RefObject<(HTMLElement | null)[]>;
  active: boolean;
  small: boolean;
  overlay: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={small ? 1 : [1, 1.5]}
      camera={{ position: [8.5, 3.4, 9.5], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: !small, alpha: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", display: "block" }}
      aria-hidden="true"
    >
      <color attach="background" args={[C.night]} />
      <fog attach="fog" args={[C.night, 14, 32]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 7, 5]} intensity={1.5} color={C.bone} />
      <directionalLight position={[-5, 3, -6]} intensity={0.35} color={C.bone} />
      <Rig labels={labels} count={small ? 7 : 14} overlay={overlay} />
    </Canvas>
  );
}
