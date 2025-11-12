// src/hooks/useFloorData.js
import { useEffect, useState } from "react";

export default function useFloorData(analysisId = "AIR-2025-042") {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/data/report_${analysisId}.json`);
        if (!res.ok) throw new Error("Failed to load report JSON");
        const report = await res.json();

        const config = report.configuration;
        const tilePhysicalSize = 2; // 1 tile = 2 ft
        const tileSize = 40; // 40 px per tile

        // Calculate grid
        const cols = Math.ceil(config.hall_width_ft / tilePhysicalSize);
        const rows = Math.ceil(config.hall_length_ft / tilePhysicalSize);

        const grid = {
          cols,
          rows,
          tileSize,
          tilePhysicalSize,
          unit: "ft",
        };

        // Normalize and convert layout elements
        const elements = (report.layout_elements || []).map((el) => {
          const toTiles = (v) => v / tilePhysicalSize;

          // Normalize element type
          const normalizedType =
            el.type?.toLowerCase() === "ai" ? "rack" : el.type?.toLowerCase();

          return {
            id: el.id,
            type: normalizedType,
            x: toTiles(el.x || el.tile_x * tilePhysicalSize || 0),
            y: toTiles(el.y || el.tile_y * tilePhysicalSize || 0),
            width: toTiles(el.width || 2),
            height: toTiles(el.depth || 4),
            orientation: el.orientation || "north",
            label: el.id,
            metadata: {
              power: el.power_kw ? `${el.power_kw} kW` : "N/A",
              temperature: el.temperature,
              status: "Active",
            },
          };
        });

        // Aisles (zones)
        const zones = (report.aisles || []).map((a, idx) => ({
          id: `zone-${idx + 1}`,
          label: `${a.type.toUpperCase()} Aisle`,
          x: a.x_start / tilePhysicalSize,
          y: a.y / tilePhysicalSize,
          width: (a.x_end - a.x_start) / tilePhysicalSize,
          height: a.height / tilePhysicalSize,
          fill:
            a.type === "cold"
              ? "rgba(0, 180, 255, 0.2)"
              : "rgba(255, 120, 0, 0.2)",
        }));

        setData({ grid, elements, zones });
      } catch (err) {
        console.error("useFloorData error:", err);
      }
    }

    loadReport();
  }, [analysisId]);

  return data;
}
