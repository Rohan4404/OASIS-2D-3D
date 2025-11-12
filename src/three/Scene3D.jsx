// import React, { Suspense, useMemo, useState, useEffect } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, Environment, Html } from "@react-three/drei";
// import ModelLoader from "./ModelLoader";
// import FloorGrid3D from "./FloorGrid3D";

// /** Auto-center camera based on total layout size */
// function FitCamera({ width, height }) {
//   const { camera, controls } = useThree();
//   useEffect(() => {
//     camera.position.set(width / 2, Math.max(width, height) * 0.8, height * 1.2);
//     camera.lookAt(width / 2, 0, height / 2);
//     if (controls) controls.target.set(width / 2, 0, height / 2);
//   }, [width, height, camera, controls]);
//   return null;
// }

// export default function Scene3D({ config, onHover }) {
//   if (!config?.grid) return null;

//   const { grid, elements = [] } = config;
//   const tileFeet = grid.tilePhysicalSize || 2; // physical tile size in feet
//   const tileMeters = tileFeet * 0.3048; // convert to meters

//   const widthM = grid.cols * tileMeters;
//   const heightM = grid.rows * tileMeters;

//   // ✅ define tweaks BEFORE usage
//   const [tweaks, setTweaks] = useState({
//     rack: { scale: 0.8, y: 0 },
//     crah: { scale: 0.8, y: 0 },
//     pdu: { scale: 0.8, y: 0 },
//     ups: { scale: 0.8, y: 0 },
//     battery: { scale: 0.8, y: 0 },
//   });

//   const orientationToRad = (o) => {
//     const k = o?.toLowerCase();
//     if (k === "east") return -Math.PI / 2;
//     if (k === "south") return Math.PI;
//     if (k === "west") return Math.PI / 2;
//     return 0;
//   };

//   const modelLookup = {
//     rack: "/assets/models/rack.glb",
//     pdu: "/assets/models/pdu.glb",
//     crah: "/assets/models/crah.glb",
//     ups: "/assets/models/ups.glb",
//     battery: "/assets/models/battery.glb",
//   };

//   const placements = useMemo(
//     () =>
//       elements.map((item) => {
//         const cx = item.x * tileMeters + (item.width * tileMeters) / 2;
//         const cz = item.y * tileMeters + (item.height * tileMeters) / 2;
//         const type = item.type.toLowerCase();
//         const rotY = orientationToRad(item.orientation);
//         const url = modelLookup[type] || modelLookup["rack"];
//         return { ...item, cx, cz, type, url, rotY };
//       }),
//     [elements, tileMeters]
//   );

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         height: "calc(100vh - 60px)", // fill screen minus header
//         overflow: "hidden",
//         background: "#f9f9f9",
//       }}
//     >
//       {/* === Tweak panel (top-left) === */}
//       <div
//         style={{
//           position: "absolute",
//           left: 20,
//           top: 20,
//           zIndex: 20,
//           background: "#fff",
//           padding: "10px 14px",
//           border: "1px solid #ccc",
//           borderRadius: 8,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         <b>Adjust Models</b>
//         {Object.keys(tweaks).map((t) => (
//           <div key={t} style={{ marginTop: 6 }}>
//             <div>{t.toUpperCase()}</div>
//             <label>
//               Scale:
//               <input
//                 type="range"
//                 min="0.05"
//                 max="1"
//                 step="0.05"
//                 value={tweaks[t].scale}
//                 onChange={(e) =>
//                   setTweaks((p) => ({
//                     ...p,
//                     [t]: { ...p[t], scale: parseFloat(e.target.value) },
//                   }))
//                 }
//               />
//               {tweaks[t].scale.toFixed(2)}
//             </label>
//             <br />
//             <label>
//               Y:
//               <input
//                 type="range"
//                 min="-1"
//                 max="1"
//                 step="0.05"
//                 value={tweaks[t].y}
//                 onChange={(e) =>
//                   setTweaks((p) => ({
//                     ...p,
//                     [t]: { ...p[t], y: parseFloat(e.target.value) },
//                   }))
//                 }
//               />
//               {tweaks[t].y.toFixed(2)}
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* === Fullscreen 3D Canvas === */}
//       <Canvas
//         shadows
//         camera={{ fov: 45 }}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//         }}
//       >
//         <ambientLight intensity={0.7} />
//         <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
//         <Suspense fallback={<Html>Loading 3D models...</Html>}>
//           <FloorGrid3D
//             cols={grid.cols}
//             rows={grid.rows}
//             metersPerTile={tileMeters}
//           />
//           {placements.map((p) => (
//             <group key={p.id} position={[p.cx, tweaks[p.type]?.y || 0, p.cz]}>
//               <ModelLoader
//                 url={p.url}
//                 scale={tweaks[p.type]?.scale || 0.3}
//                 rotationY={p.rotY}
//               />
//               <Html position={[0, 1.5, 0]} center>
//                 <div
//                   style={{
//                     background: "rgba(255,255,255,0.85)",
//                     padding: "2px 6px",
//                     borderRadius: 4,
//                     fontSize: 12,
//                     border: "1px solid #ccc",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {p.label || p.id}
//                 </div>
//               </Html>
//             </group>
//           ))}
//         </Suspense>

