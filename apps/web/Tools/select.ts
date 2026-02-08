import { Box } from "../types/interactions";
import { Shapes } from "../types/shapes";
import { Tools } from "../types/tool";
import { isPointInsideBox } from "../utils/isPointInsideBox";
import { isShapeInsideBoundingBox } from "../utils/isShapeInsideBox";
import { AppContext } from "../types/appContext";
import { sendSahpe } from "../utils/sendShapes";
import { shiftShape } from "../utils/shiftShapes";
import { AppState } from "../types/appSatate";

export const SelectTool: Tools = {
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

    const worldStartX = start.x / state.camera.scale - state.camera.x;
    const worldStartY = start.y / state.camera.scale - state.camera.y;
    const worldEndX = end.x / state.camera.scale - state.camera.x;
    const worldEndY = end.y / state.camera.scale - state.camera.y;

    const shiftX = worldEndX - worldStartX;
    const shiftY = worldEndY - worldStartY;

    if (state.interaction.selectionBox) {
      if (
        !isPointInsideBox(
          start.x / state.camera.scale - state.camera.x,
          start.y / state.camera.scale - state.camera.y,
          state.interaction.selectionBox.startX,
          state.interaction.selectionBox.startY,
          state.interaction.selectionBox.endX,
          state.interaction.selectionBox.endY,
        )
      ) {
        state.interaction.selectionBox = null;
        return;
      }



      state.interaction.delta = {
        dx: shiftX,
        dy: shiftY,
      };

      const { selectedShapes, restShapes } = partionShapesBySelection(
        state.shapes,
        state.interaction.selectionBox,
      );

      const selectAction: any = {
        moveShape: moveAction,
        delete: deleteAction,
      };
 
      console.log(state.interaction.selectionBox);

      const action = selectAction[state.interaction.activeTool];

      if (action) {
        action(state, ctx, selectedShapes, restShapes);
      }

      state.interaction.isDragging = false;
      state.interaction.dragStartScreen = null;
      state.interaction.selectionBox = null;
      return;
    }

    state.interaction.selectionBox = {
      startX: worldStartX,
      startY: worldStartY,
      endX: worldEndX,
      endY: worldEndY,
      width: worldEndX - worldStartX,
      height: worldEndY - worldStartY,
    };

    console.log("fuck you all");

    state.interaction.isDragging = false;
    state.interaction.dragStartScreen = null;

    state.interaction.preview = {
      tool: null,
      start: null,
      end: null,
    };
    return;
  },
};

function partionShapesBySelection(shapes: Shapes[], selectionBox: Box) {
  const selectedShapes: Shapes[] = [];
  const restShapes: Shapes[] = [];

  for (const shape of shapes) {
    if (isShapeInsideBoundingBox(shape, selectionBox)) {
      selectedShapes.push(shape);
    } else {
      restShapes.push(shape);
    }
  }

  return { selectedShapes, restShapes };
}

function deleteAction(
  state: AppState,
  ctx: AppContext,
  select: Shapes[],
  rest: Shapes[],
) {
  const deletedShapes = select.map((s) => ({ id: s.id, shape: s }));

  state.shapes = rest;

  sendSahpe(ctx, "delete", deletedShapes);
}

function moveAction(
  state: AppState,
  ctx: AppContext,
  select: Shapes[],
  rest: Shapes[],
) {
  const movedShapes: { id: string; shape: Shapes }[] = [];

  const updated = [...rest];

  for (const shape of select) {
    const moved = shiftShape({
      shape,
      shiftX: state.interaction.delta.dx,
      shiftY: state.interaction.delta.dy,
    });

    movedShapes.push({ id: moved.id, shape: moved });
    updated.push(moved);
  }

  state.shapes = updated;

  state.shapes.push(...select);

  sendSahpe(ctx, "update", movedShapes);
}
