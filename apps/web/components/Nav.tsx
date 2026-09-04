"use client";

import { cn } from "../lib/utils";
import { useScrollY } from "../hooks/useScrollY";

export function Nav() {
  const scrollY = useScrollY();
  const scrolled = scrollY > 40;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--color-background)]/65"
          : "border-[var(--color-border)] bg-[var(--color-background)]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-label="Sketcha">
            <path
              d="M6 22 C 6 14, 14 6, 22 6 L 26 6 L 26 10 C 26 18, 18 26, 10 26 L 6 26 Z"
              fill="oklch(0.58 0.20 28)"
            />
            <circle cx="22" cy="10" r="2.2" fill="var(--color-background)" />
          </svg>
          <span className="font-section text-[1.05rem] font-semibold tracking-tight text-[var(--color-foreground)]">
            Sketcha
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 text-sm text-[var(--color-muted-foreground)] md:flex">
          <a href="#capabilities" className="transition-colors hover:text-[var(--color-foreground)]">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-[var(--color-foreground)]">
            How it works
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href="/auth/signin"
            className="hidden rounded px-3 py-1.5 text-sm text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)] sm:block"
          >
            Sign in
          </a>
          <a
            href="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[oklch(0.58_0.20_28)] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:opacity-80"
          >
            Open canvas
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
