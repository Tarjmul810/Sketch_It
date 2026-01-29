import { Camera } from "../types/camera";
import { Shapes } from "../types/shapes";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shapes[],
  camera: Camera,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";

  shapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(
        shape.startX + camera.x,
        shape.startY + camera.y,
        shape.width,
        shape.height,
      );
    }

    if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(
        shape.x + camera.x,
        shape.y + camera.y,
        shape.radius,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
    }

    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX + camera.x, shape.startY + camera.y);
      ctx.lineTo(shape.endX + camera.x, shape.endY + camera.y);
      ctx.stroke();
    }
  });
}
