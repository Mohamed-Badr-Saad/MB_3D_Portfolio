import { Float, OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Suspense, useEffect, useState } from "react";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile }: { isMobile: boolean }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={1}>
      {
        // to create 3D element we should start with <mesh></mesh> not a div
        //we should create light or otherwise, we won't see anything ==>hemisphereLight
      }
      <mesh>
        <hemisphereLight intensity={4} groundColor="black" />
        <pointLight intensity={0.9} /> {/*point light */}
        <spotLight
          position={[-20, 50, 10]}
          intensity={1}
          angle={0.12}
          penumbra={1}
          castShadow
          shadow-mapSize={1024}
        />
        <primitive
          object={computer.scene}
          scale={isMobile ? [0.4, 0.5, 0.25] : [1, 0.7, 0.8]} //to scale the model
          position={isMobile ? [0, -2, -0.5] : [0, -2.4, -1.5]} //to position the model
          rotation={[-0.01, -0.2, -0.1]} //to rotate the model
        />
      </mesh>
    </Float>
  );
};

const ComputerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)"); // to check if the screen width is less than or equal to 500px
    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", (event) => {
      setIsMobile(event.matches); // update the state when the screen width changes
    });

    return () => {
      mediaQuery.removeEventListener("change", (event) => {
        setIsMobile(event.matches); // clean up the event listener
      });
    };
  }, []);

  return (
    <Canvas
      frameloop="always" // to render the canvas continuously
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }} // we need to specify the camera position and the field of view(how wide field of view)
      gl={{ preserveDrawingBuffer: true }}
      style={{
        touchAction: isMobile ? "pan-y" : "auto", // Allow vertical scrolling on mobile
        pointerEvents: isMobile ? "none" : "auto", // Disable pointer events on mobile
        width: "100%",
        height: "100%", // Canvas fills container but models stay same size
      }}
      onCreated={({ gl }) => {
        gl.getContext().canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.log("⚠️ WebGL context lost. Try reloading the page.");
        });
        // Disable touch events on mobile
        if (isMobile) {
          gl.domElement.style.touchAction = "pan-y";
          gl.domElement.style.pointerEvents = "none";
        }
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2} //To allow moving the model around a specific angle
          minPolarAngle={Math.PI / 2}
        />{" "}
        {/*to allow moving the 3D model */}
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
      {/**preload is used to load the model in the background */}
    </Canvas>
  );
};

export default ComputerCanvas;
