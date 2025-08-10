import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  // useGLTF is a hook that loads the glTF model from the specified path
  return (
    <mesh>
      <primitive
        object={earth.scene}
        scale={2.3} //to scale the model
        position={[0, 0, 0]} //to position the model
        rotation={[0, 0, 0]} //to rotate the model
      />
    </mesh>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      frameloop="always" // to render the canvas continuously
      shadows
      camera={{ position: [-4, 3, 6], fov: 45, near: 0.1, far: 200 }} // we need to specify the camera position and the field of view(how wide field of view)
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.getContext().canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.log("⚠️ WebGL context lost. Try reloading the page.");
        });
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate={true} //to rotate the model automatically
          autoRotateSpeed={2} //to control the speed of rotation
          enableZoom={false}
          maxPolarAngle={Math.PI / 2} //To allow moving the model around a specific angle
          minPolarAngle={Math.PI / 2}
        />
        {/*to allow moving the 3D model */}
        <Earth />
      </Suspense>

      <Preload all />
      {/**preload is used to load the model in the background */}
    </Canvas>
  );
};

export default EarthCanvas;
