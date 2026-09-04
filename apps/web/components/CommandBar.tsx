"use client";

import { useEffect, useState } from "react";

/**
 * Search command affordance. Shows ⌘K shortcut hint.
 * On macOS, shows ⌘K. On Windows/Linux, shows Ctrl K.
 */
export function CommandBar() {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    if (!isMac) setShortcut("Ctrl K");
  }, []);

  return (
    <button
      type="button"
      className="group hidden h-9 items-center gap-3 rounded border border-[var(--color-border)] bg-[var(--color-secondary)]/50 px-3 text-sm text-[var(--color-muted-foreground)] transition-all duration-200 hover:border-[var(--color-border)] hover:bg-[var(--color-secondary)] md:inline-flex"
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="hidden lg:inline">Search boards, templates…</span>
      <span
        className="font-ui ml-auto inline-flex h-5 items-center rounded border border-[var(--color-border)] bg-[var(--color-background)] px-1.5 text-[10px] font-medium text-[var(--color-muted-foreground)]"
      >
        {shortcut}
      </span>
    </button>
  );
}
