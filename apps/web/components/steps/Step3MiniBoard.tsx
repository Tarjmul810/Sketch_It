/**
 * Step3MiniBoard — mini canvas with 3 cursors and live indicator.
 */
import { Card } from "../ui/card";

function Cursor({ name, color, x, y }: { name: string; color: string; x: number; y: number }) {
  return (
    <div className="absolute z-20" style={{ left: x, top: y }}>
      <svg width="10" height="14" viewBox="0 0 16 20" fill="none">
        <path
          d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <span
        className="absolute left-2 top-2.5 whitespace-nowrap rounded px-1 py-0.5 text-[8px] font-medium text-white shadow-sm"
        style={{ background: color }}
      >
        {name}
      </span>
    </div>
  );
}

export function Step3MiniBoard() {
  return (
    <Card className="overflow-hidden border-[var(--color-border)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-muted-foreground)]">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: 180, background: "var(--color-canvas-bg)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Live indicator pill */}
        <div className="absolute right-2.5 top-2 z-30 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1 shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </span>
          <span className="font-ui text-[9px] font-medium text-[var(--color-foreground)]">
            3 drawing
          </span>
        </div>

        {/* Small sticky note */}
        <div
          className="absolute overflow-hidden rounded shadow-sm"
          style={{
            left: 20, top: 40,
            width: 80, height: 55,
            background: "oklch(0.92 0.07 70)",
            border: "1px solid oklch(0.82 0.10 70)",
          }}
        >
          <p className="p-1.5 font-ui text-[8px] leading-snug text-[var(--color-foreground)]">
            Q3 goals
          </p>
        </div>

        {/* Small rectangle */}
        <div
          className="absolute rounded border"
          style={{
            left: 115, top: 60,
            width: 55, height: 32,
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        />

        {/* Small rectangle 2 */}
        <div
          className="absolute rounded border"
          style={{
            left: 185, top: 45,
            width: 70, height: 38,
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        />

        {/* Connector */}
        <svg className="absolute" style={{ left: 100, top: 55, width: 85, height: 50 }} viewBox="0 0 85 50" fill="none">
          <path d="M5 40 C 25 10, 50 45, 80 20" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>

        {/* Cursors */}
        <Cursor name="Ana" color="#e05a3a" x={145} y={85} />
        <Cursor name="Wei" color="#7c6fe0" x={200} y={55} />
        <Cursor name="Priya" color="#e08a3a" x={50} y={105} />
      </div>
    </Card>
  );
}
