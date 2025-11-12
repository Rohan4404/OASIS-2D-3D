// src/utils/convertAIConfig.js
export function convertAIConfig(baseConfig, analysisData) {
  const tilePhysicalSize = 2; // ft per tile (fixed assumption)
  const tileSize = 40; // pixel size per tile (visual)

  const hallWidth = baseConfig.hall_width_ft;
  const hallLength = baseConfig.hall_length_ft;

  const cols = Math.ceil(hallWidth / tilePhysicalSize);
  const rows = Math.ceil(hallLength / tilePhysicalSize);

  // Generate rack elements from analysis.hot_spots or rack count
  const racks = (analysisData.thermal_analysis.hot_spots || []).map(
    (spot, i) => ({
      id: spot.component_id,
      type: "rack",
      x: Math.floor(spot.location.x / tilePhysicalSize),
      y: Math.floor(spot.location.y / tilePhysicalSize),
      width: 1,
      height: 2,
      label: spot.component_id.replace("RACK-", "").padStart(3, "0"),
      metadata: {
        power: `${baseConfig.rack_specs.power_per_rack_kw} kW`,
        temp: `${spot.temperature.toFixed(1)}°C`,
        status: "Active",
        severity: spot.severity,
      },
    })
  );

  // Add CRAH + PDU + UPS + Battery as placeholders
  const crahs = [
    {
      id: "crah-01",
      type: "crah",
      x: 5,
      y: 5,
      width: 3,
      height: 2,
      label: "CRAH-01",
    },
    {
      id: "crah-02",
      type: "crah",
      x: cols - 8,
      y: rows - 6,
      width: 3,
      height: 2,
      label: "CRAH-02",
    },
  ];

  const pdus = [
    {
      id: "pdu-01",
      type: "pdu",
      x: 2,
      y: 2,
      width: 2,
      height: 2,
      label: "PDU-01",
    },
  ];

  const upses = [
    {
      id: "ups-01",
      type: "ups",
      x: cols - 10,
      y: 4,
      width: 4,
      height: 3,
      label: "UPS-01",
    },
  ];

  const batteries = [
    {
      id: "bat-01",
      type: "battery",
      x: cols - 10,
      y: rows - 8,
      width: 2,
      height: 2,
      label: "BAT-01",
    },
  ];

  return {
    grid: {
      rows,
      cols,
      tileSize,
      tilePhysicalSize,
      unit: "ft",
    },
    elements: [...racks, ...crahs, ...pdus, ...upses, ...batteries],
    zones: [],
    cfdLayers: [
      {
        id: "ai-hotspots",
        type: "points",
        label: "Thermal Hotspots",
        points: racks.map((r) => ({
          x: r.x * tileSize,
          y: r.y * tileSize,
          color:
            r.metadata.severity === "high"
              ? "hsl(0,90%,60%)"
              : "hsl(60,90%,60%)",
          temp: r.metadata.temp,
        })),
      },
    ],
  };
}
