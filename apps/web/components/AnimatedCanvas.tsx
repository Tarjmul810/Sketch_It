"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Self-drawing canvas preview.
 * - Strokes reveal via stroke-dashoffset animation on mount.
 * - Cursors fade in with staggered delays.
 * - Hover replays the path animation.
 */
export default function AnimatedCanvas() {
  const [revealKey, setRevealKey] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Replay the path animation on hover (after a short delay)
  const handleMouseEnter = () => {
    setHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRevealKey((k) => k + 1);
    }, 120);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] shadow-2xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_oklch(0_0_0/0.2)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ───── Top bar ───── */}
      <div className="flex h-9 items-center gap-3 border-b border-[var(--color-border)] px-3 text-xs">
        <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
        <span className="ml-1 font-medium text-[var(--color-foreground)]">
          Q3 roadmap
        </span>
        <span className="text-[var(--color-muted-foreground)]">
          · 3 live
        </span>

        <div className="ml-auto flex items-center gap-2">
          {[
            { letter: "A", color: "#e05a3a" },
            { letter: "W", color: "#7c6fe0" },
            { letter: "P", color: "#e08a3a" },
          ].map((c, i) => (
            <span
              key={c.letter}
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white transition-all duration-500"
              style={{
                background: c.color,
                opacity: 1,
                transitionDelay: `${300 + i * 120}ms`,
                transform: "scale(1)",
              }}
            >
              {c.letter}
            </span>
          ))}
        </div>
      </div>

      {/* ───── Main canvas area ───── */}
      <div className="flex" style={{ height: 380 }}>
        {/* Tool palette */}
        <ToolPalette />

        {/* Drawing surface */}
        <div className="relative flex-1 overflow-hidden">
          {/* Dotted grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <DrawingSurface revealKey={revealKey} />

          {/* Cursors */}
          <Cursor
            name="Ana"
            color="#e05a3a"
            x={268}
            y={136}
            delay={900}
          />
          <Cursor
            name="Wei"
            color="#7c6fe0"
            x={180}
            y={260}
            delay={1100}
          />
          <Cursor
            name="Priya"
            color="#e08a3a"
            x={420}
            y={60}
            delay={1300}
          />
        </div>

        {/* Right sidebar */}
        <PeoplePanel />
      </div>
    </div>
  );
}

