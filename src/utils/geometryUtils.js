// src/utils/geometryUtils.js

/**
 * compute center px coordinate from tile-based x, width
 * formula required by user:
 *   centerX = x * tileSize + (width * tileSize) / 2
 *   centerY = y * tileSize + (height * tileSize) / 2
 */
export function computeCenterPx(xTile, yTile, wTiles, hTiles, tileSize) {
  return {
    cx: xTile * tileSize + (wTiles * tileSize) / 2,
    cy: yTile * tileSize + (hTiles * tileSize) / 2,
  };
}

/** compute pixel size from tiles */
export function pxSizeFromTiles(tileCount, tileSize) {
  return tileCount * tileSize;
}

/** returns human readable dimension in feet (tilePhysicalSize * tiles) */
export function tilesToFeet(tiles, tilePhysicalSize = 2) {
  return tiles * tilePhysicalSize;
}