//         <Environment preset="city" />
//         <OrbitControls makeDefault />
//         <FitCamera width={widthM} height={heightM} />
//       </Canvas>
//     </div>
//   );
// }

import React, { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import ModelLoader from "./ModelLoader";
import FloorGrid3D from "./FloorGrid3D";

/** Default isometric top camera setup */
function FitCamera({ width, height, resetSignal }) {
  const { camera, controls } = useThree();
  const defaultPos = useRef(
    new THREE.Vector3(width / 2, Math.max(width, height), height * 1.5)
  );

  useEffect(() => {
    const pos = defaultPos.current;
    camera.position.copy(pos);
    camera.lookAt(width / 2, 0, height / 2);
    if (controls) controls.target.set(width / 2, 0, height / 2);
  }, [width, height, camera, controls]);

  // Reset when clicking outside
  useEffect(() => {
    if (resetSignal) {
      const pos = defaultPos.current;
      let t = 0;
      const start = camera.position.clone();
      function animate() {
        if (t < 1) {
          t += 0.02;
          camera.position.lerpVectors(start, pos, t);
          camera.lookAt(width / 2, 0, height / 2);
          requestAnimationFrame(animate);
        }
      }
      animate();
    }
  }, [resetSignal]);

  return null;
}

export default function Scene3D({ config }) {
  if (!config?.grid) return null;

  const { grid, elements = [] } = config;
  const tileFeet = grid.tilePhysicalSize || 2;
  const tileMeters = tileFeet * 0.3048;
  const widthM = grid.cols * tileMeters;
  const heightM = grid.rows * tileMeters;

  const [selected, setSelected] = useState(null);
  const [resetSignal, setResetSignal] = useState(false);

  const [tweaks, setTweaks] = useState({
    rack: { scale: 0.8, y: 0 },
    crah: { scale: 0.8, y: 0 },
    pdu: { scale: 0.8, y: 0 },
    ups: { scale: 0.8, y: 0 },
    battery: { scale: 0.8, y: 0.8 },
  });

  const orientationToRad = (o) => {
    const k = o?.toLowerCase();
    if (k === "east") return -Math.PI / 2;
    if (k === "south") return Math.PI;
    if (k === "west") return Math.PI / 2;
    return 0;
  };

  const modelLookup = {
    rack: "/assets/models/rack.glb",
    pdu: "/assets/models/pdu.glb",
    crah: "/assets/models/crah.glb",
    ups: "/assets/models/ups.glb",
    battery: "/assets/models/battery.glb",
  };

  const infoLookup = {
    ups: {
      title: "UPS",
      description: "Uninterruptible Power Supply for reliable power backup.",
    },
    rack: {
      title: "Server Rack",
      description: "Houses computing servers and network devices securely.",
    },
    battery: {
      title: "Battery Bank",
      description: "Stores energy for UPS backup and peak load support.",
    },
    pdu: {
      title: "PDU",
      description: "Power Distribution Unit supplying electricity to racks.",
    },
    crah: {
      title: "CRAH Unit",
      description: "Computer Room Air Handler for cooling and airflow control.",
    },
  };

  const placements = useMemo(
    () =>
      elements.map((item) => {
        const cx = item.x * tileMeters + (item.width * tileMeters) / 2;
        const cz = item.y * tileMeters + (item.height * tileMeters) / 2;
        const type = item.type.toLowerCase();
        const rotY = orientationToRad(item.orientation);
        const url = modelLookup[type] || modelLookup["rack"];
        return { ...item, cx, cz, type, url, rotY };
      }),
    [elements, tileMeters]
  );

  // Camera animation when clicking on model
  function handleModelClick(p, index, camera) {
    setSelected(p);
    setResetSignal(false);
    const start = camera.position.clone();
    const end = new THREE.Vector3(p.cx + 1.5, 2.5, p.cz + 3);
    let t = 0;
    function animate() {
      if (t < 1) {
        t += 0.03;
        camera.position.lerpVectors(start, end, t);
        camera.lookAt(p.cx, 1, p.cz);
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  // Handle clicking on empty space to reset view
  function handleCanvasClick(e) {
    if (e.target.tagName === "CANVAS") {
      setSelected(null);
      setResetSignal(true);
    }
  }

  return (
    <div
      onClick={handleCanvasClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
        background: "#f9f9f9",
      }}
    >
      {/* === Adjust Models Panel === */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          zIndex: 20,
          background: "#fff",
          padding: "10px 14px",
          border: "1px solid #ccc",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <b>Adjust Models</b>
        {Object.keys(tweaks).map((t) => (
          <div key={t} style={{ marginTop: 6 }}>
            <div>{t.toUpperCase()}</div>
            <label>
              Scale:
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={tweaks[t].scale}
                onChange={(e) =>
                  setTweaks((p) => ({
                    ...p,
                    [t]: { ...p[t], scale: parseFloat(e.target.value) },
                  }))
                }
              />
              {tweaks[t].scale.toFixed(2)}
            </label>
            <br />
            <label>
              Y:
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={tweaks[t].y}
                onChange={(e) =>
                  setTweaks((p) => ({
                    ...p,
                    [t]: { ...p[t], y: parseFloat(e.target.value) },
                  }))
                }
              />
              {tweaks[t].y.toFixed(2)}
            </label>
          </div>
        ))}
      </div>

      {/* === Canvas === */}
      <Canvas
        shadows
        camera={{ fov: 45 }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

        <Suspense fallback={<Html>Loading 3D models...</Html>}>
          <FloorGrid3D
            cols={grid.cols}
            rows={grid.rows}
            metersPerTile={tileMeters}
          />

          <SceneModels
            placements={placements}
            tweaks={tweaks}
            infoLookup={infoLookup}
            selected={selected}
            onSelect={setSelected}
            handleModelClick={handleModelClick}
          />
        </Suspense>

        <Environment preset="city" />
        <OrbitControls makeDefault />
        <FitCamera width={widthM} height={heightM} resetSignal={resetSignal} />
      </Canvas>
    </div>
  );
}

/** === Subcomponent for model rendering === */
function SceneModels({
  placements,
  tweaks,
  infoLookup,
  selected,
  handleModelClick,
}) {
  const { camera } = useThree();

  return placements.map((p, index) => (
    <group
      key={p.id}
      position={[p.cx, tweaks[p.type]?.y || 0, p.cz]}
      onClick={(e) => {
        e.stopPropagation();
        handleModelClick(p, index + 1, camera);
      }}
    >
      <ModelLoader
        url={p.url}
        scale={tweaks[p.type]?.scale || 0.3}
        rotationY={p.rotY}
      />

      {/* === Number Marker === */}
      <Html position={[0, 2, 0]} center>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleModelClick(p, index + 1, camera);
          }}
          style={{
            background: "#222",
            color: "#fff",
            width: 26,
            height: 26,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {index + 1}
        </div>
      </Html>

      {/* === Popup Info === */}
      {selected?.id === p.id && (
        <Html position={[0, 3, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              color: "white",
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 13,
              width: 220,
              lineHeight: 1.4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              pointerEvents: "auto",
            }}
          >
            <b style={{ fontSize: 14 }}>
              {infoLookup[p.type]?.title || p.type.toUpperCase()}
            </b>
            <div style={{ marginTop: 6 }}>
              {infoLookup[p.type]?.description ||
                "No description available for this component."}
            </div>
          </div>
        </Html>
      )}
    </group>
  ));
}
