/**
 * ExportArtifact — expanded export dialog showing format cards
 * with descriptions, file size estimates, and a settings expander.
 */
import { useState } from "react";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

type Format = "PNG" | "SVG" | "JSON";

const FORMATS: { fmt: Format; desc: string; size: string; recommended?: boolean }[] = [
  { fmt: "PNG", desc: "Raster image, any DPI", size: "≈ 412 KB" },
  { fmt: "SVG", desc: "Vector, editable in Figma", size: "≈ 18 KB", recommended: true },
  { fmt: "JSON", desc: "Native, full round-trip", size: "≈ 6 KB" },
];

const DPI_OPTIONS = ["1x", "2x", "3x"] as const;

export function ExportArtifact() {
  const [selected, setSelected] = useState<Format>("SVG");
  const [showSettings, setShowSettings] = useState(true);
  const [dpi, setDpi] = useState<(typeof DPI_OPTIONS)[number]>("2x");

  return (
    <Card className="overflow-hidden border-[var(--color-border)]">
      {/* Top: canvas preview */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-[var(--color-foreground)]">Onboarding research</span>
          <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">
            24 shapes
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="font-ui text-[10px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
            Cancel
          </button>
        </div>
      </div>

      {/* Canvas preview */}
      <div
        className="relative h-32 overflow-hidden border-b border-[var(--color-border)]"
        style={{ background: "var(--color-canvas-bg)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            opacity: 0.6,
          }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 128" preserveAspectRatio="xMidYMid meet">
          <rect x="40" y="20" width="50" height="30" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
          <circle cx="140" cy="40" r="14" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
          <rect x="190" y="20" width="80" height="40" rx="2" fill="oklch(0.92 0.07 70)" stroke="oklch(0.82 0.10 70)" strokeWidth="1" />
          <rect x="300" y="20" width="60" height="40" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
          <rect x="60" y="80" width="80" height="30" rx="2" fill="oklch(0.92 0.05 220)" stroke="oklch(0.82 0.07 220)" strokeWidth="1" />
          <rect x="170" y="80" width="50" height="30" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" />
          <path d="M90 50 L126 40" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />
          <path d="M154 40 L190 40" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />
          <path d="M270 40 L300 40" stroke="var(--color-muted-foreground)" strokeWidth="0.5" opacity="0.4" />
        </svg>
      </div>

      {/* Format selection */}
      <div className="space-y-1.5 p-3">
        <p className="font-mono-label text-[var(--color-muted-foreground)]">Format</p>
        <div className="space-y-1.5">
          {FORMATS.map((opt) => (
            <button
              key={opt.fmt}
              onClick={() => setSelected(opt.fmt)}
              className={cn(
                "group flex w-full items-center justify-between rounded border p-2 text-left transition-all",
                selected === opt.fmt
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-foreground)]/30"
              )}
            >
              <div className="flex items-center gap-2.5">
                {/* Radio dot */}
                <div
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected === opt.fmt
                      ? "border-[var(--color-brand)]"
                      : "border-[var(--color-border)]"
                  )}
                >
                  {selected === opt.fmt && (
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-ui text-[11px] font-semibold text-[var(--color-foreground)]">
                      {opt.fmt}
                    </p>
                    {opt.recommended && (
                      <span className="font-ui text-[8px] uppercase tracking-wider text-[var(--color-brand)]">
                        · recommended
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">
                    {opt.desc}
                  </p>
                </div>
              </div>
              <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">
                {opt.size}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings expander (PNG only) */}
      {selected === "PNG" && (
        <div className="border-t border-[var(--color-border)] px-3 py-2.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex w-full items-center justify-between text-[11px] font-medium text-[var(--color-foreground)]"
          >
            <span>Settings</span>
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={cn("transition-transform", showSettings && "rotate-180")}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {showSettings && (
            <div className="mt-2 flex items-center justify-between">
              <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">Resolution</span>
              <div className="flex overflow-hidden rounded border border-[var(--color-border)]">
                {DPI_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDpi(d)}
                    className={cn(
                      "px-2 py-1 font-ui text-[10px] transition-colors",
                      dpi === d
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-secondary)]/50 px-3 py-2.5">
        <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">
          Estimated file size: 18 KB
        </span>
        <button className="inline-flex items-center gap-1.5 rounded bg-[var(--color-brand)] px-3 py-1.5 font-ui text-[11px] font-semibold text-white hover:opacity-90">
          Export {selected}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v14M5 10l7 7 7-7" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
