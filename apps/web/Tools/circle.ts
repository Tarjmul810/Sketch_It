import { Tools } from "../types/tool";
import { Shapes } from "../types/shapes";

export const CircleTool: Tools = {
  onMouseDown(state, e) {
    state.interaction.isDragging = true;
    state.interaction.dragStartScreen = { x: e.clientX, y: e.clientY };
  },

  onMouseMove(state, e) {
    if (!state.interaction.isDragging) return;
  },

  onMouseUp(state, e) {
    if (!state.interaction.isDragging || !state.interaction.dragStartScreen)
      return;

    const start = state.interaction.dragStartScreen;
    const end = { x: e.clientX, y: e.clientY };

    const worldStartX = start.x - state.camera.x;
    const worldStartY = start.y - state.camera.y;
    const worldEndX = end.x - state.camera.x;
    const worldEndY = end.y - state.camera.y;

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

    state.interaction.isDragging = false;
    state.interaction.dragStartScreen = null;
  },
};
