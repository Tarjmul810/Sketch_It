"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUser, clearToken } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type Room = {
  id: number;
  slug: string;
  adminId: number;
  createdAt: string;
};

/* ─────────────────────────────────────────────────────────────
   Logo
───────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-2.5">
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
   TopBar
───────────────────────────────────────────────────────────── */
function TopBar({ email }: { email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = (email[0] ?? "S").toUpperCase();

  const handleSignOut = () => {
    clearToken();
    window.location.href = "/auth/signin";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Logo />

        <div className="flex items-center gap-2">
          {/* Account menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.58_0.20_28)] text-sm font-semibold text-white transition-opacity hover:opacity-85"
              aria-label="Account menu"
            >
              {initial}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 w-56 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
                  <div className="border-b border-[var(--color-border)] px-3 py-2.5">
                    <p className="font-mono-label text-[9px] text-[var(--color-muted-foreground)]">Signed in as</p>
                    <p className="truncate text-[12px] text-[var(--color-foreground)]">{email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   Slug helper
───────────────────────────────────────────────────────────── */
function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 7);
}

/* ─────────────────────────────────────────────────────────────
   CreateRoomModal
───────────────────────────────────────────────────────────── */
function CreateRoomModal({
  open,
  onClose,
  onCreate,
  error,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  error: string | null;
  loading: boolean;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setTimeout(() => document.getElementById("room-name-input")?.focus(), 50);
    if (!open) setName("");
  }, [open]);

  if (!open) return null;

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  const previewSlug = slugify(name) || `untitled-${randomSuffix()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-foreground)]">Create room</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="space-y-1.5">
            <label htmlFor="room-name-input" className="text-[12px] font-medium text-[var(--color-foreground)]">
              Room name
            </label>
            <input
              id="room-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Homepage redesign"
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-colors focus:border-[oklch(0.58_0.20_28)] focus:ring-2 focus:ring-[oklch(0.58_0.20_28_/_0.15)]"
            />
          </div>

          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-secondary)]/50 px-3 py-2">
            <p className="font-mono-label text-[9px] text-[var(--color-muted-foreground)]">Room link</p>
            <p className="mt-0.5 truncate font-mono text-[12px] text-[var(--color-foreground)]">
              sketcha.app/r/{previewSlug}
            </p>
          </div>

          {error && (
            <p className="text-[13px] text-[oklch(0.55_0.20_25)]" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-[13px] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[oklch(0.58_0.20_28)] px-4 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Creating…" : "Create room"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   JoinRoomModal
───────────────────────────────────────────────────────────── */
function JoinRoomModal({
  open,
  onClose,
  onJoin,
  error,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onJoin: (slug: string) => void;
  error: string | null;
  loading: boolean;
}) {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (open) setTimeout(() => document.getElementById("join-slug-input")?.focus(), 50);
    if (!open) setSlug("");
  }, [open]);

  if (!open) return null;

  const handleJoin = () => {
    const cleaned = slug
      .trim()
      .replace(/https?:\/\/sketcha\.app\/?r\//i, "")
      .replace(/^\/r\//, "")
      .replace(/\/$/, "");
    if (!cleaned) return;
    onJoin(cleaned);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-foreground)]">Join a room</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="space-y-1.5">
            <label htmlFor="join-slug-input" className="text-[12px] font-medium text-[var(--color-foreground)]">
              Room link or slug
            </label>
            <input
              id="join-slug-input"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="sketcha.app/r/x7k2m"
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-colors focus:border-[oklch(0.58_0.20_28)] focus:ring-2 focus:ring-[oklch(0.58_0.20_28_/_0.15)]"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[oklch(0.55_0.20_25)]" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-[13px] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={!slug.trim() || loading}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[oklch(0.58_0.20_28)] px-4 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Joining…" : "Join room"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return new Date(iso).toLocaleDateString();
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Auth + initial fetch
  useEffect(() => {
    const user = getUser();
    if (!user) {
      window.location.href = "/auth/signin";
      return;
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const data = await apiFetch<{ rooms: Room[] }>("/rooms");
      setRooms(data.rooms);
    } catch (e) {
      console.error("Failed to fetch rooms", e);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreate = async (name: string) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const baseSlug = slugify(name) || `untitled-${randomSuffix()}`;
      // Try the chosen slug, then fall back to a random suffix on collision
      let attempt = baseSlug;
      let lastError: Error | null = null;
      for (let i = 0; i < 3; i++) {
        try {
          await apiFetch("/room", {
            method: "POST",
            body: JSON.stringify({ slug: attempt }),
          });
          window.location.href = `/room/${attempt}`;
          return;
        } catch (e) {
          lastError = e as Error;
          if (i === 0) attempt = `${baseSlug}-${randomSuffix()}`;
          else break;
        }
      }
      setCreateError(lastError?.message ?? "Could not create room");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoin = async (slug: string) => {
    setJoinLoading(true);
    setJoinError(null);
    try {
      await apiFetch(`/room/${encodeURIComponent(slug)}`);
      window.location.href = `/room/${slug}`;
    } catch (e) {
      setJoinError((e as Error).message || "Room not found");
      setJoinLoading(false);
    }
  };

  const user = getUser();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar email={user.email} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Your rooms
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Create a new room or join one with a link.
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 sm:max-w-md">
          <button
            onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[oklch(0.58_0.20_28)] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:opacity-80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create room
          </button>
          <button
            onClick={() => {
              setJoinError(null);
              setJoinOpen(true);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
            </svg>
            Join room
          </button>
        </div>

        {/* Room list */}
        <section>
          {loadingRooms ? (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                </svg>
                Loading rooms…
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-secondary)]/40 p-12 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--color-foreground)]">No rooms yet</p>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                Create a room to get started. Anyone with the link can draw.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              {/* Header row */}
              <div className="hidden border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted-foreground)] sm:grid sm:grid-cols-[1fr_140px_100px]">
                <span>Room</span>
                <span>Created</span>
                <span className="text-right">Link</span>
              </div>

              {/* Rows */}
              <ul className="divide-y divide-[var(--color-border)]">
                {rooms.map((room) => (
                  <li key={room.id}>
                    <div className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-secondary)]/40">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[var(--color-foreground)]">
                          {room.slug}
                        </p>
                        <p className="font-mono-label text-[9px] text-[var(--color-muted-foreground)] sm:hidden">
                          Created {relativeTime(room.createdAt)}
                        </p>
                      </div>

                      <p className="hidden font-mono-label text-[10px] text-[var(--color-muted-foreground)] sm:block">
                        {relativeTime(room.createdAt)}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/room/${room.slug}`}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 text-[11px] font-medium text-[var(--color-foreground)] opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Open
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link
                          href={`/room/${room.slug}`}
                          className="font-mono-label truncate text-[10px] text-[var(--color-muted-foreground)] sm:hidden"
                        >
                          /r/{room.slug}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      <CreateRoomModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        error={createError}
        loading={createLoading}
      />
      <JoinRoomModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoin={handleJoin}
        error={joinError}
        loading={joinLoading}
      />
    </div>
  );
}
