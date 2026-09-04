interface StatusIndicatorProps {
  status?: "operational" | "degraded" | "down";
  label?: string;
  showDot?: boolean;
}

const STATUS_MAP = {
  operational: { color: "#22c55e", text: "All systems normal" },
  degraded: { color: "#e0a83a", text: "Partial outage" },
  down: { color: "#dc2626", text: "Major outage" },
};

/**
 * Live status pill — green dot with label.
 * Used in nav and footer.
 */
export function StatusIndicator({
  status = "operational",
  label,
  showDot = true,
}: StatusIndicatorProps) {
  const config = STATUS_MAP[status];
  return (
    <a
      href="#"
      className="group inline-flex items-center gap-2 text-xs text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: config.color }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: config.color }}
          />
        </span>
      )}
      <span className="font-ui">{label ?? config.text}</span>
    </a>
  );
}
