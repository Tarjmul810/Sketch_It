import { Tools } from "../types/tool";

export const PanTool: Tools = {
  onMouseDown(state, e) {
    console.log("Panning")
    state.interaction.isDragging = true;
    state.interaction.panStart = { ...state.camera };
  },

  onMouseMove(state, e) {
    console.log("Panning1")
    if (!state.interaction.isDragging) return;
    state.camera.x += e.movementX / state.camera.scale;
    state.camera.y += e.movementY / state.camera.scale;
  },

  onMouseUp(state) {
    state.interaction.isDragging = false;
    state.interaction.panStart = null;
  },
};
