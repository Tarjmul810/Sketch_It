import { Types } from "./type"

export type Interaction = {
    activeTool: Types,
    isDragging: boolean,
    dragStartScreen: { x: number, y: number} | null,
    panStartCamera: { x: number, y: number} | null,
    delta: { dx: number, dy: number} | { dx: 0, dy: 0},
    selectionBox: Box | null,
    preview: Preview
}

export type Box = { startX: number, startY: number, endX: number, endY: number, width: number, height: number}

type Preview = {
    tool: "rect" | "circle" | "line" | null,
    start: {x: number, y: number} | null,
    end: {x: number, y: number} | null
}