import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";
import { AppContext } from "../types/appContext";
import { sendShape } from "../utils/sendShape";

export const CircleTool: Tools = {
  onMouseDown(state, e) {
    state.interaction.isDragging = true;
    state.interaction.dragStart = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    state.interaction.preview = {
      tool: "circle",
      start: state.interaction.dragStart,
      end: { x: e.clientX, y: e.clientY },
    };
  },

  onMouseUp(state, e, ctx) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    const { camera } = state;
    const screenToWorld = (sx: number, sy: number) => ({
      x: sx / camera.scale + camera.x,
      y: sy / camera.scale + camera.y,
    });
    const c = screenToWorld(state.interaction.dragStart.x, state.interaction.dragStart.y);
    const edge = screenToWorld(e.clientX, e.clientY);
    const radius = Math.sqrt((edge.x - c.x) ** 2 + (edge.y - c.y) ** 2);
    if (radius < 4) {
      state.interaction.isDragging = false;
      state.interaction.dragStart = null;
      state.interaction.preview = null;
      return;
    }
    const circle: Shapes = { type: "circle", id: crypto.randomUUID(), x: c.x, y: c.y, radius };
    state.shapes.push(circle);
    sendShape(ctx, "create", [{ id: circle.id, shape: circle }]);
    state.interaction.isDragging = false;
    state.interaction.dragStart = null;
    state.interaction.preview = null;
  },
};
