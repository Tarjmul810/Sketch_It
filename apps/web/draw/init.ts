import { sendSahpe } from "../utils/sendShape";
import { isPointInsideBox } from "../utils/isPointInsideBox";
import { isShapeInsideBoundingBox } from "../utils/isShapeInsideBox";
import { updateShape } from "../utils/updateShape";
import { getShapes } from "../utils/getShapes";
import { shiftShape } from "../utils/shiftShape";
import { Camera } from "../types/camera";
import { render } from "./render";
import { AppState } from "../types/appSatate";
import { Types } from "../types/type";
import { Shapes } from "../types/shapes";
import { ToolRegistery } from "../Tools/toolRegistery";
import { AppContext } from "../types/appContext";
// keep handler references OUTSIDE init
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: ((e: MouseEvent) => void) | null = null;

export async function init({
  canvas,
  socket,
  roomId,
  shape,
}: {
  canvas: HTMLCanvasElement;
  socket: WebSocket;
  roomId: number;
  shape: Types;
}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const state: AppState = {
    shapes: await getShapes(roomId),
    camera: loadCamera(),
    interaction: {
      activeTool: shape,
      isDragging: false,
      dragStartScreen: null,
      panStartCamera: null,
      selectionBox: null,
    },
  };

  let movedShapes: { id: string; shape: Shapes }[] = [];
  let deletedShapes: { id: string; shape: Shapes }[] = [];
  const context: AppContext = { socket, roomId };

  render(ctx, canvas, state.shapes, state.camera);

  console.log(state.shapes, shape);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "chat") {
      state.shapes.push(JSON.parse(data.message));
      render(ctx, canvas, state.shapes, state.camera);
    }

    if (data.type === "update") {
      const message = data.message;
      message.forEach((m: { id: string; shape: Shapes }) => {
        const { id, shape } = m;

        state.shapes = state.shapes.map((s) => {
          if (s.id === id) {
            return shape;
          }
          return s;
        });
      });
      render(ctx, canvas, state.shapes, state.camera);
    }

    if (data.type === "delete") {
      const message = data.message;

      message.forEach((m: { id: string; shape: Shapes }) => {
        const { id } = m;
        state.shapes = state.shapes.filter((s) => s.id !== id);
        render(ctx, canvas, state.shapes, state.camera);
      });
    }
  };

  if (mouseDownHandler)
    canvas.removeEventListener("mousedown", mouseDownHandler);
  if (mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  if (mouseUpHandler) canvas.removeEventListener("mouseup", mouseUpHandler);

  let clicked = false;

  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;

  const tool = ToolRegistery[state.interaction.activeTool];

  mouseDownHandler = (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
    if (tool?.onMouseDown) {
      tool.onMouseDown(state, e);
    }
  };

  mouseMoveHandler = (e) => {
    if (!clicked) return;

    width = e.clientX - startX;
    height = e.clientY - startY;

    render(ctx, canvas, state.shapes, state.camera);
    ctx.strokeStyle = "white";
    if (tool?.onMouseMove) {
      tool.onMouseMove(state, e);
    }

    if (shape === "rect" || shape === "moveShape" || shape === "delete") {
      ctx.strokeRect(startX, startY, width, height);
    }

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(startX, startY, Math.abs(width), 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (shape === "line") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }

  };

  mouseUpHandler = async (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    // let endX = Math.abs(e.clientX);
    // let endY = Math.abs(e.clientY);

    // width = Math.abs(e.clientX - startX);
    // height = Math.abs(e.clientY - startY);
    // ctx.strokeStyle = "white";

    if (tool?.onMouseUp) {
      tool.onMouseUp(state, e, context);
    }

    render(ctx, canvas, state.shapes, state.camera);

    // sendSahpe(socket, shapeId, details, roomId);
    

    // if (shape === "moveShape" || shape === "delete") {
    //   if (
    //     state.interaction.selectionBox &&
    //     state.interaction.selectionBox.width > 0 &&
    //     state.interaction.selectionBox.height > 0
    //   ) {
    //     if (
    //       isPointInsideBox(
    //         startX - state.camera.x,
    //         startY - state.camera.y,
    //         state.interaction.selectionBox.startX,
    //         state.interaction.selectionBox.startY,
    //         state.interaction.selectionBox.endX,
    //         state.interaction.selectionBox.endY,
    //       )
    //     ) {
    //       if (shape === "moveShape") {
    //         const updateShapes = state.shapes.map((shape) => {
    //           if (
    //             isShapeInsideBoundingBox(shape, state.interaction.selectionBox)
    //           ) {
    //             const shiftedShape = shiftShape({
    //               shape,
    //               startX,
    //               startY,
    //               endX,
    //               endY,
    //             });

    //             movedShapes.push({ id: shape.id, shape: shiftedShape });

    //             return shiftedShape;
    //           }

    //           return shape;
    //         });

    //         state.shapes = updateShapes;

    //         updateShape(socket, movedShapes, roomId, "update");

    //         movedShapes = [];

    //         render(ctx, canvas, state.shapes, state.camera);
    //       } else if (shape === "delete") {
    //         const updateShapes: Shapes[] = [];

    //         for (let s of state.shapes) {
    //           if (isShapeInsideBoundingBox(s, state.interaction.selectionBox)) {
    //             deletedShapes.push({ id: s.id, shape: s });
    //             continue;
    //           }

    //           updateShapes.push(s);
    //         }

    //         state.shapes = updateShapes;

    //         render(ctx, canvas, state.shapes, state.camera);

    //         updateShape(socket, deletedShapes, roomId, "delete");

    //         deletedShapes = [];
    //       }
    //     } else {
    //       const updatedShapes = state.shapes.map((shape) => {
    //         return shape;
    //       });

    //       state.shapes = updatedShapes;
    //       render(ctx, canvas, state.shapes, state.camera);
    //     }

    //     state.interaction.selectionBox = null;
    //   } else {
    //     const details: Shapes = {
    //       type: "rect",
    //       id: crypto.randomUUID(),
    //       startX: Math.min(startX, endX),
    //       startY: Math.min(startY, endY),
    //       endX: Math.max(startX, endX),
    //       endY: Math.max(startY, endY),
    //       width,
    //       height,
    //     };

    //     state.interaction.selectionBox = {
    //       startX: details.startX - state.camera.x,
    //       startY: details.startY - state.camera.y,
    //       endX: details.endX - state.camera.x,
    //       endY: details.endY - state.camera.y,
    //       width: details.width,
    //       height: details.height,
    //     };

    //     console.log(state.interaction.selectionBox);

    //     ctx.strokeRect(
    //       details.startX,
    //       details.startY,
    //       details.width,
    //       details.height,
    //     );
    //   }
    // }

    saveCamera(state.camera);
  };

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
}

function saveCamera(camera: Camera) {
  localStorage.setItem("camera", JSON.stringify(camera));
}

function loadCamera() {
  return JSON.parse(localStorage.getItem("camera") || "{x: 0, y: 0}");
}
