import type { Metadata } from "next";
import Link from "next/link";
import { LadderExplorer, type Rung } from "@/components/start/LadderExplorer";
import { Quadrant } from "@/components/start/Quadrant";
import { CourseFooter, Eyebrow, PhaseRule } from "@/components/ui";
import { COURSE_STATS, FIRST_LESSON_ID } from "@/lib/course";

export const metadata: Metadata = {
  title: "Before you start · Math for a CS Degree",
  description:
    "A preface from Mujtaba Hashimi, then why the mathematics is there at all, where it came from, and what a neural network is actually made of — read before the first lesson.",
};

/**
 * The preface. First person, and left in the author's own words — this is the
 * one page in the course that is not teaching anything, and it should not
 * sound like the rest of it.
 */
const PREFACE: string[] = [
  "I grew up in Afghanistan, and for most of the time I was a student there, I hated mathematics.",
  "I started coding at eight years old on an old Toshiba laptop, writing plain HTML. I loved it immediately, and I never once connected it to the subject I was failing to care about in class. They did not feel related. One was something I was building; the other was a list of rules I was supposed to repeat back correctly.",
  "It took me a long time to work out that what I hated was not mathematics. It was the way it had been handed to me. The formula always arrived finished. Here it is — use it. Nobody said where it came from, and it never occurred to me that it had come from anywhere at all, that a person had sat down and derived it because they needed it. A formula given to you with no reason behind it is not knowledge. It is an instruction, and you cannot love something you are only permitted to obey.",
  "I fell in love with mathematics the day I found out that every one of those formulas was derived, by someone, for a reason — and that I could follow the derivation myself, slowly, and end up at the same place they did. That is the whole difference. Not talent. Nobody told me it was allowed.",
  "I am writing this in the age of AI, and it has raised the stakes on exactly this point. A model will hand you a finished answer in seconds, with no derivation, delivered with total confidence — the same thing that made me hate the subject as a child, except now it is instant and far more persuasive. These tools are genuinely useful and I use them every day. But they are black boxes, and the person who cannot do the mathematics has no way to tell a correct answer from a confident one.",
  "That is the real risk facing anyone taking a CS degree right now. Not that the tools are bad. That you can travel a very long way without understanding anything, and never notice how far out you are — until the day the machine is wrong, or subtly wrong, and you cannot argue with it, cannot check it, cannot reason alongside it, because you never built the thing you would need to reason with.",
  "So please do not cheat. Not because it is against a rule, but because there is nobody on the other end of it to fool. A skipped lesson does not come due at the exam. It comes due years later, in a room where it matters, and it will not announce itself.",
  "Without foundations you are not going to win in computer science. Foundations matter the most. Everything impressive in this field is standing on something ordinary, and the ordinary part is the part almost everyone skips.",
  "Start at the beginning. Take your time. It is worth it.",
];

/**
 * The ladder. This is the concrete answer to "what do I need in order to build
 * a neural network", and the reason the course starts where it starts: each
 * rung is genuinely made of the one below it, so there is no rung to skip.
 * `rests` reads downward — the move on the left is built out of what is on the
 * right, ending at something taught in pre-algebra.
 */
const LADDER: Rung[] = [
  {
    tab: "Become numbers",
    move: "Turn the input into numbers",
    plain:
      "A picture, a word, a user — none of them are mathematics until they are a list of numbers. That list is a vector. Drag the arrow: two numbers are a point, and a point is a thing you can do arithmetic to.",
    rests:
      "vectors ← the coordinate plane ← signed numbers, because half the coordinates are negative",
    graph: "vector",
    figureNote:
      "Two components here. A word in a language model has a few thousand, which changes nothing about the mathematics and everything about what it can express.",
  },
  {
    tab: "Multiply",
    move: "Multiply by a grid of numbers",
    plain:
      "A layer of a network is one matrix multiply. Every output is a row of weights times the input, added up — and that sum, multiply-then-add across two lists, is a dot product.",
    rests:
      "matrices ← dot products ← multiplication, addition and the order you do them in",
    figureNote:
      "Take [2, 3] and weights [10, 1]: 2×10 + 3×1 = 23. One output number. A layer does that once per row of the weight grid, and a GPU does it a few trillion times a second. Nothing harder than times and plus is happening.",
  },
  {
    tab: "Bend it",
    move: "Bend it",
    plain:
      "Stack matrix multiplies with nothing between them and the whole stack collapses into a single one — depth would buy you nothing. The bend is what makes layers mean anything. The usual bend is the plainest rule imaginable: keep it if positive, otherwise zero.",
    rests:
      "activation functions ← piecewise functions ← inequalities, which is what 'otherwise zero' is",
    graph: "relu",
    figureNote:
      "Drag the slope. At zero it is the standard ReLU — a straight line with one kink in it. That kink is the entire non-linearity, and it is the reason deep networks can represent anything curved.",
  },
  {
    tab: "Score it",
    move: "Measure how wrong it is",
    plain:
      "One number for the whole answer: the loss. For a classifier it is cross-entropy, built out of logarithms of the probabilities the model assigned. Confident and right costs almost nothing; confident and wrong costs enormously.",
    rests:
      "cross-entropy ← logarithms ← exponents ← fractions, since probabilities are fractions",
    graph: "entropy",
    figureNote:
      "Entropy is the same machinery: how surprising an outcome is, in bits. A fair coin is maximally uncertain at p = 0.5, and a coin that always lands heads tells you nothing at all.",
  },
  {
    tab: "Roll downhill",
    move: "Nudge every number downhill",
    plain:
      "Ask each weight which direction would make the loss smaller, then take a small step that way. Repeat a few million times. That is training — there is no other secret in it.",
    rests:
      "gradient descent ← derivatives ← limits ← functions ← solving an equation for an unknown",
    graph: "descent",
    figureNote:
      "Drag the learning rate past about 1.0 and watch the steps overshoot and fly apart. Everyone who has trained a model has seen exactly this, and the fix is a fact about slopes, not about code.",
  },
];

