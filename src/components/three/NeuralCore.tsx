"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Core({ count, still }: { count: number; still: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const pulse = useRef<THREE.Mesh>(null!);
  const { points, lines } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2, r = Math.sqrt(1 - y * y);
      pts.push(new THREE.Vector3(Math.cos(ga * i) * r, y, Math.sin(ga * i) * r).multiplyScalar(1.6));
    }
    const thr = count > 100 ? 0.8 : 1.0, lp: number[] = [];
    for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++)
      if (pts[i].distanceTo(pts[j]) < thr) lp.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    return { points: Float32Array.from(pts.flatMap((p) => [p.x, p.y, p.z])), lines: Float32Array.from(lp) };
  }, [count]);

  useFrame((s, dt) => {
    if (still) return;
    const g = group.current;
    g.rotation.y += dt * 0.15;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, s.pointer.y * -0.4, 0.05);
    g.position.x = THREE.MathUtils.lerp(g.position.x, s.pointer.x * 0.25, 0.05);
    pulse.current.scale.setScalar(0.55 + Math.sin(s.clock.elapsedTime * 1.6) * 0.06);
  });

  return (
    <Float speed={still ? 0 : 1.2} floatIntensity={0.6}>
      <group ref={group}>
        <points>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
          <pointsMaterial color="#22D3EE" size={0.06} sizeAttenuation transparent opacity={0.95} />
        </points>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[lines, 3]} /></bufferGeometry>
          <lineBasicMaterial color="#8B5CF6" transparent opacity={0.35} />
        </lineSegments>
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.28} />
        </mesh>
        <mesh ref={pulse}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.008, 8, 120]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

export default function NeuralCore({ count }: { count?: number }) {
  const ok = useMemo(() => {
    try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
  }, []);
  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const n = count ?? (window.innerWidth < 768 ? 70 : 140);
  if (!ok) return null;
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} aria-hidden>
      <Core count={n} still={still} />
    </Canvas>
  );
}
