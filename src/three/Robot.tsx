import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows, Environment, Float, Lightformer, PerspectiveCamera, RoundedBox, Sparkles, useGLTF, useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import robotUrl from "../assets/models/robot.glb?url";
import { pointer } from "./pointer";
import { screens } from "../data/content";

const TEAL = "#3CCFB4";
const AMBER = "#F2A93B";

// Click the robot to cycle through these. Each emote comes with a line in the speech bubble.
const EMOTES: { clip: string; line: string; face?: "Surprised" | "Sad" | "Angry" }[] = [
  { clip: "ThumbsUp", line: "15,981 shift handovers migrated, zero servers. Not bad, right?" },
  { clip: "Dance", line: "Next.js, React, Node, PostgreSQL... scroll down and press my keys." },
  { clip: "Jump", line: "Full-stack developer, and an instrumentation engineer too. Yes, both.", face: "Surprised" },
  { clip: "Yes", line: "Click the screen to flip through Badr's projects." },
  { clip: "Wave", line: "Want to work together? The contact form is at the bottom." },
];

type Props = { reduced: boolean; onSay: (line: string) => void };

function Robot({ onSay }: Pick<Props, "onSay">) {
  const { scene, animations } = useGLTF(robotUrl);
  const root = useRef<THREE.Group>(null);
  const spin = useRef({ dragging: false, startX: 0, moved: 0, base: 0, velocity: 0 });
  const emoteIndex = useRef(0);
  const busy = useRef(false);
  const lastWave = useRef(-10);
  const look = useRef(new THREE.Vector2());
  const face = useRef({ name: "", value: 0 });
  const clock = useThree((s) => s.clock);
  const gl = useThree((s) => s.gl);

  const { mixer, actions, head, headRest, faceMesh } = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.name === "Main") mat.color.set(AMBER);
        mat.metalness = 0.15;
        mat.roughness = 0.45;
      }
    });
    const mixer = new THREE.AnimationMixer(scene);
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of animations) actions[clip.name] = mixer.clipAction(clip);
    let head: THREE.Bone | undefined;
    let faceMesh: THREE.Mesh | undefined;
    scene.traverse((o) => {
      if ((o as THREE.Bone).isBone && o.name === "Head") head = o as THREE.Bone;
      const m = o as THREE.Mesh;
      if (m.isMesh && m.morphTargetDictionary && "Surprised" in m.morphTargetDictionary) faceMesh = m;
    });
    const headRest = head ? head.quaternion.clone() : new THREE.Quaternion();
    return { mixer, actions, head, headRest, faceMesh };
  }, [scene, animations]);

  // Normalise the model to ~2.7 units tall, standing on y = 0.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const h = box.max.y - box.min.y;
    return { scale: 2.7 / h, y: -box.min.y * (2.7 / h) };
  }, [scene]);

  useEffect(() => {
    const idle = actions.Idle;
    idle?.play();
    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === actions.Idle) return;
      e.action.fadeOut(0.35);
      idle?.reset().fadeIn(0.35).play();
      busy.current = false;
    };
    mixer.addEventListener("finished", onFinished);
    return () => {
      mixer.removeEventListener("finished", onFinished);
      mixer.stopAllAction();
    };
  }, [actions, mixer]);

  const play = (clip: string, loops = 1) => {
    const a = actions[clip];
    if (!a) return;
    busy.current = true;
    actions.Idle?.fadeOut(0.25);
    a.reset();
    a.setLoop(loops > 1 ? THREE.LoopRepeat : THREE.LoopOnce, loops);
    a.clampWhenFinished = true;
    a.fadeIn(0.25).play();
  };

  const emote = () => {
    const e = EMOTES[emoteIndex.current % EMOTES.length];
    emoteIndex.current += 1;
    play(e.clip, e.clip === "Dance" ? 2 : 1);
    if (e.face) face.current = { name: e.face, value: 1 };
    onSay(e.line);
  };

  const onOver = () => {
    gl.domElement.ownerDocument.body.style.cursor = "grab";
    if (!busy.current && clock.elapsedTime - lastWave.current > 8) {
      lastWave.current = clock.elapsedTime;
      play("Wave");
      onSay("Hi! I'm Badr's robot. Click me, or drag to spin me around.");
    }
  };
  const onOut = () => {
    if (!spin.current.dragging) gl.domElement.ownerDocument.body.style.cursor = "";
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const s = spin.current;
    s.dragging = true;
    s.startX = e.nativeEvent.clientX;
    s.moved = 0;
    s.base = root.current?.rotation.y ?? 0;
    document.body.style.cursor = "grabbing";
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - s.startX;
      s.moved = Math.max(s.moved, Math.abs(dx));
      if (root.current) root.current.rotation.y = s.base + dx * 0.012;
    };
    const up = () => {
      s.dragging = false;
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (s.moved < 5) emote();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  useFrame((_, delta) => {
    head?.quaternion.copy(headRest); // the clip overwrites this if it animates the head
    mixer.update(Math.min(delta, 0.05));

    // After a drag, ease back to facing the visitor.
    if (root.current && !spin.current.dragging) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, 0, 2.5, delta);
    }

    // Head follows the cursor (applied on top of the animation).
    if (head) {
      const tx = THREE.MathUtils.clamp((pointer.x - 0.25) * 0.9, -0.7, 0.7);
      const ty = THREE.MathUtils.clamp(-pointer.y * 0.45, -0.35, 0.35);
      look.current.x = THREE.MathUtils.damp(look.current.x, tx, 6, delta);
      look.current.y = THREE.MathUtils.damp(look.current.y, ty, 6, delta);
      head.rotation.y += look.current.x;
      head.rotation.x += look.current.y;
    }

    if (faceMesh?.morphTargetDictionary && faceMesh.morphTargetInfluences) {
      const f = face.current;
      f.value = Math.max(0, f.value - delta * 0.6);
      for (const [name, i] of Object.entries(faceMesh.morphTargetDictionary)) {
        faceMesh.morphTargetInfluences[i] = name === f.name ? f.value : 0;
      }
    }
  });

  return (
    <group ref={root}>
      <primitive
        object={scene}
        scale={fit.scale}
        position={[0, fit.y, 0]}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onPointerDown={onDown}
      />
    </group>
  );
}

