import { BACKEND_URL, TOKEN } from "@repo/common/config";
import axios from "axios";
import { rect, s, select } from "framer-motion/client";
import { send } from "process";

type Shapes =
  | {
      type: "BoundingRect";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      width: number;
      height: number;
    }
  | {
      type: "Rect";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      width: number;
      height: number;
    }
  | {
      type: "Circle";
      id: string;
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
    }
  | {
      type: "line";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "pan";
      x: number;
      y: number;
    };

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
  shape: Shapes["type"];
}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let movedShapes: { id: string; shape: Shapes }[] = [];
  let existingShapes: Shapes[] = await getShapes(roomId);
  clearCanvas(ctx, canvas, existingShapes);

  console.log(existingShapes);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "chat") {
      existingShapes.push(JSON.parse(data.message));
      clearCanvas(ctx, canvas, existingShapes);
    }
  };

  if (mouseDownHandler)
    canvas.removeEventListener("mousedown", mouseDownHandler);
  if (mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  if (mouseUpHandler) canvas.removeEventListener("mouseup", mouseUpHandler);

  let clicked = false;
  let selected = false;

  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;

  mouseDownHandler = (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  mouseMoveHandler = (e) => {
    if (!clicked) return;

    width = e.clientX - startX;
    height = e.clientY - startY;

    let endX = Math.abs(e.clientX);
    let endY = Math.abs(e.clientY);

    clearCanvas(ctx, canvas, existingShapes);
    ctx.strokeStyle = "white";

    if (shape === "Rect" || shape === "pan") {
      ctx.strokeRect(startX, startY, width, height);
    }

    if (shape === "Circle") {
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

    let endX = Math.abs(e.clientX);
    let endY = Math.abs(e.clientY);

    width = Math.abs(e.clientX - startX);
    height = Math.abs(e.clientY - startY);
    ctx.strokeStyle = "white";

    if (shape === "Rect") {
      const details: Shapes = {
        type: "Rect",
        id: crypto.randomUUID(),
        startX: Math.min(startX, endX),
        startY: Math.min(startY, endY),
        endX: Math.max(startX, endX),
        endY: Math.max(startY, endY),
        width,
        height,
      };

      const shapeId = details.id;

      existingShapes.push(details);
      ctx.strokeRect(startX, startY, width, height,);

      sendSahpe(socket, shapeId, details, roomId);
    }

    if (shape === "Circle") {
      const radius = Math.abs(width);

      const details: Shapes = {
        type: "Circle",
        id: crypto.randomUUID(),
        x: startX,
        y: startY,
        radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      };

      existingShapes.push(details);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      const shapeId = details.id;

      sendSahpe(socket, shapeId, details, roomId);
    }

    if (shape === "line") {
      const details: Shapes = {
        type: "line",
        id: crypto.randomUUID(),
        startX: startX,
        startY: startY,
        endX: e.clientX,
        endY: e.clientY,
      };

      existingShapes.push(details);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      const shapeId = details.id;

      sendSahpe(socket, shapeId, details, roomId);
    }

    if (shape === "pan") {

      if (findBoundingBox({ shapes: existingShapes })) {
        const element = existingShapes.find(
          (shape) => shape.type === "BoundingRect",
        );

        if (!element) return;

        if (
          isPointInsideRect(
            startX,
            startY,
            element.startX,
            element.startY,
            element.endX,
            element.endY,
          )
        ) {

          const updateShapes = await Promise.all(
            existingShapes.map(async (shape) => {
              if (shape.type === "BoundingRect" || shape.type === "pan") return shape;

              if (
                isShapeInsideBoundingBox(shape, element)) {
                 const shiftedShape = shape.type === "Rect" ? shiftRect({shape, startX, startY, endX, endY} ) : shape.type === "Circle" ? shiftCircle({shape, startX, startY, endX, endY }) : shiftLine({shape, startX, startY, endX, endY})
                
                 movedShapes.push({id: shape.id, shape: shiftedShape})
                
                 return shiftedShape
              }

              return shape;
            }),
          );

          console.log(movedShapes);

          updateShapes.pop();

          existingShapes = updateShapes;

          updateShape(socket, movedShapes, roomId)

          clearCanvas(ctx, canvas, existingShapes);
        } else {
          const updatedShapes = existingShapes.map((shape) => {
            return shape;
          });

          updatedShapes.pop();

          existingShapes = updatedShapes;
          clearCanvas(ctx, canvas, existingShapes);
        }
      } else {
        const details: Shapes = {
          type: "BoundingRect",
          id: crypto.randomUUID(),
          startX: Math.min(startX, endX),
          startY: Math.min(startY, endY),
          endX: Math.max(startX, endX),
          endY: Math.max(startY, endY),
          width,
          height,
        };
        existingShapes.push(details);

        ctx.strokeRect(
          details.startX,
          details.startY,
          details.width,
          details.height,
        );
      }
    }
  };

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
}

function findBoundingBox({ shapes }: { shapes: Shapes[] }) {
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    if (shape && shape.type === "BoundingRect") {
      return true;
    }
  }
}

const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  existingShapes: Shapes[],
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    ctx.strokeStyle = "white";

    if (shape.type === "Rect") {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }

    if (shape.type === "Circle") {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  });
};

const getShapes = async (roomId: number) => {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  return response.data.messages.map((m: any) =>
    JSON.parse(m.message),
  ) as Shapes[];
};

async function updateDataBase(shapeId: string, newMessage: string) {
  await axios.put(
    `${BACKEND_URL}/chat/${shapeId}`,
    {
      message: newMessage,
    },
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );

  return true;
}

