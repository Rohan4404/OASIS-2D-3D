import React, { useState, useRef, useMemo } from "react";
import useFloorConfig from "../hooks/useFloorConfig";
import GridLayer from "../components/FloorPlan/GridLayer";
import WallLayer from "../components/FloorPlan/WallLayer";
import MeasurementLayer from "../components/FloorPlan/MeasurementLayer";
import MetadataLayer from "../components/FloorPlan/MetadataLayer";
import Rack from "../components/Elements/Rack";
import CRAH from "../components/Elements/CRAH";
import PDU from "../components/Elements/PDU";
import UPS from "../components/Elements/UPS";
import Battery from "../components/Elements/Battery";

export default function FloorPlan2D_CompositeCFD() {
  const config = useFloorConfig();
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  // Safe defaults so hooks always run
  const grid = config?.grid ?? { cols: 0, rows: 0, tileSize: 40 };
  const elements = config?.elements ?? [];
  const zones = config?.zones ?? [];
  const tileSize = grid.tileSize;
  const cols = grid.cols;
  const rows = grid.rows;
  const totalWidth = cols * tileSize;
  const totalHeight = rows * tileSize;

  /** Find racks and CRAHs for CFD placement */
  const rackElements = elements.filter((e) => e.type.toLowerCase() === "rack");
  const crahElements = elements.filter((e) => e.type.toLowerCase() === "crah");

  /** CFD Gradients - radial diffusion */
  const renderCFDComposite = useMemo(() => {
    const gradients = [];

    // === HOT ZONES (RACKS) ===
    rackElements.forEach((rack, i) => {
      const cx = rack.x * tileSize + (rack.width * tileSize) / 2;
      const cy = rack.y * tileSize + (rack.height * tileSize) / 2;

      gradients.push(
        <radialGradient
          key={`rack-hot-${i}`}
          id={`rack-hot-${i}`}
          cx={cx}
          cy={cy}
          r="50%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="hsl(0,90%,55%)" stopOpacity="0.85" />
          <stop offset="35%" stopColor="hsl(35,90%,60%)" stopOpacity="0.6" />
          <stop offset="65%" stopColor="hsl(80,80%,55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(180,80%,60%)" stopOpacity="0.1" />
        </radialGradient>
      );
    });

    // === COOL ZONES (CRAHs) ===
    crahElements.forEach((crah, i) => {
      const cx = crah.x * tileSize + (crah.width * tileSize) / 2;
      const cy = crah.y * tileSize + (crah.height * tileSize) / 2;

      gradients.push(
        <radialGradient
          key={`crah-cool-${i}`}
          id={`crah-cool-${i}`}
          cx={cx}
          cy={cy}
          r="60%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="hsl(190,90%,60%)" stopOpacity="0.7" />
          <stop offset="70%" stopColor="hsl(210,80%,65%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      );
    });

    return gradients;
  }, [rackElements, crahElements, tileSize]);

  /** CFD Layer render */
  const CFDVisualLayer = useMemo(() => {
    const layers = [];

    // HOT rack glow
    rackElements.forEach((rack, i) => {
      const cx = rack.x * tileSize + (rack.width * tileSize) / 2;
      const cy = rack.y * tileSize + (rack.height * tileSize) / 2;
      const radius = tileSize * 6; // coverage area

      layers.push(
        <circle
          key={`hot-${i}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill={`url(#rack-hot-${i})`}
          opacity="0.8"
          filter="url(#blurCFD)"
        />
      );

      // Label hot temp
      layers.push(
        <text
          key={`hot-label-${i}`}
          x={cx}
          y={cy - radius / 3}
          fontSize="12"
          fill="#222"
          fontWeight="bold"
          textAnchor="middle"
        >
          28°C
        </text>
      );
    });

    // COOL air around CRAHs
    crahElements.forEach((crah, i) => {
      const cx = crah.x * tileSize + (crah.width * tileSize) / 2;
      const cy = crah.y * tileSize + (crah.height * tileSize) / 2;
      const radius = tileSize * 7;

      layers.push(
        <circle
          key={`cool-${i}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill={`url(#crah-cool-${i})`}
          opacity="0.6"
          filter="url(#blurCFD)"
        />
      );

      // Label cool temp
      layers.push(
        <text
          key={`cool-label-${i}`}
          x={cx}
          y={cy}
          fontSize="12"
          fill="#0044aa"
          textAnchor="middle"
        >
          20°C
        </text>
      );
    });

    return layers;
  }, [rackElements, crahElements, tileSize]);

  /** Render labels for grid */
  const renderLabels = useMemo(() => {
    const labels = [];
    for (let c = 0; c < cols; c++) {
      const x = c * tileSize + tileSize / 2;
      labels.push(
        <text
          key={`col-${c}`}
          x={x}
          y={-6}
          fontSize="10"
          textAnchor="middle"
          fill="#555"
        >
          {c + 1}
        </text>
      );
    }
    for (let r = 0; r < rows; r++) {
      const y = r * tileSize + tileSize / 2 + 3;
      labels.push(
        <text
          key={`row-${r}`}
          x={-10}
          y={y}
          fontSize="10"
          textAnchor="end"
          fill="#555"
        >
          {r + 1}
        </text>
      );
    }
    return <g className="labels">{labels}</g>;
  }, [cols, rows, tileSize]);

  /** Element Renderer */
  const renderElement = (item) => {
    const common = { item, grid };
    const handlers = {
      onMouseEnter: () => {
        const cx = item.x * tileSize + (item.width * tileSize) / 2;
        const cy = item.y * tileSize + (item.height * tileSize) / 2;
        setHover({ item, cx, cy });
      },
      onMouseLeave: () => setHover(null),
    };

    switch (item.type.toLowerCase()) {
      case "rack":
        return (
          <g key={item.id} {...handlers}>
            <Rack {...common} />
          </g>
        );
      case "crah":
        return (
          <g key={item.id} {...handlers}>
            <CRAH {...common} />
          </g>
        );
      case "pdu":
        return (
          <g key={item.id} {...handlers}>
            <PDU {...common} />
          </g>
        );
      case "ups":
        return (
          <g key={item.id} {...handlers}>
            <UPS {...common} />
          </g>
        );
      case "battery":
        return (
          <g key={item.id} {...handlers}>
            <Battery {...common} />
          </g>
        );
      default:
        return null;
    }
  };

  if (!config?.grid)
    return (
      <div className="text-center p-6 text-gray-600">Loading floor plan...</div>
    );

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-auto bg-gray-50 p-4">
      {/* 🌡 Legend */}
      <div className="absolute top-4 right-6 bg-white border border-gray-300 rounded-md shadow-md p-3 text-xs z-20">
        <div className="text-sm font-semibold text-gray-800 mb-2 text-center">
          Temperature (°C)
        </div>
        <div
          style={{
            height: 120,
            width: 12,
            margin: "0 auto",
            borderRadius: 6,
            background:
              "linear-gradient(to top, hsl(0,90%,55%), hsl(35,95%,55%), hsl(90,85%,55%), hsl(180,80%,60%))",
          }}
        />
        <div className="flex justify-between mt-1 text-[10px] text-gray-600">
          <span>Hot</span>
          <span>Cool</span>
        </div>
      </div>

      {/* === SVG CANVAS === */}
      <svg
        ref={svgRef}
        width={totalWidth + 120}
        height={totalHeight + 120}
        className="mx-auto block border border-gray-300 bg-white rounded-lg shadow-md"
      >
        <defs>
          <filter id="blurCFD" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          {renderCFDComposite}
        </defs>

        <g transform="translate(60,60)">
          <GridLayer grid={grid} />
          {renderLabels}

          {/* CFD Composite Layer (racks + CRAHs) */}
          {CFDVisualLayer}

          {/* Zones */}
          {zones.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x * tileSize}
                y={z.y * tileSize}
                width={z.width * tileSize}
                height={z.height * tileSize}
                fill={z.fill || "none"}
                stroke="#ccc"
                strokeWidth="0.8"
              />
              {z.label && (
                <text
                  x={z.x * tileSize + (z.width * tileSize) / 2}
                  y={z.y * tileSize + (z.height * tileSize) / 2 + 4}
                  fontSize={Math.max(12, tileSize / 1.6)}
                  textAnchor="middle"
                  fill="#666"
                >
                  {z.label}
                </text>
              )}
            </g>
          ))}

          {/* Elements */}
          {elements.map(renderElement)}

          <WallLayer grid={grid} />
          <MeasurementLayer grid={grid} />
          <MetadataLayer hover={hover} />
        </g>
      </svg>

      {/* Hover Info */}
      {hover && hover.item && (
        <div className="absolute bottom-6 left-6 bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2 text-sm text-gray-700 z-20">
          <b className="text-gray-800">{hover.item.label || hover.item.id}</b>
          {hover.item.metadata?.power && (
            <div>Power: {hover.item.metadata.power}</div>
          )}
          {hover.item.metadata?.temp !== undefined && (
            <div>Temp: {hover.item.metadata.temp}°C</div>
          )}
          {hover.item.metadata?.status && (
            <div>Status: {hover.item.metadata.status}</div>
          )}
        </div>
      )}
    </div>
  );
}
