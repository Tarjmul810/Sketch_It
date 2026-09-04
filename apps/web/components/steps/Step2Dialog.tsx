/**
 * Step2Dialog — share dialog with copied link + email + role chips.
 */
import { useState } from "react";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

export function Step2Dialog() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ROLES = [
    { label: "Viewer", desc: "Can view only" },
    { label: "Editor", desc: "Can draw & edit" },
    { label: "Admin", desc: "Full access" },
  ];

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

      {/* Dialog body */}
      <div className="flex flex-col items-center justify-center gap-5 p-6" style={{ background: "var(--color-canvas-bg)" }}>
        <div className="w-full max-w-[280px] space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[var(--color-foreground)]">Share board</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)]">Invite collaborators</p>
          </div>

          {/* Copy link */}
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">Share link</label>
            <div className="flex overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)]">
              <input
                type="text"
                defaultValue="sketcha.app/b/x7k2m"
                readOnly
                className="min-w-0 flex-1 truncate px-3 py-2 text-[11px] text-[var(--color-foreground)] outline-none"
              />
              <button
                onClick={handleCopy}
                className={cn(
                  "flex shrink-0 items-center gap-1 border-l border-[var(--color-border)] px-3 py-2 text-[10px] font-medium transition-all",
                  copied
                    ? "text-[#22c55e]"
                    : "text-[var(--color-brand)] hover:bg-[var(--color-secondary)]"
                )}
              >
                {copied ? (
                  <>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </div>

          {/* Invite by email */}
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">Invite by email</label>
            <div className="flex gap-1.5">
              <div className="flex-1 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@studio.co"
                  className="w-full px-3 py-2 text-[11px] text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
                />
              </div>
              <button className="shrink-0 rounded bg-[var(--color-brand)] px-3 py-2 text-[11px] font-semibold text-white transition-all hover:opacity-90">
                Invite
              </button>
            </div>
          </div>

          {/* Role chips */}
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">Role</label>
            <div className="flex gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.label}
                  className="flex-1 rounded border border-[var(--color-border)] bg-[var(--color-card)] py-1.5 text-center transition-colors hover:border-[var(--color-foreground)]/30"
                >
                  <p className="text-[10px] font-semibold text-[var(--color-foreground)]">{r.label}</p>
                  <p className="text-[8px] text-[var(--color-muted-foreground)]">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
