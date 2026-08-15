"use client";

import { useRouter } from "next/navigation";
import { Eyebrow, GhostButton, GoldButton, Panel } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { FINAL_EXAM_ID, FINAL_PASS_MARK } from "@/lib/types";

export function CertificateView({
  tracks,
}: {
  tracks: { id: string; n: string }[];
}) {
  const router = useRouter();
  const { hydrated, graduated } = useProgress();

  // Progress lives in localStorage: until it is read, neither the certificate
  // nor the locked state is the truth. It also keeps the issue date — which
  // comes from the learner's clock — out of every render the server can see.
  if (!hydrated) return <div className="min-h-[60vh]" />;

  const issued = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!graduated) {
    return (
      <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 lg:px-14 pt-8 sm:pt-12 lg:pt-14 pb-24 animate-rise">
        <Panel className="flex flex-col gap-4 p-6 sm:p-8">
          <Eyebrow tone="gold">Certificate · locked</Eyebrow>
          <p className="text-lg sm:text-xl leading-[1.55] text-ink-muted">
            The certificate is issued on the comprehensive final examination.
            Pass every track, then sit the final at {FINAL_PASS_MARK}% or above
            and this page becomes yours.
          </p>
          <div className="flex flex-wrap gap-3">
            <GoldButton onClick={() => router.push(`/exam/${FINAL_EXAM_ID}`)}>
              Go to the final examination
            </GoldButton>
            <GhostButton onClick={() => router.push("/")}>
              Back to overview
            </GhostButton>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    // `data-sheet` sits on the wrapper, as in the prototype, so the print
    // rules recolour the gold frame along with everything inside it.
    <div
      data-sheet="1"
      className="mx-auto w-full max-w-[900px] px-5 sm:px-8 lg:px-14 pt-8 sm:pt-12 lg:pt-16 pb-24 lg:pb-30 flex flex-col gap-7 animate-rise"
    >
      <div className="border-2 border-gold rounded-[4px] p-1.5">
        <div className="border border-gold-line px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 flex flex-col items-center text-center gap-[22px] bg-[linear-gradient(180deg,var(--surface),var(--surface-3))]">
          <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-gold">
            Certificate of completion
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Math for a CS Degree · a proprietary course by Mujtaba Hashimi
          </div>

          <div className="font-serif italic text-lg sm:text-xl text-ink-muted">
            This certifies that the holder has completed
          </div>
          <h1 className="text-[clamp(1.75rem,6vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
            Mathematics for a CS Degree{" "}
            <span className="font-serif italic font-medium text-accent">
              &amp; AI
            </span>
          </h1>

          <p className="text-[15px] leading-[1.6] text-ink-muted max-w-[54ch]">
            having passed every track examination and the comprehensive final
            examination at or above the required standard, covering:
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-[640px]">
            {tracks.map((track) => (
              <span
                key={track.id}
                className="font-mono text-[11.5px] text-ink-muted border border-line-strong rounded-full px-3 py-1.5"
              >
                {track.n}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-15 mt-4">
            <Signature name="Mujtaba Hashimi" role="Fannos Academy · US education system" />
            <Signature name={issued} role="Date of completion" />
          </div>
        </div>
      </div>

      <div data-noprint="1" className="flex flex-wrap gap-3">
        <GoldButton onClick={() => window.print()}>Print certificate</GoldButton>
        <GhostButton onClick={() => router.push("/")}>
          Back to overview
        </GhostButton>
      </div>
    </div>
  );
}

function Signature({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Reserves the line's height before the date is known, so nothing shifts. */}
      <div className="font-serif italic text-[22px] leading-[1.2] text-ink min-h-[26px]">
        {name}
      </div>
      <div className="w-[180px] max-w-full h-px bg-ink-ghost" />
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint max-w-[180px]">
        {role}
      </div>
    </div>
  );
}
