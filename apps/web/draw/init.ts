import { getShapes } from "../utils/getShapes";
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
let mouseWheelHandler: ((e: WheelEvent) => void) | null = null;

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
    shapes: await getShapes(roomId) || [],
    camera: loadCamera(),
    interaction: {
      activeTool: shape,
      isDragging: false,
      dragStartScreen: null,
      panStartCamera: null,
      delta: { dx: 0, dy: 0 },
      selectionBox: null,
      preview: {
        tool: null,
        start: null,
        end: null,
      },
    },
  };

  const context: AppContext = { socket, roomId };

  render(ctx, canvas, state);

  console.log(state.shapes, shape);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "create") {
      const message = data.message;
      message.forEach((m: { id: string; shape: Shapes }) => {
        const { id, shape } = m;
        state.shapes.push(shape);
        render(ctx, canvas, state);
      });
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
      render(ctx, canvas, state);
    }

    if (data.type === "delete") {
      const message = data.message;

      message.forEach((m: { id: string; shape: Shapes }) => {
        const { id } = m;
        state.shapes = state.shapes.filter((s) => s.id !== id);
        render(ctx, canvas, state);
      });
    }
  };

  if (mouseDownHandler)
    canvas.removeEventListener("mousedown", mouseDownHandler);
  if (mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  if (mouseUpHandler) canvas.removeEventListener("mouseup", mouseUpHandler);
  if (mouseWheelHandler) canvas.removeEventListener("wheel", mouseWheelHandler);

  let clicked = false;

  const tool = ToolRegistery[state.interaction.activeTool];

  mouseDownHandler = (e) => {
    clicked = true;
    if (tool?.onMouseDown) {
      tool.onMouseDown(state, e);
    }
  };

  mouseMoveHandler = (e) => {
    if (!clicked) return;

    if (tool?.onMouseMove) {
      tool.onMouseMove(state, e);
    }
    render(ctx, canvas, state);
  };

  mouseUpHandler = async (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    if (tool?.onMouseUp) {
      tool.onMouseUp(state, e, context);
    }

    render(ctx, canvas, state);
    saveCamera(state.camera);
  };

  mouseWheelHandler = (e) => {
    e.preventDefault();

    const zoomIntensity = 0.1;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    e.deltaY

    const worldXBefore = mouseX / state.camera.scale - state.camera.x;
    const worldYBefore = mouseY / state.camera.scale - state.camera.y;

    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = 1 + direction * zoomIntensity;

    state.camera.scale *= factor;

    // clamp zoom
    state.camera.scale = Math.min(Math.max(state.camera.scale, 0.5), 3);

    const worldXAfter = mouseX / state.camera.scale - state.camera.x;
    const worldYAfter = mouseY / state.camera.scale - state.camera.y;

    state.camera.x += worldXAfter - worldXBefore;
    state.camera.y += worldYAfter - worldYBefore;

    render(ctx, canvas, state);
  }

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);

  canvas.addEventListener("wheel", mouseWheelHandler);
}

function saveCamera(camera: Camera) {
  localStorage.setItem("camera", JSON.stringify(camera));
}

function loadCamera() {
  return (
    JSON.parse(localStorage.getItem("camera")!) || {
      x: 0,
      y: 0,
      scale: 1,
    }
  );
}
