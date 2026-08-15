"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { COURSE_STATS, LESSON_TRACK, TRACK_OUTLINES } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { cx } from "@/components/ui";

const RING_RADIUS = 19;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { shield, dismissShield, examLive } = useProgress();
  // The drawer is a navigation surface: it remembers the route it was opened
  // on, so it is only open while the learner is still on that route — any
  // route change closes it by derivation, no effect needed.
  const [drawerRoute, setDrawerRoute] = useState<string | null>(null);
  const drawerOpen = drawerRoute !== null && drawerRoute === pathname;
  const closeDrawer = () => setDrawerRoute(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerRoute(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <>
      <div
        className={cx(
          "min-h-dvh bg-bg text-ink lg:grid lg:grid-cols-[312px_1fr]",
          examLive && "select-none",
          shield && "blur-[14px] pointer-events-none",
        )}
      >
        <MobileBar onOpen={() => setDrawerRoute(pathname)} />

        <aside
          data-noprint="1"
          className="hidden lg:flex flex-col h-dvh sticky top-0 bg-surface-3 border-r border-line"
        >
          <SidebarContent />
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40" data-noprint="1">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="absolute inset-y-0 left-0 w-[min(88vw,340px)] bg-surface-3 border-r border-line flex flex-col animate-rise">
            <SidebarContent onNavigate={closeDrawer} />
          </div>
        </div>
      )}

      {shield && <ShieldOverlay onDismiss={dismissShield} />}
    </>
  );
}

