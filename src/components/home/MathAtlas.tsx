"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eyebrow, cx } from "@/components/ui";
import type { ConceptNode, CourseAtlas } from "@/lib/concept-graph";

export function MathAtlas({ atlas }: { atlas: CourseAtlas }) {
  const [regionId, setRegionId] = useState(atlas.regions[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [pathId, setPathId] = useState(atlas.paths[0]?.id ?? "");

  const region = atlas.regions.find((entry) => entry.id === regionId) ?? atlas.regions[0];
  const path = atlas.paths.find((entry) => entry.id === pathId) ?? atlas.paths[0];
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return atlas.regions
      .flatMap((entry) => entry.concepts)
      .filter((concept) =>
        `${concept.title} ${concept.definition} ${concept.trackName}`
          .toLowerCase()
          .includes(needle),
      )
      .slice(0, 12);
  }, [atlas.regions, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid lg:grid-cols-[1fr_280px] gap-3">
        <div className="flex flex-col gap-4 p-5 sm:p-6 bg-surface border border-line rounded-[10px]">
          <div className="flex flex-col gap-2">
            <Eyebrow tone="accent">The map, not the timetable</Eyebrow>
            <h3 className="text-[22px] sm:text-[27px] leading-tight font-semibold tracking-[-0.025em]">
              Eight regions. {atlas.conceptCount} connected ideas.
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-ink-muted max-w-[64ch]">
              Tracks tell you what to study next. This atlas tells you what each
              idea is, what it rests on, and the new name it takes later.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2" aria-label="Mathematical regions">
            {atlas.regions.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={entry.id === region?.id}
                onClick={() => {
                  setRegionId(entry.id);
                  setQuery("");
                }}
                className={cx(
                  "flex flex-col gap-1 text-left px-3.5 py-3 border rounded-md transition-colors cursor-pointer",
                  entry.id === region?.id
                    ? "bg-accent-soft border-accent-line text-accent"
                    : "bg-surface-2 border-line text-ink-muted hover:text-ink hover:border-line-strong",
                )}
              >
                <span className="text-[13.5px] font-semibold leading-tight">{entry.name}</span>
                <span className="font-mono text-[10px] text-ink-faint">
                  {entry.concepts.length} ideas
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5 bg-inset border border-line rounded-[10px]">
          <Eyebrow>Find any idea</Eyebrow>
          <label className="sr-only" htmlFor="atlas-search">Search all course concepts</label>
          <input
            id="atlas-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pythagoras, entropy, proof…"
            className="w-full font-sans text-[14.5px] px-3.5 py-3 bg-surface border border-line-strong rounded-md placeholder:text-ink-faint focus:outline-none focus:border-accent"
          />
          <p className="text-[13.5px] leading-[1.55] text-ink-dim">
            Search definitions, lesson names and tracks. The result opens the
            lesson where the idea is built.
          </p>
        </div>
      </div>

      {query.trim() ? (
        <ConceptGrid concepts={matches} empty="No concept in this course matches that search yet." />
      ) : region ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 items-start">
            <div className="flex flex-col gap-1">
              <div className="text-xl font-semibold">{region.name}</div>
              <div className="font-serif italic text-[17px] text-accent">{region.question}</div>
            </div>
            <p className="text-sm leading-[1.55] text-ink-muted max-w-[55ch]">{region.thesis}</p>
          </div>
          <ConceptGrid concepts={region.concepts} />
        </div>
      ) : null}

      {path && (
        <div className="flex flex-col gap-4 p-5 sm:p-6 bg-surface-3 border border-line border-l-2 border-l-gold rounded-[10px]">
          <div className="flex flex-wrap gap-2">
            {atlas.paths.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPathId(entry.id)}
                className={cx(
                  "font-mono text-[11px] rounded-full px-3.5 py-2 border transition-colors cursor-pointer",
                  entry.id === path.id
                    ? "text-gold bg-gold-surface border-gold-line"
                    : "text-ink-dim bg-surface border-line hover:text-ink",
                )}
              >
                {entry.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <Eyebrow tone="gold">Follow one idea</Eyebrow>
            <h3 className="text-xl sm:text-[23px] font-semibold tracking-[-0.02em]">{path.name}</h3>
            <p className="text-[15px] leading-[1.65] text-gold-ink max-w-[70ch]">{path.thesis}</p>
          </div>
          <ConceptPathRail concepts={path.concepts} />
        </div>
      )}
    </div>
  );
}

function ConceptGrid({
  concepts,
  empty = "",
}: {
  concepts: ConceptNode[];
  empty?: string;
}) {
  if (concepts.length === 0) {
    return <div className="p-5 bg-surface border border-line rounded-lg text-ink-dim">{empty}</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-2.5">
      {concepts.map((concept) => (
        <Link
          key={concept.id}
          href={`/lesson/${concept.id}`}
          className="group flex flex-col gap-2 p-4 sm:p-[18px] bg-surface border border-line rounded-lg hover:border-accent-line transition-colors"
        >
          <div className="flex justify-between gap-3 items-baseline">
            <span className="text-[15.5px] font-semibold group-hover:text-accent transition-colors">
              {concept.title}
            </span>
            <span className="font-mono text-[10px] text-ink-faint shrink-0">{concept.trackName}</span>
          </div>
          <p className="text-[13.5px] leading-[1.55] text-ink-muted">{concept.definition}</p>
        </Link>
      ))}
    </div>
  );
}

export function ConceptPathRail({ concepts }: { concepts: ConceptNode[] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 overflow-x-auto pb-1">
      {concepts.map((concept, index) => (
        <div key={concept.id} className="contents">
          {index > 0 && (
            <div className="self-center font-mono text-sm text-gold-dim rotate-90 sm:rotate-0" aria-hidden>
              →
            </div>
          )}
          <Link
            href={`/lesson/${concept.id}`}
            className="flex flex-col gap-1.5 min-w-[145px] flex-1 px-3.5 py-3 bg-gold-inset border border-gold-line rounded-md hover:border-gold transition-colors"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-gold-dim">
              {concept.trackName}
            </span>
            <span className="text-[13.5px] leading-[1.35] font-medium">{concept.title}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
