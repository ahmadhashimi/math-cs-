"use client";

import { useState } from "react";
import { cx, Eyebrow, Panel } from "@/components/ui";

const bool = (value: boolean) => (value ? "T" : "F");

/** The five columns of a two-variable truth table, recomputed on every flip. */
export function TruthTableDemo() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);

  const cells: [string, boolean][] = [
    ["p", p],
    ["q", q],
    ["p ∧ q", p && q],
    ["p ∨ q", p || q],
    ["p → q", !p || q],
  ];

  const toggleClass = (on: boolean) =>
    cx(
      "font-mono text-sm rounded-[5px] px-5 py-2.5 border cursor-pointer transition-colors",
      on
        ? "bg-accent text-accent-ink border-accent"
        : "bg-transparent text-ink-muted border-line-strong hover:text-ink hover:border-ink-faint",
    );

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-col gap-[7px]">
        <Eyebrow tone="accent">Run it</Eyebrow>
        <div className="text-[17px] sm:text-[19px] font-medium text-ink">
          Flip the inputs and watch every connective respond
        </div>
      </div>

      <div className="flex gap-2.5">
        <button onClick={() => setP((v) => !v)} className={toggleClass(p)}>
          p = {bool(p)}
        </button>
        <button onClick={() => setQ((v) => !v)} className={toggleClass(q)}>
          q = {bool(q)}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {cells.map(([label, value]) => (
          <div
            key={label}
            className={cx(
              "p-4 bg-surface-2 border rounded-md transition-colors duration-[250ms]",
              value ? "border-accent text-accent" : "border-line text-ink-dim",
            )}
          >
            <div className="font-mono text-[15px] text-ink-muted mb-2">{label}</div>
            <div className="font-mono text-[22px] font-semibold">{bool(value)}</div>
          </div>
        ))}
      </div>

      <div className="font-mono text-[13px] sm:text-sm text-ink-dim">
        {!p || q
          ? "// implication holds — a false premise makes it vacuously true"
          : "// the only failing case: premise true, conclusion false"}
      </div>
    </Panel>
  );
}