/* ───── Tool palette ───── */
function ToolPalette() {
  return (
    <div className="flex w-11 flex-col items-center gap-1 border-r border-[var(--color-border)] py-2">
      {[
        { icon: <CursorIcon />, label: "Select", active: false },
        { icon: <PenIcon />, label: "Pen", active: true },
        { icon: <RectIcon />, label: "Rect", active: false },
        { icon: <CircleIcon />, label: "Circle", active: false },
        { icon: <ArrowIcon />, label: "Arrow", active: false },
        { icon: <TextIcon />, label: "Text", active: false },
        { icon: <StickyIcon />, label: "Sticky", active: false },
      ].map((tool) => (
        <button
          key={tool.label}
          title={tool.label}
          className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
            tool.active
              ? "bg-[var(--color-brand)] text-white"
              : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          }`}
        >
          {tool.icon}
        </button>
      ))}
      <div className="my-1 h-px w-6 bg-[var(--color-border)]" />
      <button
        title="Zoom"
        className="flex h-8 w-8 items-center justify-center rounded text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
      >
        <ZoomIcon />
      </button>
      <span className="text-[10px] text-[var(--color-muted-foreground)]">
        100%
      </span>
    </div>
  );
}

/* ───── Animated drawing surface ───── */
function DrawingSurface({ revealKey }: { revealKey: number }) {
  // Pre-calculated path lengths (rough) so we can use stroke-dasharray/offset
  const arrowPathLength = 280;
  const freehandLength = 320;
  const stickyPathLength = 0;

  return (
    <div key={revealKey} className="absolute inset-0">
      {/* Arrow path — draws itself */}
      <svg
        className="absolute"
        style={{ left: 48, top: 32, width: 220, height: 60 }}
        viewBox="0 0 220 60"
        fill="none"
      >
        <path
          d="M4 30 C 40 10, 80 50, 120 30 S 180 10, 216 30"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={arrowPathLength}
          strokeDashoffset={arrowPathLength}
          style={{
            animation: `draw 1.2s 0.2s ease-out forwards`,
          }}
        />
        <path
          d="M200 20 L 216 30 L 200 40"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            opacity: 0,
            animation: "fadeIn 0.4s 1.3s ease-out forwards",
          }}
        />
      </svg>

      {/* Rectangle card */}
      <div
        className="absolute overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)]"
        style={{
          left: 56,
          top: 100,
          width: 180,
          height: 100,
          opacity: 0,
          transform: "translateY(8px) scale(0.96)",
          animation: "pop 0.5s 0.6s ease-out forwards",
        }}
      >
        <div className="border-b border-[var(--color-border)] bg-[var(--color-secondary)] px-2 py-1.5">
          <span className="text-[10px] font-medium text-[var(--color-foreground)]">
            Design phase
          </span>
        </div>
        <div className="p-2">
          <p className="text-[10px] leading-relaxed text-[var(--color-muted-foreground)]">
            Wireframe for the new onboarding flow. Next step: high-fidelity mockups.
          </p>
        </div>
      </div>

      {/* Circle */}
      <div
        className="absolute flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]"
        style={{
          left: 280,
          top: 120,
          width: 80,
          height: 80,
          opacity: 0,
          transform: "scale(0.5)",
          animation: "pop 0.5s 0.8s ease-out forwards",
        }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold text-[var(--color-foreground)]">
            75%
          </p>
          <p className="text-[9px] text-[var(--color-muted-foreground)]">done</p>
        </div>
      </div>

      {/* Sticky note */}
      <div
        className="absolute overflow-hidden rounded shadow-sm"
        style={{
          left: 400,
          top: 40,
          width: 130,
          height: 90,
          background: "oklch(0.90 0.06 70)",
          border: "1px solid oklch(0.80 0.08 70)",
          opacity: 0,
          transform: "translateY(-8px) rotate(-2deg)",
          animation: "pop 0.6s 1.0s ease-out forwards",
        }}
      >
        <div className="p-2">
          <p className="text-[10px] leading-relaxed text-[var(--color-foreground)]">
            Add export to SVG in v2.1
          </p>
        </div>
      </div>

      {/* Freehand stroke */}
      <svg
        className="absolute"
        style={{ left: 40, top: 240, width: 280, height: 80 }}
        viewBox="0 0 280 80"
        fill="none"
      >
        <path
          d="M4 50 C 20 20, 50 10, 80 30 S 130 60, 160 40 S 210 10, 240 30 S 270 50, 276 45"
          stroke="var(--color-muted-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          strokeDasharray={freehandLength}
          strokeDashoffset={freehandLength}
          style={{
            animation: "draw 1.4s 1.2s ease-out forwards",
          }}
        />
      </svg>

      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes pop {
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ───── Cursor with name tag ───── */
function Cursor({
  name,
  color,
  x,
  y,
  delay,
}: {
  name: string;
  color: string;
  x: number;
  y: number;
  delay: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        opacity: 0,
        transform: "translate(-4px, -4px)",
        animation: `cursorIn 0.4s ${delay}ms ease-out forwards`,
      }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path
          d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <span
        className="absolute left-3 top-3 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
        style={{ background: color }}
      >
        {name}
      </span>
      <style>{`
        @keyframes cursorIn {
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}

/* ───── People panel (right) ───── */
function PeoplePanel() {
  return (
    <div className="w-44 border-l border-[var(--color-border)] py-2">
      <div className="px-3 pb-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
          People
        </p>
      </div>

      {[
        { letter: "A", name: "Ana", role: "editing", color: "#e05a3a", live: true },
        { letter: "W", name: "Wei", role: "viewing", color: "#7c6fe0", live: true },
        { letter: "P", name: "Priya", role: "idle", color: "#e08a3a", live: false },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-2 px-3 py-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ background: p.color }}
          >
            {p.letter}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11px] font-medium text-[var(--color-foreground)]">
              {p.name}
            </p>
            <p className="text-[9px] text-[var(--color-muted-foreground)]">
              {p.role}
            </p>
          </div>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              p.live ? "bg-[#22c55e]" : "bg-[#e0a83a]"
            }`}
          />
        </div>
      ))}

      <div className="my-2 mx-3 h-px bg-[var(--color-border)]" />

      <div className="px-3">
        <button className="w-full rounded bg-[var(--color-brand)] px-2 py-1.5 text-[10px] font-medium text-white transition-all hover:opacity-90 active:scale-95">
          Share board
        </button>
      </div>
    </div>
  );
}

/* ───── Icons ───── */
function CursorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-7 2-4 6z" />
    </svg>
  );
}
function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}
function RectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}
function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function StickyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
      <path d="M15 3v6h6" />
    </svg>
  );
}
function ZoomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}
