import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { useFrame } from "react-three-fiber";
import { frag, vert } from "./shaders";

function Cloud({ scale = [1, 1, 1], ...props }) {
  const ref = useRef();

  const [noiseTexture, rotation] = useMemo(() => {
    const size = 128;
    const data = new Uint8Array(size * size * size);

    let i = 0;
    const scale = Math.max(0.025, Math.random() * 0.05);
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const d =
            1.0 -
            vector
              .set(x, y, z)
              .subScalar(size / 2)
              .divideScalar(size)
              .length();
          data[i] =
            (128 +
              128 *
                perlin.noise((x * scale) / 1.5, y * scale, (z * scale) / 1.5)) *
            d *
            d;
          i++;
        }
      }
    }

    const texture = new THREE.DataTexture3D(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;

    return [texture, Math.random() * 0.005];
  }, []);

  const materialProps = {
    uniforms: {
      base: { value: new THREE.Color(0xe3e5f8) },
      map: { value: noiseTexture },
      cameraPos: { value: new THREE.Vector3() },
      threshold: { value: 0.25 },
      opacity: { value: 0.25 },
      range: { value: 0.1 },
      steps: { value: 100 },
    },
    vertexShader: vert,
    fragmentShader: frag,
    side: THREE.BackSide,
    transparent: true,
  };

  useFrame(({ camera }) => {
    ref.current.rotation.y += rotation;
    ref.current.material.uniforms.cameraPos.value.copy(camera.position);
  });

  return (
    <group scale={scale}>
      <mesh ref={ref} {...props} castShadow receiveShadow>
        <boxBufferGeometry args={[1, 1, 1]} />
        <rawShaderMaterial {...materialProps} />
      </mesh>
    </group>
  );
}

export default Cloud;
