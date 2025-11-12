// version1

// import React from "react";

// export default function ThermalHeatmapLayer({ grid, elements }) {
//   if (!elements || elements.length === 0) return null;

//   const tileSize = grid.tileSize;
//   const cols = grid.cols;
//   const rows = grid.rows;

//   // Parse temperature safely
//   const parseTemp = (tempValue) => {
//     if (!tempValue) return 0;
//     if (typeof tempValue === "string") {
//       return parseFloat(tempValue.replace(/[^\d.-]/g, ""));
//     }
//     return parseFloat(tempValue);
//   };

//   // Gradient color scale
//   const gradientStops = [
//     { temp: 15, color: [0, 191, 255] }, // Blue (cold)
//     { temp: 22, color: [0, 255, 128] }, // Green
//     { temp: 27, color: [255, 255, 0] }, // Yellow
//     { temp: 32, color: [255, 165, 0] }, // Orange
//     { temp: 38, color: [255, 0, 0] }, // Red (hot)
//   ];

//   const getGradientColor = (temp, opacity = 1) => {
//     if (temp <= gradientStops[0].temp)
//       return `rgba(${gradientStops[0].color.join(",")}, ${opacity})`;
//     if (temp >= gradientStops[gradientStops.length - 1].temp)
//       return `rgba(${gradientStops[gradientStops.length - 1].color.join(
//         ","
//       )}, ${opacity})`;

//     let lower, upper;
//     for (let i = 0; i < gradientStops.length - 1; i++) {
//       if (temp >= gradientStops[i].temp && temp <= gradientStops[i + 1].temp) {
//         lower = gradientStops[i];
//         upper = gradientStops[i + 1];
//         break;
//       }
//     }

//     const ratio = (temp - lower.temp) / (upper.temp - lower.temp);
//     const r = Math.round(
//       lower.color[0] + ratio * (upper.color[0] - lower.color[0])
//     );
//     const g = Math.round(
//       lower.color[1] + ratio * (upper.color[1] - lower.color[1])
//     );
//     const b = Math.round(
//       lower.color[2] + ratio * (upper.color[2] - lower.color[2])
//     );
//     return `rgba(${r}, ${g}, ${b}, ${opacity})`;
//   };

//   return (
//     <g className="thermal-layer">
//       <defs>
//         <filter id="blurHeat">
//           <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
//         </filter>
//       </defs>

//       {/* Background tint */}
//       <rect
//         x={0}
//         y={0}
//         width={cols * tileSize}
//         height={rows * tileSize}
//         fill="rgba(0, 200, 255, 0.1)"
//       />

//       {elements.map((el) => {
//         const temp = parseTemp(el.metadata?.temperature);
//         const cx = el.x * tileSize + (el.width * tileSize) / 2;
//         const cy = el.y * tileSize + (el.height * tileSize) / 2;
//         const rx = el.width * tileSize * 1.5;
//         const ry = el.height * tileSize * 1.5;
//         const type = el.type.toLowerCase();
//         const orientation = el.orientation?.toLowerCase() || "north";

//         // Non-rack = blue cooling zone
//         if (type !== "rack") {
//           return (
//             <ellipse
//               key={el.id}
//               cx={cx}
//               cy={cy}
//               rx={rx * 1.2}
//               ry={ry * 1.2}
//               fill="rgba(0,150,255,0.3)"
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "overlay" }}
//             />
//           );
//         }

//         const color = getGradientColor(temp, 0.8);
//         const gradientId = `grad-${el.id}`;
//         let x1 = 0,
//           y1 = 0,
//           x2 = 0,
//           y2 = 0;

//         // Heat direction per orientation
//         switch (orientation) {
//           case "north":
//             x1 = 0.5;
//             y1 = 1;
//             x2 = 0.5;
//             y2 = 0; // bottom → top
//             break;
//           case "south":
//             x1 = 0.5;
//             y1 = 0;
//             x2 = 0.5;
//             y2 = 1; // top → bottom
//             break;
//           case "east":
//             x1 = 0;
//             y1 = 0.5;
//             x2 = 1;
//             y2 = 0.5; // left → right
//             break;
//           case "west":
//             x1 = 1;
//             y1 = 0.5;
//             x2 = 0;
//             y2 = 0.5; // right → left
//             break;
//           default:
//             x1 = 0.5;
//             y1 = 1;
//             x2 = 0.5;
//             y2 = 0;
//         }

//         // FRONT SIDE (north/south) → fade to blue at the end
//         const isFrontFacing =
//           orientation === "north" || orientation === "south";

//         return (
//           <g key={el.id}>
//             <defs>
//               <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
//                 <stop offset="0%" stopColor={getGradientColor(15, 0.3)} />
//                 <stop offset="40%" stopColor={getGradientColor(27, 0.6)} />
//                 <stop offset="70%" stopColor={getGradientColor(32, 0.9)} />
//                 <stop
//                   offset="100%"
//                   stopColor={
//                     isFrontFacing
//                       ? "rgba(0,191,255,0.8)" // BLUE front instead of RED
//                       : color // keep red for others
//                   }
//                 />
//               </linearGradient>
//             </defs>