const sendSahpe = (
  socket: WebSocket,
  shapeId: string,
  details: Shapes,
  roomId: number,
) => {
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      shapeId,
      message: JSON.stringify(details),
    }),
  );
};

const updateShape = (
  socket: WebSocket,
  shapes: { id: string; shape: Shapes }[],
  roomId: number,
) => {
  socket.send(
    JSON.stringify({
      type: "update",
      roomId,
      message: JSON.stringify(shapes),
    }),
  );
};

const shiftRect = ({
  shape,
  startX,
  startY,
  endX,
  endY,
}: {
  shape: any;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): Shapes => {
  const shiftX = endX - startX;
  const shiftY = endY - startY;

  return {
    ...shape,
    startX: shape.startX + shiftX,
    startY: shape.startY + shiftY,
    endX: shape.endX + shiftX,
    endY: shape.endY + shiftY,
  };
};

const shiftCircle = ({
  shape,
  startX,
  startY,
  endX,
  endY,
}: {
  shape: any;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): Shapes => {
  const shiftX = endX - startX;
  const shiftY = endY - startY;

  return {
    ...shape,
    x: shape.x + shiftX,
    y: shape.y + shiftY,
  };
};

const shiftLine = ({
  shape,
  startX,
  startY,
  endX,
  endY,
} : {
  shape: any;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): Shapes => {
  const shiftX = endX - startX;
  const shiftY = endY - startY;

  return {
    ...shape,
    startX: shape.startX + shiftX,
    startY: shape.startY + shiftY,
    endX: shape.endX + shiftX,
    endY: shape.endY + shiftY,
  };
};

const isPointInsideRect = (
  x: number,
  y: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  return x >= startX && x <= endX && y >= startY && y <= endY;
};

function isInsideRect({
  rectX1,
  rectY1,
  rectX2,
  rectY2,
  shapeX1,
  shapeY1,
  shapeX2,
  shapeY2,
  rectW,
  rectH,
  shapeW,
  shapeH,
}: {
  rectX1: number;
  rectY1: number;
  rectX2: number;
  rectY2: number;
  shapeX1: number;
  shapeY1: number;
  shapeX2: number;
  shapeY2: number;
  rectW: number;
  rectH: number;
  shapeW: number;
  shapeH: number;
}) {
  if (
    rectX1 < shapeX1 &&
    rectY1 < shapeY1 &&
    rectX2 > shapeX2 &&
    rectY2 > shapeY2 &&
    rectW > shapeW &&
    rectH > shapeH
  ) {
    return true;
  } else {
    return false
  }
}

function isShapeInsideBoundingBox(shape: Shapes, box: any): boolean {
  if (shape.type === "Rect") {
    if (
      box.startX < shape.startX &&
      box.startY < shape.startY &&
      box.endX > shape.endX &&
      box.endY > shape.endY &&
      box.width > shape.width &&
      box.height > shape.height
    ) {
      return true;
    } else {
      return false
    }
  } else if (shape.type === "Circle") {
    if (
      box.startX < shape.x - shape.radius &&
      box.startY < shape.y - shape.radius &&
      box.endX > shape.x + shape.radius &&
      box.endY > shape.y + shape.radius &&
      box.width > shape.radius * 2 &&
      box.height > shape.radius * 2
    ) {
      return true;
    } else {
      return false
    }
  } else if (shape.type === "line") {
    if (shape.endX > shape.startX &&  shape.endY > shape.startY) {
     return isInsideRect({
        rectX1: box.startX,
        rectY1: box.startY,
        rectX2: box.endX,
        rectY2: box.endY,
        shapeX1: shape.startX,
        shapeY1: shape.startY,
        shapeX2: shape.endX,
        shapeY2: shape.endY,
        rectW: box.width,
        rectH: box.height,
        shapeW: shape.endX - shape.startX,
        shapeH: shape.endY - shape.startY,
      }); 

      
    } else if(shape.endX > shape.startX && shape.endY < shape.startY) {
      console.log("case 2")
      return isInsideRect({
        rectX1: box.startX,
        rectY1: box.startY,
        rectX2: box.endX,
        rectY2: box.endY,
        shapeX1: shape.startX,
        shapeY1: shape.endY,
        shapeX2: shape.endX,
        shapeY2: shape.startY,
        rectW: box.width,
        rectH: box.height,
        shapeW: shape.endX - shape.startX,
        shapeH: shape.startY - shape.endY,
      })
    } else if (shape.endX < shape.startX && shape.endY > shape.startY) {
      console.log("case3")
      return isInsideRect({
        rectX1: box.startX,
        rectY1: box.startY,
        rectX2: box.endX,
        rectY2: box.endY,
        shapeX1: shape.endX,
        shapeY1: shape.startY,
        shapeX2: shape.startX,
        shapeY2: shape.endY,
        rectW: box.width,
        rectH: box.height,
        shapeW: shape.startX - shape.endX,
        shapeH: shape.endY - shape.startY,
      })
    } else if (shape.endX < shape.startX && shape.endY < shape.startY) {
      console.log("case4")
      return isInsideRect({
        rectX1: box.startX,
        rectY1: box.startY,
        rectX2: box.endX,
        rectY2: box.endY,
        shapeX1: shape.endX,
        shapeY1: shape.endY,
        shapeX2: shape.startX,
        shapeY2: shape.startY,
        rectW: box.width,
        rectH: box.height,
        shapeW: shape.startX - shape.endX,
        shapeH: shape.startY - shape.endY,
      })
    }
    console.log("i am here")
  }

  return false
}
