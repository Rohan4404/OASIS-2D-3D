// src/components/Elements/BaseElement.jsx
import React from "react";

/**
 * BaseElement accepts:
 *   type, cx, cy (center px), w (px), h (px), label, orientation (north/east/south/west)
 * Draws CAD-style outline; label centered or rotated depending on orientation.
 */
export default function BaseElement({
  type,
  cx,
  cy,
  w,
  h,
  label,
  orientation = "north",
}) {
  const halfW = w / 2;
  const halfH = h / 2;
  const angle =
    (orientation || "north").toLowerCase() === "east"
      ? 90
      : (orientation || "north").toLowerCase() === "south"
      ? 180
      : (orientation || "north").toLowerCase() === "west"
      ? 270
      : 0;

  // draw different shapes for types but use architectural style
  const commonProps = { fill: "#f4f4f4", stroke: "#333", strokeWidth: 0.8 };

  let shape = null;
  switch (type.toLowerCase()) {
    case "rack":
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="2"
          {...commonProps}
        />
      );
      break;
    case "crah":
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="3"
          {...commonProps}
        />
      );
      break;
    case "pdu":
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="2"
          {...commonProps}
        />
      );
      break;
    case "ups":
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="2"
          {...commonProps}
        />
      );
      break;
    case "battery":
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="2"
          {...commonProps}
        />
      );
      break;
    default:
      shape = (
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={w}
          height={h}
          rx="2"
          {...commonProps}
        />
      );
  }

  // small internal details for racks
  const rackDetails =
    type.toLowerCase() === "rack" ? (
      <>
        <line
          x1={cx - halfW + 6}
          y1={cy - halfH + 6}
          x2={cx - halfW + 6}
          y2={cy + halfH - 6}
          stroke="#aaa"
          strokeWidth="0.5"
        />
        <line
          x1={cx + halfW - 6}
          y1={cy - halfH + 6}
          x2={cx + halfW - 6}
          y2={cy + halfH - 6}
          stroke="#aaa"
          strokeWidth="0.5"
        />
      </>
    ) : null;

  // label positioning: center; rotate label if orientation is 90 or 270
  const labelProps =
    angle === 90 || angle === 270
      ? { transform: `rotate(${angle}, ${cx}, ${cy})` }
      : {};

  return (
    <g
      className="base-element"
      transform={angle ? `rotate(${angle}, ${cx}, ${cy})` : undefined}
    >
      {shape}
      {rackDetails}
      <text
        x={cx}
        y={cy + 4}
        fontSize={Math.max(10, Math.min(14, Math.min(w, h) / 4))}
        textAnchor="middle"
        fill="#222"
        {...labelProps}
      >
        {label || type}
      </text>
    </g>
  );
}