//             {/* Outer diffusion */}
//             <ellipse
//               cx={cx}
//               cy={cy}
//               rx={rx * 2.5}
//               ry={ry * 2.5}
//               fill={`url(#${gradientId})`}
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "overlay" }}
//             />

//             {/* Core heat zone */}
//             <ellipse
//               cx={cx}
//               cy={cy}
//               rx={rx}
//               ry={ry}
//               fill={color}
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "multiply" }}
//             />

//             {/* Temperature Label */}
//             {temp > 30 && (
//               <text
//                 x={cx}
//                 y={orientation === "south" ? cy + ry * 1.6 : cy - ry * 1.6}
//                 textAnchor="middle"
//                 fontSize="11"
//                 fill="#222"
//                 fontWeight="600"
//               >
//                 {temp.toFixed(1)}°C
//               </text>
//             )}
//           </g>
//         );
//       })}
//     </g>
//   );
// }

// version2

// import React from "react";

// export default function ThermalHeatmapLayer({ grid, elements }) {
//   if (!elements || elements.length === 0) return null;

//   const tileSize = grid.tileSize;
//   const cols = grid.cols;
//   const rows = grid.rows;

//   const parseTemp = (tempValue) => {
//     if (!tempValue) return 0;
//     if (typeof tempValue === "string") {
//       return parseFloat(tempValue.replace(/[^\d.-]/g, ""));
//     }
//     return parseFloat(tempValue);
//   };

//   // Filter racks
//   const racks = elements.filter((e) => e.type.toLowerCase() === "rack");
//   if (racks.length === 0) return null;

//   // Dynamic rack region
//   const xMin = Math.min(...racks.map((r) => r.x));
//   const xMax = Math.max(...racks.map((r) => r.x + r.width));
//   const yMin = Math.min(...racks.map((r) => r.y));
//   const yMax = Math.max(...racks.map((r) => r.y + r.height));

//   const regionX = xMin * tileSize;
//   const regionY = yMin * tileSize;
//   const regionWidth = (xMax - xMin) * tileSize;
//   const regionHeight = (yMax - yMin) * tileSize;

//   const temps = racks.map((r) => parseTemp(r.metadata?.temperature));
//   const avgTemp =
//     racks.reduce((acc, r) => acc + parseTemp(r.metadata?.temperature), 0) /
//     racks.length;

//   const centerX = regionX + regionWidth / 2;
//   const centerY = regionY + regionHeight / 2;

//   return (
//     <g className="thermal-layer">
//       <defs>
//         <filter id="blurHeat">
//           <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
//         </filter>

//         {/* === Radial Gradient Halo === */}
//         <radialGradient id="heatGradient" cx="50%" cy="50%" r="80%">
//           <stop offset="0%" stopColor="rgba(255, 0, 0, 1)" />{" "}
//           {/* Hot red core */}
//           <stop offset="25%" stopColor="rgba(255, 165, 0, 0.95)" />{" "}
//           {/* Orange */}
//           <stop offset="45%" stopColor="rgba(255, 255, 0, 0.85)" />{" "}
//           {/* Yellow */}
//           <stop offset="65%" stopColor="rgba(0, 255, 128, 0.75)" />{" "}
//           {/* Green */}
//           <stop offset="85%" stopColor="rgba(0, 191, 255, 0.6)" /> {/* Cyan */}
//           <stop offset="100%" stopColor="rgba(0, 180, 255, 0.4)" />{" "}
//           {/* Light Blue */}
//         </radialGradient>
//       </defs>

//       {/* === Central red rack zone === */}
//       <rect
//         x={regionX}
//         y={regionY}
//         width={regionWidth}
//         height={regionHeight}
//         fill="rgba(200,0,0,1)"
//         filter="url(#blurHeat)"
//         style={{ mixBlendMode: "screen" }}
//       />

//       {/* === Smooth gradient halo area === */}
//       <rect
//         x={regionX - tileSize * 4}
//         y={regionY - tileSize * 4}
//         width={regionWidth + tileSize * 8}
//         height={regionHeight + tileSize * 8}
//         fill="url(#heatGradient)"
//         filter="url(#blurHeat)"
//         style={{ mixBlendMode: "screen" }}
//         opacity={0.95}
//       />

//       {/* === CRAH / UPS Cool Spots === */}
//       {elements
//         .filter((e) => e.type.toLowerCase() !== "rack")
//         .map((el) => {
//           const cx = el.x * tileSize + (el.width * tileSize) / 2;
//           const cy = el.y * tileSize + (el.height * tileSize) / 2;
//           const rx = el.width * tileSize * 1.3;
//           const ry = el.height * tileSize * 1.3;
//           return (
//             <ellipse
//               key={el.id}
//               cx={cx}
//               cy={cy}
//               rx={rx}
//               ry={ry}
//               fill="rgba(0,180,255,0.45)"
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "screen" }}
//             />
//           );
//         })}

