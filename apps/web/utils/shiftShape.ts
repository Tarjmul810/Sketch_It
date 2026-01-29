import { Shapes } from "../types/shapes";

export const shiftShape = ({
  shape,
  startX,
  startY,
  endX,
  endY,
}: {
  shape: Shapes;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): Shapes => {
  const shiftX = endX - startX;
  const shiftY = endY - startY;

  if (shape.type === "rect") {
    return {
      ...shape,
      startX: shape.startX + shiftX,
      startY: shape.startY + shiftY,
      endX: shape.endX + shiftX,
      endY: shape.endY + shiftY,
    };
  } else if (shape.type === "circle") {
    return {
      ...shape,
      x: shape.x + shiftX,
      y: shape.y + shiftY,
    };
  } else if (shape.type === "line") {
    return {
      ...shape,
      startX: shape.startX + shiftX,
      startY: shape.startY + shiftY,
      endX: shape.endX + shiftX,
      endY: shape.endY + shiftY,
    };
  }

  return shape;
};
