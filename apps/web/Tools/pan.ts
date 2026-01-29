import { Tools } from "../types/tool";


export const PanTool: Tools = {
    onMouseDown(state, ctx, e) {
        state.interaction.isDragging = true;
        state.interaction.panStartCamera = { ...state.camera };
    },

    onMouseMove(state, e) {
        if (!state.interaction.isDragging) return;
        state.camera.x += e.movementX;
        state.camera.y += e.movementY;

    },

    onMouseUp(state, cx, e) {
        if (!state.interaction.isDragging || !state.interaction.panStartCamera) return;
        state.interaction.isDragging = false;
        state.interaction.panStartCamera = null;
    }
}