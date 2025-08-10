import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html>
      <span className="canvas-loader"></span>
      <p
        style={{
          color: "#f1f1f1",
          fontSize: "14px",
          fontWeight: "800",
          marginTop: "40px",
        }}
      >
        {progress.toFixed(2)}% loaded
      </p>
    </Html>
  );
};

export default CanvasLoader;
