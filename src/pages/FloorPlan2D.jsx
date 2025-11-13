// import React, { useState, useRef } from "react";
// import useFloorConfig from "../hooks/useFloorConfig";
// import GridLayer from "../components/FloorPlan/GridLayer";
// import WallLayer from "../components/FloorPlan/WallLayer";
// import MeasurementLayer from "../components/FloorPlan/MeasurementLayer";
// import MetadataLayer from "../components/FloorPlan/MetadataLayer";
// import Rack from "../components/Elements/Rack";
// import CRAH from "../components/Elements/CRAH";
// import PDU from "../components/Elements/PDU";
// import UPS from "../components/Elements/UPS";
// import Battery from "../components/Elements/Battery";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function FloorPlan2D() {
//   const config = useFloorConfig();
//   const [hover, setHover] = useState(null);
//   const svgRef = useRef(null);

//   if (!config)
//     return <div className="text-center p-6">Loading floor plan...</div>;
//   const { grid, elements = [], zones = [] } = config;
//   if (!grid || !grid.rows)
//     return <div className="text-center p-6">Invalid grid in config</div>;

//   const tileSize = grid.tileSize;
//   const cols = grid.cols;
//   const rows = grid.rows;
//   const totalWidth = cols * tileSize;
//   const totalHeight = rows * tileSize;

//   const totalRacks = elements.filter((e) => e.type === "rack").length;
//   const totalPowerKW = elements
//     .filter((e) => e.metadata?.power)
//     .reduce((acc, e) => acc + parseFloat(e.metadata.power), 0);

