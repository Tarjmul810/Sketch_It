import { Types } from "./type"

export type Interaction = {
    activeTool: Types,
    isDragging: boolean,
    dragStartScreen: { x: number, y: number} | null,
    panStartCamera: { x: number, y: number} | null,
    selectionBox: Box | null
}

export type Box = { startX: number, startY: number, endX: number, endY: number, width: number, height: number}