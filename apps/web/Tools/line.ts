import { Shapes } from "../types/shapes";
import { Tools } from "../types/tool";


export const LineTool: Tools = {
    onMouseDown(state, e) {
        state.interaction.isDragging = true;
        state.interaction.dragStartScreen = { x: e.clientX, y: e.clientY };
    },

    onMouseMove(state, e) {
        if (!state.interaction.isDragging) return;
    },

    onMouseUp(state, e) {
        if (!state.interaction.isDragging || !state.interaction.dragStartScreen) return;

        const start = state.interaction.dragStartScreen;
        const end = { x: e.clientX, y: e.clientY };

        const worldStartX = start.x - state.camera.x;
        const worldStartY = start.y - state.camera.y;
        const worldEndX = end.x - state.camera.x;
        const worldEndY = end.y - state.camera.y;

        const line: Shapes = {
            type: "line",
            id: crypto.randomUUID(),
            startX: worldStartX,
            startY: worldStartY,
            endX: worldEndX,
            endY: worldEndY
        };

        state.shapes.push(line);

        state.interaction.isDragging = false;
        state.interaction.dragStartScreen = null;
    }
}