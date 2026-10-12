// Skills as a small solar system: logo planets orbit a glowing "MB" core, one ring per group.
// Drag to turn the system, hover a planet to pause its ring, click to fly the camera to it.
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Environment, Lightformer, Line, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { skillList, type Skill, type SkillGroup } from "../data/skills";
import { pointer } from "./pointer";
import { sceneVisibility } from "./visibility";

const FOV = 24; // a long lens keeps near-side planets from ballooning

// Inner to outer. Colours tie each ring to its group.
const RINGS: { group: SkillGroup; radius: number; speed: number; tilt: number; color: string }[] = [
  { group: "Plant & control", radius: 2.0, speed: 0.34, tilt: 0.06, color: "#F2A93B" },
  { group: "Tools & languages", radius: 2.95, speed: -0.24, tilt: -0.08, color: "#3CCFB4" },
  { group: "Backend & data", radius: 3.9, speed: 0.17, tilt: 0.1, color: "#7AA2FF" },
  { group: "Frontend", radius: 4.85, speed: -0.12, tilt: -0.05, color: "#DDE6EF" },
];

function luminance(hex: string) {
  const c = new THREE.Color(`#${hex}`);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

function planetStyle(s: Skill) {
  if (!s.icon) return { body: "#13213A", ink: "#3CCFB4" };
  const L = luminance(s.icon.hex);
  if (L < 0.08) return { body: "#E8EEF5", ink: "#0D1726" };
  if (L > 0.9) return { body: "#1A2433", ink: "#FFFFFF" };
  return { body: `#${s.icon.hex}`, ink: L > 0.55 ? "#0D1726" : "#FFFFFF" };
}

/** Logo (or short text) on a transparent disc that sits on the planet's face. */
function logoTexture(s: Skill, ink: string) {
  const N = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext("2d")!;
  if (s.icon) {
    const size = N * 0.62;
    ctx.translate((N - size) / 2, (N - size) / 2);
    ctx.scale(size / 24, size / 24);
    ctx.fillStyle = ink;
    ctx.fill(new Path2D(s.icon.path));
  } else {
    const lines = (s.short ?? s.name).split("\n");
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${lines.length > 1 ? 58 : 72}px "Archivo Variable", system-ui, sans-serif`;
    lines.forEach((l, i) => ctx.fillText(l, N / 2, N / 2 + (i - (lines.length - 1) / 2) * 60));
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function labelTexture(text: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `600 44px "Archivo Variable", system-ui, sans-serif`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 48;
  canvas.width = w;
  canvas.height = 76;
  ctx.font = font;
  ctx.fillStyle = "rgba(13,23,38,0.88)";
  ctx.beginPath();
  ctx.roundRect(2, 2, w - 4, 72, 36);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,207,180,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#DDE6EF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, 40);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: w / 76 };
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(60,207,180,0.9)");
  g.addColorStop(0.35, "rgba(60,207,180,0.25)");
  g.addColorStop(1, "rgba(60,207,180,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function coreTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#DDE6EF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 110px "Archivo Variable", system-ui, sans-serif`;
  ctx.fillText("MB", 128, 136);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Planet = { skill: Skill; ring: number; phase: number; r: number; style: { body: string; ink: string } };

type Props = {
  reduced: boolean;
  selected: string | null;
  group: SkillGroup | "All";
  jump: number;
  focus: string | null;
  onSelect: (name: string) => void;
  onFocus: (name: string | null) => void;
};

export default function SkillOrbit({ reduced, selected, group, jump, focus, onSelect, onFocus }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const narrow = typeof window !== "undefined" && window.innerWidth < 640;
  const k = narrow ? 0.64 : 1; // shrink the system on phones, keep planets readable

  const planets = useMemo<Planet[]>(() => {
    const out: Planet[] = [];
    RINGS.forEach((ring, ri) => {
      const members = skillList.filter((s) => s.group === ring.group);
      members.forEach((skill, i) => {
        out.push({
          skill,
          ring: ri,
          phase: (i / members.length) * Math.PI * 2 + ri * 0.7,
          r: 0.27 + 0.13 * skill.size,
          style: planetStyle(skill),
        });
      });
    });
    return out;
  }, []);

  const logos = useMemo(() => planets.map((p) => logoTexture(p.skill, p.style.ink)), [planets]);
  const labels = useMemo(() => planets.map((p) => labelTexture(p.skill.name)), [planets]);
  const bodies = useMemo(
    () => planets.map((p) => new THREE.MeshStandardMaterial({ color: p.style.body, roughness: 0.35, metalness: 0.1, emissive: new THREE.Color("#3CCFB4"), emissiveIntensity: 0 })),
    [planets],
  );
  const glow = useMemo(() => glowTexture(), []);
  const coreTex = useMemo(() => coreTexture(), []);

  const system = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const labelRefs = useRef<(THREE.Sprite | null)[]>([]);
  const halo = useRef<THREE.Sprite>(null);
  const cage = useRef<THREE.Mesh>(null);
  const angle = useMemo(() => RINGS.map(() => 0), []);
  const ringSpeed = useMemo(() => RINGS.map(() => 1), []);
  const hovered = useRef<number | null>(null);
  const drag = useRef({ active: false, x: 0, y: 0, rotY: 0, rotX: 0, vy: 0 });
  const pulse = useRef({ ring: -1, t: -10 });
  const clock = useThree((s) => s.clock);

  // Ring outlines
  const ringPoints = useMemo(
    () =>
      RINGS.map((r) =>
        Array.from({ length: 129 }, (_, i) => {
          const a = (i / 128) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * r.radius, 0, Math.sin(a) * r.radius);
        }),
      ),
    [],
  );

  const stars = useMemo(() => {
    const n = 600;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(18 + Math.random() * 20);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    return pos;
  }, []);

  // Picking a group makes its ring swell outward for a moment.
  useEffect(() => {
    if (!jump) return;
    pulse.current = { ring: RINGS.findIndex((r) => r.group === group), t: clock.elapsedTime };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const camGoal = useMemo(() => new THREE.Vector3(), []);
  const lookGoal = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const viewDir = useMemo(() => new THREE.Vector3(0, narrow ? 0.7 : 0.44, 1).normalize(), [narrow]);

  useFrame(({ clock: c }, delta) => {
    const dt = Math.min(delta, 0.05);
    const focusIdx = focus ? planets.findIndex((p) => p.skill.name === focus) : -1;

    // Orbits only run while the section is on screen. A ring stops while one of its planets is
    // hovered, and everything slows right down while a planet is focused.
    const visible = sceneVisibility.skills;
    RINGS.forEach((r, ri) => {
      const hoveredHere = hovered.current !== null && planets[hovered.current].ring === ri;
      const goal = !visible ? 0 : focusIdx >= 0 ? 0.08 : hoveredHere ? 0 : reduced ? 0.6 : 1;
      ringSpeed[ri] = THREE.MathUtils.damp(ringSpeed[ri], goal, 4, dt);
      angle[ri] += r.speed * ringSpeed[ri] * dt;
    });

    // Drag to turn the system, with a little inertia; otherwise follow the cursor slightly.
    const d = drag.current;
    if (!d.active) {
      d.rotY += d.vy * dt;
      d.vy = THREE.MathUtils.damp(d.vy, 0, 2, dt);
      // the whole system also turns slowly while in view
      if (visible && focusIdx < 0) d.rotY += dt * (reduced ? 0.035 : 0.06);
    }
    if (system.current) {
      system.current.rotation.y = d.rotY + (reduced ? 0 : pointer.x * 0.15);
      system.current.rotation.x = THREE.MathUtils.damp(system.current.rotation.x, d.rotX + (reduced ? 0 : -pointer.y * 0.06), 6, dt);
      system.current.scale.setScalar(k);
    }

    const pr = pulse.current;
    const pulseAmt = pr.ring >= 0 ? Math.max(0, Math.sin(Math.min(1, (c.elapsedTime - pr.t) / 0.9) * Math.PI)) : 0;

    planets.forEach((p, i) => {
      const node = nodes.current[i];
      if (!node) return;
      const ring = RINGS[p.ring];
      const swell = pr.ring === p.ring || (pr.ring === -1 && group === "All") ? pulseAmt * 0.45 : 0;
      const a = p.phase + angle[p.ring];
      const rad = ring.radius + swell;
      // same maths as the ring outline, rotated by the ring's tilt about x
      node.position.set(Math.cos(a) * rad, -Math.sin(a) * Math.sin(ring.tilt) * rad, Math.sin(a) * Math.cos(ring.tilt) * rad);

      const inGroup = group === "All" || p.skill.group === group;
      const isHover = hovered.current === i;
      const isSel = selected === p.skill.name;
      const s = (isHover ? 1.4 : isSel ? 1.25 : 1) * (inGroup ? 1 : 0.7) * (narrow ? 1.35 : 1);
      node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, s, 10, dt));
      const mat = bodies[i];
      mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, isSel ? 0.35 : isHover ? 0.2 : 0, 8, dt);
      mat.color.set(p.style.body).multiplyScalar(inGroup ? 1 : 0.35);

      const label = labelRefs.current[i];
      if (label) {
        const m = label.material as THREE.SpriteMaterial;
        m.opacity = THREE.MathUtils.damp(m.opacity, isHover || isSel ? 1 : 0, 10, dt);
        label.visible = m.opacity > 0.02;
      }
    });

    if (halo.current) halo.current.scale.setScalar(4.2 + Math.sin(c.elapsedTime * 1.6) * (reduced ? 0 : 0.35));
    if (cage.current) {
      cage.current.rotation.y += dt * 0.3;
      cage.current.rotation.x += dt * 0.12;
    }

    // Camera: fit the whole system, or fly in close to the focused planet.
    const vHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const outer = (RINGS[RINGS.length - 1].radius + 0.9) * k;
    // planets on the near side come toward the camera, so leave generous room
    const fit = Math.max((outer / (vHalf * camera.aspect)) * (narrow ? 0.8 : 1), (outer * 0.5) / vHalf) * 1.1;
    if (focusIdx >= 0 && nodes.current[focusIdx]) {
      nodes.current[focusIdx]!.getWorldPosition(tmp);
      lookGoal.copy(tmp);
      camGoal.copy(tmp).addScaledVector(viewDir, 8.5);
    } else {
      lookGoal.set(0, 0, 0);
      camGoal.copy(viewDir).multiplyScalar(fit);
    }
    const ease = 1 - Math.exp(-dt * 3.2);
    camera.position.lerp(camGoal, ease);
    look.lerp(lookGoal, ease);
    camera.lookAt(look);
  });

  const onBackgroundDown = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    d.active = true;
    d.x = e.nativeEvent.clientX;
    d.y = e.nativeEvent.clientY;
    let moved = 0;
    document.body.style.cursor = "grabbing";
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - d.x;
      const dy = ev.clientY - d.y;
      moved += Math.abs(dx) + Math.abs(dy);
      d.rotY += dx * 0.006;
      d.vy = dx * 0.35;
      d.rotX = THREE.MathUtils.clamp(d.rotX + dy * 0.003, -0.35, 0.5);
      d.x = ev.clientX;
      d.y = ev.clientY;
    };
    const up = () => {
      d.active = false;
      document.body.style.cursor = "";
      if (moved < 4 && focus) onFocus(null); // a plain click on empty space returns to the overview
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <>
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 6, 16]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={30} distance={14} decay={1.6} color="#BFF5EA" />
      <directionalLight position={[4, 8, 6]} intensity={1.1} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 6, 6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-6, 0, 2]} scale={[2, 6, 1]} color="#7AA2FF" />
      </Environment>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8EA1B6" size={0.07} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
      </points>

      {/* Drag catcher behind everything */}
      <mesh position={[0, 0, -12]} onPointerDown={onBackgroundDown}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={system}>
        {/* Core */}
        <group onPointerDown={(e) => { e.stopPropagation(); onFocus(null); }}>
          <mesh>
            <sphereGeometry args={[0.85, 48, 32]} />
            <meshStandardMaterial color="#0F1C2E" emissive="#1C6F66" emissiveIntensity={0.9} roughness={0.25} metalness={0.4} />
          </mesh>
          <mesh ref={cage}>
            <icosahedronGeometry args={[1.12, 1]} />
            <meshBasicMaterial color="#3CCFB4" wireframe transparent opacity={0.35} toneMapped={false} />
          </mesh>
          <Billboard>
            <mesh position={[0, 0, 0.9]}>
              <planeGeometry args={[1.2, 1.2]} />
              <meshBasicMaterial map={coreTex} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          </Billboard>
          <sprite ref={halo} scale={4.2}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
        </group>

        {/* Rings */}
        {RINGS.map((r, ri) => {
          const on = group === "All" || group === r.group;
          return (
            <group key={r.group} rotation={[r.tilt, 0, 0]}>
              <Line points={ringPoints[ri]} color={r.color} lineWidth={on && group !== "All" ? 2.2 : 1.2} transparent opacity={on ? (group === "All" ? 0.35 : 0.9) : 0.12} />
            </group>
          );
        })}

        {/* Planets */}
        {planets.map((p, i) => (
          <group
            key={p.skill.name}
            ref={(el) => {
              nodes.current[i] = el;
            }}
          >
            <Billboard>
              <group
                onPointerOver={(e) => {
                  e.stopPropagation();
                  hovered.current = i;
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  if (hovered.current === i) hovered.current = null;
                  document.body.style.cursor = "";
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelect(p.skill.name);
                  onFocus(p.skill.name);
                }}
              >
                <mesh material={bodies[i]}>
                  <sphereGeometry args={[p.r, 32, 24]} />
                </mesh>
                <mesh position={[0, 0, p.r * 1.01]}>
                  <circleGeometry args={[p.r * 0.72, 40]} />
                  <meshBasicMaterial map={logos[i]} transparent depthWrite={false} toneMapped={false} />
                </mesh>
              </group>
              <sprite
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                position={[0, p.r + 0.32, 0.2]}
                scale={[0.3 * labels[i].aspect, 0.3, 1]}
                visible={false}
              >
                <spriteMaterial map={labels[i].tex} transparent opacity={0} depthTest={false} toneMapped={false} />
              </sprite>
            </Billboard>
          </group>
        ))}
      </group>
    </>
  );
}
