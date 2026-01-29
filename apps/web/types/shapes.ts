export type Shapes =
  | {
      type: "rect";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
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