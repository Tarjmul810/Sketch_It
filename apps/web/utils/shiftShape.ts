import { Shapes } from "../types/shapes";

/** Return a copy of the shape translated by (dx, dy) in world coords. */
export function shiftShape(shape: Shapes, dx: number, dy: number): Shapes {
  switch (shape.type) {
    case "rect":
      return {
        ...shape,
        startX: shape.startX + dx,
        startY: shape.startY + dy,
      };
    case "circle":
      return { ...shape, x: shape.x + dx, y: shape.y + dy };
    case "line":
      return {
        ...shape,
        startX: shape.startX + dx,
        startY: shape.startY + dy,
        endX: shape.endX + dx,
        endY: shape.endY + dy,
      };
  }
}
