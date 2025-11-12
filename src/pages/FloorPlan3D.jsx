// // src/pages/FloorPlan3D.jsx
// import React, { useState } from "react";
// import useFloorConfig from "../hooks/useFloorConfig";
// import Scene3D from "../three/Scene3D";

// export default function FloorPlan3D() {
//   const config = useFloorConfig();
//   const [hover, setHover] = useState(null);

//   if (!config) return <div>Loading 3D plan...</div>;

//   const totalRacks = (config.elements || []).filter(
//     (e) => e.type === "rack"
//   ).length;
//   const totalPowerKW = (config.elements || [])
//     .filter((e) => e.metadata?.power)
//     .reduce((acc, e) => acc + parseFloat(e.metadata.power), 0);

//   return (
//     <div style={{ position: "relative", padding: 10 }}>
//       <div style={{ position: "absolute", top: 12, right: 12, zIndex: 20 }}>
//         <div
//           style={{
//             background: "#fff",
//             padding: "8px 12px",
//             borderRadius: 8,
//             border: "1px solid #ddd",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//           }}
//         >
//           <div>
//             <b>3D Site Summary</b>
//           </div>
//           <div>Total Racks: {totalRacks}</div>
//           <div>Total Power: {totalPowerKW} kW</div>
//         </div>
//       </div>

//       <Scene3D config={config} onHover={(h) => setHover(h)} />

//       {/* simple hover box */}
//       {hover && (
//         <div
//           style={{
//             position: "absolute",
//             left: 20,
//             bottom: 16,
//             background: "#fff",
//             padding: 8,
//             borderRadius: 6,
//             border: "1px solid #ddd",
//           }}
//         >
//           <div>
//             <b>{hover.item.label || hover.item.id}</b>
//           </div>
//           {hover.item.metadata?.power && (
//             <div>Power: {hover.item.metadata.power}</div>
//           )}
//           {hover.item.metadata?.temp && (
//             <div>Temp: {hover.item.metadata.temp}</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import useFloorConfig from "../hooks/useFloorConfig";
import Scene3D from "../three/Scene3D";

export default function FloorPlan3D() {
  const config = useFloorConfig();
  const [hover, setHover] = useState(null);

  if (!config)
    return (
      <div className="p-6 text-center text-gray-600">Loading 3D plan...</div>
    );

  const totalRacks = (config.elements || []).filter(
    (e) => e.type === "rack"
  ).length;
  const totalPowerKW = (config.elements || [])
    .filter((e) => e.metadata?.power)
    .reduce((acc, e) => acc + parseFloat(e.metadata.power), 0);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-gray-50">
      {/* 📊 3D Site Summary Card */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white border border-gray-300 shadow-md rounded-lg px-4 py-3 text-sm">
          <div className="font-semibold text-gray-800 mb-1">
            📊 3D Site Summary
          </div>
          <div className="text-gray-700">Total Racks: {totalRacks}</div>
          <div className="text-gray-700">
            Total Power: {totalPowerKW.toFixed(1)} kW
          </div>
        </div>
      </div>

      {/* 🧱 3D Scene Canvas */}
      <Scene3D config={config} onHover={(h) => setHover(h)} />

      {/* 🖱 Hover Info Box */}
      {hover && (
        <div className="absolute left-5 bottom-5 bg-white border border-gray-300 shadow-md rounded-lg px-3 py-2 text-sm text-gray-700">
          <div className="font-semibold text-gray-800">
            {hover.item.label || hover.item.id}
          </div>
          {hover.item.metadata?.power && (
            <div>Power: {hover.item.metadata.power}</div>
          )}
          {hover.item.metadata?.temp && (
            <div>Temp: {hover.item.metadata.temp}</div>
          )}
        </div>
      )}
    </div>
  );
}
