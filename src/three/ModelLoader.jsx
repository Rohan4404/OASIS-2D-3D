// src/three/ModelLoader.jsx
import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * ModelLoader
 * props:
 *  - url: string (path to glb)
 *  - scale: number
 *  - rotationY: radians
 *  - position: [x, y, z]
 *  - onPointerOver, onPointerOut (optional)
 */
export default function ModelLoader({
  url,
  scale = 0.5,
  rotationY = 0,
  position = [0, 0, 0],
  onPointerOver,
  onPointerOut,
}) {
  const { scene } = useGLTF(url);

  // clone the scene to avoid mutating cache
  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    // ensure materials are unique to avoid shared state
    clone.traverse((n) => {
      if (n.isMesh) {
        n.material = n.material ? n.material.clone() : n.material;
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}
