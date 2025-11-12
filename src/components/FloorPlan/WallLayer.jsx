// src/components/FloorPlan/WallLayer.jsx
import React from "react";

export default function WallLayer({ grid, padding = 0 }) {
  if (!grid) return null;
  const { rows, cols, tileSize } = grid;
  const w = cols * tileSize;
  const h = rows * tileSize;

  return (
    <g className="wall-layer">
      {/* Outer wall (thin architectural stroke) */}
      <rect
        x={-padding}
        y={-padding}
        width={w + padding * 2}
        height={h + padding * 2}
        fill="none"
        stroke="#444"
        strokeWidth="1.5"
      />
    </g>
  );
}
