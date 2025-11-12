// src/three/FloorGrid3D.jsx
import React from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";

/**
 * FloorGrid3D draws a grid that matches the tile layout.
 * props:
 *  - cols, rows: ints
 *  - metersPerTile: number
 */
export default function FloorGrid3D({ cols, rows, metersPerTile }) {
  const { scene } = useThree();
  // we create a grid helper centered at half extents
  const width = cols * metersPerTile;
  const height = rows * metersPerTile;
  const size = Math.max(width, height);
  const divisions = Math.max(cols, rows) * 1; // one division per tile

  // We return an object (GridHelper) using React fragment to avoid re-adding repeatedly
  return (
    <>
      <gridHelper
        args={[size, divisions, "#cccccc", "#efefef"]}
        position={[width / 2 - size / 2, 0.001, height / 2 - size / 2]}
      />
      {/* subtle plane for the floor so shadows look right */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, height / 2]}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={"#f8f8f8"} />
      </mesh>
    </>
  );
}
