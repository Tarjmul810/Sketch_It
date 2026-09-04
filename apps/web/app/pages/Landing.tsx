"use client";

import { useEffect, useState } from "react";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { useInView } from "../../hooks/useInView";
import { useCountUp } from "../../hooks/useCountUp";
import { cn } from "../../lib/utils";
import { CollabArtifact } from "../../components/capabilities/CollabArtifact";
import { CanvasArtifact } from "../../components/capabilities/CanvasArtifact";
import { TemplatesArtifact } from "../../components/capabilities/TemplatesArtifact";
import { ExportArtifact } from "../../components/capabilities/ExportArtifact";
import { Step1Modal } from "../../components/steps/Step1Modal";
import { Step2Dialog } from "../../components/steps/Step2Dialog";
import { Step3MiniBoard } from "../../components/steps/Step3MiniBoard";

/* ─────────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────────── */
function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-16 pb-20">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Left column */}
        <div className="flex flex-col justify-center lg:col-span-7">
          {/* Eyebrow */}
          <div
            className={cn(
              "mb-5 flex items-center gap-2 transition-all duration-500",
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            <span className="font-mono-label text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
              Real-time canvas for teams
            </span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* H1 — Fraunces serif, two lines */}
          <h1
            className={cn(
              "font-display text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--color-foreground)] transition-all duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            Draw together.
            <br />
            <span className="text-[oklch(0.58_0.20_28)]">In real time.</span>
          </h1>

          {/* Subhead */}
          <p
            className={cn(
              "mt-6 max-w-[480px] text-base leading-relaxed text-[var(--color-muted-foreground)] transition-all duration-500",
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            A canvas your whole team can use. Open a board, share the link, and watch
            ideas take shape — together.
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "mt-8 flex flex-wrap items-center gap-4 transition-all duration-500",
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: "420ms" }}
          >
            <a
              href="/dashboard"
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-[oklch(0.58_0.20_28)] px-6 text-base font-semibold text-white shadow-sm transition-all hover:opacity-90 active:opacity-80"
            >
              Open canvas
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex h-12 items-center gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-background)] px-6 text-base font-medium text-[var(--color-foreground)] transition-all hover:bg-[var(--color-secondary)]"
            >
              See how it works
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-y-0.5"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>

          {/* Trust strip */}
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-x-6 gap-y-2 transition-all duration-500",
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: "540ms" }}
          >
            {[
              { check: true, text: "MIT open source" },
              { check: true, text: "No account needed" },
              { check: true, text: "42ms median sync" },
              { check: true, text: "Free for 5 people" },
            ].map((t) => (
              <span key={t.text} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                {t.check && (
                  <svg
                    className="text-[oklch(0.58_0.20_28)]"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                )}
                {t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Right: canvas preview placeholder */}
        <div
          className={cn(
            "lg:col-span-5 transition-all duration-700",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <CanvasPreview />
        </div>
      </div>
    </section>
  );
}

function CanvasPreview() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas-bg)]"
      style={{ height: 420 }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Mock canvas shapes */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 420" preserveAspectRatio="xMidYMid meet">
        {/* Rectangle 1 */}
        <rect x="30" y="40" width="80" height="55" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* Circle */}
        <circle cx="165" cy="70" r="26" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* Sticky note — yellow */}
        <rect x="230" y="35" width="65" height="65" rx="2" fill="oklch(0.92 0.07 70)" stroke="oklch(0.82 0.10 70)" strokeWidth="1.5" />
        <text x="240" y="60" fontSize="9" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.7">Q3 goals</text>
        {/* Rectangle 2 */}
        <rect x="320" y="40" width="45" height="55" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* Sticky note — blue */}
        <rect x="30" y="240" width="70" height="50" rx="2" fill="oklch(0.92 0.05 220)" stroke="oklch(0.82 0.07 220)" strokeWidth="1.5" />
        <text x="40" y="260" fontSize="9" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.7">Onboard...</text>
        {/* Rectangle 3 */}
        <rect x="130" y="230" width="100" height="60" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="140" y="253" fontSize="9" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">user flow v3</text>
        <text x="140" y="267" fontSize="9" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">3 steps</text>
        {/* Circle 2 */}
        <circle cx="300" cy="260" r="22" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* Connector lines */}
        <path d="M110 70 L139 70" stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.5" />
        <path d="M191 70 L230 68" stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.5" />
        <path d="M295 70 L320 68" stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.5" />
        <path d="M100 260 L130 260" stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.4" />
        <path d="M230 260 L278 260" stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Cursor — Ana */}
      <div className="absolute" style={{ left: 155, top: 95 }}>
        <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
          <path d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z" fill="#e05a3a" stroke="white" strokeWidth="1" />
        </svg>
        <span className="absolute left-3 top-3 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ background: "#e05a3a" }}>
          Ana
        </span>
      </div>

      {/* Cursor — Wei */}
      <div className="absolute" style={{ left: 260, top: 55 }}>
        <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
          <path d="M0 0 L0 16 L4.5 12 L7.5 19 L9.5 18 L6.5 11 L12 11 Z" fill="#7c6fe0" stroke="white" strokeWidth="1" />
        </svg>
        <span className="absolute left-3 top-3 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ background: "#7c6fe0" }}>
          Wei
        </span>
      </div>

      {/* Live indicator */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
        </span>
        <span className="font-ui text-[10px] font-medium text-[var(--color-foreground)]">3 live</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Capabilities — 2x2 grid of h-96 artifacts
───────────────────────────────────────────────────────────── */
function Capabilities() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  const caps = [
    {
      eyebrow: "Collaboration",
      title: "Real-time multi-cursor",
      body: "Watch teammates draw as it happens. Every cursor, stroke, and sticky note syncs in under 50ms. Chat inline without leaving the canvas.",
      artifact: <CollabArtifact />,
    },
    {
      eyebrow: "Canvas",
      title: "Infinite pan & zoom",
      body: "Unlimited canvas space. A minimap shows your full board. Zoom controls keep you oriented at any scale.",
      artifact: <CanvasArtifact />,
    },
    {
      eyebrow: "Templates",
      title: "Ready-made templates",
      body: "Start from roadmaps, wireframes, retrospectives, or kanban boards. Or go blank and improvise.",
      artifact: <TemplatesArtifact />,
    },
    {
      eyebrow: "Export",
      title: "Export anywhere",
      body: "PNG at any DPI. SVG for Figma. JSON for full round-trip editing. One click, any format.",
      artifact: <ExportArtifact />,
    },
  ];

  return (
    <section
      id="capabilities"
      ref={ref}
      className="border-t border-[var(--color-border)] bg-[var(--color-secondary)]/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Section header */}
        <div
          className={cn(
            "mb-10 transition-all duration-500",
            inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <p className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
            Capabilities
          </p>
          <h2 className="font-section text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight text-[var(--color-foreground)]">
            Built for how teams think
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            Four things Sketcha does well — and nothing it doesn't.
          </p>
        </div>

        {/* 2x2 artifact grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {caps.map((c, i) => (
            <div
              key={c.title}
              className={cn(
                "space-y-3 transition-all duration-500",
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${80 + i * 60}ms` }}
            >
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.12em] text-[oklch(0.58_0.20_28)]">
                  {c.eyebrow}
                </p>
                <h3 className="mt-0.5 text-[15px] font-semibold text-[var(--color-foreground)]">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                  {c.body}
                </p>
              </div>
              {/* Tall artifact — h-80 (matches plan's h-96 roughly) */}
              <div
                className="transition-all duration-700"
                style={{
                  transitionDelay: `${160 + i * 60}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {c.artifact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   How it works — 3 rich step cards with visuals
───────────────────────────────────────────────────────────── */
function HowItWorks() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const steps = [
    {
      n: "01",
      title: "Open a board",
      body: "Pick a template or start blank. Takes five seconds.",
      visual: <Step1Modal />,
    },
    {
      n: "02",
      title: "Share the link",
      body: "Send the URL to your team. No sign-up required for them.",
      visual: <Step2Dialog />,
    },
    {
      n: "03",
      title: "Draw together",
      body: "See every stroke and cursor in real time. No lag, no conflicts.",
      visual: <Step3MiniBoard />,
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div
        className={cn(
          "mb-10 transition-all duration-500",
          inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        <p className="font-mono-label mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
          How it works
        </p>
        <h2 className="font-section text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight text-[var(--color-foreground)]">
          Three steps to a shared canvas
        </h2>
      </div>

      {/* Step cards with horizontal arrows */}
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={cn(
              "relative transition-all duration-500",
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: `${100 + i * 100}ms` }}
          >
            {/* Arrow connector between cards */}
            {i < steps.length - 1 && (
              <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}

            <div className="space-y-3">
              {/* Number + title */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono-label text-[28px] font-semibold leading-none text-[oklch(0.58_0.20_28)]">
                  {s.n}
                </span>
                <h3 className="text-[15px] font-semibold text-[var(--color-foreground)]">
                  {s.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                {s.body}
              </p>

              {/* Visual */}
              <div
                className="transition-all duration-700"
                style={{
                  transitionDelay: `${200 + i * 100}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(6px)",
                }}
              >
                {s.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Numbers — single hero stat
───────────────────────────────────────────────────────────── */
function Numbers() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  const n = useCountUp(12438291, 1800, inView, 0);

  return (
    <section ref={ref} className="border-t border-[var(--color-border)] bg-[var(--color-foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div
          className={cn(
            "transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <p className="font-mono-label text-[11px] uppercase tracking-[0.12em] text-[var(--color-background)]/50">
            Shapes drawn this month
          </p>
          <p
            className="font-display mt-2 text-[clamp(4rem,12vw,9rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--color-background)]"
            style={{ fontOpticalSizing: "auto" }}
          >
            {n.toLocaleString()}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {[
              "42ms median sync",
              "99.97% uptime",
              "MIT licensed",
            ].map((s) => (
              <span key={s} className="font-mono-label text-[11px] text-[var(--color-background)]/50">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Final CTA — full-bleed dark
───────────────────────────────────────────────────────────── */
function FinalCTA() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--color-foreground)]"
      style={{ background: "var(--color-foreground)" }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-background) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div
          className={cn(
            "transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <h2
            className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--color-background)]"
            style={{ fontOpticalSizing: "auto" }}
          >
            Open a board.
            <br />
            Invite your team.
            <br />
            <span className="text-[oklch(0.58_0.20_28)]">Start drawing.</span>
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-background)]/60">
            Free for up to 5 people. No credit card, no install, no account required to start.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/dashboard"
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-[oklch(0.58_0.20_28)] px-6 text-base font-semibold text-white shadow-sm transition-all hover:opacity-90 active:opacity-80"
            >
              Open canvas
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label text-[11px] text-[var(--color-background)]/50 transition-colors hover:text-[var(--color-background)]"
            >
              Source on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Nav />
      <Hero />
      <Capabilities />
      <HowItWorks />
      <Numbers />
      <FinalCTA />
      <Footer />
    </main>
  );
}
