// The rigor layer: why each result is actually true.
//
// This is the part a procedures course leaves out and an elite one does not.
// Every entry is a real argument — not a restatement, not a mnemonic — written
// so a motivated beginner can follow every line.
//
// q = the question the argument answers · a = the intuition, shaped like the
// proof · s = the argument, one line per step · m = what having it buys you
export const WHY = {

signed: {
 q: 'Why do two negatives make a positive?',
 a: 'Multiplying by −1 reflects the whole number line about zero. Reflect twice and every point is back where it started — so the second flip has to undo the first. The algebra below is that picture, made airtight.',
 s: ['Start from something nobody disputes: anything times zero is zero. So a × 0 = 0.',
   'Zero can be written as b + (−b), for any b at all. Substituting: a × (b + (−b)) = 0.',
   'Multiplication distributes over addition, so that expands to ab + a(−b) = 0.',
   'Read that as a statement about a(−b): it is the number you add to ab to get zero. That is exactly what “−ab” means, so a(−b) = −ab. One negative flips the sign.',
   'Now run the same argument again with (−a) in place of a: (−a)(−b) = −((−a)b) = −(−ab) = ab. The second flip undoes the first.'],
 m: 'Nothing here was a rule handed to you — it followed from “zero times anything is zero” plus distribution. That is what it means for arithmetic to be forced rather than chosen, and it is why no one can define (−1)(−1) = −1 and keep the rest of algebra.'
},

'order-ops': {
 q: 'Why multiplication before addition, rather than plain left to right?',
 a: 'The convention is not arbitrary etiquette. It is chosen so that the way we write polynomials means what we want without a forest of brackets.',
 s: ['We want to write 3x² + 2x + 7 and have it mean “three x-squareds, plus two xs, plus seven”.',
   'Read strictly left to right, that expression would mean (((3x² + 2)x) + 7) — a completely different function.',
   'To recover the intended reading under left-to-right rules you would have to write it as ((3 × x²) + (2 × x)) + 7, with brackets on every term, forever.',
   'So the precedence rule is the choice that makes the common case bracket-free: the tighter operation binds first. Exponent, then multiply and divide, then add and subtract.',
   'Every programming language inherits the same choice for the same reason, which is why a + b * c parses as a + (b * c) in C, Python, Java and the rest.'],
 m: 'Precedence is a compression scheme for notation. Once you see it as “which brackets are we agreeing to leave out”, operator precedence tables in a language reference stop being trivia to memorise.'
},

fractions: {
 q: 'Why must denominators match before you can add, and why does dividing by a fraction flip it?',
 a: 'A fraction is a count of a unit: 3/8 is three eighths, the way 3 metres is three metres. You can add three metres to two metres. You cannot add three metres to two seconds until you convert.',
 s: ['a/b means “a copies of the unit 1/b”. Addition counts copies, and counting only works when the copies are the same size.',
   'So a/b + c/d needs both written in one unit. The unit 1/(bd) works for both: a/b is ad copies of it, c/d is cb copies.',
   'Hence a/b + c/d = (ad + cb)/(bd). The common denominator is not a ritual — it is a unit conversion.',
   'Now division. a/b ÷ c/d asks: how many c/d fit inside a/b?',
   'Scale both by d/c. Fitting c/d into a/b is the same count as fitting 1 into (a/b)(d/c), and fitting 1 into something is just that something. So a/b ÷ c/d = (a/b)(d/c) — the flip is forced, not a trick.'],
 m: 'Both rules come from one idea: a fraction names a unit. That idea returns for units in physics, for dimensional analysis in engineering, and for normalising probabilities.'
},

exponents: {
 q: 'Why is a⁰ = 1, and why is a⁻ⁿ = 1/aⁿ? Nothing is being multiplied.',
 a: 'They are not extra definitions bolted on. They are the only values that let one rule keep working, and mathematicians chose them the way you would choose the only key that still fits the lock.',
 s: ['Start with the one rule that is obvious from counting factors: aᵐ × aⁿ = aᵐ⁺ⁿ, because you are just putting m copies next to n copies.',
   'Now ask what a⁰ must be if that rule is to survive. Set n = 0: aᵐ × a⁰ = aᵐ⁺⁰ = aᵐ.',
   'So a⁰ is the number that leaves aᵐ unchanged under multiplication. There is exactly one such number: 1. Hence a⁰ = 1, forced.',
   'Same move for negatives. Set n = −m: aᵐ × a⁻ᵐ = aᵐ⁻ᵐ = a⁰ = 1.',
   'So a⁻ᵐ is whatever you multiply aᵐ by to get 1 — the reciprocal. Hence a⁻ᵐ = 1/aᵐ, also forced.'],
 m: 'This is a pattern you will meet repeatedly: a definition is extended past its original meaning by demanding that an existing law keep holding. It is how 0! = 1 is settled, and how exponents are later stretched to fractions and then to the complex numbers.'
},

factors: {
 q: 'Why does adding a number’s digits tell you whether 9 divides it?',
 a: 'Because in the eyes of 9, every power of ten is just 1. Ten is nine-and-one, a hundred is ninety-nine-and-one, and so on — the nines fall away and only the digits are left.',
 s: ['Write any number by its digits: for example 4726 = 4×1000 + 7×100 + 2×10 + 6.',
   'Every power of ten is one more than a run of nines: 10 = 9+1, 100 = 99+1, 1000 = 999+1.',
   'Substitute: 4726 = 4(999+1) + 7(99+1) + 2(9+1) + 6 = [4×999 + 7×99 + 2×9] + [4+7+2+6].',
   'Every term in the first bracket is a multiple of 9. So the whole number is a multiple of 9, plus the digit sum.',
   'Therefore the number is divisible by 9 exactly when its digit sum is. The same argument with 10 = 9+1 replaced by 10 = 3×3+1 gives the rule for 3.'],
 m: 'You have just done modular arithmetic without the notation — the statement is 10 ≡ 1 (mod 9). The same reasoning is what makes hash functions, check digits on a bank card, and the RSA lesson later in this course work.'
},

decimals: {
 q: 'Why does 0.999… equal 1 exactly, rather than being just short of it?',
 a: 'People hear 0.999… as a number creeping toward 1 and never arriving. But it is not a journey — it is a single fixed number, and the question is only which one.',
 s: ['Give it a name: let x = 0.999… — a fixed quantity, not a process.',
   'Multiply by ten: 10x = 9.999… The digits after the point are the same endless run of nines.',
   'Subtract the first from the second: 10x − x = 9.999… − 0.999…, and the endless tails cancel exactly, leaving 9x = 9.',
   'So x = 1.',
   'A second check: if 0.999… and 1 were different numbers, some number would have to lie strictly between them. Name it. You cannot — and on the real line, two numbers with nothing between them are the same number.'],
 m: 'The lesson is that decimal notation is a name for a number, and one number can have two names. Confusing a name with the thing named is behind a lot of floating-point confusion later.'
},

ratios: {
 q: 'Why is cross-multiplication allowed?',
 a: 'It looks like a licence to move numbers diagonally across an equals sign, which would be alarming if it were true. It is really one ordinary move done twice.',
 s: ['Start with the proportion a/b = c/d, with b and d not zero.',
   'You may multiply both sides of any equation by the same non-zero quantity. Multiply both sides by b: a = (c/d)b.',
   'Do it again, this time by d: ad = cb.',
   'That is cross-multiplication. Nothing travelled diagonally — both sides were multiplied by bd, and the denominators cancelled.',
   'It fails precisely when b or d is zero, which is exactly when the original fractions were meaningless.'],
 m: 'Naming the legal move — “do the same thing to both sides” — is what turns a memorised shortcut into something you can re-derive when you have forgotten which way the arrows point.'
},

expressions: {
 q: 'Why can you collect 3x + 2x into 5x, but not 3x + 2y?',
 a: 'The same reason you can add three apples to two apples and get five apples, but adding three apples to two oranges leaves you holding a description rather than a number.',
 s: ['3x means x + x + x, and 2x means x + x. Together that is five copies of x.',
   'Formally it is the distributive law read backwards: 3x + 2x = (3 + 2)x = 5x.',
   'The law only applies when the two terms share the same factor to pull out. x is shared; that is what “like terms” means.',
   'With 3x + 2y there is no common factor to extract, so there is nothing to collect and the expression is already as simple as it gets.',
   'The same test decides harder cases: 3x²y and 5x²y are like terms, 3x²y and 3xy² are not, because the shared factor is not the same.'],
 m: '“Simplify” is not an instruction to make an expression shorter by any means available. It means: apply the distributive law until no factor can be pulled out. That precision is what stops algebra from feeling like guesswork.'
},

inequalities: {
 q: 'Why does multiplying an inequality by a negative reverse it?',
 a: 'An inequality is a claim about direction on the number line. Multiplying by a negative reflects the line about zero — and a reflection turns every “to the right of” into “to the left of”.',
 s: ['Say what a < b actually means: b − a is positive.',
   'Take a negative number c. Multiplying a positive by a negative gives a negative, so c(b − a) is negative.',
   'Expand it: cb − ca is negative.',
   'A quantity being negative means the thing subtracted is the larger one, so cb < ca — equivalently ca > cb.',
   'We began with a < b and ended with ca > cb. The relation reversed, and it reversed because c was negative. Had c been positive, step two would have kept the sign and the relation would have survived unchanged.'],
 m: 'This is the most-missed rule in school algebra, and it is missed because it is taught as a rule. Once you have seen that it follows from “negative times positive is negative”, you cannot really forget it — and you can rebuild it in the exam if you do.'
},

coordinates: {
 q: 'Why is the distance between two points √((x₂−x₁)² + (y₂−y₁)²)?',
 a: 'It is not a new formula. It is Pythagoras, applied to a triangle you draw yourself out of the two points.',
 s: ['Take the two points and complete a right triangle: travel horizontally from the first, then vertically to the second.',
   'The horizontal leg has length |x₂ − x₁| and the vertical leg |y₂ − y₁| — each is just how far you moved along that axis.',
   'The straight-line distance you want is the hypotenuse of that triangle.',
   'Pythagoras says hypotenuse² = leg² + leg², so d² = (x₂−x₁)² + (y₂−y₁)².',
   'Take the positive square root. The absolute values vanish on their own, because squaring already discards the sign.'],
 m: 'This is the first appearance of a pattern that runs to the end of the course: distance is a square root of a sum of squares. In three dimensions you add a z term. In a few thousand dimensions it is the length of an embedding vector, and it is still this triangle.'
},

'word-problems': {
 q: 'Why insist on writing “let x = …” when you already know what you are solving for?',
 a: 'Because the sentence is doing two jobs at once — deciding what the unknown is, and committing to its units — and skipping it is where most wrong answers are actually born.',
 s: ['A word problem is a translation task: English in, algebra out. Translation needs a dictionary, and “let x = the number of hours” is the dictionary entry.',
   'Without it, the same symbol quietly changes meaning mid-solution — x starts as a speed and ends as a time — and the algebra stays valid while the answer becomes nonsense.',
   'Naming the unknown also fixes its units, which gives you a free correctness check: if the two sides of your equation carry different units, the equation is wrong before you solve it.',
   'It converts each English relation into one symbolic one. “Five more than twice the number” has exactly one reading once x is pinned down: 2x + 5.',
   'Finally it tells you when you are finished. You solved for x; the question may have asked for something else, and the definition line is what catches that.'],
 m: 'This is the same discipline as declaring a variable with a type and a name that means something. The bugs it prevents in algebra are precisely the bugs bad naming causes in code.'
},

};
