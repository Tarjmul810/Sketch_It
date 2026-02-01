

export const previewShape = ({ctx, tool, start, end}: {ctx: CanvasRenderingContext2D, tool: "rect" | "circle" | "line", start: {x: number, y: number}, end: {x: number, y: number}}) => {
    switch (tool) {
        case "rect":
            return previewRect({ctx, start, end})
        case "circle":
            return previewCircle({ctx, start, end})
        case "line":
            return previewLine({ctx, start, end})
    }
}

const previewRect = ({ctx, start, end}: {ctx: CanvasRenderingContext2D, start: {x: number, y: number}, end: {x: number, y: number}}) => {
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
}

const previewCircle = ({ctx, start, end}: {ctx: CanvasRenderingContext2D, start: {x: number, y: number}, end: {x: number, y: number}}) => {
    ctx.beginPath();
    ctx.arc(start.x, start.y, Math.max(Math.abs(start.x - end.x)), 0, 2 * Math.PI);
    ctx.stroke();
}

const previewLine = ({ctx, start, end}: {ctx: CanvasRenderingContext2D, start: {x: number, y: number}, end: {x: number, y: number}}) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}