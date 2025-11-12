// // src/components/FloorPlan/GridLayer.jsx
// import React from "react";

// /**
//  * Draw faint grid lines for rows x cols using tileSize.
//  * Each tile visual corresponds to 2x2 ft in real world (tilePhysicalSize in config).
//  */
// export default function GridLayer({ grid }) {
//   if (!grid) return null;
//   const { rows, cols, tileSize } = grid;
//   const width = cols * tileSize;
//   const height = rows * tileSize;
//   const lines = [];

//   // vertical
//   for (let c = 0; c <= cols; c++) {
//     const x = c * tileSize;
//     lines.push(
//       <line
//         key={`v-${c}`}
//         x1={x}
//         y1={0}
//         x2={x}
//         y2={height}
//         stroke="#e6e6e6"
//         strokeWidth="0.7"
//       />
//     );
//   }
//   // horizontal
//   for (let r = 0; r <= rows; r++) {
//     const y = r * tileSize;
//     lines.push(
//       <line
//         key={`h-${r}`}
//         x1={0}
//         y1={y}
//         x2={width}
//         y2={y}
//         stroke="#e6e6e6"
//         strokeWidth="0.7"
//       />
//     );
//   }
//   return <g className="grid-layer">{lines}</g>;
// }

import React from "react";

/**
 * Draw grid lines for rows × cols using tileSize (visual pixel size per tile).
 * If you increase tileSize, the tile squares should *visually* grow larger.
 */
export default function GridLayer({ grid }) {
  if (!grid) return null;
  const { rows, cols, tileSize = 40 } = grid;

  const width = cols * tileSize;
  const height = rows * tileSize;

  const lines = [];

  // vertical lines
  for (let c = 0; c <= cols; c++) {
    const x = c * tileSize;
    lines.push(
      <line
        key={`v-${c}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#dcdcdc"
        strokeWidth="0.7"
      />
    );
  }

  // horizontal lines
  for (let r = 0; r <= rows; r++) {
    const y = r * tileSize;
    lines.push(
      <line
        key={`h-${r}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#dcdcdc"
        strokeWidth="0.7"
      />
    );
  }

  // background rectangle for reference (optional)
  lines.push(
    <rect
      key="background"
      x={0}
      y={0}
      width={width}
      height={height}
      fill="none"
      stroke="#ccc"
      strokeWidth="1"
    />
  );

  return <g className="grid-layer">{lines}</g>;
}