//       {/* === Temperature Label === */}
//       <rect
//         x={centerX - tileSize * 1.5}
//         y={centerY - tileSize * 0.8}
//         width={tileSize * 3}
//         height={tileSize * 1.6}
//         fill="rgba(255,255,255,0.6)"
//         rx="4"
//         ry="4"
//         style={{ mixBlendMode: "screen" }}
//       />

//       <text
//         x={centerX}
//         y={centerY + 4}
//         textAnchor="middle"
//         fontSize="12"
//         fill="#000"
//         fontWeight="700"
//         style={{
//           textShadow: "0 0 5px rgba(255,255,255,0.9)",
//           fontFamily: "Arial, sans-serif",
//         }}
//       >
//         {avgTemp.toFixed(1)}°C
//       </text>
//     </g>
//   );
// }

// version3

import React from "react";

export default function ThermalHeatmapLayer({ grid, elements }) {
  if (!elements || elements.length === 0) return null;

  const tileSize = grid.tileSize;
  const cols = grid.cols;
  const rows = grid.rows;

  // Parse temperature safely
  const parseTemp = (tempValue) => {
    if (!tempValue) return 0;
    if (typeof tempValue === "string") {
      return parseFloat(tempValue.replace(/[^\d.-]/g, ""));
    }
    return parseFloat(tempValue);
  };

  // Filter racks
  const racks = elements.filter((e) => e.type.toLowerCase() === "rack");
  if (racks.length === 0) return null;

  // Dynamic bounds for rack region (covers both north and south)
  const xMin = Math.min(...racks.map((r) => r.x));
  const xMax = Math.max(...racks.map((r) => r.x + r.width));
  const yMin = Math.min(...racks.map((r) => r.y));
  const yMax = Math.max(...racks.map((r) => r.y + r.height));

  const regionX = xMin * tileSize;
  const regionY = yMin * tileSize;
  const regionWidth = (xMax - xMin) * tileSize;
  const regionHeight = (yMax - yMin) * tileSize;

  const temps = racks.map((r) => parseTemp(r.metadata?.temperature));
  const avgTemp =
    racks.reduce((acc, r) => acc + parseTemp(r.metadata?.temperature), 0) /
    racks.length;

  return (
    <g className="thermal-layer">
      <defs>
        <filter id="blurHeat">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
        </filter>
      </defs>

      {/* === Ambient background (light blue tone) === */}
      <rect
        x={0}
        y={0}
        width={cols * tileSize}
        height={rows * tileSize}
        fill="rgba(0, 191, 255, 0.15)"
      />

      {/* === Core hot rack region (solid bright red) === */}
      <rect
        x={regionX}
        y={regionY}
        width={regionWidth}
        height={regionHeight}
        fill="rgba(255, 0, 0, 0.95)" // vivid red
        filter="url(#blurHeat)"
        style={{ mixBlendMode: "screen" }}
        opacity={0.95}
      />

      {/* === Layer 1: Green transition band === */}
      <rect
        x={regionX - tileSize * 2}
        y={regionY - tileSize * 2}
        width={regionWidth + tileSize * 4}
        height={regionHeight + tileSize * 4}
        fill="rgba(0, 255, 128, 0.55)"
        filter="url(#blurHeat)"
        style={{ mixBlendMode: "screen" }}
        opacity={0.8}
      />

      {/* === Layer 2: Blue ambient zone === */}
      <rect
        x={regionX - tileSize * 4}
        y={regionY - tileSize * 4}
        width={regionWidth + tileSize * 8}
        height={regionHeight + tileSize * 8}
        fill="rgba(0, 191, 255, 0.45)"
        filter="url(#blurHeat)"
        style={{ mixBlendMode: "screen" }}
      />

      {/* === CRAH / UPS / Battery cool zones === */}
      {elements
        .filter((e) => e.type.toLowerCase() !== "rack")
        .map((el) => {
          const cx = el.x * tileSize + (el.width * tileSize) / 2;
          const cy = el.y * tileSize + (el.height * tileSize) / 2;
          const rx = el.width * tileSize * 1.3;
          const ry = el.height * tileSize * 1.3;
          return (
            <ellipse
              key={el.id}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="rgba(0,180,255,0.45)"
              filter="url(#blurHeat)"
              style={{ mixBlendMode: "screen" }}
            />
          );
        })}

      {/* === Temperature label (clear area) === */}
      <rect
        x={regionX + regionWidth / 2 - tileSize * 1.5}
        y={regionY + regionHeight / 2 - tileSize * 0.8}
        width={tileSize * 3}
        height={tileSize * 1.6}
        fill="rgba(255,255,255,0.5)"
        rx="4"
        ry="4"
        style={{ mixBlendMode: "screen" }}
      />

      <text
        x={regionX + regionWidth / 2}
        y={regionY + regionHeight / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fill="#000"
        fontWeight="700"
        style={{
          textShadow: "0 0 5px rgba(255,255,255,0.9)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {avgTemp.toFixed(1)}°C
      </text>
    </g>
  );
}