//   // ---- Export Handlers ----
//   const handleDownloadSVG = () => {
//     const svgEl = svgRef.current;
//     const svgData = new XMLSerializer().serializeToString(svgEl);
//     const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "DataCenter_FloorPlan.svg";
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleDownloadPDF = async () => {
//     const svgEl = svgRef.current;
//     const canvas = await html2canvas(svgEl, { backgroundColor: "#fff" });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "px",
//       format: [canvas.width, canvas.height],
//     });
//     pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
//     pdf.save("DataCenter_FloorPlan.pdf");
//   };

//   // ---- Render Floor Elements ----
//   const renderElement = (item) => {
//     const common = { item, grid };
//     const handlers = {
//       onMouseEnter: () => {
//         const cx = item.x * tileSize + (item.width * tileSize) / 2;
//         const cy = item.y * tileSize + (item.height * tileSize) / 2;
//         setHover({ item, cx, cy });
//       },
//       onMouseLeave: () => setHover(null),
//     };

//     switch (item.type.toLowerCase()) {
//       case "rack":
//         return (
//           <g key={item.id} {...handlers}>
//             <Rack {...common} />
//           </g>
//         );
//       case "crah":
//         return (
//           <g key={item.id} {...handlers}>
//             <CRAH {...common} />
//           </g>
//         );
//       case "pdu":
//         return (
//           <g key={item.id} {...handlers}>
//             <PDU {...common} />
//           </g>
//         );
//       case "ups":
//         return (
//           <g key={item.id} {...handlers}>
//             <UPS {...common} />
//           </g>
//         );
//       case "battery":
//         return (
//           <g key={item.id} {...handlers}>
//             <Battery {...common} />
//           </g>
//         );
//       default:
//         return null;
//     }
//   };

//   // ---- Row / Column Labels ----
//   const renderLabels = () => {
//     const labels = [];

//     // top labels
//     for (let c = 0; c < cols; c++) {
//       const x = c * tileSize + tileSize / 2;
//       labels.push(
//         <text
//           key={`col-${c}`}
//           x={x}
//           y={-5}
//           fontSize="10"
//           textAnchor="middle"
//           fill="#555"
//         >
//           {c + 1}
//         </text>
//       );
//     }

//     // left labels
//     for (let r = 0; r < rows; r++) {
//       const y = r * tileSize + tileSize / 2;
//       labels.push(
//         <text
//           key={`row-${r}`}
//           x={-10}
//           y={y + 3}
//           fontSize="10"
//           textAnchor="end"
//           fill="#555"
//         >
//           {r + 1}
//         </text>
//       );
//     }
//     return <g>{labels}</g>;
//   };

//   return (
//     <div className="relative w-full h-[calc(100vh-80px)] overflow-auto bg-gray-50 p-4">
//       {/* 📊 Site Summary Overlay */}
//       <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-md p-3 text-sm z-10">
//         <b className="block mb-1 text-gray-800">📊 Site Summary</b>
//         <p>Total Racks: {totalRacks}</p>
//         <p>Total Power: {totalPowerKW.toFixed(1)} kW</p>
//         {/* <div className="mt-2 flex gap-2">
//           <button
//             onClick={handleDownloadSVG}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition"
//           >
//             ⬇ Download SVG
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs transition"
//           >
//             🖨 PDF
//           </button>
//         </div> */}
//       </div>

//       {/* 🧭 Floor Plan SVG */}
//       <svg
//         ref={svgRef}
//         width={totalWidth + 120}
//         height={totalHeight + 120}
//         className="mx-auto block border border-gray-300 bg-white"
//       >
//         <g transform="translate(60,60)">
//           <GridLayer grid={grid} />
//           {renderLabels()}
//           {zones.map((z) => (
//             <g key={z.id}>
//               <rect
//                 x={z.x * tileSize}
//                 y={z.y * tileSize}
//                 width={z.width * tileSize}
//                 height={z.height * tileSize}
//                 fill={z.fill || "#efefef"}
//                 stroke="#ccc"
//                 strokeWidth="0.8"
//               />
//               <text
//                 x={z.x * tileSize + (z.width * tileSize) / 2}
//                 y={z.y * tileSize + (z.height * tileSize) / 2}
//                 fontSize={Math.max(12, tileSize / 1.4)}
//                 textAnchor="middle"
//                 fill="#666"
//               >
//                 {z.label}
//               </text>
//             </g>
//           ))}
//           {elements.map(renderElement)}
//           <WallLayer grid={grid} />
//           <MeasurementLayer grid={grid} />
//           <MetadataLayer hover={hover} />
//         </g>
//       </svg>
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import useFloorData from "../hooks/useFloorData";
import GridLayer from "../components/FloorPlan/GridLayer";
import WallLayer from "../components/FloorPlan/WallLayer";
import MeasurementLayer from "../components/FloorPlan/MeasurementLayer";
import MetadataLayer from "../components/FloorPlan/MetadataLayer";
import Rack from "../components/Elements/Rack";
import CRAH from "../components/Elements/CRAH";
import PDU from "../components/Elements/PDU";
import UPS from "../components/Elements/UPS";
import Battery from "../components/Elements/Battery";
import ThermalHeatmapLayer from "../components/FloorPlan/ThermalHeatmapLayer2";

export default function FloorPlan2D() {
  const data = useFloorData("AIR-2025-042");
  const [hover, setHover] = useState(null);
  const [showThermal, setShowThermal] = useState(true);
  const svgRef = useRef(null);

  if (!data)
    return <div className="text-center p-6">Loading floor plan...</div>;

  const { grid, elements, zones, thermal } = data;
  const { tileSize, cols, rows } = grid;

  console.log("thermal of the data is", elements);
  const totalWidth = cols * tileSize;
  const totalHeight = rows * tileSize;

  // === Render any equipment ===
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

  // === Grid Labels ===
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
    <div className="relative w-full h-[calc(100vh-80px)] overflow-auto bg-gray-50 p-4">
      <button
        onClick={() => setShowThermal(!showThermal)}
        className={`mt-2 w-full px-3 py-1.5 rounded text-xs transition ${
          showThermal
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-300 hover:bg-gray-400 text-gray-700"
        }`}
      >
        {showThermal ? "🔥 Hide Thermal" : "❄️ Show Thermal"}
      </button>
      <svg
        ref={svgRef}
        width={totalWidth + 120}
        height={totalHeight + 120}
        className="mx-auto block border border-gray-300 bg-white"
      >
        <g transform="translate(60,60)">
          <GridLayer grid={grid} />
          {renderLabels()}
          {showThermal && (
            <ThermalHeatmapLayer
              grid={grid}
              elements={elements}
              zones={zones}
            />
          )}
          {/* Zones */}
          {/* {zones.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x * tileSize}
                y={z.y * tileSize}
                width={z.width * tileSize}
                height={z.height * tileSize}
                fill={z.fill}
                stroke="#ccc"
                strokeWidth="0.5"
              />
              <text
                x={z.x * tileSize + (z.width * tileSize) / 2}
                y={z.y * tileSize + (z.height * tileSize) / 2}
                textAnchor="middle"
                fill="#555"
                fontSize="11"
              >
                {z.label}
              </text>
            </g>
          ))} */}
          {/* Elements */}
          {elements.map(renderElement)}
          <WallLayer grid={grid} />
          <MeasurementLayer grid={grid} />
          <MetadataLayer hover={hover} />
        </g>
      </svg>
    </div>
  );
}
