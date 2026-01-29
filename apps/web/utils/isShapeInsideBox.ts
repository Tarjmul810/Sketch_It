import { Shapes } from "../types/shapes";

export function isShapeInsideBoundingBox(shape: Shapes, box: any): boolean {
  if (shape.type === "rect") {
    return rectLogic(box, shape);
  } else if (shape.type === "circle") {
    return circleLogic(box, shape);
  } else if (shape.type === "line") {
    return lineLogic(box, shape);
  }
  return false;
}


const rectLogic = (box: any, shape: any) => {
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
    return false;
  }
};

const circleLogic = (box: any, shape: any) => {
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
    return false;
  }
};

const lineLogic = (box: any, shape: any) => {
  if (shape.endX >= shape.startX && shape.endY >= shape.startY) {
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
  } else if (shape.endX >= shape.startX && shape.endY <= shape.startY) {
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
    });
  } else if (shape.endX <= shape.startX && shape.endY >= shape.startY) {
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
    });
  } else if (shape.endX <= shape.startX && shape.endY <= shape.startY) {
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
    });
  }
  return false;
};

    function isInsideRect(params: {
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
    }): boolean {
      const {
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
      } = params;
    
      return (
        rectX1 < shapeX1 &&
        rectY1 < shapeY1 &&
        rectX2 > shapeX2 &&
        rectY2 > shapeY2 &&
        rectW > shapeW &&
        rectH > shapeH
      );
    }