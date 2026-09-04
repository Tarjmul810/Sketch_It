/**
 * TemplatesArtifact — 3x2 grid of real-looking template thumbnails
 * with category tabs at the top.
 */
import { useState } from "react";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

type Template = {
  name: string;
  category: string;
  hue: string;
  shapes: "roadmap" | "wireframe" | "retro" | "kanban" | "sitemap" | "wireframe2";
};

const TEMPLATES: Template[] = [
  { name: "Roadmap", category: "Planning", hue: "oklch(0.93 0.05 28)", shapes: "roadmap" },
  { name: "Wireframe kit", category: "Design", hue: "oklch(0.93 0.05 240)", shapes: "wireframe" },
  { name: "Retro board", category: "Team", hue: "oklch(0.93 0.05 150)", shapes: "retro" },
  { name: "Kanban", category: "Planning", hue: "oklch(0.93 0.05 80)", shapes: "kanban" },
  { name: "Sitemap", category: "Design", hue: "oklch(0.93 0.05 280)", shapes: "sitemap" },
  { name: "Onboarding flow", category: "Product", hue: "oklch(0.93 0.05 200)", shapes: "wireframe2" },
];

const TABS = ["All", "Design", "Planning", "Team"] as const;

function TemplatePreview({ shape }: { shape: Template["shapes"] }) {
  switch (shape) {
    case "roadmap":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="6" y="10" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.15" />
          <rect x="32" y="10" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.15" />
          <rect x="58" y="10" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.15" />
          <rect x="6" y="30" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <rect x="32" y="30" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <rect x="58" y="30" width="22" height="14" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <line x1="0" y1="56" x2="120" y2="56" stroke="var(--color-foreground)" strokeWidth="0.5" opacity="0.2" />
          <text x="6" y="68" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">Q1</text>
          <text x="32" y="68" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">Q2</text>
          <text x="58" y="68" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">Q3</text>
        </svg>
      );
    case "wireframe":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="6" y="6" width="108" height="10" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="6" y="22" width="50" height="50" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <rect x="62" y="22" width="52" height="20" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <rect x="62" y="48" width="52" height="24" rx="1" fill="var(--color-foreground)" opacity="0.10" />
        </svg>
      );
    case "retro":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="6" y="6" width="32" height="68" rx="1" fill="oklch(0.90 0.10 28 / 0.6)" />
          <rect x="44" y="6" width="32" height="68" rx="1" fill="oklch(0.90 0.10 150 / 0.6)" />
          <rect x="82" y="6" width="32" height="68" rx="1" fill="oklch(0.90 0.10 280 / 0.6)" />
          <text x="14" y="20" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">went well</text>
          <text x="52" y="20" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">to improve</text>
          <text x="90" y="20" fontSize="6" fontFamily="ui-monospace" fill="var(--color-foreground)" opacity="0.5">actions</text>
        </svg>
      );
    case "kanban":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="6" y="6" width="32" height="68" rx="1" fill="var(--color-foreground)" opacity="0.08" />
          <rect x="44" y="6" width="32" height="68" rx="1" fill="var(--color-foreground)" opacity="0.08" />
          <rect x="82" y="6" width="32" height="68" rx="1" fill="var(--color-foreground)" opacity="0.08" />
          <rect x="10" y="14" width="24" height="10" rx="1" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.7" />
          <rect x="10" y="28" width="24" height="10" rx="1" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.7" />
          <rect x="48" y="14" width="24" height="10" rx="1" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.7" />
          <rect x="86" y="14" width="24" height="10" rx="1" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.7" />
          <rect x="86" y="28" width="24" height="10" rx="1" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.7" />
        </svg>
      );
    case "sitemap":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="44" y="6" width="32" height="14" rx="1" fill="var(--color-foreground)" opacity="0.15" />
          <rect x="6" y="34" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="34" y="34" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="62" y="34" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="90" y="34" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="6" y="58" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <rect x="34" y="58" width="24" height="12" rx="1" fill="var(--color-foreground)" opacity="0.10" />
          <line x1="60" y1="20" x2="18" y2="34" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.3" />
          <line x1="60" y1="20" x2="46" y2="34" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.3" />
          <line x1="60" y1="20" x2="74" y2="34" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.3" />
          <line x1="60" y1="20" x2="102" y2="34" stroke="var(--color-foreground)" strokeWidth="0.3" opacity="0.3" />
        </svg>
      );
    case "wireframe2":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <circle cx="20" cy="40" r="12" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="40" y="28" width="20" height="24" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="70" y="20" width="20" height="14" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="70" y="40" width="20" height="14" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <rect x="95" y="30" width="20" height="40" rx="1" fill="var(--color-foreground)" opacity="0.12" />
          <line x1="32" y1="40" x2="40" y2="40" stroke="var(--color-foreground)" strokeWidth="0.5" opacity="0.4" />
          <line x1="60" y1="34" x2="70" y2="27" stroke="var(--color-foreground)" strokeWidth="0.5" opacity="0.4" />
          <line x1="60" y1="44" x2="70" y2="47" stroke="var(--color-foreground)" strokeWidth="0.5" opacity="0.4" />
          <line x1="90" y1="40" x2="95" y2="40" stroke="var(--color-foreground)" strokeWidth="0.5" opacity="0.4" />
        </svg>
      );
  }
}

export function TemplatesArtifact() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  return (
    <Card className="overflow-hidden border-[var(--color-border)]">
      {/* Tabs header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-[var(--color-foreground)]">Templates</span>
          <span className="font-ui text-[10px] text-[var(--color-muted-foreground)]">
            {TEMPLATES.length} ready
          </span>
        </div>
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded px-2 py-1 font-ui text-[10px] font-medium transition-colors",
                tab === t
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3x2 grid */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {TEMPLATES.map((t) => (
          <div
            key={t.name}
            className="group cursor-pointer overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-card)] transition-all hover:border-[var(--color-foreground)]/30 hover:shadow-sm"
          >
            <div
              className="relative h-20 overflow-hidden"
              style={{ background: t.hue }}
            >
              <TemplatePreview shape={t.shapes} />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-foreground)]/0 opacity-0 transition-all duration-200 group-hover:bg-[var(--color-foreground)]/10 group-hover:opacity-100">
                <span className="font-ui text-[10px] font-medium text-[var(--color-foreground)]">
                  Use template →
                </span>
              </div>
            </div>
            <div className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1.5">
              <p className="text-[11px] font-medium text-[var(--color-foreground)]">{t.name}</p>
              <p className="font-ui text-[9px] text-[var(--color-muted-foreground)]">
                {t.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
