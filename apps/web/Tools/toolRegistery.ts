import { Tools } from "../types/tool";
import { RectTool } from "./rect";
import { CircleTool } from "./circle";
import { LineTool } from "./line";
import { PanTool } from "./pan";
import { SelectTool } from "./select";

export const ToolRegistery : Record<string, Tools> = {
    rect: RectTool,
    circle: CircleTool,
    line: LineTool, 
    pan: PanTool,
    moveShape: SelectTool,
    delete: SelectTool
}