function Monitor({ onSay }: { onSay: (line: string) => void }) {
  const textures = useTexture(screens.map((s) => s.src));
  const index = useRef(0);
  const a = useRef<THREE.MeshBasicMaterial>(null);
  const b = useRef<THREE.MeshBasicMaterial>(null);
  const fade = useRef(1);
  const last = useRef(0);

  useMemo(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  }, [textures]);

  const next = () => {
    if (!a.current || !b.current) return;
    b.current.map = textures[index.current];
    index.current = (index.current + 1) % textures.length;
    a.current.map = textures[index.current];
    a.current.needsUpdate = b.current.needsUpdate = true;
    fade.current = 0;
  };

  useFrame(({ clock }, delta) => {
    if (clock.elapsedTime - last.current > 4.5) {
      last.current = clock.elapsedTime;
      next();
    }
    fade.current = Math.min(1, fade.current + delta * 2.5);
    if (a.current) a.current.opacity = fade.current;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    next();
    onSay(`That's ${screens[index.current].name}.`);
  };

  return (
    <group
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <RoundedBox args={[2.86, 1.5, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#111B2B" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[2.7, 1.3]} />
        <meshBasicMaterial ref={b} map={textures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.054]}>
        <planeGeometry args={[2.7, 1.3]} />
        <meshBasicMaterial ref={a} map={textures[0]} transparent toneMapped={false} />
      </mesh>
      {/* glow edge */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[3.05, 1.7]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Pad() {
  return (
    <group>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.45, 0.12, 64]} />
        <meshStandardMaterial color="#13213A" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.22, 1.3, 96]} />
        <meshBasicMaterial color={TEAL} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.57, 64]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function RobotScene({ reduced, onSay }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useMemo(() => new THREE.Vector3(0.55, 1.35, 0), []);
  const base = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    // Fit the composition to the view: pull back on narrow screens.
    const narrow = camera.aspect < 1;
    const dist = narrow ? 11.5 : 9.4 * Math.max(1, 1.25 / camera.aspect);
    target.x = narrow ? 0.95 : 0.9;
    base.set(target.x + (reduced ? 0 : pointer.x * 0.5), target.y + 0.5 + (reduced ? 0 : pointer.y * 0.25), dist);
    camera.position.lerp(base, reduced ? 1 : Math.min(1, delta * 3));
    camera.lookAt(target);
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={34} position={[0.6, 1.9, 8]} near={0.1} far={50} />
      <hemisphereLight args={["#CFE0F5", "#0D1726", 0.9]} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} />
      <pointLight position={[1.8, 2, 1]} intensity={6} distance={5} color={TEAL} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -3]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 2, 4]} scale={[3, 5, 1]} color="#AFC6E6" />
        <Lightformer form="rect" intensity={1} position={[5, 1, 2]} scale={[3, 4, 1]} color={TEAL} />
      </Environment>

      <group position={[-0.2, 0, 0]}>
        <Pad />
        <Robot onSay={onSay} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={4} blur={2.4} far={3} resolution={256} color="#000000" />
      </group>

      <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.6}>
        <group position={[2.3, 2.45, -1.4]} rotation={[0, -0.4, 0]} scale={0.85}>
          <Monitor onSay={onSay} />
        </group>
      </Float>

      {!reduced && <Sparkles count={40} scale={[7, 4, 3]} position={[0.6, 2, -1]} size={2.2} speed={0.35} color={TEAL} opacity={0.6} />}
    </>
  );
}

useGLTF.preload(robotUrl);
