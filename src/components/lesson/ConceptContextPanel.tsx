import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import type { LessonConceptContext } from "@/lib/concept-graph";

const RELATION_LABEL = {
  requires: "requires",
  becomes: "becomes",
  generalizes: "generalizes into",
  inverse: "meets its inverse in",
  reappears: "reappears in",
  powers: "powers",
} as const;

const SOURCE_RELATION_LABEL = {
  requires: "after",
  becomes: "from",
  generalizes: "extends",
  inverse: "inverse of",
  reappears: "echoes",
  powers: "uses",
} as const;

export function ConceptContextPanel({ context }: { context: LessonConceptContext }) {
  const { concept, buildsFrom, leadsTo, paths } = context;

  return (
    <section className="grid items-start md:grid-cols-[1.15fr_0.85fr] gap-3">
      <div className="flex flex-col gap-3 p-5 sm:p-[22px] bg-accent-soft border border-accent-line rounded-lg">
        <Eyebrow tone="accent">Definition</Eyebrow>
        <p className="text-[17px] sm:text-lg leading-[1.65] text-ink">{concept.definition}</p>
        {concept.notation[0] && (
          <div className="flex flex-col gap-1.5 pt-3 border-t border-accent-line">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
              First formal handle · {concept.notation[0].label}
            </span>
            <span className="font-mono text-[16px] leading-[1.45] text-accent break-words">
              {concept.notation[0].expression}
            </span>
            <span className="text-sm text-ink-muted">{concept.notation[0].note}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-[22px] bg-surface border border-line rounded-lg">
        <div className="flex flex-col gap-2">
          <Eyebrow>Its place in the map</Eyebrow>
          <div className="font-mono text-[11px] text-ink-faint">
            {concept.trackName} · concept {concept.position + 1}
          </div>
        </div>

        {buildsFrom.length > 0 && (
          <ConnectionList
            label="Builds from"
            entries={buildsFrom.map(({ concept: source, relation, note }) => ({
              id: source.id,
              title: source.title,
              prefix: SOURCE_RELATION_LABEL[relation],
              note,
            }))}
          />
        )}

        {leadsTo.length > 0 && (
          <ConnectionList
            label="This returns later"
            entries={leadsTo.map(({ concept: target, relation, note }) => ({
              id: target.id,
              title: target.title,
              prefix: RELATION_LABEL[relation],
              note,
            }))}
          />
        )}

        {paths.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {paths.map((path) => (
              <Link
                key={path.id}
                href="/#math-atlas"
                className="font-mono text-[10px] text-gold border border-gold-line bg-gold-surface rounded-full px-3 py-1.5"
              >
                path · {path.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ConnectionList({
  label,
  entries,
}: {
  label: string;
  entries: { id: string; title: string; prefix: string; note: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">{label}</span>
      <div className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <Link
            key={`${entry.id}-${entry.prefix}`}
            href={`/lesson/${entry.id}`}
            title={entry.note}
            className="group flex gap-2 text-[13.5px] leading-[1.45] px-3 py-2 bg-surface-2 border border-line rounded-md hover:border-line-strong"
          >
            <span className="font-mono text-[10px] text-ink-faint pt-[2px] shrink-0">{entry.prefix}</span>
            <span className="text-ink-muted group-hover:text-ink">{entry.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
