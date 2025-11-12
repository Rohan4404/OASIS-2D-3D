import React, { useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Hotspot({ hotspot, onHover, onClick, isActive }) {
  const ref = useRef();

  // Subtle floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current)
      ref.current.position.y = hotspot.position[1] + Math.sin(t * 2) * 0.1;
  });

  return (
    <group position={hotspot.position}>
      <mesh
        ref={ref}
        onPointerOver={() => onHover(hotspot)}
        onPointerOut={() => onHover(null)}
        onClick={() => onClick(hotspot)}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? "#00bfff" : "#ffffff"}
          emissive={isActive ? "#00bfff" : "#333"}
          emissiveIntensity={0.6}
        />
      </mesh>
      <Html distanceFactor={10}>
        <div
          className={`text-xs text-center font-semibold ${
            isActive ? "text-blue-500" : "text-gray-800"
          }`}
        >
          {hotspot.label}
        </div>
      </Html>
    </group>
  );
}
