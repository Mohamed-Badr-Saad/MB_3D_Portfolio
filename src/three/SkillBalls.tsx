// A small hand-written physics playground: skill balls fall into a 2.5D box,
// collide, and can be pushed, grabbed and thrown. No physics engine needed for ~30 spheres.
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { skillList, type Skill, type SkillGroup } from "../data/skills";
import { sceneVisibility } from "./visibility";

const BASE_R = 0.72;
const DEPTH = 0.7; // half-depth of the box the balls live in
const GRAVITY = -14;
const RESTITUTION = 0.45;
const CAM_Z = 12;
const FOV = 35;
const FACING = new THREE.Quaternion();
const PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0, where the balls live

function luminance(hex: string) {
  const c = new THREE.Color(`#${hex}`);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/** Equirectangular ball skin with the logo printed on the front and the back. */
function ballTexture(skill: Skill) {
  const W = 512, H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  let ball = "#13213A", ink = "#3CCFB4";
  if (skill.icon) {
    const L = luminance(skill.icon.hex);
    if (L < 0.08) { ball = "#E8EEF5"; ink = "#0D1726"; }
    else if (L > 0.9) { ball = "#1A2433"; ink = "#FFFFFF"; }
    else { ball = `#${skill.icon.hex}`; ink = L > 0.55 ? "#0D1726" : "#FFFFFF"; }
  }
  ctx.fillStyle = ball;
  ctx.fillRect(0, 0, W, H);
  // a subtle seam band so rolling reads clearly
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, H * 0.5 - 70, W, 4);
  ctx.fillRect(0, H * 0.5 + 66, W, 4);
  for (const cx of [W * 0.25, W * 0.75]) {
    if (skill.icon) {
      const s = H * 0.44;
      ctx.save();
      ctx.translate(cx - s / 2, H / 2 - s / 2);
      ctx.scale(s / 24, s / 24);
      ctx.fillStyle = ink;
      ctx.fill(new Path2D(skill.icon.path));
      ctx.restore();
    } else {
      const lines = (skill.short ?? skill.name).split("\n");
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `800 ${lines.length > 1 ? 40 : 48}px "Archivo Variable", system-ui, sans-serif`;
      lines.forEach((l, i) => ctx.fillText(l, cx, H / 2 + (i - (lines.length - 1) / 2) * 44));
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type Body = { p: THREE.Vector3; v: THREE.Vector3; r: number; q: THREE.Quaternion };

type Props = {
  reduced: boolean;
  selected: string | null;
  group: SkillGroup | "All";
  shake: number;
  jump: number;
  onSelect: (name: string) => void;
};

export default function SkillBalls({ reduced, selected, group, shake, jump, onSelect }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const textures = useMemo(() => skillList.map(ballTexture), []);
  const dim = useMemo(() => new THREE.Color("#3A4658"), []);
  const white = useMemo(() => new THREE.Color("#FFFFFF"), []);
  const started = useRef(false);
  const grabbed = useRef<number | null>(null);
  const hover = useRef({ active: false, point: new THREE.Vector3(), last: new THREE.Vector3(), vel: new THREE.Vector3() });

  // Smaller balls on narrow screens so the pile still has room to play.
  const k = typeof window !== "undefined" && window.innerWidth < 640 ? 0.66 : 1;
  const bodies = useMemo<Body[]>(
    () =>
      skillList.map((s, i) => ({
        p: new THREE.Vector3((Math.random() - 0.5) * 6 * k, 6 + i * 0.55, (Math.random() - 0.5) * DEPTH),
        v: new THREE.Vector3((Math.random() - 0.5) * 2, 0, 0),
        r: BASE_R * s.size * k,
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (Math.random() - 0.5) * 0.8, 0)),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Walls sit where the front of the slab meets the view edge, so balls never clip.
  const bounds = () => {
    const halfH = (CAM_Z - DEPTH - BASE_R) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    return { x: halfH * camera.aspect, y: halfH };
  };

  const step = (dt: number) => {
    const { x: bx, y: by } = bounds();
    const h = hover.current;
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      if (grabbed.current === i) {
        b.v.subVectors(h.point, b.p).multiplyScalar(16);
        b.v.z = -b.p.z * 10;
      } else {
        b.v.y += GRAVITY * dt;
        b.v.multiplyScalar(1 - 0.4 * dt);
      }
      b.p.addScaledVector(b.v, dt);

      // Walls, floor, a soft ceiling, and the front/back of the slab.
      if (b.p.x < -bx + b.r) { b.p.x = -bx + b.r; b.v.x = Math.abs(b.v.x) * RESTITUTION; }
      if (b.p.x > bx - b.r) { b.p.x = bx - b.r; b.v.x = -Math.abs(b.v.x) * RESTITUTION; }
      if (b.p.y < -by + b.r) { b.p.y = -by + b.r; b.v.y = Math.abs(b.v.y) * RESTITUTION; b.v.x *= 0.98; }
      if (started.current && b.p.y > by * 1.6) { b.p.y = by * 1.6; b.v.y = -Math.abs(b.v.y) * 0.3; }
      if (Math.abs(b.p.z) > DEPTH) { b.p.z = Math.sign(b.p.z) * DEPTH; b.v.z *= -RESTITUTION; }

      // The cursor is a solid sphere that shoves balls aside.
      if (h.active && grabbed.current === null) {
        const pr = 0.6;
        const d = b.p.distanceTo(h.point);
        const min = b.r + pr;
        if (d < min && d > 1e-4) {
          const n = new THREE.Vector3().subVectors(b.p, h.point).divideScalar(d);
          b.p.addScaledVector(n, min - d);
          b.v.addScaledVector(n, (min - d) * 30).addScaledVector(h.vel, 0.25);
        }
      }
    }
    // Pairwise collisions (mass ~ r^3).
    const n = new THREE.Vector3();
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], c = bodies[j];
        n.subVectors(a.p, c.p);
        const d = n.length();
        const min = a.r + c.r;
        if (d >= min || d < 1e-5) continue;
        n.divideScalar(d);
        const ma = a.r ** 3, mc = c.r ** 3, sum = ma + mc;
        const overlap = min - d;
        a.p.addScaledVector(n, (overlap * mc) / sum);
        c.p.addScaledVector(n, (-overlap * ma) / sum);
        const vn = a.v.clone().sub(c.v).dot(n);
        if (vn < 0) {
          const j2 = (-(1 + RESTITUTION) * vn) / (1 / ma + 1 / mc);
          a.v.addScaledVector(n, j2 / ma);
          c.v.addScaledVector(n, -j2 / mc);
        }
      }
    }
  };

  // Shake button
  useEffect(() => {
    if (!shake) return;
    for (const b of bodies) b.v.add(new THREE.Vector3((Math.random() - 0.5) * 12, 8 + Math.random() * 8, (Math.random() - 0.5) * 2));
  }, [shake, bodies]);

  // Picking a group makes its balls jump.
  useEffect(() => {
    if (!jump) return;
    skillList.forEach((s, i) => {
      if (group === "All" || s.group === group) bodies[i].v.add(new THREE.Vector3((Math.random() - 0.5) * 3, 9 + Math.random() * 3, 0));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  // Reduced motion: settle the pile before the first frame instead of animating the drop.
  useMemo(() => {
    if (!reduced) return;
    started.current = true;
    for (let k = 0; k < 600; k++) step(1 / 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const tmpQ = useMemo(() => new THREE.Quaternion(), []);
  const axis = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    if (!sceneVisibility.skills && !started.current) return; // wait until the section is on screen
    started.current = true;
    // Step in real time (small fixed substeps), so slow devices don't play in slow motion.
    const dt = Math.min(delta, 0.1);
    const sub = Math.max(2, Math.ceil(dt / (1 / 240)));
    for (let k = 0; k < sub; k++) step(dt / sub);
    hover.current.vel.multiplyScalar(0.8);

    bodies.forEach((b, i) => {
      const m = meshes.current[i];
      if (!m) return;
      // Roll: moving along x spins about y, moving along y spins about -x.
      const speed = Math.hypot(b.v.x, b.v.y);
      if (speed > 0.01) {
        axis.set(-b.v.y, b.v.x, 0).normalize();
        tmpQ.setFromAxisAngle(axis, (speed * dt) / b.r);
        b.q.premultiply(tmpQ);
      }
      // Once a ball is nearly still, it turns its logo back toward the viewer.
      if (speed < 1.2 && grabbed.current !== i) b.q.slerp(FACING, Math.min(1, dt * 2.2 * (1.2 - speed)));
      m.position.copy(b.p);
      m.quaternion.copy(b.q);
      const s = skillList[i];
      const on = group === "All" || s.group === group;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.color.lerp(on ? white : dim, Math.min(1, dt * 8));
      const target = b.r * (selected === s.name ? 1.12 : 1);
      m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, target, 10, dt));
    });
  });

  const onPlaneMove = (e: ThreeEvent<PointerEvent>) => {
    const h = hover.current;
    h.active = true;
    h.last.copy(h.point);
    e.ray.intersectPlane(PLANE, h.point);
    h.vel.subVectors(h.point, h.last).multiplyScalar(60);
  };

  const onBallDown = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    grabbed.current = i;
    e.ray.intersectPlane(PLANE, hover.current.point);
    onSelect(skillList[i].name);
    document.body.style.cursor = "grabbing";
    const up = () => {
      grabbed.current = null;
      document.body.style.cursor = "";
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointerup", up);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, CAM_Z]} fov={FOV} />
      <hemisphereLight args={["#DCE8F7", "#0D1726", 1]} />
      <directionalLight position={[3, 6, 8]} intensity={1.6} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 6]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 0, 4]} scale={[2, 6, 1]} color="#AFC6E6" />
      </Environment>

      {/* Invisible catcher plane: tracks the cursor in world space */}
      <mesh
        position={[0, 0, -3]}
        onPointerMove={onPlaneMove}
        onPointerLeave={() => (hover.current.active = false)}
      >
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {skillList.map((s, i) => (
        <mesh
          key={s.name}
          ref={(el) => (meshes.current[i] = el)}
          position={bodies[i].p}
          scale={bodies[i].r}
          onPointerDown={onBallDown(i)}
          onPointerMove={onPlaneMove}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (grabbed.current === null) document.body.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (grabbed.current === null) document.body.style.cursor = "";
          }}
        >
          <sphereGeometry args={[1, 40, 28]} />
          <meshStandardMaterial map={textures[i]} roughness={0.28} metalness={0.05} envMapIntensity={1.1} />
        </mesh>
      ))}
    </>
  );
}
