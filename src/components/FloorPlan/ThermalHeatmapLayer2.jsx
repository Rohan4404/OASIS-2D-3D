// import React from "react";

// export default function ThermalHeatmapLayer({ grid, elements }) {
//   if (!elements || elements.length === 0) return null;

//   const tileSize = grid.tileSize;
//   const cols = grid.cols;
//   const rows = grid.rows;

//   // Parse temperature from metadata
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

//       {/* Base background */}
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

//         // For non-rack objects → show cool zones
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

//         // Heat direction based on rack orientation
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

//         return (
//           <g key={el.id}>
//             <defs>
//               <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
//                 <stop offset="0%" stopColor={getGradientColor(15, 0.2)} />
//                 <stop offset="40%" stopColor={getGradientColor(27, 0.5)} />
//                 <stop offset="70%" stopColor={getGradientColor(32, 0.8)} />
//                 <stop offset="100%" stopColor={color} />
//               </linearGradient>
//             </defs>

//             {/* Outer heat diffusion */}
//             <ellipse
//               cx={cx}
//               cy={cy}
//               rx={rx * 2.5}
//               ry={ry * 2.5}
//               fill={`url(#${gradientId})`}
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "overlay" }}
//             />

//             {/* Core high heat zone */}
//             <ellipse
//               cx={cx}
//               cy={cy}
//               rx={rx}
//               ry={ry}
//               fill={color}
//               filter="url(#blurHeat)"
//               style={{ mixBlendMode: "multiply" }}
//             />

//             {/* Temperature label (only if >30°C) */}
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

  // Gradient color scale
  const gradientStops = [
    { temp: 15, color: [0, 191, 255] }, // Blue (cold)
    { temp: 22, color: [0, 255, 128] }, // Green
    { temp: 27, color: [255, 255, 0] }, // Yellow
    { temp: 32, color: [255, 165, 0] }, // Orange
    { temp: 38, color: [255, 0, 0] }, // Red (hot)
  ];

  const getGradientColor = (temp, opacity = 1) => {
    if (temp <= gradientStops[0].temp)
      return `rgba(${gradientStops[0].color.join(",")}, ${opacity})`;
    if (temp >= gradientStops[gradientStops.length - 1].temp)
      return `rgba(${gradientStops[gradientStops.length - 1].color.join(
        ","
      )}, ${opacity})`;

    let lower, upper;
    for (let i = 0; i < gradientStops.length - 1; i++) {
      if (temp >= gradientStops[i].temp && temp <= gradientStops[i + 1].temp) {
        lower = gradientStops[i];
        upper = gradientStops[i + 1];
        break;
      }
    }

    const ratio = (temp - lower.temp) / (upper.temp - lower.temp);
    const r = Math.round(
      lower.color[0] + ratio * (upper.color[0] - lower.color[0])
    );
    const g = Math.round(
      lower.color[1] + ratio * (upper.color[1] - lower.color[1])
    );
    const b = Math.round(
      lower.color[2] + ratio * (upper.color[2] - lower.color[2])
    );
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <g className="thermal-layer">
      <defs>
        <filter id="blurHeat">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
        </filter>
      </defs>

      {/* Background tint */}
      <rect
        x={0}
        y={0}
        width={cols * tileSize}
        height={rows * tileSize}
        fill="rgba(0, 200, 255, 0.1)"
      />

      {elements.map((el) => {
        const temp = parseTemp(el.metadata?.temperature);
        const cx = el.x * tileSize + (el.width * tileSize) / 2;
        const cy = el.y * tileSize + (el.height * tileSize) / 2;
        const rx = el.width * tileSize * 1.5;
        const ry = el.height * tileSize * 1.5;
        const type = el.type.toLowerCase();
        const orientation = el.orientation?.toLowerCase() || "north";

        // Non-rack = blue cooling zone
        if (type !== "rack") {
          return (
            <ellipse
              key={el.id}
              cx={cx}
              cy={cy}
              rx={rx * 1.2}
              ry={ry * 1.2}
              fill="rgba(0,150,255,0.3)"
              filter="url(#blurHeat)"
              style={{ mixBlendMode: "overlay" }}
            />
          );
        }

        const color = getGradientColor(temp, 0.8);
        const gradientId = `grad-${el.id}`;
        let x1 = 0,
          y1 = 0,
          x2 = 0,
          y2 = 0;

        // Heat direction per orientation
        switch (orientation) {
          case "north":
            x1 = 0.5;
            y1 = 1;
            x2 = 0.5;
            y2 = 0; // bottom → top
            break;
          case "south":
            x1 = 0.5;
            y1 = 0;
            x2 = 0.5;
            y2 = 1; // top → bottom
            break;
          case "east":
            x1 = 0;
            y1 = 0.5;
            x2 = 1;
            y2 = 0.5; // left → right
            break;
          case "west":
            x1 = 1;
            y1 = 0.5;
            x2 = 0;
            y2 = 0.5; // right → left
            break;
          default:
            x1 = 0.5;
            y1 = 1;
            x2 = 0.5;
            y2 = 0;
        }

        // FRONT SIDE (north/south) → fade to blue at the end
        const isFrontFacing =
          orientation === "north" || orientation === "south";

        return (
          <g key={el.id}>
            <defs>
              <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
                <stop offset="0%" stopColor={getGradientColor(15, 0.3)} />
                <stop offset="40%" stopColor={getGradientColor(27, 0.6)} />
                <stop offset="70%" stopColor={getGradientColor(32, 0.9)} />
                <stop
                  offset="100%"
                  stopColor={
                    isFrontFacing
                      ? "rgba(0,191,255,0.8)" // BLUE front instead of RED
                      : color // keep red for others
                  }
                />
              </linearGradient>
            </defs>

            {/* Outer diffusion */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx * 2.5}
              ry={ry * 2.5}
              fill={`url(#${gradientId})`}
              filter="url(#blurHeat)"
              style={{ mixBlendMode: "overlay" }}
            />

            {/* Core heat zone */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={color}
              filter="url(#blurHeat)"
              style={{ mixBlendMode: "multiply" }}
            />

            {/* Temperature Label */}
            {temp > 30 && (
              <text
                x={cx}
                y={orientation === "south" ? cy + ry * 1.6 : cy - ry * 1.6}
                textAnchor="middle"
                fontSize="11"
                fill="#222"
                fontWeight="600"
              >
                {temp.toFixed(1)}°C
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
