"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const cyan = "#22D3EE";
const violet = "#8B5CF6";

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function CoreMesh({ pulse }: { pulse: number }) {
  const core = useRef<THREE.Mesh>(null);
  const previousPulse = useRef(pulse);
  const reduced = useReducedMotionPreference();
  const uniforms = useMemo(() => ({ time: { value: 0 }, pulse: { value: 0 } }), []);
  useFrame(({ clock }) => {
    uniforms.time.value = reduced ? 0 : clock.elapsedTime;
    if (previousPulse.current !== pulse) {
      previousPulse.current = pulse;
      uniforms.pulse.value = 1;
    } else {
      uniforms.pulse.value = THREE.MathUtils.damp(uniforms.pulse.value, 0, 2.5, 0.016);
    }
    if (core.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.025 + uniforms.pulse.value * 0.12;
      core.current.scale.setScalar(scale);
    }
  });
  return (
    <mesh ref={core}>
      <icosahedronGeometry args={[0.95, 4]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader="varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader="varying vec3 vNormal; varying vec3 vPosition; uniform float time; uniform float pulse; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),vec3(0.0,0.0,1.0))),2.2);float wave=0.5+0.5*sin(vPosition.y*6.0+time*2.0);vec3 color=mix(vec3(0.54,0.36,0.96),vec3(0.13,0.83,0.93),clamp(rim+0.25*wave,0.0,1.0));gl_FragColor=vec4(color*(0.45+rim*1.6+pulse),0.35+rim*0.65);}"
      />
    </mesh>
  );
}

function Ring({ radius, tilt, speed, phase, color, still }: { radius: number; tilt: [number, number, number]; speed: number; phase: number; color: string; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = phase + (still ? 0 : clock.elapsedTime * speed);
  });
  return (
    <group ref={group} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-radius, 0, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function OrbitParticles() {
  const reduced = useReducedMotionPreference();
  const points = useMemo(() => {
    const values: THREE.Vector3[] = [];
    const count = window.innerWidth < 768 ? 260 : 700;
    for (let i = 0; i < count; i++) {
      const y = (((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1) * 2 - 1;
      const angle = i * 2.39996;
      const radius = 2.6 + ((Math.sin(i * 78.233) * 43758.5453) % 1 + 1) % 1 * 1.8;
      const spread = Math.sqrt(1 - y * y) * radius;
      values.push(new THREE.Vector3(Math.cos(angle) * spread, y * radius, Math.sin(angle) * spread));
    }
    return new Float32Array(values.flatMap((p) => [p.x, p.y, p.z]));
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = reduced ? 0 : clock.elapsedTime * 0.035; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
      <pointsMaterial color="#9AE6F5" size={0.025} transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

export function ERAAVisualizer() {
  const [pulse, setPulse] = useState(0);
  const reduced = useReducedMotionPreference();
  return (
    <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onClick={() => setPulse((value) => value + 1)}>
      <ambientLight intensity={0.3} />
      <group rotation={[0.15, 0, 0]}>
        <CoreMesh pulse={pulse} />
        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color={violet} wireframe transparent opacity={0.28} />
        </mesh>
        <Ring radius={1.9} tilt={[0.4, 0, 0.5]} speed={0.32} phase={0} color={cyan} still={reduced} />
        <Ring radius={2.4} tilt={[1.2, 0.6, -0.35]} speed={-0.22} phase={1} color={violet} still={reduced} />
        <Ring radius={2.9} tilt={[0.2, 1.1, 0.25]} speed={0.16} phase={2} color={cyan} still={reduced} />
      </group>
      <OrbitParticles />
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.65} />
    </Canvas>
  );
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotionPreference();
  const items = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    position: [(i % 2 ? 1 : -1) * (3 + Math.random() * 3.5), (Math.random() * 2 - 1) * 5, -Math.random() * 5] as [number, number, number],
    scale: 0.45 + Math.random() * 0.8,
    speed: 0.12 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    geometry: i % 4,
  })), []);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY;
    group.current.children.forEach((shape, i) => {
      const item = items[i];
      shape.rotation.x = (reduced ? 0 : time * item.speed) + item.phase;
      shape.rotation.y = (reduced ? 0 : time * item.speed * 0.8) + item.phase;
      shape.position.y = item.position[1] + (reduced ? 0 : Math.sin(time * 0.2 + i) * 0.28) - scroll * 0.001;
    });
  });
  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i} position={item.position} scale={item.scale}>
          {item.geometry === 0 ? <icosahedronGeometry args={[1, 0]} /> : item.geometry === 1 ? <octahedronGeometry args={[1, 0]} /> : item.geometry === 2 ? <torusKnotGeometry args={[0.7, 0.18, 40, 6]} /> : <dodecahedronGeometry args={[0.9, 0]} />}
          <meshBasicMaterial color={i % 2 ? cyan : violet} wireframe transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-30" aria-hidden>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={1} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}>
        <FloatingShapes />
      </Canvas>
    </div>
  );
}

type Skill = { name: string; category: string };
const categoryColors = [cyan, violet, "#34D399", "#FBBF24", "#F472B6"];

