import React from "react";
import { Canvas } from "react-three-fiber";

import Effects from "./Effects";
import Scene from "./Scene";

export default function App() {
  return (
    <Canvas
      shadowMap
      gl={{
        powerPreference: "high-performance",
        alpha: false,
        antialias: false,
        stencil: false,
        depth: false,
      }}
      camera={{ fov: 30 }}
      onCreated={({ gl }) => gl.setClearColor("#3454da")}
    >
      <ambientLight />
      <pointLight
        position={[-6, 4, -40]}
        color="yellow"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[0, -10, -10]} intensity={0.3} />
      <Effects />
      <Scene />
    </Canvas>
  );
}
