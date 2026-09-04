"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/* ─────────────────────────────────────────────────────────────
   Logo
───────────────────────────────────────────────────────────── */
function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-label="Sketcha">
        <path
          d="M6 22 C 6 14, 14 6, 22 6 L 26 6 L 26 10 C 26 18, 18 26, 10 26 L 6 26 Z"
          fill="oklch(0.58 0.20 28)"
        />
        <circle cx="22" cy="10" r="2.2" fill="oklch(0.985 0.003 240)" />
      </svg>
      <span className="font-section text-[1.05rem] font-semibold tracking-tight text-[var(--color-foreground)]">
        Sketcha
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Right panel
   Composition (top → bottom):
     1. Tiny mono label  "sketcha.app · live"
     2. Centered canvas artifact (the only big visual)
     3. Small attribution line
───────────────────────────────────────────────────────────── */
function RightPanel() {
  return (
    <aside
      className="relative hidden h-full overflow-hidden lg:block"
      style={{
        background: "oklch(0.985 0.003 240)",
        // dark mode falls through to the page background — keeps the panel calm
      }}
    >
      {/* Faint dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.85 0.005 240) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.5,
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-10">
        {/* Top: status pill */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          </span>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
            sketcha.app · live
          </span>
        </div>

        {/* Center: the artifact */}
        <div className="flex flex-1 items-center justify-center py-8">
          <BoardArtifact />
        </div>

        {/* Bottom: caption + page meta */}
        <div className="space-y-3">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">
            Example board · Q3 roadmap
          </p>
          <div className="flex items-center gap-2">
            {["A", "W", "P"].map((letter, i) => (
              <span
                key={letter}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-[var(--color-background)]"
                style={{ background: ["#e05a3a", "#7c6fe0", "#e08a3a"][i] }}
              >
                {letter}
              </span>
            ))}
            <span className="font-mono-label text-[10px] text-[var(--color-muted-foreground)]">
              3 collaborators
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   The artifact: a single, polished board preview
   Card with window chrome, real-looking canvas content,
   cursors positioned naturally.
───────────────────────────────────────────────────────────── */
function BoardArtifact() {
  return (
    <div className="relative w-full max-w-[440px]">
      {/* Soft shadow */}
      <div
        className="absolute -inset-3 -z-10 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.20 28 / 0.08), transparent 70%)",
        }}
      />

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.01_240)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.01_240)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.01_240)]" />
            <span className="ml-2 font-mono-label text-[10px] text-[var(--color-muted-foreground)]">
              Q3 roadmap · 24 shapes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span className="font-mono-label text-[9px] text-[var(--color-muted-foreground)]">
              saved 2m ago
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="relative h-[340px] overflow-hidden"
          style={{
            background: "var(--color-canvas-bg, oklch(0.99 0.002 240))",
            backgroundImage:
              "radial-gradient(circle, oklch(0.88 0.006 240) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 440 340"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Group: Q3 Goals (top-left) */}
            <rect
              x="32"
              y="40"
              width="78"
              height="50"
              rx="3"
              fill="var(--color-card)"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />
            <text
              x="42"
              y="62"
              fontSize="8"
              fontFamily="ui-monospace"
              fill="var(--color-foreground)"
              opacity="0.85"
            >
              Q3 goals
            </text>
            <text
              x="42"
              y="76"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="var(--color-muted-foreground)"
            >
              3 items
            </text>

            {/* Sticky — yellow */}
            <rect
              x="148"
              y="34"
              width="64"
              height="58"
              rx="2"
              fill="oklch(0.93 0.10 80)"
              stroke="oklch(0.82 0.12 80)"
              strokeWidth="1"
            />
            <text
              x="156"
              y="56"
              fontSize="8"
              fontFamily="ui-monospace"
              fill="oklch(0.20 0.05 70)"
            >
              export v2
            </text>
            <text
              x="156"
              y="68"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="oklch(0.25 0.06 70)"
              opacity="0.7"
            >
              ship by Aug
            </text>
            <text
              x="156"
              y="80"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="oklch(0.25 0.06 70)"
              opacity="0.5"
            >
              Ana • Wei
            </text>

            {/* Circle */}
            <circle
              cx="262"
              cy="62"
              r="20"
              fill="var(--color-card)"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />

            {/* Sticky — blue */}
            <rect
              x="320"
              y="36"
              width="58"
              height="48"
              rx="2"
              fill="oklch(0.92 0.05 230)"
              stroke="oklch(0.80 0.07 230)"
              strokeWidth="1"
            />
            <text
              x="328"
              y="58"
              fontSize="8"
              fontFamily="ui-monospace"
              fill="oklch(0.22 0.05 230)"
            >
              research
            </text>
            <text
              x="328"
              y="70"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="oklch(0.25 0.05 230)"
              opacity="0.7"
            >
              interviews
            </text>

            {/* Connectors top row */}
            <path
              d="M110 65 L148 65"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M212 65 L242 65"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M282 65 L320 60"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Connector down */}
            <path
              d="M180 92 Q 180 140 220 165"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mid: user flow rectangle */}
            <rect
              x="100"
              y="200"
              width="120"
              height="60"
              rx="3"
              fill="var(--color-card)"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />
            <text
              x="112"
              y="222"
              fontSize="9"
              fontFamily="ui-monospace"
              fill="var(--color-foreground)"
              opacity="0.85"
            >
              user flow v3
            </text>
            <text
              x="112"
              y="236"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="var(--color-muted-foreground)"
            >
              4 steps · 2 versions
            </text>
            {/* Tiny step indicator */}
            <rect x="112" y="244" width="40" height="3" rx="1.5" fill="oklch(0.58 0.20 28)" />
            <rect x="156" y="244" width="40" height="3" rx="1.5" fill="oklch(0.88 0.01 240)" />
            <rect x="200" y="244" width="14" height="3" rx="1.5" fill="oklch(0.88 0.01 240)" />

            {/* Sticky — pink */}
            <rect
              x="260"
              y="200"
              width="58"
              height="50"
              rx="2"
              fill="oklch(0.93 0.05 0)"
              stroke="oklch(0.82 0.08 0)"
              strokeWidth="1"
            />
            <text
              x="268"
              y="222"
              fontSize="8"
              fontFamily="ui-monospace"
              fill="oklch(0.22 0.06 0)"
            >
              A/B test
            </text>
            <text
              x="268"
              y="234"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="oklch(0.25 0.06 0)"
              opacity="0.7"
            >
              2 variants
            </text>

            {/* Circle 2 — large milestone */}
            <circle
              cx="370"
              cy="225"
              r="22"
              fill="var(--color-card)"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />
            <text
              x="362"
              y="228"
              fontSize="7"
              fontFamily="ui-monospace"
              fill="var(--color-foreground)"
              opacity="0.7"
            >
              v2.1
            </text>

            {/* Connector right */}
            <path
              d="M220 230 L260 225"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M318 225 L348 225"
              stroke="oklch(0.58 0.20 28 / 0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Cursor — Ana (writing on yellow sticky) */}
          <div className="absolute" style={{ left: "34%", top: "12%" }}>
            <svg width="11" height="14" viewBox="0 0 16 20" fill="none">
              <path d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z" fill="#e05a3a" stroke="white" strokeWidth="1" />
            </svg>
            <span
              className="absolute left-2 top-2 whitespace-nowrap rounded px-1 py-0.5 text-[8px] font-semibold text-white"
              style={{ background: "#e05a3a" }}
            >
              Ana
            </span>
          </div>

          {/* Cursor — Wei (pointing at circle) */}
          <div className="absolute" style={{ left: "55%", top: "11%" }}>
            <svg width="11" height="14" viewBox="0 0 16 20" fill="none">
              <path d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z" fill="#7c6fe0" stroke="white" strokeWidth="1" />
            </svg>
            <span
              className="absolute left-2 top-2 whitespace-nowrap rounded px-1 py-0.5 text-[8px] font-semibold text-white"
              style={{ background: "#7c6fe0" }}
            >
              Wei
            </span>
          </div>

          {/* Cursor — Priya (mid-canvas, on user flow) */}
          <div className="absolute" style={{ left: "32%", top: "65%" }}>
            <svg width="11" height="14" viewBox="0 0 16 20" fill="none">
              <path d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z" fill="#e08a3a" stroke="white" strokeWidth="1" />
            </svg>
            <span
              className="absolute left-2 top-2 whitespace-nowrap rounded px-1 py-0.5 text-[8px] font-semibold text-white"
              style={{ background: "#e08a3a" }}
            >
              Priya
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Form primitives
───────────────────────────────────────────────────────────── */
type AuthFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  id: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  error?: string;
  rightSlot?: ReactNode;
};

