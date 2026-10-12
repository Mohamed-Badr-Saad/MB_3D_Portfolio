// Everything three.js lives in this lazily-loaded chunk.
// One fixed, transparent canvas renders every scene on the page through drei <View>s,
// so the site uses a single WebGL context. Pointer events come from the page root,
// and each View maps them into its own scene.
import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import RobotScene from "./Robot";
import SkillBalls from "./SkillBalls";
import SkillKeyboard from "./SkillKeyboard";
import SkillOrbit from "./SkillOrbit";
import Globe from "./Globe";
import { sceneVisibility } from "./visibility";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { SkillGroup } from "../data/skills";

export function SceneCanvas() {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.75]}
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <View.Port />
    </Canvas>
  );
}

function useVisibility(key: keyof typeof sceneVisibility) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      sceneVisibility[key] = entry.isIntersecting;
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [key]);
  return ref;
}

export function RobotView({ className, onSay }: { className?: string; onSay: (line: string) => void }) {
  const reduced = useReducedMotion();
  const ref = useVisibility("hero");
  return (
    <View ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      <Suspense fallback={null}>
        <RobotScene reduced={reduced} onSay={onSay} />
      </Suspense>
    </View>
  );
}

export function SkillsView(props: {
  className?: string;
  selected: string | null;
  group: SkillGroup | "All";
  shake: number;
  jump: number;
  onSelect: (name: string) => void;
}) {
  const reduced = useReducedMotion();
  const ref = useVisibility("skills");
  const { className, ...rest } = props;
  return (
    <View ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      <Suspense fallback={null}>
        <SkillBalls reduced={reduced} {...rest} />
      </Suspense>
    </View>
  );
}

export function KeyboardView(props: {
  className?: string;
  selected: string | null;
  group: SkillGroup | "All";
  jump: number;
  onSelect: (name: string) => void;
}) {
  const reduced = useReducedMotion();
  const ref = useVisibility("skills");
  const { className, ...rest } = props;
  return (
    <View ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      <Suspense fallback={null}>
        <SkillKeyboard reduced={reduced} {...rest} />
      </Suspense>
    </View>
  );
}

export function OrbitView(props: {
  className?: string;
  selected: string | null;
  group: SkillGroup | "All";
  jump: number;
  focus: string | null;
  onSelect: (name: string) => void;
  onFocus: (name: string | null) => void;
}) {
  const reduced = useReducedMotion();
  const ref = useVisibility("skills");
  const { className, ...rest } = props;
  return (
    <View ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      <Suspense fallback={null}>
        <SkillOrbit reduced={reduced} {...rest} />
      </Suspense>
    </View>
  );
}

export function GlobeView({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useVisibility("globe");
  return (
    <View ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      <Suspense fallback={null}>
        <Globe reduced={reduced} />
      </Suspense>
    </View>
  );
}
