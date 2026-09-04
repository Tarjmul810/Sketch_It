import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";
import { AppContext } from "../types/appContext";
import { sendShape } from "../utils/sendShape";

export const RectTool: Tools = {
  onMouseDown(state, e) {
    console.log("RectTool")
    state.interaction.isDragging = true;
    state.interaction.dragStart = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    state.interaction.preview = {
      tool: "rect",
      start: state.interaction.dragStart,
      end: { x: e.clientX, y: e.clientY },
    };
  },

  onMouseUp(state, e, ctx) {
    if (!state.interaction.isDragging || !state.interaction.dragStart) return;
    const { camera } = state;
    const screenToWorld = (sx: number, sy: number) => ({
      x: (sx / camera.scale) + camera.x,
      y: (sy / camera.scale) + camera.y,
    });
    const s = screenToWorld(state.interaction.dragStart.x, state.interaction.dragStart.y);
    const en = screenToWorld(e.clientX, e.clientY);
    const x = Math.min(s.x, en.x);
    const y = Math.min(s.y, en.y);
    const w = Math.abs(en.x - s.x);
    const h = Math.abs(en.y - s.y);
    if (w < 4 && h < 4) {
      // tiny accidental drag — ignore
      state.interaction.isDragging = false;
      state.interaction.dragStart = null;
      state.interaction.preview = null;
      return;
    }
    const rect: Shapes = { type: "rect", id: crypto.randomUUID(), startX: x, startY: y, width: w, height: h };
    state.shapes.push(rect);
    sendShape(ctx, "create", [{ id: rect.id, shape: rect }]);
    state.interaction.isDragging = false;
    state.interaction.dragStart = null;
    state.interaction.preview = null;
  },
};