export function AuthField({
  label,
  type = "text",
  placeholder,
  id,
  autoComplete,
  value,
  onChange,
  hint,
  error,
  rightSlot,
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-[var(--color-foreground)]">{label}</span>
        {rightSlot}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-md border bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-colors",
          error
            ? "border-[oklch(0.55_0.20_25)] focus:border-[oklch(0.55_0.20_25)] focus:ring-2 focus:ring-[oklch(0.55_0.20_25_/_0.15)]"
            : "border-[var(--color-border)] focus:border-[oklch(0.58_0.20_28)] focus:ring-2 focus:ring-[oklch(0.58_0.20_28_/_0.15)]"
        )}
      />
      {(hint || error) && (
        <p
          className={cn(
            "mt-1.5 text-[11px]",
            error ? "text-[oklch(0.55_0.20_25)]" : "text-[var(--color-muted-foreground)]"
          )}
        >
          {error || hint}
        </p>
      )}
    </label>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shell
───────────────────────────────────────────────────────────── */
type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* LEFT — form column */}
      <main className="flex flex-col bg-[var(--color-background)]">
        <div className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-6 lg:px-10">
          <Logo />
          <a
            href="#"
            className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Need help?
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-[360px]">
            <p className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.14em] text-[oklch(0.58_0.20_28)]">
              {eyebrow}
            </p>
            <h1 className="font-display text-[clamp(1.875rem,3.5vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--color-foreground)]">
              {title}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {subtitle}
            </p>

            <div className="mt-8 space-y-4">{children}</div>

            <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
              {footer}
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] px-6 py-4 lg:px-10">
          <p className="text-center text-[11px] text-[var(--color-muted-foreground)]">
            By continuing you agree to our{" "}
            <a href="#" className="text-[var(--color-foreground)] underline-offset-4 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[var(--color-foreground)] underline-offset-4 hover:underline">
              Privacy
            </a>
            .
          </p>
        </div>
      </main>

      {/* RIGHT — product artifact */}
      <RightPanel />
    </div>
  );
}
