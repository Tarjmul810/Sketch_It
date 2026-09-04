import { Tools } from "../types/tool";
import { RectTool } from "./rect";
import { CircleTool } from "./circle";
import { LineTool } from "./line";
import { PanTool } from "./pan";
import { SelectTool } from "./select";

export type ToolName = "rect" | "circle" | "line" | "select" | "pan";

export const ToolRegistry: Record<ToolName, Tools> = {
  rect: RectTool,
  circle: CircleTool,
  line: LineTool,
  select: SelectTool,
  pan: PanTool,
};
