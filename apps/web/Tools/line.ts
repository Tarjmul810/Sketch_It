import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";
import { AppContext } from "../types/appContext";
import { sendShape } from "../utils/sendShape";

export const LineTool: Tools = {
  onMouseDown(state, e) {
    state.interaction.isDragging = true;
    state.interaction.dragStart = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    state.interaction.preview = {
      tool: "line",
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
    const s = screenToWorld(state.interaction.dragStart.x, state.interaction.dragStart.y);
    const en = screenToWorld(e.clientX, e.clientY);
    if (Math.abs(en.x - s.x) < 2 && Math.abs(en.y - s.y) < 2) {
      state.interaction.isDragging = false;
      state.interaction.dragStart = null;
      state.interaction.preview = null;
      return;
    }
    const line: Shapes = {
      type: "line",
      id: crypto.randomUUID(),
      startX: s.x,
      startY: s.y,
      endX: en.x,
      endY: en.y,
    };
    state.shapes.push(line);
    sendShape(ctx, "create", [{ id: line.id, shape: line }]);
    state.interaction.isDragging = false;
    state.interaction.dragStart = null;
    state.interaction.preview = null;
  },
};
