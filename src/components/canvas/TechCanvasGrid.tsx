import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Decal,
  useTexture,
  OrbitControls,
  Preload,
} from "@react-three/drei";
import CanvasLoader from "../Loader";
import type { TechnologiesType } from "../../types";
import type { Group } from "three";

const TechBall = ({
  imgUrl,
  position,
}: {
  imgUrl: string;
  position: [number, number, number];
}) => {
  const [decal] = useTexture([imgUrl]);

  return (
    <group position={position}>
      <Float speed={1.75} rotationIntensity={1.2} floatIntensity={2}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[0, 0, 0.05]} />
        <mesh castShadow receiveShadow scale={1.5}>
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
    </group>
  );
};

// NEW: Rotating group component with responsive columns
interface RotationConfig {
  maxAngleX: number;
  maxAngleY: number;
  maxAngleZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
}

const RotatingTechGroup = ({
  technologies,
  rotationConfig,
  columns,
  isMobile, // NEW: Add isMobile prop
}: {
  technologies: TechnologiesType[];
  rotationConfig?: RotationConfig;
  columns: number;
  isMobile?: boolean; // NEW: Optional mobile flag
}) => {
  const groupRef = useRef<Group>(null);

  // Default rotation configuration
  const config: RotationConfig = {
    maxAngleX: 0.17,
    maxAngleY: 0.26,
    maxAngleZ: 0.09,
    speedX: 0.3,
    speedY: 0.5,
    speedZ: 0.7,
    ...rotationConfig,
  };

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.elapsedTime;

    groupRef.current.rotation.x =
      config.maxAngleX * Math.sin(time * config.speedX);
    groupRef.current.rotation.y =
      config.maxAngleY * Math.sin(time * config.speedY);
    groupRef.current.rotation.z =
      config.maxAngleZ * Math.sin(time * config.speedZ);
  });

  return (
    <group
      ref={groupRef}
      position={[0, isMobile ? 2 : 0, 0]} // Move the entire group up on mobile
    >
      {technologies.map((tech, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        // Adjust spacing and positioning for mobile
        const spacing = isMobile ? 4.5 : 4; // Slightly tighter on mobile
        const x = (col - (columns - 1) / 2) * spacing;
        const y = (1 - row) * spacing;

        return (
          <TechBall key={tech.name} imgUrl={tech.icon} position={[x, y, 0]} />
        );
      })}
    </group>
  );
};

const TechCanvasGrid = ({
  technologies,
}: {
  technologies: TechnologiesType[];
}) => {
  const [columns, setColumns] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setColumns(mobile ? 3 : 5);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <div className={`w-full ${isMobile ? "h-[700px]" : "h-[500px]"}`}>
      <Canvas
        frameloop="always"
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [0, 0, isMobile ? 25 : 15], // Move camera further back on mobile
          fov: isMobile ? 60 : 50, // Wider field of view for mobile
        }}
        style={{
          touchAction: isMobile ? "pan-y" : "auto", // Allow vertical scrolling on mobile
          pointerEvents: isMobile ? "none" : "auto", // Disable pointer events on mobile
          width: "100%",
          height: "100%", // Canvas fills container but models stay same size
        }}
        onCreated={({ gl }) => {
          // Disable touch events on mobile
          if (isMobile) {
            gl.domElement.style.touchAction = "pan-y";
            gl.domElement.style.pointerEvents = "none";
          }
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <RotatingTechGroup
            technologies={technologies}
            columns={columns}
            isMobile={isMobile} // Pass isMobile to adjust positioning
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={isMobile ? false : true} // Disable rotation on mobile
            autoRotate={false}
            autoRotateSpeed={0}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TechCanvasGrid;
