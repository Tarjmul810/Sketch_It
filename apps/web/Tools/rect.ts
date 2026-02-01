import { previewShape } from "../draw/previewShape";
import { AppContext } from "../types/appContext";
import { Shapes } from "../types/shapes";
import { Tools } from "../types/tool";
import { sendSahpe } from "../utils/sendShapes";

export const RectTool: Tools = {
  onMouseDown(state, e) {
    state.interaction.isDragging = true;
    state.interaction.dragStartScreen = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStartScreen)
      return;

    state.interaction.preview = {
      tool: "rect",
      start: state.interaction.dragStartScreen,
      end: { x: e.clientX, y: e.clientY },
    };
  },

  onMouseUp(state, e, ctx) {
    if (!state.interaction.isDragging || !state.interaction.dragStartScreen)
      return;

    const start = state.interaction.dragStartScreen;
    const end = { x: e.clientX, y: e.clientY };

    const worldStartX = Math.min(start.x, end.x) / state.camera.scale - state.camera.x;
    const worldStartY = Math.min(start.y, end.y) / state.camera.scale - state.camera.y;
    const worldEndX = Math.max(start.x, end.x) / state.camera.scale - state.camera.x;
    const worldEndY = Math.max(start.y, end.y) / state.camera.scale - state.camera.y;

    const shiftX = worldEndX - worldStartX;
    const shiftY = worldEndY - worldStartY;

    const rect: Shapes = {
      type: "rect",
      id: crypto.randomUUID(),
      startX: worldStartX,
      startY: worldStartY,
      endX: worldEndX,
      endY: worldEndY,
      width: worldEndX - worldStartX,
      height: worldEndY - worldStartY,
    };

    const shape = {
      id: rect.id,
      shape: rect,
    };

    if (!ctx) return;

    createAction(ctx, [shape]);

    state.shapes.push(rect);

    state.interaction.isDragging = false;
    state.interaction.dragStartScreen = null;

    state.interaction.preview = {
      tool: null,
      start: null,
      end: null
    }

    return
  },
};

export function createAction(
  ctx: AppContext,
  message: { id: string; shape: Shapes }[],
) {
  sendSahpe(ctx, "create", message);
}
