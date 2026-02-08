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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Connecting to server…
      </div>
    )
  }

  return (
    
    <div className="relative max-h-screen overflow-hidden">

      <div className="fixed top-4 left-1/2 -translate-x-1/2">
        <div className=" flex items-center gap-1 border border-border rounded-xl px-1.5 py-1 shadow-lg">
          <ToolBar shape={shape} setShape={setShape} />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className=""
        width={16000}
        height={780}
      />
    </div>
  )
}


interface ToolBarProps {
  shape: Types
  setShape: (shape: Types) => void
}

function ToolBar({ shape, setShape }: ToolBarProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex items-center gap-1.5">
        <Icon icon={<Pencil size={15} />} activated={shape === "line"} onClick={() => setShape("line")} />
        <Icon icon={<RectangleHorizontal size={15} />} activated={shape === "rect"} onClick={() => setShape("rect")} />
        <Icon icon={<Circle size={15} />} activated={shape === "circle"} onClick={() => setShape("circle")} />
        <Icon icon={<MousePointer2 size={15} />} activated={shape === "moveShape"} onClick={() => setShape("moveShape")} />
        <Icon icon={<Trash size={15} />} activated={shape === "delete"} onClick={() => setShape("delete")} />
        <Icon icon={<Hand size={15} />} activated={shape === "pan"} onClick={() => setShape("pan")} />
      </div>
    </div>
  )
}
