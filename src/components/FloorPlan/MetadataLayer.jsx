// src/components/FloorPlan/MetadataLayer.jsx
import React from "react";

/**
 * Shows a simple architectural-style summary card.
 * props.hover — object { item, screenX, screenY } OR {item, x, y} in svg coords transformed
 */
export default function MetadataLayer({ hover }) {
  if (!hover || !hover.item) return null;
  const { item, cx, cy } = hover;

  // card anchored a bit offset from element center
  const cardWidth = 180;
  const cardHeight = 80;
  const x = cx + 10;
  const y = Math.max(cy - cardHeight / 2, 0);

  return (
    <g className="metadata-layer">
      <rect
        x={x}
        y={y}
        width={cardWidth}
        height={cardHeight}
        rx="6"
        fill="#ffffff"
        stroke="#ccc"
        strokeWidth="0.8"
      />
      <text x={x + 10} y={y + 20} fontSize="12" fill="#222" fontWeight="600">
        {item.label || item.id}
      </text>
      {item.metadata?.power && (
        <text x={x + 10} y={y + 36} fontSize="11" fill="#333">
          Power: {item.metadata.power}
        </text>
      )}
      {item.metadata?.temp && (
        <text x={x + 10} y={y + 52} fontSize="11" fill="#333">
          Temp: {item.metadata.temp}
        </text>
      )}
      {item.metadata?.status && (
        <text x={x + 10} y={y + 68} fontSize="11" fill="#333">
          Status: {item.metadata.status}
        </text>
      )}
    </g>
  );
}
