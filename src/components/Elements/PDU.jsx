// src/components/Elements/PDU.jsx
import React from "react";
import BaseElement from "./BaseElement";
import { computeCenterPx, pxSizeFromTiles } from "../../utils/geometryUtils";

export default function PDU({ item, grid }) {
  const { cx, cy } = computeCenterPx(
    item.x,
    item.y,
    item.width,
    item.height,
    grid.tileSize
  );
  const w = pxSizeFromTiles(item.width, grid.tileSize);
  const h = pxSizeFromTiles(item.height, grid.tileSize);
  return (
    <BaseElement type="pdu" cx={cx} cy={cy} w={w} h={h} label={item.label} />
  );
}
