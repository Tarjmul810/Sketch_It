"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { ToolRegistry, ToolName } from "../Tools/toolRegistery";
import { AppState } from "../types/appSatate";
import { AppContext } from "../types/appContext";
import { Shapes } from "../types/shapes";
import { deleteSelection } from "../Tools/select";
import Link from "next/link";
import { apiFetch } from "../lib/api";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type Tool = { id: ToolName; label: string; icon: React.ReactNode };

/* ─────────────────────────────────────────────────────────────
   Render
───────────────────────────────────────────────────────────── */
function renderShape(
  ctx: CanvasRenderingContext2D,
  shape: Shapes,
  camera: { x: number; y: number; scale: number },
  selectedIds: Set<string>,
) {
  const toScreen = (wx: number, wy: number) => ({
    x: (wx - camera.x) * camera.scale,
    y: (wy - camera.y) * camera.scale,
  });

  const isSelected = selectedIds.has(shape.id);
  const strokeColor = isSelected ? "oklch(0.58 0.20 28)" : "oklch(0.20 0.00 0)";
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = isSelected ? 2 : 1.5;
  ctx.setLineDash(isSelected ? [6, 4] : []);

  ctx.beginPath();
  switch (shape.type) {
    case "rect": {
      const p = toScreen(shape.startX, shape.startY);
      const w = shape.width * camera.scale;
      const h = shape.height * camera.scale;
      ctx.strokeRect(p.x, p.y, w, h);
      if (isSelected) {
        ctx.setLineDash([]);
        ctx.fillStyle = "oklch(0.58 0.20 28 / 0.08)";
        ctx.fillRect(p.x, p.y, w, h);
        ctx.strokeRect(p.x, p.y, w, h);
      }
      break;
    }
    case "circle": {
      const p = toScreen(shape.x, shape.y);
      ctx.arc(p.x, p.y, shape.radius * camera.scale, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "line": {
      const s = toScreen(shape.startX, shape.startY);
      const e = toScreen(shape.endX, shape.endY);
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      ctx.stroke();
      break;
    }
  }
  ctx.setLineDash([]);
}

function renderPreview(
  ctx: CanvasRenderingContext2D,
  preview: { tool: "rect" | "circle" | "line"; start: { x: number; y: number }; end: { x: number; y: number } } | null,
  camera: { x: number; y: number; scale: number },
  offsetX: number,
  offsetY: number,
) {
  if (!preview) return;
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "oklch(0.58 0.20 28)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Convert viewport-relative preview coords to canvas-local coords
  const start = { x: preview.start.x - offsetX, y: preview.start.y - offsetY };
  const end = { x: preview.end.x - offsetX, y: preview.end.y - offsetY };
  // Preview coords are in canvas-local screen space (aligned with canvas origin)
  const { tool } = preview;
  if (tool === "rect") {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    ctx.strokeRect(x, y, w, h);
  } else if (tool === "circle") {
    const r = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    ctx.arc(start.x, start.y, r, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.restore();
}

function renderSelectionBox(
  ctx: CanvasRenderingContext2D,
  sel: { box: { x: number; y: number; width: number; height: number } } | null,
  camera: { x: number; y: number; scale: number },
) {
  if (!sel) return;
  const { box } = sel;
  const sx = (box.x - camera.x) * camera.scale;
  const sy = (box.y - camera.y) * camera.scale;
  const sw = box.width * camera.scale;
  const sh = box.height * camera.scale;
  ctx.save();
  ctx.strokeStyle = "oklch(0.58 0.20 28)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(sx, sy, sw, sh);
  ctx.fillStyle = "oklch(0.58 0.20 28 / 0.06)";
  ctx.fillRect(sx, sy, sw, sh);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────
   Toolbar icons
───────────────────────────────────────────────────────────── */
function IconLine() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  );
}
function IconRect() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}
function IconCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function IconSelect() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-7 1-4 7z" />
    </svg>
  );
}
function IconPan() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V8a2 2 0 1 1 4 0" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Toolbar
───────────────────────────────────────────────────────────── */
const TOOLS: Tool[] = [
  { id: "select", label: "Select  (V)", icon: <IconSelect /> },
  { id: "line", label: "Line  (L)", icon: <IconLine /> },
  { id: "rect", label: "Rectangle  (R)", icon: <IconRect /> },
  { id: "circle", label: "Circle  (C)", icon: <IconCircle /> },
  { id: "pan", label: "Pan  (Space / Right-drag)", icon: <IconPan /> },
];

