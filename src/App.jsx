// src/App.jsx
import React, { useState } from "react";
import FloorPlan2D from "./pages/FloorPlan2D";
import FloorPlan3D from "./pages/FloorPlan3D";
import "tailwindcss";

export default function App() {
  const [mode, setMode] = useState("2d");
  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: 14 }}>
        Datacenter Architectural Floor Plan
      </h2>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          padding: 16,
        }}
      >
        <button
          onClick={() => setMode("2d")}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            background: mode === "2d" ? "#1976d2" : "#eee",
            color: mode === "2d" ? "#fff" : "#000",
            border: "none",
            borderRadius: 6,
          }}
        >
          2D View
        </button>
        <button
          onClick={() => setMode("3d")}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            background: mode === "3d" ? "#1976d2" : "#eee",
            color: mode === "3d" ? "#fff" : "#000",
            border: "none",
            borderRadius: 6,
          }}
        >
          3D View
        </button>
      </header>

      <main>{mode === "2d" ? <FloorPlan2D /> : <FloorPlan3D />}</main>
    </div>
  );
}

{
  /* <div>
  <h2 style={{ textAlign: "center", marginTop: 14 }}>
    Datacenter Architectural Floor Plan
  </h2>
  <FloorPlan2D />
</div>; */
}
