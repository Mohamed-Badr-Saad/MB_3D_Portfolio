import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { LAND_POINTS_B64 } from "./landPoints";
import { pointer } from "./pointer";
import { sceneVisibility } from "./visibility";

const RADIUS = 1.6;
const TEAL = "#3CCFB4";
const ALEXANDRIA = { lat: 31.2001, lon: 29.9187 };
const DEG = Math.PI / 180;

function toVec(lat: number, lon: number, r = RADIUS) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

function decodeLand() {
  const bin = atob(LAND_POINTS_B64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const pairs = new Int16Array(bytes.buffer);
  const pos = new Float32Array((pairs.length / 2) * 3);
  for (let i = 0; i < pairs.length / 2; i++) {
    const v = toVec(pairs[i * 2] / 100, pairs[i * 2 + 1] / 100);
    pos.set([v.x, v.y, v.z], i * 3);
  }
  return pos;
}

function Graticule() {
  const lines = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 6) pts.push(toVec(lat, lon, RADIUS * 1.002));
      out.push(pts);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 6) pts.push(toVec(lat, lon, RADIUS * 1.002));
      out.push(pts);
    }
    return out;
  }, []);
  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#22344B" lineWidth={1} transparent opacity={0.9} />
      ))}
    </>
  );
}

export default function Globe({ reduced }: { reduced: boolean }) {
  const positions = useMemo(() => decodeLand(), []);
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const drag = useRef({ x: 0, y: 0, active: false });
  const ring = useRef<THREE.Mesh>(null);
  const pin = useMemo(() => toVec(ALEXANDRIA.lat, ALEXANDRIA.lon), []);
  const beamEnd = useMemo(() => toVec(ALEXANDRIA.lat, ALEXANDRIA.lon, RADIUS * 1.28), []);
  const pinQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pin.clone().normalize()),
    [pin],
  );

  const turn = useRef(0);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    // Spins steadily while the globe is on screen, and stops as soon as it isn't (or while dragging).
    if (sceneVisibility.globe && !drag.current.active) turn.current += Math.min(delta, 0.05) * (reduced ? 0.14 : 0.22);
    if (spin.current) {
      spin.current.rotation.y = -ALEXANDRIA.lon * DEG + turn.current + drag.current.y + (reduced ? 0 : pointer.x * 0.2);
    }
    if (tilt.current) tilt.current.rotation.x = ALEXANDRIA.lat * DEG * 0.55 + drag.current.x;
    if (ring.current) {
      const k = (t * (reduced ? 0.35 : 0.6)) % 1;
      ring.current.scale.setScalar(1 + k * 2.4);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={36} />
      <group ref={tilt} rotation={[ALEXANDRIA.lat * DEG * 0.55, 0, 0]}>
        <group ref={spin}>
          <mesh
            onPointerOver={() => (document.body.style.cursor = "grab")}
            onPointerOut={() => !drag.current.active && (document.body.style.cursor = "")}
            onPointerDown={(e) => {
              e.stopPropagation();
              const d = drag.current;
              d.active = true;
              let lx = e.nativeEvent.clientX, ly = e.nativeEvent.clientY;
              document.body.style.cursor = "grabbing";
              const move = (ev: PointerEvent) => {
                d.y += (ev.clientX - lx) * 0.008;
                d.x = THREE.MathUtils.clamp(d.x + (ev.clientY - ly) * 0.005, -0.8, 0.8);
                lx = ev.clientX;
                ly = ev.clientY;
              };
              const up = () => {
                d.active = false;
                document.body.style.cursor = "";
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
            }}
          >
            <sphereGeometry args={[RADIUS * 0.99, 64, 48]} />
            <meshBasicMaterial color="#0F1C2E" />
          </mesh>
          <Graticule />
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#8EA1B6" size={0.03} sizeAttenuation transparent opacity={0.9} />
          </points>
          <group position={pin} quaternion={pinQuat}>
            <mesh>
              <circleGeometry args={[0.035, 24]} />
              <meshBasicMaterial color={TEAL} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ring} position={[0, 0, 0.002]}>
              <ringGeometry args={[0.045, 0.06, 32]} />
              <meshBasicMaterial color={TEAL} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          </group>
          <Line points={[pin, beamEnd]} color={TEAL} lineWidth={1.5} />
        </group>
      </group>
    </>
  );
}
