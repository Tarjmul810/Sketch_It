"use client"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { init } from "../app/draw/init"
import { Pencil, RectangleHorizontal, Circle, MousePointer2 } from "lucide-react"
import { Icon } from "./Icon"

interface Shapes {
    type: "Rect" | "Circle" | "line" | "pan"
}

export function CanvasClient({ roomId }: { roomId: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { socket, loading } = useSocket()
    const [shape, setShape] = useState<Shapes["type"]>("pan")

    useEffect(() => {
        if (!canvasRef.current || !socket || loading) return

        const canvas = canvasRef.current
        socket.send(JSON.stringify({ type: "join-room", roomId }))
        console.log("React", shape)

        init({ canvas, socket, roomId, shape })
    }, [socket, roomId, shape, loading])

    if (loading) return <div>Connecting to Server...</div>

    return (
        <div className="h-screen overflow-hidden">
            <ToolBar shape={shape} setShape={setShape} />
            <canvas ref={canvasRef} width={10000} height={6000}></canvas>
        </div>
    )
}

interface ToolBarProps {
    shape: Shapes["type"]
    setShape: (shape: Shapes["type"]) => void
}

function ToolBar({ shape, setShape }: ToolBarProps) {
    return <div className="flex flex- fixed">
        <Icon icon={<Pencil />} activated={shape === "line"} onClick={() => setShape("line")} />
        <Icon icon={<RectangleHorizontal />} activated={shape === "Rect"} onClick={() => setShape("Rect")} />
        <Icon icon={<Circle />} activated={shape === "Circle"} onClick={() => setShape("Circle")}/>
        <Icon icon={<MousePointer2 />} activated={shape === "pan"} onClick={() => setShape("pan")} /> 
    </div>
}