/**
 * A short history, chosen for one property: every entry is a thing this course
 * later teaches. It is here to make the subject feel like something people
 * built, over a long time, mostly by being stuck.
 */
const HISTORY: { when: string; what: string; why: string }[] = [
  {
    when: "c. 20,000 BCE",
    what: "Tally marks on the Ishango bone",
    why: "Counting is older than writing. Before anyone could record a name, they were recording how many.",
  },
  {
    when: "c. 1800 BCE",
    what: "Plimpton 322",
    why: "A Babylonian clay tablet listing Pythagorean triples — more than a thousand years before Pythagoras. The result is older than the man it is named after.",
  },
  {
    when: "c. 300 BCE",
    what: "Euclid's Elements",
    why: "The invention of proof: an argument that settles infinitely many cases at once. It stayed in use as a textbook for roughly two thousand years.",
  },
  {
    when: "c. 628 CE",
    what: "Brahmagupta writes rules for zero and negatives",
    why: "Negative numbers were justified as debts. Every sign error you will make in the first lesson was a live research question once.",
  },
  {
    when: "c. 820 CE",
    what: "al-Khwarizmi, al-jabr",
    why: "The book that names algebra — al-jabr, 'restoring', the move of adding the same thing to both sides. His own name, Latinised, became the word algorithm.",
  },
  {
    when: "1637",
    what: "Descartes joins geometry to algebra",
    why: "Coordinates. Once a point is a pair of numbers, a shape becomes an equation and an equation becomes a picture. Every graph in this course is that one idea.",
  },
  {
    when: "1670s",
    what: "Newton and Leibniz, independently, invent calculus",
    why: "Two people, no contact, the same machinery for rates of change — then a bitter priority dispute that soured English and continental mathematics for a century.",
  },
  {
    when: "1854",
    what: "Boole, The Laws of Thought",
    why: "Logic written as algebra, with true and false as the only two values. It was received as a philosophical curiosity with no use.",
  },
  {
    when: "1937",
    what: "Shannon connects Boole to circuits",
    why: "A master's thesis showing that Boole's algebra describes electrical switching exactly. Eighty years of unused mathematics became the design rule for every digital computer.",
  },
  {
    when: "1943",
    what: "McCulloch and Pitts model a neuron",
    why: "A neuron as a weighted sum with a threshold — arithmetic, nothing more. The mathematical object at the centre of modern AI is this old.",
  },
  {
    when: "1986",
    what: "Backpropagation reaches a wide audience",
    why: "Rumelhart, Hinton and Williams show how to push the error backwards through the layers. It is the chain rule from Calculus I, applied carefully.",
  },
  {
    when: "2017",
    what: "Attention Is All You Need",
    why: "The transformer — the architecture behind current language models. Its central operation is a dot product asking how similar two vectors are.",
  },
];

