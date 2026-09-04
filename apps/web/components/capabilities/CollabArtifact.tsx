/**
 * CollabArtifact — full board with 3 cursors, sticky note,
 * labeled arrow, and a chat thread at the bottom.
 */
import { Card } from "../ui/card";

function Cursor({ name, color, x, y, label }: { name: string; color: string; x: number; y: number; label?: string }) {
  return (
    <div className="absolute z-20" style={{ left: x, top: y }}>
      <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
        <path
          d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <span
        className="absolute left-2.5 top-3 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white shadow-sm"
        style={{ background: color }}
      >
        {name}
        {label && `: ${label}`}
      </span>
    </div>
  );
}

export function CollabArtifact() {
  return (
    <Card className="overflow-hidden border-[var(--color-border)]">
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
          </div>
          <span className="font-medium text-[var(--color-foreground)]">Q3 roadmap</span>
          <span className="text-[var(--color-muted-foreground)]">·</span>
          <span className="text-[var(--color-muted-foreground)]">3 people drawing</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { letter: "A", color: "#e05a3a" },
            { letter: "W", color: "#7c6fe0" },
            { letter: "P", color: "#e08a3a" },
          ].map((c) => (
            <span
              key={c.letter}
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-[var(--color-card)]"
              style={{ background: c.color }}
            >
              {c.letter}
            </span>
          ))}
        </div>
      </div>

      {/* Canvas body */}
      <div className="flex" style={{ height: 320 }}>
        {/* Main canvas */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ background: "var(--color-canvas-bg)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Labeled arrow with text */}
          <svg
            className="absolute"
            style={{ left: 60, top: 50, width: 220, height: 90 }}
            viewBox="0 0 220 90"
            fill="none"
          >
            <path
              d="M4 70 C 40 30, 80 80, 120 50 S 180 20, 210 45"
              stroke="#e05a3a"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M196 35 L 210 45 L 198 55"
              stroke="#e05a3a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x="40"
              y="22"
              fontSize="9"
              fontFamily="ui-monospace"
              fill="#e05a3a"
              opacity="0.85"
            >
              ship path →
            </text>
          </svg>

          {/* Sticky note */}
          <div
            className="absolute overflow-hidden rounded shadow-sm"
            style={{
              left: 300,
              top: 30,
              width: 130,
              height: 90,
              background: "oklch(0.92 0.07 70)",
              border: "1px solid oklch(0.82 0.10 70)",
            }}
          >
            <p className="p-2 font-ui text-[10px] leading-snug text-[var(--color-foreground)]">
              Don't forget export
              <br />
              to SVG in v2.1
            </p>
          </div>

          {/* Sticky note 2 */}
          <div
            className="absolute overflow-hidden rounded shadow-sm"
            style={{
              left: 60,
              top: 200,
              width: 110,
              height: 70,
              background: "oklch(0.92 0.05 220)",
              border: "1px solid oklch(0.82 0.07 220)",
            }}
          >
            <p className="p-2 font-ui text-[10px] leading-snug text-[var(--color-foreground)]">
              Onboarding
              <br />
              research
            </p>
          </div>

          {/* Cursors */}
          <Cursor name="Ana" color="#e05a3a" x={140} y={108} label="drawing" />
          <Cursor name="Wei" color="#7c6fe0" x={275} y={48} />
          <Cursor name="Priya" color="#e08a3a" x={90} y={218} label="writing" />

          {/* Chat thread (bottom-left) */}
          <div className="absolute bottom-3 left-3 z-10 max-w-[230px] rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-md">
            <div className="flex items-start gap-2">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: "#e05a3a" }}
              >
                A
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-semibold text-[var(--color-foreground)]">Ana</span>
                  <span className="font-ui text-[9px] text-[var(--color-muted-foreground)]">just now</span>
                </div>
                <p className="text-[10px] leading-snug text-[var(--color-foreground)]">
                  What about the export flow?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail: people */}
        <div className="w-40 border-l border-[var(--color-border)] py-2.5">
          <div className="px-3 pb-2">
            <p className="font-mono-label text-[var(--color-muted-foreground)]">
              People · 3
            </p>
          </div>
          {[
            { letter: "A", name: "Ana", role: "editing", color: "#e05a3a", live: true },
            { letter: "W", name: "Wei", role: "viewing", color: "#7c6fe0", live: true },
            { letter: "P", name: "Priya", role: "writing", color: "#e08a3a", live: true },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-2 px-3 py-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: p.color }}
              >
                {p.letter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-[var(--color-foreground)]">
                  {p.name}
                </p>
                <p className="font-ui text-[9px] text-[var(--color-muted-foreground)]">
                  {p.role}
                </p>
              </div>
              {p.live && <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />}
            </div>
          ))}
          <div className="mx-3 my-2 h-px bg-[var(--color-border)]" />
          <div className="px-3">
            <button className="w-full rounded bg-[var(--color-brand)] px-2 py-1.5 font-ui text-[10px] font-medium text-white transition-all hover:opacity-90">
              + Invite
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