function Toolbar({
  activeTool,
  onTool,
  hasSelection,
  onDelete,
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: {
  activeTool: ToolName;
  onTool: (t: ToolName) => void;
  hasSelection: boolean;
  onDelete: () => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-0.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-1.5 py-1.5 shadow-xl backdrop-blur-sm">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onTool(tool.id)}
            title={tool.label}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
              activeTool === tool.id
                ? "bg-[oklch(0.58_0.20_28)] text-white shadow-sm"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {tool.icon}
            {activeTool === tool.id && (
              <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-1 rounded-full bg-[oklch(0.58_0.20_28)] -translate-x-1/2" />
            )}
          </button>
        ))}

        {/* Divider */}
        <div className="mx-1.5 h-5 w-px bg-[var(--color-border)]" />

        {/* Delete */}
        <button
          onClick={onDelete}
          title="Delete selected  (Del)"
          disabled={!hasSelection}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
            hasSelection
              ? "text-[var(--color-muted-foreground)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              : "cursor-not-allowed opacity-30"
          }`}
        >
          <IconTrash />
        </button>

        {/* Divider */}
        <div className="mx-1.5 h-5 w-px bg-[var(--color-border)]" />

        {/* Zoom controls */}
        <button
          onClick={onZoomOut}
          title="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={onZoomReset}
          title="Reset zoom"
          className="flex h-8 min-w-[44px] items-center justify-center rounded-lg px-1 text-[11px] font-mono font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          title="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Room header
───────────────────────────────────────────────────────────── */
function RoomHeader({ slug, connected }: { slug: string; connected: boolean }) {
  return (
    <div className="fixed top-4 left-4 z-30">
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2 shadow-xl backdrop-blur-sm">
        <Link
          href="/dashboard"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          title="Back to dashboard"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="h-4 w-px bg-[var(--color-border)]" />
        <div>
          <p className="font-mono-label text-[9px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Room</p>
          <p className="text-[13px] font-semibold text-[var(--color-foreground)]">/{slug}</p>
        </div>
        <div className="h-4 w-px bg-[var(--color-border)]" />
        <div className="flex items-center gap-1.5">
          <span
            className={`relative flex h-2 w-2 ${connected ? "" : "opacity-40"}`}
          >
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${connected ? "animate-ping" : ""}`}
              style={{ backgroundColor: connected ? "#22c55e" : "#94a3b8" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: connected ? "#22c55e" : "#94a3b8" }}
            />
          </span>
          <span className="font-mono-label text-[9px] text-[var(--color-muted-foreground)]">
            {connected ? "live" : "offline"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CanvasApp
───────────────────────────────────────────────────────────── */
export function CanvasApp({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { socket, loading } = useSocket();
  const [connected, setConnected] = useState(false);
  const [tool, setTool] = useState<ToolName>("select");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  // Track scale in React state so the toolbar's percentage updates on zoom.
  const [scaleDisplay, setScaleDisplay] = useState(1);

  // Keep a ref in sync with roomId so non-React code (mouse handlers, key handlers)
  // can always read the latest value without re-binding effects.
  const roomIdRef = useRef<number | null>(null);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  // App state lives in a ref so event handlers always see the latest
  const stateRef = useRef<AppState>({
    shapes: [],
    camera: { x: 0, y: 0, scale: 1 },
    interaction: {
      activeTool: "select",
      isDragging: false,
      dragStart: null,
      panStart: null,
      preview: null,
      selection: null,
    },
    selectedIds: new Set<string>(),
  });

  // Render the canvas (stable — reads from stateRef, NEVER triggers React re-render)
  const renderRef = useRef<() => void>(() => {});
  renderRef.current = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { shapes, camera, interaction, selectedIds } = stateRef.current;
    // Blank white sheet — no grid.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([]);
    ctx.strokeStyle = "oklch(0.20 0.00 0)";
    for (const shape of shapes) {
      renderShape(ctx, shape, camera, selectedIds);
    }
    renderSelectionBox(ctx, interaction.selection, camera);
    renderPreview(ctx, interaction.preview, camera, rect.left, rect.top);
  };
  const render = useCallback(() => renderRef.current(), []);

  // Sync tool changes into refs so mouse handlers always read the latest without needing to be re-bound
  const toolRef = useRef<ToolName>(tool);
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { socketRef.current = socket; }, [socket]);
  // Update canvas cursor when tool changes (for keyboard shortcuts)
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = tool === "pan" ? "grab" : "default";
    }
  }, [tool]);

  // WebSocket lifecycle: open → ask for room id → load shapes → join room → handle broadcasts
  // All in ONE effect, no listener accumulation, no race conditions.
  useEffect(() => {
    if (!socket) return;

    let cancelled = false;
    let joined = false;

    const sendIfOpen = (payload: object) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        return true;
      }
      return false;
    };

    const joinRoom = (id: number) => {
      if (joined) return;
      joined = true;
      setRoomId(id);
      sendIfOpen({ type: "join-room", roomId: id });
    };

    const loadShapes = async (id: number) => {
      try {
        const res = await apiFetch<{ messages: { message: string }[] }>(`/chats/${id}`);
        if (cancelled) return;
        const shapes = res.messages.map((m) => JSON.parse(m.message) as Shapes);
        stateRef.current.shapes = shapes;
        render();
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load shapes", err);
        stateRef.current.shapes = [];
        render();
      }
    };

    const requestRoomId = () => {
      sendIfOpen({ type: "get-room-id", slug });
    };

    socket.onopen = () => {
      setConnected(true);
      requestRoomId();
    };

    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    socket.onmessage = (event) => {
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "room-not-found") {
        console.error("Room not found:", data.slug);
        return;
      }

      if (data.type === "room-id") {
        const id = Number(data.roomId);
        if (Number.isFinite(id)) {
          joinRoom(id);
          loadShapes(id);
        }
        return;
      }

      if (data.type === "create") {
        const incoming: { id: string; shape: Shapes }[] = data.message;
        for (const item of incoming) {
          if (!stateRef.current.shapes.find((s) => s.id === item.shape.id)) {
            stateRef.current.shapes.push(item.shape);
          }
        }
        render();
        return;
      }

      if (data.type === "update") {
        for (const item of data.message) {
          const idx = stateRef.current.shapes.findIndex((s) => s.id === item.id);
          if (idx !== -1) stateRef.current.shapes[idx] = item.shape;
        }
        render();
        return;
      }

      if (data.type === "delete") {
        for (const item of data.message) {
          stateRef.current.shapes = stateRef.current.shapes.filter((s) => s.id !== item.id);
        }
        render();
        return;
      }
    };

    // If the socket is already open by the time this effect runs, request the room id now.
    if (socket.readyState === WebSocket.OPEN) {
      setConnected(true);
      requestRoomId();
    }

    return () => {
      cancelled = true;
      // Do NOT close the socket here — `useSocket` owns its lifecycle.
      // Just null out the handlers so they don't fire after unmount.
      socket.onopen = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;
    };
  }, [socket, slug, render]);

  // Canvas resize — re-runs once `loading` flips and the canvas actually mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      render();
    });
    ro.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
    return () => ro.disconnect();
  }, [render, loading]);

  // Mouse handlers — imperative canvas draws only, NO React state updates.
  // Dependencies include loading so this re-runs once the canvas mounts (loading spinner
  // is returned early in the render, so canvas isn't always present on first effect run).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("Canvas1")
    let clicked = false;
    let rafId: number | null = null;

    const scheduleRender = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        renderRef.current();
      });
    };

    const onDown = (e: MouseEvent) => {
      clicked = true;
      // Right-click (or middle-click) = hand/pan gesture, works regardless of active tool
      if (e.button === 2 || e.button === 1) {
        console.log("Panning")
        stateRef.current.interaction.isDragging = true;
        stateRef.current.interaction.panStart = { ...stateRef.current.camera };
        canvas.style.cursor = "grabbing";
        scheduleRender();
        return;
      }
      // Pass original event to tools (they expect viewport-relative coordinates)
      const t = ToolRegistry[toolRef.current];
      t.onMouseDown?.(stateRef.current, e);
      setHasSelection(stateRef.current.selectedIds.size > 0);
      scheduleRender();
    };
    const onMove = (e: MouseEvent) => {
      if (!clicked) return;
      // Pan: pan-tool drag OR right/middle-click hand gesture
      console.log("Panning1")
      if (stateRef.current.interaction.isDragging && stateRef.current.interaction.panStart) {
        stateRef.current.camera.x += e.movementX / stateRef.current.camera.scale;
        stateRef.current.camera.y += e.movementY / stateRef.current.camera.scale;
        canvas.style.cursor = "grabbing";
        scheduleRender();
        return;
      }
      // Pass original event to tools
      const t = ToolRegistry[toolRef.current];
      t.onMouseMove?.(stateRef.current, e);
      setHasSelection(stateRef.current.selectedIds.size > 0);
      scheduleRender();
    };
    const onUp = (e: MouseEvent) => {
      if (!clicked) return;
      clicked = false;
      // End pan gesture (right-click hand gesture or pan-tool drag)
      if (stateRef.current.interaction.panStart) {
        stateRef.current.interaction.isDragging = false;
        stateRef.current.interaction.panStart = null;
        canvas.style.cursor = toolRef.current === "pan" ? "grab" : "default";
        scheduleRender();
        return;
      }
      // Always run the tool's onMouseUp so it can clean up local state
      // (isDragging, dragStart, preview) — even before the room is joined
      // or if the socket is down. Broadcasting is optional.
      const id = roomIdRef.current;
      const ws = socketRef.current;
      const ctx: AppContext | null = id && ws ? { socket: ws, roomId: id } : null;
      const t = ToolRegistry[toolRef.current];
      if (ctx) {
        t.onMouseUp?.(stateRef.current, e, ctx);
      } else {
        // Reset interaction state when there's no broadcast context.
        stateRef.current.interaction.isDragging = false;
        stateRef.current.interaction.dragStart = null;
        stateRef.current.interaction.preview = null;
      }
      // Update React state for delete button visibility
      setHasSelection(stateRef.current.selectedIds.size > 0);
      scheduleRender();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { camera } = stateRef.current;
      const ZOOM = 0.1;
      const dir = e.deltaY < 0 ? 1 : -1;
      const factor = 1 + dir * ZOOM;
      const newScale = Math.min(Math.max(camera.scale * factor, 0.2), 5);
      const mx = e.clientX - canvas.getBoundingClientRect().left;
      const my = e.clientY - canvas.getBoundingClientRect().top;
      const wxBefore = mx / camera.scale + camera.x;
      const wyBefore = my / camera.scale + camera.y;
      camera.scale = newScale;
      camera.x = wxBefore - mx / newScale;
      camera.y = wyBefore - my / newScale;
      setScaleDisplay(newScale);
      scheduleRender();
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    console.log("Mouseup")
    // If user releases outside the canvas, still end the drag
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    // Prevent the browser context menu on right-click so the hand gesture works cleanly
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    // Set initial cursor based on active tool
    canvas.style.cursor = toolRef.current === "pan" ? "grab" : "default";
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", (e) => e.preventDefault());
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [loading]); // <-- re-runs once `loading` flips and the canvas actually mounts

  // Keyboard shortcuts — single mount, uses refs for everything.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, ToolName> = {
        v: "select",
        l: "line",
        r: "rect",
        c: "circle",
        " ": "pan",
      };
      const key = e.key === " " ? " " : e.key.toLowerCase();
      const nextTool = map[key];
      if (nextTool) {
        e.preventDefault();
        setTool(nextTool);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const id = roomIdRef.current;
        const ws = socketRef.current;
        if (stateRef.current.selectedIds.size > 0 && ws && id) {
          e.preventDefault();
          deleteSelection(stateRef.current, { socket: ws, roomId: id });
          setHasSelection(false);
          renderRef.current();
        }
      }
      if (e.key === "Escape") {
        stateRef.current.selectedIds.clear();
        stateRef.current.interaction.selection = null;
        setHasSelection(false);
        renderRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const zoomIn = () => {
    const { camera } = stateRef.current;
    const newScale = Math.min(camera.scale * 1.2, 5);
    camera.scale = newScale;
    setScaleDisplay(newScale);
    renderRef.current();
  };
  const zoomOut = () => {
    const { camera } = stateRef.current;
    const newScale = Math.max(camera.scale / 1.2, 0.2);
    camera.scale = newScale;
    setScaleDisplay(newScale);
    renderRef.current();
  };
  const zoomReset = () => {
    stateRef.current.camera = { x: 0, y: 0, scale: 1 };
    setScaleDisplay(1);
    renderRef.current();
  };

  const handleDelete = () => {
    const id = roomIdRef.current;
    const ws = socketRef.current;
    if (ws && id) {
      deleteSelection(stateRef.current, { socket: ws, roomId: id });
      setHasSelection(false);
      renderRef.current();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="flex items-center gap-2.5 text-sm text-[var(--color-muted-foreground)]">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
          </svg>
          Connecting to room…
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[var(--color-background)]">
      <RoomHeader slug={slug} connected={connected} />

      <Toolbar
        activeTool={tool}
        onTool={setTool}
        hasSelection={hasSelection}
        onDelete={handleDelete}
        scale={scaleDisplay}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
      />

      {/* Canvas layer */}
      <div className="absolute inset-0 pt-14">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}
