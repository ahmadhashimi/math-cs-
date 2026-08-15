import type { Metadata } from "next";
import { BackButton, PrintButton } from "@/components/FormulaSheet";
import { FORMULA_SHEET } from "@/lib/course";

export const metadata: Metadata = {
  title: "Formula sheet · Math for a CS Degree",
};

export default function FormulaSheetPage() {
  return (
    <div
      data-sheet="1"
      className="mx-auto w-full max-w-[920px] px-5 sm:px-8 lg:px-14 pt-8 sm:pt-12 lg:pt-14 pb-24 lg:pb-30 flex flex-col gap-9 sm:gap-10 animate-rise"
    >
      <header className="flex flex-wrap justify-between items-end gap-5 border-b border-line pb-5 sm:pb-[22px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-[clamp(2rem,6vw,2.75rem)] leading-none font-semibold tracking-[-0.03em]">
            Formula sheet
          </h1>
          <p className="text-[15px] sm:text-base text-ink-muted">
            Every formula in the course, in order. Print it.
          </p>
        </div>
        <div data-noprint="1" className="flex flex-wrap gap-2.5">
          <PrintButton />
          <BackButton />
        </div>
      </header>

      <div className="flex flex-col gap-9 sm:gap-10" data-stagger="1">
        {FORMULA_SHEET.map((section) => (
          <section key={section.id} className="flex flex-col gap-3.5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {section.n}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {section.rows.map((row) => (
                <div
                  key={row.key}
                  className="min-w-0 flex flex-col gap-1.5 px-[15px] py-3.5 bg-inset border border-line rounded-md"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim">
                    {row.label}
                  </div>
                  <div className="font-mono text-[15px] sm:text-base break-words">
                    {row.expr}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
