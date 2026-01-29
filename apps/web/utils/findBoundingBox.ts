import { Shapes } from "../types/shapes";


export function findBoundingBox({ shapes }: { shapes: Shapes[] }) {
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    if (shape && shape.type === "BoundingRect") {
      return true;
    }
  }
}