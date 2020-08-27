import React, { Suspense, forwardRef, useMemo } from "react";

import {
  EffectComposer,
  Noise,
  Vignette,
  HueSaturation,
} from "react-postprocessing";
import { useResource, useThree } from "react-three-fiber";

import { GodRaysEffect, KernelSize, BlendFunction } from "postprocessing";

import { Circle } from "drei";
import { useControl } from "react-three-gui";

export const GodRays = forwardRef((props, ref) => {
  const { camera } = useThree();
  const { sun } = props;

  const effect = useMemo(() => {
    const godRaysEffect = new GodRaysEffect(camera, sun.current, {
      height: 1000,
      width: 1000,
      kernelSize: KernelSize.MEDIUM,
      density: 0.96,
      decay: 0.92,
      weight: 0.3,
      exposure: 0.7,
      samples: 50,
      clampMax: 1,
    });

    return godRaysEffect;
  }, [camera, sun]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

const Sun = forwardRef(function Sun(props, forwardRef) {
  const sunColor = useControl("sun color", { type: "color", value: "#FFD9BA" });

  return (
    <Circle args={[2, 32, 32]} ref={forwardRef} position={[-6, 4, -40]}>
      <meshBasicMaterial color={sunColor} />
    </Circle>
  );
});

function Effects() {
  const [$sun, sun] = useResource();

  const hue = useControl("Hue", {
    group: "postproc",
    value: 3.83,
    min: 0,
    max: Math.PI * 2,
    type: "number",
  });
  const saturation = useControl("saturation", {
    group: "postproc",
    value: 2.05,
    min: 0,
    max: Math.PI * 2,
    type: "number",
  });
  const noise = useControl("noise", {
    group: "postproc",
    value: 0.2,
    min: 0,
    max: 1,
    type: "number",
  });

  return (
    <Suspense fallback={null}>
      <Sun ref={$sun} />

      {sun && (
        <EffectComposer multisampling={false}>
          <GodRays sun={$sun} />

          <Noise
            opacity={noise}
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.ADD} // blend mode
          />

          <HueSaturation hue={hue} saturation={saturation} />

          <Vignette />
        </EffectComposer>
      )}
    </Suspense>
  );
}

export default Effects;