function SkillTag({ name, position, color }: { name: string; position: [number, number, number]; color: string }) {
  const object = useRef<THREE.Group>(null);
  const label = useRef<HTMLDivElement>(null);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const view = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    if (!object.current || !label.current) return;
    object.current.getWorldPosition(normal);
    normal.normalize();
    view.copy(camera.position).sub(object.current.position).normalize();
    const depth = (THREE.MathUtils.clamp(normal.dot(view), -1, 1) + 1) / 2;
    label.current.style.opacity = String(0.25 + depth * 0.75);
    label.current.style.zIndex = String(Math.round(depth * 100));
    const text = label.current.firstElementChild as HTMLElement | null;
    if (text) text.style.transform = `scale(${0.6 + depth * 0.55})`;
  });
  return (
    <group ref={object} position={position}>
      <mesh>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html ref={label} center distanceFactor={8} zIndexRange={[100, 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}>
        <span className="rounded-full border bg-[#0b1024e8] px-2 py-1 font-mono text-[9px] text-slate-100 shadow-[0_0_14px_#8b5cf622]" style={{ borderColor: `${color}88` }}>{name}</span>
      </Html>
    </group>
  );
}

function SkillPoints({ skills }: { skills: Skill[] }) {
  const positions = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return skills.map((skill, i) => {
      const y = 1 - (i / Math.max(skills.length - 1, 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const category = Math.max(0, ["Generative AI", "Vector Search", "Machine Learning", "Backend & MLOps", "Programming & Data"].indexOf(skill.category));
      return {
        skill,
        position: [Math.cos(goldenAngle * i) * radius * 2.15, y * 2.15, Math.sin(goldenAngle * i) * radius * 2.15] as [number, number, number],
        color: categoryColors[category % categoryColors.length],
      };
    });
  }, [skills]);
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.9, 2]} />
        <meshBasicMaterial color={violet} wireframe transparent opacity={0.13} />
      </mesh>
      {positions.map(({ skill, position, color }) =>
        <SkillTag key={skill.name} name={skill.name} position={position} color={color} />
      )}
    </group>
  );
}

export function SkillSphere({ skills }: { skills: Skill[] }) {
  const reduced = useReducedMotionPreference();
  return (
    <div className="h-[340px] w-full overflow-hidden rounded-2xl border border-violet/20 bg-void/35 sm:h-[400px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.6} />
        <SkillPoints skills={skills} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={!reduced} autoRotateSpeed={0.35} rotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}

type NetworkEdge = { from: THREE.Vector3; to: THREE.Vector3; weight: number };

function NeuralNetwork({ activations, weights }: { activations: number[][]; weights: number[][][] }) {
  const pulses = useRef<THREE.Group>(null);
  const positions = useMemo(() => [3, 6, 6, 4, 2].map((size, layer) =>
    Array.from({ length: size }, (_, i) => new THREE.Vector3((layer - 2) * 1.75, (i - (size - 1) / 2) * 0.68, Math.sin(i * 1.9 + layer) * 0.35))), []);
  const edges = useMemo<NetworkEdge[]>(() => {
    const all: NetworkEdge[] = [];
    positions.slice(0, -1).forEach((layer, l) => layer.forEach((from, i) =>
      positions[l + 1].forEach((to, j) => all.push({ from, to, weight: weights[l]?.[i]?.[j] ?? 0 }))));
    return all;
  }, [positions, weights]);

  useFrame(({ clock }) => {
    if (!pulses.current) return;
    const time = clock.elapsedTime;
    pulses.current.children.forEach((child, i) => {
      const edge = edges[i % edges.length];
      const progress = (time * 0.42 + i * 0.071) % 1;
      child.position.lerpVectors(edge.from, edge.to, progress);
    });
  });

  return (
    <>
      <group rotation={[0.08, -0.15, 0]}>
        {edges.map((edge, i) => (
          <Line key={i} points={[edge.from, edge.to]} color={edge.weight >= 0 ? cyan : violet}
            lineWidth={0.65 + Math.min(Math.abs(edge.weight), 1.3)} transparent opacity={0.18 + Math.min(Math.abs(edge.weight), 1) * 0.35} />
        ))}
        {positions.map((layer, l) => layer.map((point, i) => {
          const value = activations[l]?.[i] ?? 0;
          const color = value >= 0 ? cyan : violet;
          return (
            <mesh key={`${l}-${i}`} position={point} scale={0.82 + Math.abs(value) * 0.55}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={value === 0 ? "#1b2250" : color} />
            </mesh>
          );
        }))}
        <group ref={pulses}>
          {Array.from({ length: 22 }, (_, i) => <mesh key={i}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color={i % 2 ? cyan : violet} /></mesh>)}
        </group>
      </group>
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.65} />
    </>
  );
}

export function NeuralNetworkCanvas({ activations, weights }: { activations: number[][]; weights: number[][][] }) {
  return (
    <div className="h-[300px] w-full sm:h-[380px]">
      <Canvas camera={{ position: [0, 0, 9.5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.5} />
        <NeuralNetwork activations={activations} weights={weights} />
      </Canvas>
    </div>
  );
}
