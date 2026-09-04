/**
 * CanvasArtifact — zoomed-out infinite canvas with viewport indicator,
 * minimap, zoom controls, and a layers list.
 */
import { Card } from "../ui/card";

export function CanvasArtifact() {
  return (
    <Card className="overflow-hidden border-[var(--color-border)]">
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-[var(--color-foreground)]">Onboarding research</span>
          <span className="font-ui text-[var(--color-muted-foreground)]">·</span>
          <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">
            24 shapes · saved 2m ago
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <button className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 320 }}>
        {/* Main canvas — zoomed out view */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ background: "var(--color-canvas-bg)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.6,
            }}
          />

          {/* Tiny shapes scattered across the zoomed-out canvas */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
            {/* Rectangle 1 */}
            <rect x="40" y="40" width="40" height="30" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
            {/* Circle */}
            <circle cx="120" cy="60" r="14" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
            {/* Sticky 1 */}
            <rect x="180" y="30" width="34" height="34" rx="1" fill="oklch(0.92 0.07 70)" stroke="oklch(0.82 0.10 70)" strokeWidth="1" />
            {/* Rectangle 2 */}
            <rect x="240" y="50" width="50" height="25" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />

            {/* Connector lines (showing the network) */}
            <path d="M80 55 L106 60" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />
            <path d="M134 60 L180 50" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />
            <path d="M214 50 L240 62" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />

            {/* Sticky 2 */}
            <rect x="40" y="200" width="40" height="30" rx="1" fill="oklch(0.92 0.05 220)" stroke="oklch(0.82 0.07 220)" strokeWidth="1" />
            {/* Circle 2 */}
            <circle cx="140" cy="220" r="12" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
            {/* Rectangle 3 */}
            <rect x="200" y="200" width="60" height="40" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
            <text x="205" y="215" fontSize="6" fontFamily="ui-monospace" fill="var(--color-muted-foreground)">
              user flow v3
            </text>
            <text x="205" y="225" fontSize="6" fontFamily="ui-monospace" fill="var(--color-muted-foreground)">
              · 3 steps
            </text>
          </svg>

          {/* Viewport indicator (the "you are here" rectangle) */}
          <div
            className="absolute"
            style={{
              left: 280, top: 90, width: 220, height: 130,
              border: "2px solid var(--color-brand)",
              borderRadius: 4,
              background: "var(--color-brand)",
              opacity: 0.08,
            }}
          />
          <div
            className="pointer-events-none absolute"
            style={{ left: 280, top: 222 }}
          >
            <span className="font-ui text-[9px] font-medium text-[var(--color-brand)]">
              you are here
            </span>
          </div>

          {/* Zoom controls (bottom-left) */}
          <div className="absolute bottom-3 left-3 flex items-center overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)]">
            <button className="flex h-7 w-7 items-center justify-center text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="font-ui border-x border-[var(--color-border)] px-2 py-1.5 text-[10px] font-medium text-[var(--color-foreground)]">
              40%
            </span>
            <button className="flex h-7 w-7 items-center justify-center text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Fit button (bottom-left, next to zoom) */}
          <button className="absolute bottom-3 left-[120px] flex h-7 items-center gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-card)] px-2 font-ui text-[10px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
            </svg>
            Fit
          </button>
        </div>

        {/* Right rail: layers + minimap */}
        <div className="w-44 border-l border-[var(--color-border)]">
          {/* Layers */}
          <div className="border-b border-[var(--color-border)] py-2.5">
            <div className="flex items-center justify-between px-3 pb-1.5">
              <p className="font-mono-label text-[var(--color-muted-foreground)]">Layers</p>
              <button className="font-ui text-[10px] text-[var(--color-brand)] hover:underline">
                + Add
              </button>
            </div>
            {[
              { name: "Research notes", count: 12, active: true },
              { name: "User flow", count: 8 },
              { name: "Sticky notes", count: 4 },
            ].map((layer) => (
              <div
                key={layer.name}
                className={`flex items-center gap-2 px-3 py-1.5 text-[11px] ${
                  layer.active ? "bg-[var(--color-secondary)]" : ""
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2 L20 6 L12 10 L4 6 Z" />
                  <path d="M4 12 L12 16 L20 12" />
                  <path d="M4 18 L12 22 L20 18" />
                </svg>
                <span className="flex-1 truncate text-[var(--color-foreground)]">{layer.name}</span>
                <span className="font-ui text-[9px] text-[var(--color-muted-foreground)]">
                  {layer.count}
                </span>
              </div>
            ))}
          </div>

          {/* Minimap */}
          <div className="p-3">
            <p className="font-mono-label mb-2 text-[var(--color-muted-foreground)]">Overview</p>
            <div
              className="relative h-20 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-canvas-bg)]"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />
              <div className="absolute" style={{ left: 8, top: 4, width: 6, height: 5, background: "var(--color-card)", borderRadius: 0.5, border: "0.5px solid var(--color-border)" }} />
              <div className="absolute" style={{ left: 16, top: 8, width: 8, height: 4, background: "oklch(0.92 0.07 70)", borderRadius: 0.5 }} />
              <div className="absolute" style={{ left: 28, top: 6, width: 10, height: 6, background: "var(--color-card)", borderRadius: 0.5, border: "0.5px solid var(--color-border)" }} />
              <div className="absolute" style={{ left: 6, top: 14, width: 8, height: 5, background: "oklch(0.92 0.05 220)", borderRadius: 0.5 }} />
              <div className="absolute" style={{ left: 22, top: 14, width: 14, height: 5, background: "var(--color-card)", borderRadius: 0.5, border: "0.5px solid var(--color-border)" }} />
              {/* Viewport indicator on minimap */}
              <div
                className="absolute"
                style={{
                  left: 18, top: 10, width: 18, height: 9,
                  border: "1px solid var(--color-brand)", borderRadius: 0.5,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
