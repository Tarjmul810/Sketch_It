"use client"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { init } from "../draw/init"
import { Pencil, RectangleHorizontal, Circle, MousePointer2, Trash, Hand } from "lucide-react"
import { Icon } from "./Icon"
import { Types } from "../types/type"

export function CanvasClient({ roomId }: { roomId: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { socket, loading } = useSocket()
    const [shape, setShape] = useState<Types>("circle")

    useEffect(() => {
        if (!canvasRef.current || !socket || loading) return

        const canvas = canvasRef.current
        socket.send(JSON.stringify({ type: "join-room", roomId }))

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
    shape: Types
    setShape: (shape: Types) => void
}

function ToolBar({ shape, setShape }: ToolBarProps) {
    return <div className="flex flex- fixed">
        <Icon icon={<Pencil />} activated={shape === "line"} onClick={() => setShape("line")} />
        <Icon icon={<RectangleHorizontal />} activated={shape === "rect"} onClick={() => setShape("rect")} />
        <Icon icon={<Circle />} activated={shape === "circle"} onClick={() => setShape("circle")} />
        <Icon icon={<MousePointer2 />} activated={shape === "moveShape"} onClick={() => setShape("moveShape")} />
        <Icon icon={<Trash />} activated={shape === "delete"} onClick={() => setShape("delete")} />
        <Icon icon={<Hand />} activated={shape === "pan"} onClick={() => setShape("pan")} />
    </div>
}