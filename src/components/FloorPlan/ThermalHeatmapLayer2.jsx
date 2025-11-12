import React from "react";

export default function ThermalHeatmapLayer({ grid, elements }) {
  if (!elements || elements.length === 0) return null;

  const tileSize = grid.tileSize;
  const cols = grid.cols;
  const rows = grid.rows;

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

  // Dynamic rack region
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

  const centerX = regionX + regionWidth / 2;
  const centerY = regionY + regionHeight / 2;

  return (
    <g className="thermal-layer">
      <defs>
        <filter id="blurHeat">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
        </filter>

        {/* === Radial Gradient Halo === */}
        <radialGradient id="heatGradient" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="rgba(255, 0, 0, 1)" />{" "}
          {/* Hot red core */}
          <stop offset="25%" stopColor="rgba(255, 165, 0, 0.95)" />{" "}
          {/* Orange */}
          <stop offset="45%" stopColor="rgba(255, 255, 0, 0.85)" />{" "}
          {/* Yellow */}
          <stop offset="65%" stopColor="rgba(0, 255, 128, 0.75)" />{" "}
          {/* Green */}
          <stop offset="85%" stopColor="rgba(0, 191, 255, 0.6)" /> {/* Cyan */}
          <stop offset="100%" stopColor="rgba(0, 180, 255, 0.4)" />{" "}
          {/* Light Blue */}
        </radialGradient>
      </defs>

      {/* === Central red rack zone === */}
      <rect
        x={regionX}
        y={regionY}
        width={regionWidth}
        height={regionHeight}
        fill="rgba(200,0,0,1)"
        filter="url(#blurHeat)"
        style={{ mixBlendMode: "screen" }}
      />

      {/* === Smooth gradient halo area === */}
      <rect
        x={regionX - tileSize * 4}
        y={regionY - tileSize * 4}
        width={regionWidth + tileSize * 8}
        height={regionHeight + tileSize * 8}
        fill="url(#heatGradient)"
        filter="url(#blurHeat)"
        style={{ mixBlendMode: "screen" }}
        opacity={0.95}
      />

      {/* === CRAH / UPS Cool Spots === */}
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

      {/* === Temperature Label === */}
      <rect
        x={centerX - tileSize * 1.5}
        y={centerY - tileSize * 0.8}
        width={tileSize * 3}
        height={tileSize * 1.6}
        fill="rgba(255,255,255,0.6)"
        rx="4"
        ry="4"
        style={{ mixBlendMode: "screen" }}
      />

      <text
        x={centerX}
        y={centerY + 4}
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
