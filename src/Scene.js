import * as THREE from "three";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Physics, useBox } from "use-cannon";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Balloon from "./Balloon";
import Cloud from "./cloud";
import cloudData from "./data.json";

function Bird({ speed = 1, factor = 0.1, ...props }) {
  const { viewport } = useThree();

  const { nodes, materials, animations } = useLoader(
    GLTFLoader,
    "/Flamingo.glb"
  );
  const [mixer] = useState(() => new THREE.AnimationMixer());
  const [body, api] = useBox(() => ({
    type: "Kinematic",
    args: [4, 4, 0.5],
    rotation: [1.5707964611537577, 0, 0],
  }));
  const [, apiL] = useBox(() => ({
    type: "Kinematic",
    args: [1, 0.5, 4],
  }));
  const [, apiR] = useBox(() => ({
    type: "Kinematic",
    args: [1, 0.5, 4],
  }));

  useEffect(() => void mixer.clipAction(animations[0], body.current).play(), [
    mixer,
    animations,
    body,
  ]);

  useFrame(({ mouse, clock }, delta) => {
    const time = clock.getElapsedTime() * 4.34;

    const { x, y, z } = body.current.position;

    mixer.update(delta * speed);

    api.position.set(mouse.x * viewport.width * 2, 0, 0);
    apiL.position.set(x - 1, y + Math.sin(time), z);
    apiR.position.set(x + 1, y + Math.sin(time), z);
  });

  return (
    <group {...props}>
      <mesh
        castShadow
        receiveShadow
        ref={body}
        dispose={null}
        morphTargetDictionary={nodes?.Object_0?.morphTargetDictionary}
        morphTargetInfluences={nodes?.Object_0?.morphTargetInfluences}
        geometry={nodes.Object_0.geometry}
        material={materials.Material_0_COLOR_0}
      />
    </group>
  );
}

export default function Scene() {
  return (
    <group position={[0, 0, -20]}>
      <Physics gravity={[0, 1, 0]}>
        <Suspense fallback={null}>
          <Bird />
          <Balloon />
        </Suspense>
      </Physics>
      {cloudData.clouds.map((cloud, index) => (
        <Cloud key={`0${index}`} {...cloud} />
      ))}
    </group>
  );
}
