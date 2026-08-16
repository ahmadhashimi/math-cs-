import { TRACKS, THREADS } from "@/data/course-data";

export type ConceptRelation =
  | "requires"
  | "becomes"
  | "generalizes"
  | "inverse"
  | "reappears"
  | "powers";

export type ConceptRegion = {
  id: string;
  name: string;
  question: string;
  thesis: string;
  trackIds: string[];
};

export type ConceptNode = {
  id: string;
  title: string;
  definition: string;
  trackId: string;
  trackName: string;
  regionId: string;
  position: number;
  notation: { label: string; expression: string; note: string }[];
};

export type ConceptEdge = {
  from: string;
  to: string;
  relation: ConceptRelation;
  note: string;
};

export type ConceptPath = {
  id: string;
  name: string;
  thesis: string;
  nodeIds: string[];
};

export type CourseAtlas = {
  regions: (ConceptRegion & { concepts: ConceptNode[] })[];
  paths: (ConceptPath & { concepts: ConceptNode[] })[];
  conceptCount: number;
};

export type LessonConceptContext = {
  concept: ConceptNode;
  buildsFrom: { concept: ConceptNode; relation: ConceptRelation; note: string }[];
  leadsTo: { concept: ConceptNode; relation: ConceptRelation; note: string }[];
  paths: { id: string; name: string }[];
};

/**
 * The course sequence and the mathematical map answer different questions.
 * Tracks say what to study next. Regions say what kind of object or move the
 * learner is looking at, so a theorem can keep its identity when it reappears
 * three semesters later under a new name.
 */
export const CONCEPT_REGIONS: ConceptRegion[] = [
  {
    id: "quantity",
    name: "Quantity",
    question: "What can a number mean?",
    thesis: "Signs, fractions, powers and ratios are the atoms every later structure is built from.",
    trackIds: ["prealgebra"],
  },
  {
    id: "relations",
    name: "Relations",
    question: "How do quantities constrain each other?",
    thesis: "Equations and functions turn a dependency into something you can solve, invert and transform.",
    trackIds: ["algebra", "precalc"],
  },
  {
    id: "space",
    name: "Space",
    question: "How do number and shape become the same thing?",
    thesis: "Coordinates make geometry computable; trigonometry turns direction, distance and rotation into arithmetic.",
    trackIds: ["trig"],
  },
  {
    id: "change",
    name: "Change",
    question: "What is moving, and what is accumulating?",
    thesis: "Calculus reads local motion with derivatives and reconstructs totals with integrals.",
    trackIds: ["calc1", "calc2"],
  },
  {
    id: "proof-structure",
    name: "Proof & structure",
    question: "Why must it work for every case?",
    thesis: "Logic, sets, relations and graphs expose the structure that a correct algorithm is allowed to exploit.",
    trackIds: ["discrete", "graphs"],
  },
  {
    id: "uncertainty",
    name: "Uncertainty",
    question: "What can be known before the outcome arrives?",
    thesis: "Counting builds the sample space; probability and expectation price uncertainty inside it.",
    trackIds: ["prob"],
  },
  {
    id: "computation",
    name: "Computation",
    question: "Which work is possible, and which shortcut is justified?",
    thesis: "Number theory, complexity and landmark algorithms turn mathematical structure into executable strategy.",
    trackIds: ["numtheory", "algo", "landmark"],
  },
  {
    id: "intelligence",
    name: "Machine intelligence",
    question: "How does a model represent, compare and improve?",
    thesis: "Vectors represent; dot products compare; matrices transform; gradients learn; probability measures belief.",
    trackIds: ["ai"],
  },
];

const REGION_BY_TRACK = new Map(
  CONCEPT_REGIONS.flatMap((region) =>
    region.trackIds.map((trackId) => [trackId, region.id] as const),
  ),
);

const CONCEPTS: ConceptNode[] = TRACKS.flatMap((track) =>
  track.lessons.map((lesson, position) => ({
    id: lesson.id,
    title: lesson.title,
    definition: lesson.idea,
    trackId: track.id,
    trackName: track.n,
    regionId: REGION_BY_TRACK.get(track.id) ?? "quantity",
    position,
    notation: lesson.f.slice(0, 2).map(([label, expression, note]) => ({
      label,
      expression,
      note,
    })),
  })),
);

const CONCEPT_BY_ID = new Map(CONCEPTS.map((concept) => [concept.id, concept]));

/** The lesson-order spine: the minimum dependency map, never the whole story. */
const SEQUENCE_EDGES: ConceptEdge[] = TRACKS.flatMap((track) =>
  track.lessons.slice(1).map((lesson, index) => ({
    from: track.lessons[index].id,
    to: lesson.id,
    relation: "requires" as const,
    note: `The ${lesson.title.toLowerCase()} lesson starts from the language established immediately before it.`,
  })),
);

/**
 * Cross-track bridges are deliberately typed. “Related” is too weak to teach
 * from: the learner needs to know whether an idea is a prerequisite, an
 * inverse, a special case becoming a general one, or machinery being reused.
 */
