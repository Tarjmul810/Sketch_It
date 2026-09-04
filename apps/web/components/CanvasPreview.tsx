/**
 * Static CSS-only product mockup.
 * Shows a realistic board with shapes, collaborators, and tool palette.
 * No animation — this is a product screenshot, not a demo.
 */

export default function CanvasPreview() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] shadow-xl"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* ---------- Top bar ---------- */}
      <div className="flex h-9 items-center gap-3 border-b border-[var(--color-border)] px-3 text-xs">
        {/* Window chrome */}
        <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-muted)]" />
        <span className="mr-2 h-2 w-2 rounded-full bg-[var(--color-muted)]" />

        {/* Board name */}
        <span className="font-medium text-[var(--color-foreground)]">Q3 roadmap</span>
        <span className="text-[var(--color-muted-foreground)]">· 3 collaborators</span>

        {/* Collaborator avatars */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {/* Avatar: Ana */}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e05a3a] text-[9px] font-semibold text-white">
              A
            </span>
            <span className="text-[var(--color-muted-foreground)]">Ana</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex items-center gap-1.5">
            {/* Avatar: Wei */}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7c6fe0] text-[9px] font-semibold text-white">
              W
            </span>
            <span className="text-[var(--color-muted-foreground)]">Wei</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex items-center gap-1.5">
            {/* Avatar: Priya */}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e08a3a] text-[9px] font-semibold text-white">
              P
            </span>
            <span className="text-[var(--color-muted-foreground)]">Priya</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#e0a83a]" />
          </div>
        </div>
      </div>

      {/* ---------- Main area ---------- */}
      <div className="flex" style={{ height: 380 }}>
        {/* ---------- Tool palette ---------- */}
        <div className="flex w-11 flex-col items-center gap-1 border-r border-[var(--color-border)] py-2">
          {[
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l14 9-7 2-4 6z" />
                </svg>
              ),
              label: "Select",
              active: false,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              ),
              label: "Pen",
              active: true,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              ),
              label: "Rect",
              active: false,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              ),
              label: "Circle",
              active: false,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              ),
              label: "Arrow",
              active: false,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              ),
              label: "Text",
              active: false,
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
                  <path d="M15 3v6h6" />
                </svg>
              ),
              label: "Sticky",
              active: false,
            },
          ].map((tool) => (
            <button
              key={tool.label}
              title={tool.label}
              className={`group flex h-8 w-8 items-center justify-center rounded transition-colors ${
                tool.active
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {tool.icon}
            </button>
          ))}

          {/* Divider */}
          <div className="my-1 h-px w-6 bg-[var(--color-border)]" />

          {/* Zoom controls */}
          <button
            title="Zoom out"
            className="flex h-8 w-8 items-center justify-center rounded text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35M8 11h6" />
            </svg>
          </button>
          <span className="text-[10px] text-[var(--color-muted-foreground)]">100%</span>
          <button
            title="Zoom in"
            className="flex h-8 w-8 items-center justify-center rounded text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </button>
        </div>

        {/* ---------- Canvas area ---------- */}
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

          {/* Canvas content — positioned shapes and cursors */}
          <div className="absolute inset-0">

            {/* Arrow shape (top area) */}
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
              />
              <path
                d="M200 20 L 216 30 L 200 40"
                stroke="var(--color-brand)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            {/* Rectangle shape */}
            <div
              className="absolute overflow-hidden rounded"
              style={{
                left: 56,
                top: 100,
                width: 180,
                height: 100,
                background: "var(--color-card)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              <div className="border-b border-[var(--color-border)] bg-[var(--color-secondary)] px-2 py-1.5">
                <span className="text-[10px] font-medium text-[var(--color-foreground)]">Design phase</span>
              </div>
              <div className="p-2">
                <p className="text-[10px] leading-relaxed text-[var(--color-muted-foreground)]">
                  Wireframe for the new onboarding flow. Next step: high-fidelity mockups.
                </p>
              </div>
            </div>

            {/* Circle shape */}
            <div
              className="absolute flex items-center justify-center rounded-full"
              style={{
                left: 280,
                top: 120,
                width: 80,
                height: 80,
                background: "var(--color-card)",
                border: "1.5px solid var(--color-border)",
              }}
            >
              <div className="text-center">
                <p className="text-xs font-semibold text-[var(--color-foreground)]">75%</p>
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
              />
            </svg>

            {/* Cursor: Ana (actively drawing) */}
            <div className="absolute" style={{ left: 268, top: 136 }}>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path
                  d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
                  fill="#e05a3a"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              <span
                className="absolute left-3 top-4 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
                style={{ background: "#e05a3a" }}
              >
                Ana
              </span>
            </div>

            {/* Cursor: Wei */}
            <div className="absolute" style={{ left: 180, top: 260 }}>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path
                  d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
                  fill="#7c6fe0"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              <span
                className="absolute left-3 top-4 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
                style={{ background: "#7c6fe0" }}
              >
                Wei
              </span>
            </div>

            {/* Cursor: Priya */}
            <div className="absolute" style={{ left: 420, top: 60 }}>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path
                  d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z"
                  fill="#e08a3a"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              <span
                className="absolute left-3 top-4 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
                style={{ background: "#e08a3a" }}
              >
                Priya
              </span>
            </div>
          </div>
        </div>

        {/* ---------- Collaborator panel (right sidebar) ---------- */}
        <div className="w-44 border-l border-[var(--color-border)] py-2">
          <div className="px-3 pb-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
              People
            </p>
          </div>

          {/* Ana */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e05a3a] text-[9px] font-semibold text-white">
              A
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[11px] font-medium text-[var(--color-foreground)]">Ana</p>
              <p className="text-[9px] text-[var(--color-muted-foreground)]">editing</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </div>

          {/* Wei */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7c6fe0] text-[9px] font-semibold text-white">
              W
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[11px] font-medium text-[var(--color-foreground)]">Wei</p>
              <p className="text-[9px] text-[var(--color-muted-foreground)]">viewing</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </div>

          {/* Priya */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e08a3a] text-[9px] font-semibold text-white">
              P
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[11px] font-medium text-[var(--color-foreground)]">Priya</p>
              <p className="text-[9px] text-[var(--color-muted-foreground)]">idle</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[#e0a83a]" />
          </div>

          {/* Divider */}
          <div className="my-2 mx-3 h-px bg-[var(--color-border)]" />

          {/* Share button */}
          <div className="px-3">
            <button
              className="w-full rounded bg-[var(--color-brand)] px-2 py-1.5 text-[10px] font-medium text-white transition-colors hover:opacity-90"
            >
              Share board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
