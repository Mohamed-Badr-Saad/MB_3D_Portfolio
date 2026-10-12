import { lazy } from "react";

// The three.js chunk is only fetched after first paint, and never on devices without WebGL.
const load = () => import("./Stage");
export const SceneCanvas = lazy(() => load().then((m) => ({ default: m.SceneCanvas })));
export const RobotView = lazy(() => load().then((m) => ({ default: m.RobotView })));
export const SkillsView = lazy(() => load().then((m) => ({ default: m.SkillsView })));
export const KeyboardView = lazy(() => load().then((m) => ({ default: m.KeyboardView })));
export const OrbitView = lazy(() => load().then((m) => ({ default: m.OrbitView })));
export const GlobeView = lazy(() => load().then((m) => ({ default: m.GlobeView })));

export const hasWebGL = (() => {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
})();
