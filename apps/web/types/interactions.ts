export type Camera = {
  x: number; // world offset x
  y: number; // world offset y
  scale: number;
};

export type Interaction = {
  activeTool: "line" | "rect" | "circle" | "select" | "pan";
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  panStart: Camera | null;
  preview: Preview | null;
  selection: Selection | null;
};

export type Preview = {
  tool: "rect" | "circle" | "line";
  start: { x: number; y: number }; // screen coords
  end: { x: number; y: number }; // screen coords
};

export type Selection = {
  box: {
    x: number; // world coords
    y: number;
    width: number;
    height: number;
  };
  shapeIds: string[];
};