const CROSS_EDGES: ConceptEdge[] = [
  { from: "exponents", to: "quadratics", relation: "powers", note: "A quadratic is an equation whose highest power is two." },
  { from: "fractions", to: "rational", relation: "generalizes", note: "A rational expression is fraction arithmetic with polynomials in place of numbers." },
  { from: "ratios", to: "right-triangles", relation: "becomes", note: "Sine, cosine and tangent are ratios that stay fixed when a triangle is scaled." },
  { from: "coordinates", to: "right-triangles", relation: "powers", note: "Coordinate differences become the two perpendicular legs whose length Pythagoras recovers." },
  { from: "right-triangles", to: "unit-circle", relation: "becomes", note: "Put every right triangle on a circle of radius one and its side ratios become coordinates." },
  { from: "right-triangles", to: "identities", relation: "becomes", note: "Pythagoras on a unit hypotenuse becomes sin²θ + cos²θ = 1." },
  { from: "right-triangles", to: "law-sines", relation: "generalizes", note: "The law of cosines is Pythagoras with a correction for angles that are not 90°." },
  { from: "right-triangles", to: "vectors", relation: "generalizes", note: "Vector magnitude is Pythagoras extended from two perpendicular components to n." },
  { from: "vectors", to: "dotproduct", relation: "powers", note: "Lengths make the angle form of the dot product and cosine similarity possible." },
  { from: "unit-circle", to: "dotproduct", relation: "reappears", note: "Cosine returns as the normalized measure of how two vectors point." },
  { from: "linear", to: "limits", relation: "powers", note: "A derivative begins as the slope formula applied over a shrinking interval." },
  { from: "functions", to: "transformations", relation: "powers", note: "You cannot transform, compose or invert a rule until it is understood as a function." },
  { from: "functions", to: "limits", relation: "powers", note: "Calculus studies how function outputs behave as their inputs move." },
  { from: "exponential", to: "logarithms", relation: "inverse", note: "A logarithm asks which exponent produced the number." },
  { from: "logarithms", to: "bigo", relation: "reappears", note: "Every repeated halving in an algorithm creates a logarithmic cost." },
  { from: "limits", to: "derivatives", relation: "becomes", note: "The derivative is the limit of secant slopes." },
  { from: "derivatives", to: "integrals", relation: "inverse", note: "The fundamental theorem makes accumulation and instantaneous change inverse views of one process." },
  { from: "derivatives", to: "gradient-descent", relation: "generalizes", note: "A gradient collects one derivative per parameter and points uphill." },
  { from: "chain-rule", to: "gradient-descent", relation: "powers", note: "Backpropagation is the chain rule applied through a composition of model layers." },
  { from: "series", to: "taylor", relation: "becomes", note: "A Taylor series chooses the coefficients of an infinite series from derivatives." },
  { from: "logic", to: "boolean", relation: "becomes", note: "Boolean algebra turns logical truth values into operations a circuit can execute." },
  { from: "sets", to: "relations", relation: "powers", note: "A relation is a set of allowed ordered pairs." },
  { from: "proofs", to: "induction", relation: "generalizes", note: "Induction is the proof pattern for recursively built objects and statements indexed by integers." },
  { from: "induction", to: "recurrence", relation: "powers", note: "Recurrences define a problem from smaller copies; induction proves the resulting claim." },
  { from: "relations", to: "representation", relation: "becomes", note: "A graph is a relation made visible as vertices and edges." },
  { from: "trees", to: "binary-search", relation: "reappears", note: "A balanced search tree preserves binary search's halving structure under updates." },
  { from: "counting", to: "probability", relation: "powers", note: "Classical probability divides favourable outcomes by the size of the counted sample space." },
  { from: "conditional", to: "bayes", relation: "becomes", note: "Bayes' theorem reverses a conditional probability by accounting for the base rate." },
  { from: "expected-value", to: "entropy", relation: "reappears", note: "Entropy is an expected information value over possible outcomes." },
  { from: "factors", to: "modular", relation: "becomes", note: "Remainders turn divisibility into arithmetic on equivalence classes." },
  { from: "gcd", to: "mod-inverse", relation: "powers", note: "Extended Euclid produces an inverse exactly when the gcd is one." },
  { from: "mod-inverse", to: "rsa", relation: "powers", note: "RSA chooses exponents that undo each other modulo the totient." },
  { from: "recurrences", to: "sorting", relation: "reappears", note: "Merge sort's running time is the recurrence created by splitting, solving and merging." },
  { from: "bigo", to: "loops", relation: "powers", note: "Loop structure becomes a growth-rate expression through Big-O." },
  { from: "develop", to: "dp", relation: "reappears", note: "Overlapping subproblems are the property that justifies dynamic programming." },
  { from: "develop", to: "greedy", relation: "reappears", note: "A provably safe local choice is the property that justifies greed." },
  { from: "vectors", to: "matrices", relation: "powers", note: "A matrix is a function whose inputs and outputs are vectors." },
  { from: "matrices", to: "gradient-descent", relation: "powers", note: "Training changes the entries of the model's matrices to reduce loss." },
  { from: "probability", to: "bayes", relation: "powers", note: "Bayes updates a probability after evidence arrives." },
  { from: "logarithms", to: "entropy", relation: "powers", note: "The logarithm turns probability into information and makes independent surprises add." },
];

