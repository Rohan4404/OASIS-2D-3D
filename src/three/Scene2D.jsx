import React, { useState, useRef, useMemo } from "react";
import GridLayer from "../components/FloorPlan/GridLayer";
import WallLayer from "../components/FloorPlan/WallLayer";
import MeasurementLayer from "../components/FloorPlan/MeasurementLayer";
import MetadataLayer from "../components/FloorPlan/MetadataLayer";
import Rack from "../components/Elements/Rack";
import CRAH from "../components/Elements/CRAH";
import PDU from "../components/Elements/PDU";
import UPS from "../components/Elements/UPS";
import Battery from "../components/Elements/Battery";

/**
 * Enhanced Scene2D
 * - Dynamic CFD Heatmap
 * - Visual depth
 * - Better color and layout aesthetics
 */
export default function Scene2D({ config }) {
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  if (!config || !config.grid) return null;
  const { grid, elements = [], zones = [] } = config;
  const tileSize = grid.tileSize;
  const cols = grid.cols;
  const rows = grid.rows;
  const totalWidth = cols * tileSize;
  const totalHeight = rows * tileSize;

  // 🧠 Compute CFD data from rack temperatures
  const heatmapCells = useMemo(() => {
    if (!grid || !elements.length) return [];
    const cells = [];
    const temps = elements
      .filter((e) => e.type === "rack" && e.metadata?.temp)
      .map((e) => e.metadata.temp);
    if (!temps.length) return [];
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempToColor = (t) => {
      const ratio = (t - minTemp) / (maxTemp - minTemp || 1);
      const hue = 240 - ratio * 240; // blue → red
      return `hsl(${hue}, 90%, 60%)`;
    };

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const overlapping = elements.filter(
          (e) =>
            e.type === "rack" &&
            r >= e.y &&
            r < e.y + e.height &&
            c >= e.x &&
            c < e.x + e.width
        );
        if (overlapping.length) {
          const avgTemp =
            overlapping.reduce((sum, e) => sum + (e.metadata?.temp || 0), 0) /
            overlapping.length;
          cells.push({
            x: c * grid.tileSize,
            y: r * grid.tileSize,
            color: tempToColor(avgTemp),
          });
        }
      }
    }
    return cells;
  }, [grid, elements]);

  // 🔲 Render element wrappers
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

  // 📐 Render coordinate labels
  const renderLabels = () => {
    const labels = [];
    for (let c = 0; c < cols; c++) {
      const x = c * tileSize + tileSize / 2;
      labels.push(
        <text
          key={`col-${c}`}
          x={x}
          y={-5}
          fontSize="10"
          textAnchor="middle"
          fill="#555"
        >
          {c + 1}
        </text>
      );
    }
    for (let r = 0; r < rows; r++) {
      const y = r * tileSize + tileSize / 2;
      labels.push(
        <text
          key={`row-${r}`}
          x={-10}
          y={y + 3}
          fontSize="10"
          textAnchor="end"
          fill="#555"
        >
          {r + 1}
        </text>
      );
    }
    return <g>{labels}</g>;
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-auto bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6">
      <svg
        ref={svgRef}
        width={totalWidth + 120}
        height={totalHeight + 120}
        className="border border-gray-300 bg-white shadow-xl rounded-xl"
      >
        <defs>
          {/* Blur filter for smooth heat diffusion */}
          <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <g transform="translate(60,60)">
          {/* Grid background */}
          <GridLayer grid={grid} />
          {renderLabels()}

          {/* 🔥 CFD Thermal Layer */}
          <g className="cfd-heatmap" filter="url(#blur)">
            {heatmapCells.map((cell, i) => (
              <rect
                key={i}
                x={cell.x}
                y={cell.y}
                width={grid.tileSize}
                height={grid.tileSize}
                fill={cell.color}
                opacity="0.4"
              />
            ))}
          </g>

          {/* Zones */}
          {zones.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x * tileSize}
                y={z.y * tileSize}
                width={z.width * tileSize}
                height={z.height * tileSize}
                fill={z.fill || "rgba(200,200,200,0.1)"}
                stroke="#aaa"
                strokeWidth="0.8"
              />
              <text
                x={z.x * tileSize + (z.width * tileSize) / 2}
                y={z.y * tileSize + (z.height * tileSize) / 2}
                fontSize={Math.max(12, tileSize / 1.4)}
                textAnchor="middle"
                fill="#444"
              >
                {z.label}
              </text>
            </g>
          ))}

          {/* Data center elements */}
          {elements.map(renderElement)}

          {/* Architectural overlays */}
          <WallLayer grid={grid} />
          <MeasurementLayer grid={grid} />
          <MetadataLayer hover={hover} />
        </g>
      </svg>

      {/* 🌡 CFD Legend */}
      <div className="absolute top-6 right-8 bg-white border border-gray-300 shadow-md rounded-lg p-3 text-xs w-28 text-center">
        <b className="block text-gray-800 mb-1">CFD Temp °C</b>
        <div
          className="h-36 w-4 mx-auto rounded-full"
          style={{
            background:
              "linear-gradient(to top, hsl(0,90%,60%), hsl(60,90%,60%), hsl(120,90%,60%), hsl(180,90%,60%), hsl(240,90%,60%))",
          }}
        />
        <div className="flex justify-between mt-1 text-[10px] text-gray-600">
          <span>Hot</span>
          <span>Cool</span>
        </div>
      </div>

      {/* Hover info */}
      {hover && hover.item && (
        <div className="absolute bottom-6 left-6 bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-700">
          <b className="text-gray-800">{hover.item.label || hover.item.id}</b>
          {hover.item.metadata?.power && (
            <div>Power: {hover.item.metadata.power}</div>
          )}
          {hover.item.metadata?.temp && (
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
