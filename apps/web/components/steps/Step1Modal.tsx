/**
 * Step1Modal — "New board" modal with input and visibility dropdown.
 */
import { Card } from "../ui/card";

export function Step1Modal() {
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

      {/* Modal body */}
      <div className="flex flex-col items-center justify-center gap-5 p-6" style={{ background: "var(--color-canvas-bg)" }}>
        <div className="w-full max-w-[280px] space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[var(--color-foreground)]">New board</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)]">Start a fresh canvas</p>
          </div>

          {/* Board name input */}
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">Board name</label>
            <div className="overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)]">
              <input
                type="text"
                defaultValue="Untitled board"
                className="w-full px-3 py-2 text-[12px] text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">Who can view</label>
            <div className="flex gap-1.5">
              {["Private", "Team", "Public"].map((v) => (
                <button
                  key={v}
                  className={`flex-1 rounded border py-1.5 text-[10px] font-medium transition-colors ${
                    v === "Team"
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-foreground)]/30"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Create button */}
          <button className="w-full rounded bg-[var(--color-brand)] py-2.5 text-[12px] font-semibold text-white transition-all hover:opacity-90">
            Create board
          </button>
        </div>
      </div>
    </Card>
  );
}
