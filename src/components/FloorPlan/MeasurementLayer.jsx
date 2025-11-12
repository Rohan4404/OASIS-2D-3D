// src/components/FloorPlan/MeasurementLayer.jsx
import React from "react";
import { tilesToFeet } from "../../utils/geometryUtils";

export default function MeasurementLayer({ grid }) {
  if (!grid) return null;
  const { rows, cols, tilePhysicalSize = 2, tileSize } = grid;
  const width = cols * tileSize;
  const height = rows * tileSize;

  const widthFeet = tilesToFeet(cols, tilePhysicalSize);
  const heightFeet = tilesToFeet(rows, tilePhysicalSize);
  const totalArea = (widthFeet * heightFeet).toFixed(0);

  return (
    <g className="measurement-layer" transform="translate(0,0)">
      <defs>
        <marker
          id="arrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#000" />
        </marker>
      </defs>

      {/* Horizontal dimension (top) */}
      <line
        x1={0}
        y1={-20}
        x2={width}
        y2={-20}
        stroke="#000"
        strokeWidth="0.6"
        markerStart="url(#arrow)"
        markerEnd="url(#arrow)"
      />
      <text x={width / 2} y={-25} fontSize="12" textAnchor="middle" fill="#000">
        {widthFeet} ft
      </text>

      {/* Vertical dimension (right) */}
      <line
        x1={width + 20}
        y1={0}
        x2={width + 20}
        y2={height}
        stroke="#000"
        strokeWidth="0.6"
        markerStart="url(#arrow)"
        markerEnd="url(#arrow)"
      />
      <text
        x={width + 45}
        y={height / 2}
        fontSize="12"
        textAnchor="middle"
        fill="#000"
        transform={`rotate(90, ${width + 45}, ${height / 2})`}
      >
        {heightFeet} ft
      </text>

      {/* Area label below */}
      <text
        x={width / 2}
        y={height + 30}
        fontSize="13"
        textAnchor="middle"
        fill="#333"
      >
        Total Floor Area: {totalArea} sq ft ({widthFeet} ft × {heightFeet} ft)
      </text>
    </g>
  );
}
