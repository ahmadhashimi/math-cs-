import Link from "next/link";
import { CourseFooter, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="max-w-[860px] mx-auto px-5 sm:px-10 lg:px-14 py-16 sm:py-24 flex flex-col gap-8 animate-rise">
      <div className="flex flex-col gap-4">
        <Eyebrow tone="accent">404</Eyebrow>
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
          That page is not part of the course.
        </h1>
        <p className="text-lg leading-relaxed text-ink-muted max-w-[60ch]">
          The lesson, track or exam you asked for does not exist. Head back to
          the overview and pick up the sequence from there.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="font-mono text-sm font-semibold bg-accent text-accent-ink rounded-md px-7 py-4 hover:bg-accent-hover"
        >
          Back to overview
        </Link>
        <Link
          href="/formulas"
          className="font-mono text-sm text-ink-muted border border-line-strong rounded-md px-6 py-4 hover:text-ink hover:border-ink-faint"
        >
          Formula sheet
        </Link>
      </div>

      <CourseFooter className="border-t border-line mt-4" />
    </div>
  );
}