/** Existing recurring-move threads become graph edges instead of a second map. */
const THREAD_EDGES: ConceptEdge[] = THREADS.flatMap((thread) =>
  thread.steps.slice(1).map(([to, note], index) => ({
    from: thread.steps[index][0],
    to,
    relation: "reappears" as const,
    note: `${thread.n}: ${note}.`,
  })),
);

const ALL_EDGES: ConceptEdge[] = [
  ...SEQUENCE_EDGES,
  ...CROSS_EDGES,
  ...THREAD_EDGES,
];

const invalidEdge = ALL_EDGES.find(
  (edge) => !CONCEPT_BY_ID.has(edge.from) || !CONCEPT_BY_ID.has(edge.to),
);
if (invalidEdge) {
  throw new Error(
    `Concept edge points at an unknown lesson: ${invalidEdge.from} -> ${invalidEdge.to}`,
  );
}

export const CONCEPT_EDGES: ConceptEdge[] = ALL_EDGES;

export const CONCEPT_PATHS: ConceptPath[] = [
  {
    id: "pythagoras",
    name: "Pythagoras keeps changing names",
    thesis: "One statement about a right triangle becomes distance, an identity, a general triangle law, vector length and finally machine similarity.",
    nodeIds: ["exponents", "coordinates", "right-triangles", "identities", "law-sines", "vectors", "dotproduct"],
  },
  {
    id: "halving",
    name: "Halving becomes speed",
    thesis: "Doubling, logarithms, binary search, divide-and-conquer recurrences and balanced trees are one move seen from different sides.",
    nodeIds: ["exponents", "logarithms", "binary-search", "recurrences", "sorting", "trees"],
  },
  {
    id: "learning",
    name: "The mathematics of learning",
    thesis: "Functions compose into layers; derivatives travel backward; probability scores belief; gradients improve the weights.",
    nodeIds: ["functions", "chain-rule", "probability", "vectors", "matrices", "gradient-descent", "entropy"],
  },
];

export function courseAtlas(): CourseAtlas {
  return {
    regions: CONCEPT_REGIONS.map((region) => ({
      ...region,
      concepts: CONCEPTS.filter((concept) => concept.regionId === region.id),
    })),
    paths: CONCEPT_PATHS.map((path) => ({
      ...path,
      concepts: path.nodeIds.flatMap((id) => {
        const concept = CONCEPT_BY_ID.get(id);
        return concept ? [concept] : [];
      }),
    })),
    conceptCount: CONCEPTS.length,
  };
}

export function getLessonConceptContext(lessonId: string): LessonConceptContext | null {
  const concept = CONCEPT_BY_ID.get(lessonId);
  if (!concept) return null;

  const incoming = CONCEPT_EDGES.filter((edge) => edge.to === lessonId)
    .map((edge) => {
      const source = CONCEPT_BY_ID.get(edge.from);
      return source
        ? { concept: source, relation: edge.relation, note: edge.note }
        : null;
    })
    .filter(
      (
        entry,
      ): entry is { concept: ConceptNode; relation: ConceptRelation; note: string } =>
        Boolean(entry),
    );

  const distinctIncoming = incoming.filter(
    (entry, index, entries) =>
      entries.findIndex((candidate) => candidate.concept.id === entry.concept.id) ===
      index,
  );

  const immediatePrerequisite = distinctIncoming.filter(
    (entry) => entry.relation === "requires",
  ).slice(-1);
  const conceptualSources = distinctIncoming.filter(
    (entry) => entry.relation !== "requires",
  ).slice(0, 3);

  const outgoing = CONCEPT_EDGES.filter((edge) => edge.from === lessonId)
    .map((edge) => {
      const target = CONCEPT_BY_ID.get(edge.to);
      return target
        ? { concept: target, relation: edge.relation, note: edge.note }
        : null;
    })
    .filter(
      (
        entry,
      ): entry is { concept: ConceptNode; relation: ConceptRelation; note: string } =>
        Boolean(entry),
    );

  const distinctDestinations = outgoing
    .filter((entry) => entry.relation !== "requires")
    .filter(
      (entry, index, entries) =>
        entries.findIndex(
          (candidate) => candidate.concept.id === entry.concept.id,
        ) === index,
    );

  return {
    concept,
    buildsFrom: [...immediatePrerequisite, ...conceptualSources],
    leadsTo: distinctDestinations.slice(0, 5),
    paths: CONCEPT_PATHS.filter((path) => path.nodeIds.includes(lessonId)).map(
      ({ id, name }) => ({ id, name }),
    ),
  };
}
