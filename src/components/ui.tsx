import type { ComponentProps, ReactNode } from "react";

/** Joins class names, dropping falsy entries. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * The palette is deliberately two-accent: mint carries progress and anything
 * the learner acts on, gold carries assessment and licence, and everything else
 * is neutral ink. Red is reserved for a wrong answer and never used decoratively.
 */
export type Accent = "accent" | "gold" | "dim";

const EYEBROW_TONE: Record<Accent, string> = {
  accent: "text-accent",
  gold: "text-gold",
  dim: "text-ink-dim",
};

/** The small mono, letter-spaced, uppercase label that opens most sections. */
export function Eyebrow({
  tone = "dim",
  className,
  children,
}: {
  tone?: Accent;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]",
        EYEBROW_TONE[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A bordered card. The default surface for every block of course content. */
export function Panel({
  className,
  children,
  ...rest
}: ComponentProps<"section">) {
  return (
    <section
      {...rest}
      className={cx(
        "bg-surface border border-line rounded-lg",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** The numbered phase divider: 01 Understand · 02 Reference · 03 Practice. */
export function PhaseRule({
  step,
  label,
  note,
}: {
  step: string;
  label: string;
  note: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3">
      <span className="font-mono text-[28px] sm:text-[34px] leading-none font-semibold text-line-strong">
        {step}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </span>
      <span className="text-[15px] text-ink-faint">{note}</span>
    </div>
  );
}

const BUTTON_BASE =
  "font-mono text-[13px] rounded-md px-5 py-3 cursor-pointer transition-colors disabled:cursor-not-allowed";

export function PrimaryButton({ className, ...rest }: ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={cx(
        BUTTON_BASE,
        "font-semibold bg-accent text-accent-ink hover:bg-accent-hover",
        "disabled:bg-line disabled:text-ink-faint disabled:hover:bg-line",
        className,
      )}
    />
  );
}

export function GoldButton({ className, ...rest }: ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={cx(
        BUTTON_BASE,
        "font-semibold bg-gold text-gold-surface hover:opacity-90",
        "disabled:bg-line disabled:text-ink-faint disabled:opacity-100",
        className,
      )}
    />
  );
}

export function GhostButton({ className, ...rest }: ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={cx(
        BUTTON_BASE,
        "bg-transparent text-ink-muted border border-line-strong hover:text-ink hover:border-ink-faint",
        className,
      )}
    />
  );
}

/** One of the five headline numbers on the course home page. */
export function StatTile({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="bg-surface border border-line rounded-lg p-4 sm:p-5 flex flex-col gap-2">
      <div className="font-mono text-2xl sm:text-3xl leading-none text-accent">
        {value}
      </div>
      <div className="text-[13px] text-ink-muted">{label}</div>
    </div>
  );
}

/** The proprietary-course footer, on the home page and every lesson. */
export function CourseFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cx(
        "flex flex-wrap justify-between items-center gap-4 pt-6",
        className,
      )}
    >
      <span className="font-mono text-xs text-ink-faint">
        Math for a CS Degree by{" "}
        <span className="text-ink-muted">Mujtaba Hashimi</span> · Fannos Academy ·
        US education system
      </span>
      <span className="font-mono text-xs text-ink-faint">
        © 2026 Mujtaba Hashimi · Proprietary — all rights reserved
      </span>
    </footer>
  );
}