function MobileBar({ onOpen }: { onOpen: () => void }) {
  const { doneCount } = useProgress();
  return (
    <div
      data-noprint="1"
      className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface-3/95 backdrop-blur border-b border-line"
    >
      <button
        onClick={onOpen}
        aria-label="Open navigation"
        className="flex flex-col gap-[5px] p-2 -m-2 cursor-pointer"
      >
        <span className="block w-5 h-px bg-ink-muted" />
        <span className="block w-5 h-px bg-ink-muted" />
        <span className="block w-5 h-px bg-ink-muted" />
      </button>
      <Link href="/" className="flex flex-col min-w-0 flex-1">
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink truncate">
          Math for a CS Degree
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          by Mujtaba Hashimi
        </span>
      </Link>
      <span className="font-mono text-xs text-accent shrink-0">
        {doneCount}/{COURSE_STATS.lessons}
      </span>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    done,
    passed,
    unlocked,
    doneCount,
    examBlocked,
    resetProgress,
    theme,
    toggleTheme,
    showShield,
  } = useProgress();

  const currentLessonId = useMemo(() => {
    const match = /^\/lesson\/([^/]+)/.exec(pathname ?? "");
    return match ? decodeURIComponent(match[1]) : null;
  }, [pathname]);

  const currentTrackId = currentLessonId ? LESSON_TRACK[currentLessonId] : null;

  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>({});

  // Keep the track containing the open lesson expanded: when navigation moves
  // into a different track, expand it once during render (the adjust-state-
  // on-change pattern), leaving the learner free to collapse it afterwards.
  const [prevTrackId, setPrevTrackId] = useState(currentTrackId);
  if (currentTrackId !== prevTrackId) {
    setPrevTrackId(currentTrackId);
    if (currentTrackId && !openTracks[currentTrackId]) {
      setOpenTracks({ ...openTracks, [currentTrackId]: true });
    }
  }

  const progressFraction = COURSE_STATS.lessons
    ? doneCount / COURSE_STATS.lessons
    : 0;

  const goToLockedTrack = (trackId: string, index: number) => {
    const previous = TRACK_OUTLINES[index - 1];
    showShield({
      title: "Track locked",
      message: `Pass the ${previous ? previous.n : "previous track"} exam to unlock ${
        TRACK_OUTLINES[index]?.n ?? "this track"
      }. The gate is the point: every track assumes the one before it.`,
    });
  };

  return (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-line flex flex-col gap-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex flex-col gap-1 text-left"
        >
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
            Math for a CS Degree
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim">
            by Mujtaba Hashimi
          </span>
        </Link>

        <div className="flex items-center gap-3.5">
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            className="-rotate-90 shrink-0"
            aria-hidden
          >
            <circle
              cx="23"
              cy="23"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--line)"
              strokeWidth="4"
            />
            <circle
              cx="23"
              cy="23"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(RING_CIRCUMFERENCE * progressFraction).toFixed(1)} ${RING_CIRCUMFERENCE.toFixed(1)}`}
              className="transition-[stroke-dasharray] duration-500"
            />
          </svg>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[15px] text-accent">
              {doneCount} / {COURSE_STATS.lessons}
            </span>
            <span className="text-xs text-ink-dim">lessons complete</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[11px] text-ink-faint">
          <span>{COURSE_STATS.tracks} tracks</span>
          <span>{COURSE_STATS.formulas} formulas</span>
          <span>{COURSE_STATS.drills} drills</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2.5 pb-6 flex flex-col gap-0.5">
        {TRACK_OUTLINES.map((track, index) => {
          const isUnlocked = unlocked[track.id];
          const isOpen = Boolean(openTracks[track.id]) && isUnlocked;
          const doneInTrack = track.lessons.filter((l) => done[l.id]).length;
          const isCurrent = track.id === currentTrackId;

          return (
            <div key={track.id} className="flex flex-col">
              <button
                onClick={() => {
                  if (!isUnlocked) return goToLockedTrack(track.id, index);
                  setOpenTracks((prev) => ({
                    ...prev,
                    [track.id]: !prev[track.id],
                  }));
                }}
                aria-expanded={isOpen}
                className={cx(
                  "flex items-center gap-2.5 w-full text-left text-sm rounded-md px-2.5 py-2.5",
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed",
                  !isUnlocked
                    ? "text-ink-faint"
                    : isCurrent
                      ? "text-ink font-semibold"
                      : "text-ink-muted hover:text-ink font-medium",
                )}
              >
                <span
                  className={cx(
                    "inline-block text-[10px] text-ink-faint transition-transform duration-200",
                    isOpen && "rotate-90",
                  )}
                  aria-hidden
                >
                  ▸
                </span>
                <span className="flex-1 min-w-0 truncate">{track.n}</span>
                <span className="font-mono text-[11px] text-ink-faint">
                  {passed[track.id]
                    ? "✓"
                    : isUnlocked
                      ? `${doneInTrack}/${track.lessons.length}`
                      : "🔒"}
                </span>
              </button>

              {isOpen && (
                <div className="flex flex-col gap-px pb-2">
                  <button
                    onClick={() => {
                      if (examBlocked(track.id)) return;
                      router.push(`/exam/${track.id}`);
                      onNavigate?.();
                    }}
                    className={cx(
                      "flex items-center w-full text-left font-mono text-xs rounded-md py-2 pl-7 pr-2.5",
                      examBlocked(track.id)
                        ? "text-ink-faint cursor-not-allowed"
                        : "text-gold-dim hover:text-gold cursor-pointer",
                    )}
                  >
                    {examBlocked(track.id)
                      ? "Exam locked — redo flagged lessons"
                      : `Take the ${track.n} exam →`}
                  </button>

                  {track.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isDone = Boolean(done[lesson.id]);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lesson/${lesson.id}`}
                        onClick={onNavigate}
                        className={cx(
                          "flex items-center gap-2.5 w-full text-left text-[13.5px] rounded-md py-2.5 pl-7 pr-2.5 transition-colors",
                          isActive
                            ? "bg-accent text-accent-ink font-semibold"
                            : isDone
                              ? "text-ink-muted hover:text-ink"
                              : "text-ink-dim hover:text-ink",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx(
                            "w-[5px] h-[5px] rounded-full shrink-0",
                            isActive
                              ? "bg-accent-ink"
                              : isDone
                                ? "bg-accent"
                                : "bg-ink-ghost",
                          )}
                        />
                        <span className="flex-1 min-w-0">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-line p-3 flex gap-2">
        <Link
          href="/"
          onClick={onNavigate}
          className={cx(
            "flex-1 text-center font-mono text-xs rounded-md px-3 py-2.5 border",
            pathname === "/"
              ? "bg-accent text-accent-ink border-accent"
              : "bg-transparent text-ink-muted border-line hover:text-ink",
          )}
        >
          Overview
        </Link>
        <Link
          href="/formulas"
          onClick={onNavigate}
          className={cx(
            "flex-1 text-center font-mono text-xs rounded-md px-3 py-2.5 border",
            pathname === "/formulas"
              ? "bg-accent text-accent-ink border-accent"
              : "bg-transparent text-ink-muted border-line hover:text-ink",
          )}
        >
          Formulas
        </Link>
        <button
          onClick={toggleTheme}
          title="Toggle light and dark"
          aria-label="Toggle light and dark"
          className="font-mono text-[13px] rounded-md px-3 py-2.5 border border-line text-ink-muted hover:text-ink hover:border-line-strong cursor-pointer"
        >
          {theme === "light" ? "☀" : "☾"}
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Reset all progress? Completed lessons, exam passes and your review queue will be cleared.",
              )
            ) {
              resetProgress();
            }
          }}
          className="font-mono text-xs rounded-md px-3 py-2.5 border border-line text-ink-faint hover:text-ink-muted hover:border-line-strong cursor-pointer"
        >
          Reset
        </button>
      </div>
    </>
  );
}

function ShieldOverlay({ onDismiss }: { onDismiss: () => void }) {
  const { shield } = useProgress();
  if (!shield) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/55 backdrop-blur-2xl p-6 animate-rise"
      role="alertdialog"
      aria-modal="true"
      aria-label={shield.title}
    >
      <div className="flex flex-col gap-3 items-center text-center max-w-[440px] p-8 bg-surface border border-gold-line border-t-[3px] border-t-gold rounded-lg">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
          {shield.title}
        </div>
        <p className="text-base leading-relaxed text-ink-muted">
          {shield.message}
        </p>
        <button
          onClick={onDismiss}
          autoFocus
          className="font-mono text-[13px] font-semibold bg-gold text-gold-surface rounded-md px-6 py-3 mt-1.5 cursor-pointer"
        >
          I understand
        </button>
      </div>
    </div>
  );
}
