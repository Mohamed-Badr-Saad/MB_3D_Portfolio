// Skills as a 3D mechanical keyboard. Each keycap is a skill: hover lifts it, click (or typing the
// letter printed on the cap) presses it down and shows where the skill was used.
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { skillList, type Skill, type SkillGroup } from "../data/skills";
import { sceneVisibility } from "./visibility";
import { pointer } from "./pointer";

const GAP = 0.14;
const PITCH = 1 + GAP;
const SPACE_W = 4.6;
const FOV = 32;
const VIEW_DIR = new THREE.Vector3(0, 0.78, 0.63).normalize();

// Keycap colourways: light alphas, navy backend, teal tools, amber "modifier" keys for plant & control.
const CAPS: Record<SkillGroup, { cap: string; ink: string }> = {
  Frontend: { cap: "#E6ECF3", ink: "#0D1726" },
  "Backend & data": { cap: "#1C2A42", ink: "#FFFFFF" },
  "Tools & languages": { cap: "#2FB9A2", ink: "#0B1522" },
  "Plant & control": { cap: "#F2A93B", ink: "#1A1205" },
};

function luminance(hex: string) {
  const c = new THREE.Color(`#${hex}`);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

function capTexture(skill: Skill | null, width = 1) {
  const W = 256 * width, H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const style = skill ? CAPS[skill.group] : { cap: "#1C2A42", ink: "#3CCFB4" };
  ctx.fillStyle = style.cap;
  ctx.fillRect(0, 0, W, H);
  // soft dish shading, like a real keycap
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H / 2, W * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (!skill) {
    ctx.fillStyle = style.ink;
    ctx.font = `700 58px "Archivo Variable", system-ui, sans-serif`;
    ctx.fillText("Let's work together", W / 2, H / 2 - 10);
    ctx.font = `500 32px "JetBrains Mono Variable", ui-monospace, monospace`;
    ctx.fillStyle = "rgba(221,230,239,0.7)";
    ctx.fillText("press to get in touch", W / 2, H / 2 + 44);
  } else {
    // hotkey legend, top-left like a real keycap
    ctx.textAlign = "left";
    ctx.font = `700 40px "JetBrains Mono Variable", ui-monospace, monospace`;
    ctx.fillStyle = style.ink;
    ctx.globalAlpha = 0.55;
    ctx.fillText(skill.key, 20, 36);
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    if (skill.icon) {
      let ink = `#${skill.icon.hex}`;
      const L = luminance(skill.icon.hex);
      const capL = luminance(style.cap.slice(1));
      if (Math.abs(L - capL) < 0.28 || skill.group === "Tools & languages") ink = style.ink;
      const s = 96;
      ctx.save();
      ctx.translate(W / 2 - s / 2, 50);
      ctx.scale(s / 24, s / 24);
      ctx.fillStyle = ink;
      ctx.fill(new Path2D(skill.icon.path));
      ctx.restore();
    } else {
      ctx.fillStyle = style.ink;
      const lines = (skill.short ?? skill.name).split("\n");
      ctx.font = `800 ${lines.length > 1 ? 44 : 54}px "Archivo Variable", system-ui, sans-serif`;
      lines.forEach((l, i) => ctx.fillText(l, W / 2, 102 + (i - (lines.length - 1) / 2) * 46));
    }
    ctx.fillStyle = style.ink;
    let size = 40;
    ctx.font = `600 ${size}px "Archivo Variable", system-ui, sans-serif`;
    while (ctx.measureText(skill.name).width > W - 24 && size > 24) {
      size -= 1;
      ctx.font = `600 ${size}px "Archivo Variable", system-ui, sans-serif`;
    }
    ctx.fillText(skill.name, W / 2, 206);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type Key = { skill: Skill | null; index: number; x: number; z: number; w: number; row: number; col: number };

/** Rows by group on wide screens; five keys per row on narrow ones. The spacebar always goes last. */
function layout(narrow: boolean): { keys: Key[]; width: number; depth: number } {
  const rows: (Skill | null)[][] = [];
  if (narrow) {
    for (let i = 0; i < skillList.length; i += 5) rows.push(skillList.slice(i, i + 5));
  } else {
    for (const g of ["Frontend", "Backend & data", "Tools & languages"] as SkillGroup[]) rows.push(skillList.filter((s) => s.group === g));
    rows.push([...skillList.filter((s) => s.group === "Plant & control"), null]);
  }
  if (narrow) rows.push([null]);
  const keys: Key[] = [];
  let width = 0;
  rows.forEach((row, r) => {
    const rowW = row.reduce((sum, s) => sum + (s ? 1 : SPACE_W) + GAP, -GAP);
    width = Math.max(width, rowW);
    let x = -rowW / 2;
    row.forEach((s, c) => {
      const w = s ? 1 : SPACE_W;
      keys.push({ skill: s, index: s ? skillList.indexOf(s) : -1, x: x + w / 2, z: (r - (rows.length - 1) / 2) * PITCH, w, row: r, col: c });
      x += w + GAP;
    });
  });
  return { keys, width, depth: rows.length * PITCH - GAP };
}

type Props = {
  reduced: boolean;
  selected: string | null;
  group: SkillGroup | "All";
  jump: number;
  onSelect: (name: string) => void;
};

export default function SkillKeyboard({ reduced, selected, group, jump, onSelect }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const narrow = typeof window !== "undefined" && window.innerWidth < 640;
  const { keys, width, depth } = useMemo(() => layout(narrow), [narrow]);
  const textures = useMemo(() => keys.map((k) => capTexture(k.skill, k.w)), [keys]);
  const bodyMats = useMemo(
    () =>
      keys.map(
        (k) =>
          new THREE.MeshStandardMaterial({
            color: k.skill ? CAPS[k.skill.group].cap : "#1C2A42",
            roughness: 0.42,
            metalness: 0.05,
            emissive: new THREE.Color("#3CCFB4"),
            emissiveIntensity: 0,
          }),
      ),
    [keys],
  );
  const topMats = useMemo(
    () => textures.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 0.5 })),
    [textures],
  );
  const caps = useRef<(THREE.Group | null)[]>([]);
  const board = useRef<THREE.Group>(null);
  const state = useMemo(() => keys.map(() => ({ y: -1.4, v: 0, hover: false, held: false, pressedAt: -10 })), [keys]);
  const startedAt = useRef<number | null>(reduced ? 0 : null);
  const clock = useThree((s) => s.clock);

  const press = (k: number) => {
    const st = state[k];
    st.pressedAt = clock.elapsedTime;
    st.v = -6;
    const key = keys[k];
    if (key.skill) onSelect(key.skill.name);
    else window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 280);
  };

  // Type on your real keyboard while the section is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sceneVisibility.skills || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const ch = e.key === "+" ? "=" : e.key.toUpperCase();
      const k = keys.findIndex((key) => key.skill?.key === ch);
      if (k >= 0) press(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  // Picking a group "types" its keys one after another.
  useEffect(() => {
    if (!jump) return;
    const ids = keys.map((k, i) => ({ k, i })).filter(({ k }) => k.skill && (group === "All" || k.skill.group === group));
    const timers = ids.map(({ i }, n) => window.setTimeout(() => press(i), n * 90));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  const camPos = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(0, -0.3, 0.25), []);

  useFrame(({ clock: c }, delta) => {
    const dt = Math.min(delta, 0.05);
    // Fit the whole board in view for the current aspect.
    const vHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const hHalf = vHalf * camera.aspect;
    const dist = Math.max((width + 1.4) / 2 / hHalf, ((depth + 1.4) * 0.85) / 2 / vHalf) * 1.18;
    camPos.copy(target).addScaledVector(VIEW_DIR, dist);
    camera.position.lerp(camPos, 0.2);
    camera.lookAt(target);

    if (startedAt.current === null && sceneVisibility.skills) startedAt.current = c.elapsedTime;
    const t0 = startedAt.current;

    if (board.current) {
      const tx = reduced ? 0 : -pointer.y * 0.05;
      const tz = reduced ? 0 : -pointer.x * 0.05;
      board.current.rotation.x = THREE.MathUtils.damp(board.current.rotation.x, tx, 3, dt);
      board.current.rotation.z = THREE.MathUtils.damp(board.current.rotation.z, tz, 3, dt);
    }

    keys.forEach((k, i) => {
      const st = state[i];
      const g = caps.current[i];
      if (!g) return;
      const inGroup = !k.skill || group === "All" || k.skill.group === group;
      const intro = t0 === null ? -1.4 : c.elapsedTime - t0 < (k.col * 0.045 + k.row * 0.08) ? -1.4 : 0;
      const down = st.held || c.elapsedTime - st.pressedAt < 0.16;
      let target = intro + (down ? -0.24 : st.hover ? 0.08 : 0) + (inGroup ? 0 : -0.12);
      if (reduced && intro < 0) target = 0;
      // damped spring gives keys a little bounce
      st.v += ((target - st.y) * 220 - st.v * 15) * dt;
      st.y += st.v * dt;
      if (reduced && t0 !== null && !down && !st.hover) st.y = target;
      g.position.y = st.y;

      const mat = bodyMats[i];
      const isSel = !!k.skill && selected === k.skill.name;
      const glow = isSel ? 0.45 : st.hover ? 0.18 : group !== "All" && inGroup && k.skill ? 0.12 : 0;
      mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, glow, 8, dt);
      // Keys outside the chosen group dim down.
      const dim = inGroup ? 1 : 0.3;
      const top = topMats[i];
      top.color.setScalar(THREE.MathUtils.damp(top.color.r, dim, 8, dt));
      mat.color.set(k.skill ? CAPS[k.skill.group].cap : "#1C2A42").multiplyScalar(top.color.r);
    });
  });

  const handlers = (i: number) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      state[i].hover = true;
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      state[i].hover = false;
      document.body.style.cursor = "";
    },
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      state[i].held = true;
      press(i);
      const up = () => {
        state[i].held = false;
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointerup", up);
    },
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 10, 9]} />
      <hemisphereLight args={["#DCE8F7", "#0D1726", 0.9]} />
      <directionalLight position={[-4, 9, 6]} intensity={1.7} />
      <pointLight position={[0, 2, 4]} intensity={4} distance={10} color="#3CCFB4" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 4]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-7, 2, 0]} scale={[2, 6, 1]} color="#AFC6E6" />
      </Environment>

      <group ref={board}>
        {/* Case, with a teal underglow */}
        <RoundedBox args={[width + 0.9, 0.5, depth + 0.9]} radius={0.22} smoothness={4} position={[0, -0.42, 0]}>
          <meshStandardMaterial color="#0F1A2B" metalness={0.75} roughness={0.32} />
        </RoundedBox>
        <RoundedBox args={[width + 1.0, 0.06, depth + 1.0]} radius={0.03} smoothness={2} position={[0, -0.66, 0]}>
          <meshBasicMaterial color="#3CCFB4" toneMapped={false} />
        </RoundedBox>
        <mesh position={[0, -0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width + 0.3, depth + 0.3]} />
          <meshStandardMaterial color="#070D17" roughness={0.9} />
        </mesh>

        {keys.map((k, i) => (
          <group key={i} position={[k.x, 0, k.z]}>
            <group
              ref={(el) => {
                caps.current[i] = el;
              }}
              {...handlers(i)}
            >
              <RoundedBox args={[k.w, 0.46, 1]} radius={0.12} smoothness={3} material={bodyMats[i]} />
              <mesh position={[0, 0.232, 0]} rotation={[-Math.PI / 2, 0, 0]} material={topMats[i]}>
                <planeGeometry args={[k.w - 0.16, 0.84]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </>
  );
}

