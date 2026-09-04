import { Shapes } from "../types/shapes";

/**
 * Check if a world-point hits a shape. The line threshold is in world units and is
 * typically scaled by `1 / camera.scale` at the call site so it stays ~8px on screen.
 */
export function isPointInShape(
  shape: Shapes,
  wx: number,
  wy: number,
  worldThreshold = 8,
): boolean {
  switch (shape.type) {
    case "rect": {
      // Inflate by half-stroke-width (1.5 screen px → 1.5 world units) so the stroke is hittable
      const hw = 0.75;
      const x1 = Math.min(shape.startX, shape.startX + shape.width) - hw;
      const y1 = Math.min(shape.startY, shape.startY + shape.height) - hw;
      const x2 = x1 + Math.abs(shape.width) + hw * 2;
      const y2 = y1 + Math.abs(shape.height) + hw * 2;
      return wx >= x1 && wx <= x2 && wy >= y1 && wy <= y2;
    }
    case "circle": {
      const dx = wx - shape.x;
      const dy = wy - shape.y;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    }
    case "line": {
      const { startX, startY, endX, endY } = shape;
      const dx = endX - startX;
      const dy = endY - startY;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) return false;
      let t = ((wx - startX) * dx + (wy - startY) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const nearX = startX + t * dx;
      const nearY = startY + t * dy;
      const dist2 = (wx - nearX) ** 2 + (wy - nearY) ** 2;
      const r = worldThreshold;
      return dist2 <= r * r;
    }
  }
}

/** Check if a world-point is inside a rectangular selection box. */
export function isPointInBox(
  wx: number,
  wy: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  const x1 = Math.min(bx, bx + bw);
  const y1 = Math.min(by, by + bh);
  const x2 = x1 + Math.abs(bw);
  const y2 = y1 + Math.abs(bh);
  return wx >= x1 && wx <= x2 && wy >= y1 && wy <= y2;
}

/** Get the bounding box of a shape in world coords. */
export function shapeBounds(shape: Shapes): { x: number; y: number; width: number; height: number } {
  switch (shape.type) {
    case "rect": {
      // Inflate by half-stroke-width so the selection box covers what is actually hittable
      const hw = 0.75;
      const x = Math.min(shape.startX, shape.startX + shape.width) - hw;
      const y = Math.min(shape.startY, shape.startY + shape.height) - hw;
      return { x, y, width: Math.abs(shape.width) + hw * 2, height: Math.abs(shape.height) + hw * 2 };
    }
    case "circle":
      return {
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    case "line": {
      const x = Math.min(shape.startX, shape.endX);
      const y = Math.min(shape.startY, shape.endY);
      return {
        x,
        y,
        width: Math.abs(shape.endX - shape.startX),
        height: Math.abs(shape.endY - shape.startY),
      };
    }
  }
}

/** Check if a shape's bounding box intersects a selection box (world coords). */
export function isShapeInBox(
  shape: Shapes,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  const b = shapeBounds(shape);
  const bx2 = bx + bw;
  const by2 = by + bh;
  const bbx2 = b.x + b.width;
  const bby2 = b.y + b.height;
  // Intersection = both intervals overlap on both axes
  return b.x < bx2 && bbx2 > bx && b.y < by2 && bby2 > by;
}