/** Things that are true and do not sound true. The point is that intuition is not a proof. */
const CURIOSITIES: { claim: string; body: string }[] = [
  {
    claim: "0.999… = 1",
    body: "Not nearly one. Exactly one. They are two spellings of the same number — if they differed, some number would have to sit between them, and none does.",
  },
  {
    claim: "23 people, even odds of a shared birthday",
    body: "It feels like it should take hundreds. But you are not comparing yourself to everyone, you are comparing every pair — and 23 people make 253 pairs.",
  },
  {
    claim: "Some infinities are bigger than others",
    body: "Cantor proved the numbers between 0 and 1 cannot be paired off with the counting numbers. No matter how you list them, you can always construct one you missed.",
  },
  {
    claim: "Your card shuffle has probably never happened before",
    body: "A deck can be ordered 52! ways — about 8 followed by 67 zeros. Shuffle properly and that order is, near enough, new to the universe.",
  },
  {
    claim: "A shape with finite volume and infinite surface",
    body: "Gabriel's horn. You could fill it with paint and never have enough paint to coat the inside. Both statements are correct.",
  },
  {
    claim: "Fraudulent books get caught by first digits",
    body: "In real accounting data, leading digits are not uniform — 1 leads about 30% of the time. Benford's law, and auditors use it.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 lg:pt-16 pb-24 lg:pb-30 flex flex-col gap-12 sm:gap-14 animate-rise">
      <section className="flex flex-col gap-5 px-5 py-7 sm:px-8 sm:py-9 bg-gold-surface border border-gold-line border-l-[3px] border-l-gold rounded-lg">
        <div className="flex flex-col gap-2">
          <Eyebrow tone="gold" className="tracking-[0.18em]">
            Preface
          </Eyebrow>
          <h2 className="text-[clamp(1.5rem,4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.03em] max-w-[24ch]">
            A formula given with no reason behind it is not{" "}
            <em className="font-serif italic font-medium text-gold">
              knowledge
            </em>
            .
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {PREFACE.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[16.5px] sm:text-[17.5px] leading-[1.72] text-gold-ink max-w-[66ch]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1 pt-2 border-t border-gold-line">
          <span className="font-serif italic text-[19px] text-ink pt-3">
            Mujtaba Hashimi
          </span>
          <span className="text-[13.5px] text-gold-ink">
            Self-taught STEM and AI engineer · Founder
          </span>
          <span className="font-mono text-[12.5px] text-gold-dim">
            Seattle, Washington · 15 August 2026
          </span>
        </div>
      </section>

      <header className="flex flex-col gap-4">
        <Eyebrow tone="accent" className="tracking-[0.18em]">
          Before the first lesson
        </Eyebrow>
        <h1 className="text-[clamp(2.25rem,6.5vw,4rem)] leading-[1.04] font-semibold tracking-[-0.04em] max-w-[18ch]">
          You already know how to{" "}
          <em className="font-serif italic font-medium text-accent">count</em>.
          This is about what that turned into.
        </h1>
        <p className="text-[clamp(1.0625rem,2.4vw,1.1875rem)] leading-[1.65] text-ink-muted max-w-[64ch]">
          You are about to spend a long time on arithmetic you were taught once
          and half remember. Before any of that, it is worth knowing what the
          subject actually is, where it came from, and what it is for — because
          the honest answer to &ldquo;why do I need this&rdquo; is specific, and
          nobody usually gives it to you.
        </p>
        <p className="text-[15px] leading-[1.6] text-ink-faint max-w-[64ch]">
          Nothing here is examined. Read it once, then start.
        </p>
      </header>

      <section className="flex flex-col gap-5">
        <PhaseRule
          step="01"
          label="Why math"
          note="What the subject is, and what it is doing in a computing degree"
        />

        <p className="text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[68ch]">
          Mathematics is not calculation. A computer beats you at calculation and
          always will — that argument was lost decades ago and it never mattered.
          Mathematics is the practice of making a claim that covers infinitely
          many cases at once, and being able to say why it holds. &ldquo;This
          sorting method is correct&rdquo; is not a claim about the list you
          tried. It is a claim about every list that will ever exist, including
          the ones nobody has written down yet. No amount of testing reaches
          that. An argument does.
        </p>

        <p className="text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[68ch]">
          That is the whole reason it sits inside a computing degree. The machine
          will do the arithmetic. What it cannot do is decide which arithmetic is
          worth doing, tell you that your approach will still be running next
          year, or explain why the thing that worked on a hundred rows dies on a
          million. Those are the questions you are hired for, and every one of
          them is answered in mathematics.
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <Eyebrow tone="accent">Start with the smallest possible version</Eyebrow>
          <p className="text-[16.5px] leading-[1.65] text-ink-muted max-w-[68ch]">
            Here is the first idea in the course, and you can move it. A
            position is a pair of numbers. Which quadrant it lands in is nothing
            more than the sign of each one — that is all a quadrant has ever
            been. Drag it into the bottom-left and watch both numbers go
            negative.
          </p>
        </div>

        <Quadrant />

        <p className="text-[16.5px] leading-[1.7] text-ink-muted max-w-[68ch]">
          That is a vector. You have just done the first of the five things a
          neural network does, and the only difference at the far end of this
          course is that the list is longer than two.
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <Eyebrow tone="accent">
            What a neural network is actually made of
          </Eyebrow>
          <p className="text-[16.5px] leading-[1.65] text-ink-muted max-w-[68ch]">
            This course ends at the mathematics a model runs on, so it is fair to
            ask what is really up there. A network is five moves. Not a metaphor
            — five operations, each one built out of the one below it, all the
            way down to what you will meet in the first eleven lessons.
          </p>
        </div>

        <LadderExplorer rungs={LADDER} />

        <p className="text-[17px] leading-[1.7] text-ink-muted max-w-[68ch]">
          Read the right-hand column from the bottom up and you have the syllabus,
          in order, for a reason. This is also why the course refuses to let you
          skip: nobody is stopped by backpropagation. They are stopped by signs,
          by fractions, by not being fluent enough with a logarithm to see what a
          loss function is saying. The interesting ceiling is almost always a
          boring floor.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <PhaseRule
          step="02"
          label="Where it came from"
          note="Every entry below is something this course later teaches"
        />

        <p className="text-[17px] leading-[1.7] text-ink-muted max-w-[68ch]">
          Mathematics is taught as if it arrived finished. It did not. It was
          built slowly, by people who were mostly stuck, and the ideas you will
          find hardest were the ones that took longest to arrive — negative
          numbers were controversial for centuries. If a lesson feels
          unreasonable, you are usually in good company historically.
        </p>

        <ol className="flex flex-col">
          {HISTORY.map((entry) => (
            <li
              key={entry.what}
              className="grid sm:grid-cols-[130px_1fr] gap-x-5 gap-y-1 py-4 border-b border-line last:border-b-0"
            >
              <span className="font-mono text-[12.5px] text-gold pt-1">
                {entry.when}
              </span>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-[16.5px] font-semibold leading-snug">
                  {entry.what}
                </span>
                <span className="text-[15.5px] leading-[1.6] text-ink-muted">
                  {entry.why}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-[17px] leading-[1.7] text-ink-muted max-w-[68ch]">
          Notice the gap between Boole and Shannon: eighty years in which
          Boolean algebra was of no use to anybody. The mathematics that turns
          out to matter is rarely the mathematics that looked useful at the time,
          which is the honest reason a degree makes you learn more than you can
          currently justify.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <PhaseRule
          step="03"
          label="Things that are true anyway"
          note="Where intuition and proof disagree, proof wins"
        />

        <p className="text-[17px] leading-[1.7] text-ink-muted max-w-[68ch]">
          The most useful habit this subject gives you is distrusting your own
          certainty. Each of these is established beyond argument, and each one
          feels wrong the first time — which is the point.
        </p>

        <div data-stagger="1" className="grid sm:grid-cols-2 gap-3">
          {CURIOSITIES.map((item) => (
            <div
              key={item.claim}
              className="flex flex-col gap-2 p-5 bg-surface border border-line rounded-lg"
            >
              <div className="font-mono text-[14px] text-gold">{item.claim}</div>
              <p className="text-[15px] leading-[1.6] text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <PhaseRule
          step="04"
          label="Then: pre-algebra"
          note={`${COURSE_STATS.lessons} lessons ahead, and this is the first of them`}
        />

        <p className="text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[68ch]">
          Pre-algebra has a bad name because it is taught as rules to memorise.
          It is not rules. It is the small set of facts about numbers that
          everything above it quietly assumes you will never get wrong — what a
          minus sign means, why you multiply before you add, what a fraction
          actually is. Every one of those shows up again, unannounced, inside
          something much larger.
        </p>

        <p className="text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[68ch]">
          It is first because it is load-bearing, not because it is easy. Take it
          slowly, do the drills even when you are sure, and let the exam tell you
          the truth rather than deciding for yourself that you knew it.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/lesson/${FIRST_LESSON_ID}`}
            className="font-mono text-[14px] font-semibold rounded-md px-8 py-4 bg-accent text-accent-ink hover:bg-accent-hover transition-colors"
          >
            Start the first lesson →
          </Link>
          <Link
            href="/"
            className="font-mono text-[14px] rounded-md px-6 py-4 text-ink-muted border border-line-strong hover:text-ink hover:border-ink-faint transition-colors"
          >
            See the whole course
          </Link>
        </div>
      </section>

      <CourseFooter className="border-t border-line" />
    </div>
  );
}
