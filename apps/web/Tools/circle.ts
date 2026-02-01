import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";
import { createAction } from "./rect";

export const CircleTool: Tools = {
  onMouseDown(state, e) {
    state.interaction.isDragging = true;
    state.interaction.dragStartScreen = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStartScreen) return;

    state.interaction.preview = {
      tool: "circle",
      start: state.interaction.dragStartScreen,
      end: { x: e.clientX, y: e.clientY },
    }
  },

  onMouseUp(state, e, ctx) {
    if (!state.interaction.isDragging || !state.interaction.dragStartScreen)
      return;

    const start = state.interaction.dragStartScreen;
    const end = { x: e.clientX, y: e.clientY };

    const worldStartX = start.x / state.camera.scale - state.camera.x;
    const worldStartY = start.y / state.camera.scale - state.camera.y;
    const worldEndX = end.x / state.camera.scale - state.camera.x;
    const worldEndY = end.y / state.camera.scale - state.camera.y;

    const circle: Shapes = {
      type: "circle",
      id: crypto.randomUUID(),
      x: worldStartX,
      y: worldStartY,
      radius:Math.max(Math.abs(worldStartX - worldEndX), Math.abs(worldStartY - worldEndY)),
      startAngle: 0,
      endAngle: 2 * Math.PI,
    };

    state.shapes.push(circle);

    if (!ctx) return
    createAction(ctx, [{ id: circle.id, shape: circle }]);

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
