"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route error boundary: a thrown render error shows this fallback instead of
 * a blank page. Progress lives in localStorage, so nothing is lost — the
 * learner can retry the segment or bail out to the course overview.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure where it can be found; the digest matches the
    // corresponding server-side log line.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] flex flex-col items-start gap-4 bg-surface border border-line rounded-lg p-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          Something went wrong
        </span>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
          This page hit an error
        </h1>
        <p className="text-[15px] leading-[1.6] text-ink-muted">
          Your progress is saved on this device and is not affected. Try the
          page again — if it keeps failing, head back to the course overview.
        </p>
        {error.digest && (
          <p className="font-mono text-[11px] text-ink-muted">
            ref {error.digest}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => reset()}
            className="font-mono text-[13px] font-semibold bg-accent text-accent-ink rounded-md px-5 py-2.5 cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-mono text-[13px] text-ink-muted border border-line rounded-md px-5 py-2.5 hover:text-ink"
          >
            Course overview
          </Link>
        </div>
      </div>
    </div>
  );
}
