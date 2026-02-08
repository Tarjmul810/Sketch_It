import { AppState } from "../types/appSatate";
import { Camera } from "../types/camera";
import { Shapes } from "../types/shapes";
import { renderOverlays } from "./renderOverlay";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: AppState,
) {
  worldRender(ctx, canvas, state.shapes, state.camera);
  renderOverlays(ctx, state);
}

const worldRender = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shapes[],
  camera: Camera,
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";

  shapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(
        (shape.startX + camera.x) * camera.scale,
        (shape.startY + camera.y) * camera.scale,
        (shape.width) * camera.scale,
        (shape.height) * camera.scale,
      );
    }

    if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(
        (shape.x + camera.x) * camera.scale,
        (shape.y + camera.y) * camera.scale,
        (shape.radius) * camera.scale,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
    }

    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(
        (shape.startX + camera.x)* camera.scale,
        (shape.startY + camera.y)* camera.scale,
      );
      ctx.lineTo(
        (shape.endX + camera.x) * camera.scale,
        (shape.endY + camera.y) * camera.scale,
      );
      ctx.stroke();
    }
  });
};
