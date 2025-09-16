import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  useTexture,
  Preload,
} from "@react-three/drei";
import CanvasLoader from "../Loader";

// Standalone Ball compo nent (no Canvas wrapper)
export const Ball = ({ imgUrl }: { imgUrl: string }) => {
  const [decal] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
        />
      </mesh>
    </Float>
  );
};

// Original BallCanvas (keep for backward compatibility)
const BallCanvas = ({ icon }: { icon: string }) => {
  return (
    <Canvas
      frameloop="demand"
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.getContext().canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.log("⚠️ WebGL context lost. Try reloading the page.");
        });
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Ball imgUrl={icon} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default BallCanvas;
