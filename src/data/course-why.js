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

transformations: {
 q: 'Why does f(x − 3) move the graph to the right when the sign says minus?',
 a: 'The minus is not moving the graph. It is compensating: the new function has to be handed a larger input before it will pass the old function the value it wants. Chase a single point through the substitution and the direction stops being a rule to remember.',
 s: ['A graph is nothing but a set of points (input, output). So to compare two graphs, compare their points.',
   'Let g(x) = f(x − h), and take any point on the graph of f — call it (t, f(t)).',
   'Feed t + h into g: g(t + h) = f(t + h − h) = f(t). So (t + h, f(t)) sits on the graph of g — same height, h further along the x-axis.',
   'Every point of g arises this way and no others do: an arbitrary point (x, g(x)) is (x, f(x − h)), which is exactly the point (x − h, f(x − h)) of f moved right by h. The two graphs match point for point under “shift right by h”.',
   'The direction now has a reason rather than a mnemonic. To reach a given value, g must be given an input h larger than the one f needed — the graph lags behind by h, which on the page is a move to the right. Changes made outside, like f(x) + k, act on the output after the fact and so read forwards.'],
 m: 'This is the whole content of “inside acts backwards”, and it survives into composition, into inverse functions and into code. When a chart maps data to pixels, or a shader slides a sampled image, the offset that moves the picture one way is subtracted from the coordinate handed to the lookup — the same sign flip, for exactly this reason.'
},

exponential: {
 q: 'Why does 2ⁿ eventually beat every polynomial, no matter how big the polynomial’s powers and constants are?',
 a: 'An exponential is not merely a fast-growing function; it contains every polynomial inside it. Expanding 2ⁿ as (1 + 1)ⁿ shows this literally: one of the terms in that expansion is already a polynomial in n of any degree you care to name, and the rest of the terms are still waiting.',
 s: ['Start with the binomial theorem: 2ⁿ = (1 + 1)ⁿ = C(n,0) + C(n,1) + ⋯ + C(n,n). Every term is positive, so 2ⁿ is at least as large as any single term you pick out.',
   'Fix the polynomial degree k and pick the term j = k+1, valid once n ≥ k+1: 2ⁿ ≥ C(n, k+1) = n(n−1)(n−2)⋯(n−k) / (k+1)!, a numerator of exactly k+1 factors.',
   'Every one of those factors is at least n − k, and once n ≥ 2k we have n − k ≥ n/2. So 2ⁿ ≥ (n/2)^(k+1) / (k+1)!.',
   'Divide by nᵏ to compare growth: 2ⁿ / nᵏ ≥ n^(k+1) / (2^(k+1)(k+1)! · nᵏ) = n / (2^(k+1)(k+1)!). With k fixed, that denominator is a constant, so the ratio grows at least linearly in n and passes every bound.',
   'Hence 2ⁿ / (C·nᵏ) also runs off to infinity for any constant C: a constant only divides through and postpones the crossing. For every polynomial there is an n beyond which 2ⁿ is larger, and stays larger.'],
 m: 'This is the honest reason exponential algorithms are not merely slow but hopeless. A faster machine multiplies your throughput by a constant, and the argument just showed a constant cannot win — it only shifts the crossover a little. It also explains the shape of the pain: going from n = 20 to n = 30 multiplies the work by 2¹⁰ ≈ 1000, and the same ten items again costs another factor of a thousand.'
},

logarithms: {
 q: 'Why can Big-O write O(log n) without ever saying which base?',
 a: 'Because there is really only one logarithm. Changing the base does not change the shape of the function at all — it multiplies the whole thing by a fixed number, the same number at every input. Constant multiples are precisely what Big-O throws away.',
 s: ['Take the definition as the only starting point: log_b x = y means bʸ = x. Nothing else is assumed.',
   'First the power rule, which the argument needs. Let u = log_c m, so cᵘ = m. Then mʸ = (cᵘ)ʸ = c^(uy), and reading that back through the definition gives log_c(mʸ) = uy = y·log_c m.',
   'Now set y = log_b x, so bʸ = x. Apply log base c to both sides: log_c(bʸ) = log_c x, and by the power rule that left side is y·log_c b.',
   'So y·log_c b = log_c x, and dividing by the non-zero number log_c b gives log_b x = log_c x / log_c b.',
   'The factor 1/log_c b does not depend on x. Every logarithm is therefore a constant multiple of every other: log₂ n = ln n / ln 2 ≈ 1.4427 · ln n, for every n at once.'],
 m: 'An algorithm that does log₂ n steps and one that does log₁₀ n steps differ by a fixed factor of about 3.32, which is exactly the kind of difference Big-O is built to ignore — so O(log n) is unambiguous and the base is genuinely not missing information. The same identity is why a calculator carrying only ln can produce any base you ask for, and why a plot of log n on log paper is a straight line whatever base you chose.'
},

sequences: {
 q: 'Why does 1 + ½ + ¼ + ⅛ + ⋯ add up to exactly 2 rather than growing forever?',
 a: 'Multiply the whole sum by the ratio and you get back nearly the same sum — shifted along by one term. Subtracting the two versions annihilates everything in the middle, so an infinite pile of terms collapses to a short piece of algebra. That collapse is the proof.',
 s: ['Work with a finite piece first, because a finite sum is something we already know how to handle: S = a + ar + ar² + ⋯ + arⁿ⁻¹, which is n terms.',
   'Multiply by r: rS = ar + ar² + ⋯ + arⁿ. This is the same list of terms as S, minus the first one and plus one new one at the end.',
   'Subtract: S − rS = a − arⁿ, since every term between cancels. So S(1 − r) = a(1 − rⁿ), and for r ≠ 1, S = a(1 − rⁿ)/(1 − r). This part is exact for every n, with no limits involved.',
   'Now let n grow, with |r| < 1. Write 1/|r| = 1 + t where t > 0; expanding (1 + t)ⁿ gives 1 + nt plus further positive terms, so (1/|r|)ⁿ ≥ 1 + nt, which passes any bound. Hence |r|ⁿ ≤ 1/(1 + nt), squeezed down to zero.',
   'So the partial sums a(1 − rⁿ)/(1 − r) settle on a/(1 − r) and on no other number — and that is what the infinite sum means. With |r| ≥ 1 step four fails, the terms never shrink, and there is nothing to settle on.'],
 m: 'The finite formula is the useful half in computing. When a dynamic array doubles, the copies done over its whole life are n + n/2 + n/4 + ⋯, which the same argument bounds by 2n — a constant amount of copying per insert, no matter how many times the array grew. That is where amortised O(1) appending actually comes from, and why halving rather than doubling would ruin it.'
},

piecewise: {
 q: 'Why is making the pieces meet enough for continuity, but not enough to remove the corner in |x| or ReLU?',
 a: 'Continuity is a condition on values; differentiability is a condition on slopes. Making two pieces meet closes the gap in height and says nothing about the two directions of travel arriving at the seam. Compute the difference quotient from each side and the mismatch is visible immediately.',
 s: ['Continuity at a seam c means three numbers agree: what the left piece approaches, what the right piece approaches, and the value assigned at c. For f(x) = |x| at 0 all three are 0, so |x| is continuous there — no jump, nothing torn.',
   'The derivative asks a stricter question. It asks whether the ratio [f(0 + h) − f(0)]/h closes in on one single number as h shrinks to zero, approaching from both sides.',
   'Take h > 0: |h| = h, so the ratio is h/h = 1, exactly 1 for every positive h however small. Shrinking h changes nothing.',
   'Take h < 0: |h| = −h, so the ratio is (−h)/h = −1, exactly −1 for every negative h.',
   'The ratio is pinned at 1 on one side and −1 on the other, so it approaches no single value and the derivative at 0 does not exist. Continuity forbade a jump in the value; it never promised anything about the slope. ReLU is the same picture with slopes 0 and 1.'],
 m: 'This is why deep learning frameworks have to *choose* a value for ReLU′(0) — usually 0 — and why that is a convention rather than a derivation: the mathematics genuinely supplies no answer there. It costs nothing in practice because a single point has no width, and every other point of ReLU has an honest derivative, which is the whole reason the kink is tolerable.'
},

binomial: {
 q: 'Why are the coefficients in (a + b)ⁿ combination counts rather than something you look up?',
 a: 'Multiplying out n brackets is not a mysterious operation — it is making one choice per bracket and adding up every way of choosing. Terms that look alike are then piled together, and the size of each pile is a count of choices. The coefficients are counts because collecting like terms is counting.',
 s: ['(a + b)ⁿ means n copies of (a + b) multiplied together. Distribution, applied repeatedly, says the expansion is: from each bracket take either the a or the b, multiply your n picks, and sum over every possible way to pick. Nothing is lost and nothing extra appears.',
   'Each such product is a string of as and bs, and multiplication does not care about order, so the product depends only on how many bs were taken. If k brackets gave a b, the product is aⁿ⁻ᵏbᵏ.',
   'So collecting like terms means grouping all the choice-patterns that took the same number of bs. The coefficient of aⁿ⁻ᵏbᵏ is therefore the number of ways to select which k of the n brackets contributed a b — which is what C(n,k) means by definition.',
   'Hence (a + b)ⁿ = Σ from k = 0 to n of C(n,k) aⁿ⁻ᵏ bᵏ, with every coefficient earned rather than tabulated.',
   'Two consequences drop out for free. Put a = b = 1: 2ⁿ = Σ C(n,k), because choosing a b from each bracket or not is choosing a subset of n things. And Pascal’s rule C(n,k) = C(n−1,k−1) + C(n−1,k) comes from splitting the choices by what the last bracket did — it gave a b, or it did not.'],
 m: 'Reading the coefficients as counts is what links three things that otherwise look unrelated: Pascal’s triangle, the number of subsets of an n-element set, and the binomial distribution, whose probabilities are these same counts weighted by pᵏ(1−p)ⁿ⁻ᵏ. Pascal’s rule is also a genuine dynamic program — each entry from two already computed — which is how C(n,k) is calculated in code without ever forming n!.'
},

integrals: {
 q: 'Why does an antiderivative — a question about slopes — compute an area?',
 a: 'Track the area under the curve as a running total, measured from a fixed left edge out to a right edge you are free to move. Nudge that right edge a hair further along and the total gains a thin sliver, near enough a rectangle whose height is the curve there and whose width is the nudge. So the rate at which accumulated area grows is exactly the height of the curve — which is to say the area function is an antiderivative of the curve. Everything below is that sliver, made airtight.',
 s: ['Let f be continuous, and define A(x) to be the area under f from a fixed left edge a out to x. Then A(a) = 0, and A(b) is the area we are after.',
   'Move the right edge from x to x + h, taking h > 0 for the moment. The area gained, A(x + h) − A(x), is a sliver sitting over the strip [x, x + h], so it is at least (the smallest height of f on that strip) × h and at most (the largest height) × h.',
   'Divide through by h. The difference quotient (A(x + h) − A(x))/h is trapped between the smallest and largest values f takes on a strip of width h. As h → 0 the strip closes onto the single point x, and because f is continuous both bounds close onto f(x); the same argument with the strip on the left handles h < 0. So A′(x) = f(x), and A is an antiderivative of f.',
   'Now take any antiderivative F of f — anything at all with F′ = f. Then (F − A)′ = f − f = 0 across the whole interval, and a function with zero derivative everywhere on an interval cannot change value, since the mean value theorem from Calculus I says any change between two points forces a non-zero slope somewhere between them. Hence F = A + C for some constant C.',
   'Therefore F(b) − F(a) = (A(b) + C) − (A(a) + C) = A(b) − 0, which is the area itself. That is ∫ₐᵇ f(x) dx = F(b) − F(a): the fundamental theorem, and the reason two substitutions can stand in for a sum of infinitely many rectangles.'],
 m: 'This is what makes calculus a calculus rather than an endless numerical exercise: every accumulation question — total error over a run, expected value over a continuous distribution, work done — collapses to finding one function whose derivative is the integrand. It also tells you precisely what to do when no such function exists in closed form, which is the common case in real work: go back to step two and add the slivers yourself. That is all a numerical integrator is, and the width of your slices is the accuracy you are buying.'
},

techniques: {
 q: 'Why can you treat du = g′(x) dx as though the dx cancels, when dx is not a number you can divide by?',
 a: 'Substitution is not sleight of hand with infinitesimals. It is the chain rule read from right to left: differentiating a composition always leaves behind an extra factor of the inner function’s derivative, so an integrand that carries such a factor is advertising that it came from a composition. The du notation is bookkeeping for that fact, and the argument below never divides by anything.',
 s: ['Suppose F is an antiderivative of f, so F′ = f. That is the only thing assumed, and it is what the symbol ∫ f(u) du means.',
   'Differentiate the composition F(g(x)) with the chain rule: d/dx F(g(x)) = F′(g(x))·g′(x) = f(g(x))·g′(x).',
   'Read that line backwards. A function whose derivative is f(g(x))g′(x) is F(g(x)), so ∫ f(g(x))g′(x) dx = F(g(x)) + C.',
   'Separately, ∫ f(u) du = F(u) + C by the definition of F, and putting u = g(x) into that gives F(g(x)) + C — the very same answer as step three. So the two integrals genuinely agree, and “cancelling the dx” is shorthand for this agreement rather than a claim about arithmetic on dx.',
   'Integration by parts is the identical move applied to the product rule instead: (uv)′ = u′v + uv′, so integrating both sides gives uv = ∫u′v dx + ∫uv′ dx, and rearranging gives ∫u dv = uv − ∫v du.'],
 m: 'Every technique in this lesson is a differentiation rule run in reverse, which is why the catalogue is short and why recognition beats memorisation: a composition with its inner derivative loitering beside it is a chain rule that has left fingerprints. It also explains the LIATE ordering rather than leaving it as a mnemonic — you pick u to be the factor that gets simpler when differentiated, because ∫v du is the integral you are still going to have to do, and the whole point was to trade a hard one for an easy one.'
},

series: {
 q: 'Why does adding infinitely many terms come out to the finite number a/(1 − r)?',
 a: 'You never add infinitely many things. You add n of them, get an exact answer valid for every n, and then watch what that answer does as n grows. For a geometric series the finite answer has a closed form because multiplying the sum by r shifts the whole list along by one place, so subtracting annihilates everything in the middle and leaves two terms standing.',
 s: ['Add only n terms — an ordinary finite sum with nothing infinite in it: Sₙ = a + ar + ar² + ⋯ + arⁿ⁻¹.',
   'Multiply the whole thing by r: rSₙ = ar + ar² + ⋯ + arⁿ. That is the same list shifted one place along, missing a at the front and gaining arⁿ at the back.',
   'Subtract the second from the first. Every middle term appears in both and cancels, leaving Sₙ − rSₙ = a − arⁿ, so Sₙ = a(1 − rⁿ)/(1 − r) — exact, for every n, whenever r ≠ 1.',
   'The sum of the series means the number Sₙ approaches. Only rⁿ depends on n, so everything hangs on that one factor: if |r| < 1, each step multiplies by something smaller than one in size, so rⁿ → 0 and Sₙ → a/(1 − r).',
   'If |r| ≥ 1 then arⁿ does not shrink to zero, so every new term adds at least a fixed amount and the partial sums march off without ever settling. The condition |r| < 1 is not fine print attached to the formula; it is exactly the case in which there is anything for the formula to be equal to.'],
 m: 'Amortised analysis is this argument wearing a hat: a dynamic array that doubles copies 1 + 2 + 4 + ⋯ + n elements, a geometric sum below 2n, so n appends cost O(n) altogether and O(1) each on average despite the occasional expensive copy. The converse warning is worth as much — the harmonic series Σ1/n has terms shrinking to zero and diverges anyway, so “the terms go to zero” is a test a series must pass, never a reason to believe it converges.'
},

taylor: {
 q: 'Where does the n! in the Taylor coefficients come from?',
 a: 'Suppose for a moment that the function can be written as an infinite polynomial. Then its coefficients are not free to choose — you can fish them out one at a time, because differentiating a few times and then setting x = a kills every term but one. The factorial is simply the debris that repeated differentiation of a power piles up out front, and dividing by n! is clearing that debris away.',
 s: ['Assume f can be written as a power series about a, f(x) = c₀ + c₁(x − a) + c₂(x − a)² + c₃(x − a)³ + ⋯, and that it may be differentiated term by term. Whether a particular function admits such a series is a separate question; here we ask only what the coefficients would have to be if it does.',
   'Set x = a. Every term carrying a factor (x − a) vanishes, leaving f(a) = c₀.',
   'Differentiate once: f′(x) = c₁ + 2c₂(x − a) + 3c₃(x − a)² + ⋯. Setting x = a kills all but the first term, so f′(a) = c₁. Differentiating again and repeating gives f″(a) = 2c₂.',
   'Do it n times and follow the single term cₙ(x − a)ⁿ. Each differentiation drops the exponent by one and drags the old exponent out in front, so after n rounds it has become cₙ · n(n−1)(n−2)⋯1 = n!cₙ, a bare constant. Every earlier term has by then been differentiated down to zero, and every later term still carries a factor (x − a), which vanishes at x = a.',
   'So f⁽ⁿ⁾(a) = n!cₙ, which rearranges to cₙ = f⁽ⁿ⁾(a)/n!. The factorial in the Taylor formula is there to undo the factorial that differentiation manufactured.'],
 m: 'This argument pins down the coefficients; it does not prove the series equals f, nor over what range — that is what the remainder term and the convergence tests are for, and the gap is real: the series for 1/(1 − x) reproduces the function only for |x| < 1, and there are smooth functions whose Taylor series converges to something else entirely. What it does explain is why a polynomial can imitate sin x or eˣ at all — it is constructed to match every derivative at a point, so it agrees with the function to every order there. Library implementations start from exactly these coefficients and then re-tune them, trading perfect accuracy at one point for error spread evenly across the whole interval.'
},

applications: {
 q: 'Why does (1/(b − a))∫ₐᵇ f dx deserve to be called an average?',
 a: 'An average is a sum divided by a count, and a function on an interval has no count — it takes a whole continuum of values. So the honest move is to average finitely many samples, where the schoolroom definition applies with nothing to argue about, and then take more and more of them. What falls out is a Riemann sum with the width of the interval divided back out.',
 s: ['The average of n numbers is their sum divided by n. Nothing about a function changes that definition; the only difficulty is deciding which n numbers to average.',
   'Sample f at n equally spaced points x₁, …, xₙ across [a, b], with spacing Δx = (b − a)/n. Their ordinary average is (1/n)(f(x₁) + ⋯ + f(xₙ)).',
   'Rewrite the 1/n as Δx/(b − a). It is the same number, since nΔx = b − a. The average becomes (1/(b − a))·(f(x₁)Δx + ⋯ + f(xₙ)Δx).',
   'The bracketed sum is precisely a Riemann sum for f on [a, b]: rectangles of width Δx and height f(xᵢ). For continuous f it converges to ∫ₐᵇ f dx as n → ∞ and Δx → 0.',
   'So sampling ever more finely drives the ordinary average to (1/(b − a))∫ₐᵇ f dx. The formula is not an analogy to averaging — it is the everyday average of n samples, with n taken to infinity.'],
 m: 'Rearranged as ∫ₐᵇ f dx = f̄·(b − a), it says the area under any curve equals the area of a single rectangle of the average height, which is a quick sanity check on an integral you have just computed. The same slice–approximate–sum move is every other application in this lesson: make each slice something you can already measure — a rectangle of height (top − bottom), a disk of area πf(x)² — then sum and take the limit. It is also why averaging a sampled load curve on a monitoring dashboard approaches the true mean as the sampling rate rises: the dashboard is computing step three, and the integral is what step five says it is heading for.'
},

improper: {
 q: 'Why does ∫₁∞ 1/x² dx have a finite area while ∫₁∞ 1/x dx does not, when both curves fall to zero?',
 a: 'Spreading a shrinking height across an infinite width is a race. The width grows without limit, so the height must fall fast enough to beat it, and “falls to zero” says nothing at all about speed. Computing the area only as far as a movable right edge b turns the race into one expression in b, and the exponent is what decides which side wins.',
 s: ['An infinite upper limit is not a number you can substitute, so ∫₁∞ f dx is defined as lim(b→∞) ∫₁ᵇ f dx: do an ordinary integral out to a finite edge b, then ask whether those answers settle on a number as b runs away.',
   'For f(x) = 1/xᵖ with p ≠ 1, the power rule gives the antiderivative x¹⁻ᵖ/(1 − p), so ∫₁ᵇ x⁻ᵖ dx = (b¹⁻ᵖ − 1)/(1 − p).',
   'Only b¹⁻ᵖ depends on b, so watch that alone. If p > 1 the exponent 1 − p is negative, so b¹⁻ᵖ = 1/bᵖ⁻¹ → 0, and the area settles on (0 − 1)/(1 − p) = 1/(p − 1), a finite number. For p = 2 that is exactly 1.',
   'If p < 1 the exponent 1 − p is positive, so b¹⁻ᵖ → ∞ and the accumulated area grows without bound. The curve is still falling to zero; it simply is not falling fast enough to outrun the width it is being spread over.',
   'The boundary p = 1 has to be checked on its own, because there the antiderivative changes species: ∫₁ᵇ dx/x = ln b, and ln b has no ceiling — it grows ever more slowly and still passes every number eventually. So the tail is finite exactly when p > 1, strictly.'],
 m: 'The same threshold governs the p-series Σ1/nᵖ, and for the reason you would guess: the rectangles of the sum and the area under the curve trap one another between them, so the two stand or fall together. It also has teeth in practice — if request latencies have a density falling off like 1/x², the mean is ∫x·(1/x²) dx = ∫(1/x) dx, which diverges, so the running average of your latency data drifts upward forever instead of converging on a value. A heavy tail is not merely a large number; it is a divergent integral, and no amount of extra data will settle it.'
},

'right-triangles': {
 q: 'Why does the ratio of two sides depend only on the angle, when the triangle itself can be any size at all?',
 a: 'A right triangle with a given acute angle is not one triangle but a whole family, and every member is a photographic enlargement of every other. Enlarging multiplies all three sides by one and the same factor — and a ratio of two sides cannot notice a factor that appears above and below the line, because it cancels. The coordinates below turn that picture into arithmetic.',
 s: ['Put the angle’s vertex at the origin with the adjacent side along the positive x-axis. The other side of the angle is then a ray heading out of the origin, and the angle is nothing more than a name for which ray.',
   'A straight ray out of the origin is exactly the set of points (tx₁, ty₁) for t ≥ 0, where (x₁, y₁) is any one point on it. That is what “straight, through the origin” means: every point on it is a scaled copy of every other.',
   'Take the point Pₜ = (tx₁, ty₁) and drop a perpendicular to the x-axis. The opposite side has length ty₁, the adjacent side tx₁, and the hypotenuse √((tx₁)² + (ty₁)²) = t√(x₁² + y₁²), since t ≥ 0.',
   'So moving out along the ray multiplies all three sides by the same t. Every ratio of two sides therefore cancels it: opposite/hypotenuse = ty₁ / (t√(x₁²+y₁²)) = y₁/√(x₁²+y₁²), with no t left anywhere.',
   'The three ratios depend on the ray alone — that is, on the angle alone — so writing them as sin θ, cos θ and tan θ is legitimate: they are genuinely functions of θ. Choosing the t that makes the hypotenuse 1 puts the point at (cos θ, sin θ), which is the unit circle waiting for the next lesson.'],
 m: 'This is what earns trigonometry the right to exist: without the cancellation there would be no function sin, only a table of particular triangles. It is also exactly why normalising a vector — dividing by its length — throws away nothing but size: the direction, and every angle you can ask about it, survives the division untouched.'
},

'unit-circle': {
 q: 'Why do radians beat degrees, when degrees are the units everyone actually thinks in?',
 a: 'Near zero, three things become indistinguishable: the arc along the circle, the vertical drop sin θ, and the tangent line’s rise tan θ. Radians are the unit that measures the arc directly, so in radians sin θ and θ agree to first order and the sine curve leaves the origin at slope exactly 1. Degrees measure the same arc on a rescaled ruler, and that rescaling factor never goes away. The squeeze below makes the “indistinguishable” precise.',
 s: ['Define the radian by arc length: the angle θ cuts an arc of length θ off the unit circle, so a full turn is 2π because the circumference is 2π. (Circles of different radii about the same vertex are scaled copies, by the previous lesson, so arc/radius is the same number for all of them — the definition is consistent.)',
   'For 0 < θ < π/2 look at three nested regions between the ray at angle 0 and the ray at angle θ: the triangle with vertices (0,0), (1,0), (cos θ, sin θ), which has base 1 and height sin θ; the circular sector; and the triangle (0,0), (1,0), (1, tan θ), base 1 and height tan θ. Each region sits inside the next.',
   'Their areas are ½ sin θ, ½θ (the sector is the fraction θ/2π of a disc of area π), and ½ tan θ. A region contained in another cannot have greater area, so sin θ ≤ θ ≤ tan θ.',
   'Divide throughout by the positive number sin θ: 1 ≤ θ/sin θ ≤ 1/cos θ. As θ → 0 the right-hand bound tends to 1, so θ/sin θ is squeezed to 1 — that is, sin θ/θ → 1, and sin θ = θ to first order near zero.',
   'Only radians give the clean 1. An angle of x degrees is πx/180 radians, so the function “sine of x degrees” is sin(πx/180), whose slope at 0 is π/180 ≈ 0.01745. Measure in degrees and that factor is dragged through every derivative, every series, every integral, forever; radians are precisely the unit chosen to make it disappear, which is why d/dθ sin θ = cos θ comes out with no stray constant.'],
 m: 'This is the argument behind Math.sin taking radians in every standard library, and behind the small-angle approximation sin θ ≈ θ that physics engines and pendulum models lean on — you now know the error is third order, not merely “small”. It is also the single limit that the derivative of sine rests on later, so the calculus track owes this lesson a debt.'
},

identities: {
 q: 'Where does the minus sign in cos(a + b) = cos a cos b − sin a sin b actually come from?',
 a: 'Adding angles is not an algebraic accident; it is what rotation does. So rotate the point that sits at angle a by a further angle b and it must land at angle a + b. Write the starting point in terms of the two grid directions, rotate each of them, add the results back up, and the two coordinates of where you land are the two addition identities. The minus sign arrives from one place only: the rotated vertical direction leans backwards, into negative x.',
 s: ['The point at angle a on the unit circle is P(a) = (cos a, sin a). Split it along the grid directions: P(a) = cos a·(1,0) + sin a·(0,1).',
   'Let R be rotation by b about the origin. R slides every point b of arc along the unit circle, so it carries the point at angle a to the point at angle a + b: R(P(a)) = P(a + b). That is what it means for the angle to measure arc.',
   'R is rigid and fixes the origin, so it carries the parallelogram built on u and v to the parallelogram built on Ru and Rv, and carries the point c of the way along a ray to the point c of the way along the rotated ray. In symbols: R(u + v) = Ru + Rv and R(cu) = cRu.',
   'R(1,0) = (cos b, sin b), by the definition of the angle b. And (0,1) is the unit vector one right angle anticlockwise from (1,0), so R(0,1) is the unit vector one right angle anticlockwise from (cos b, sin b) — namely (−sin b, cos b). (Check the right angle without any trigonometry: both tips are distance 1 from the origin, and the squared distance between them is (cos b + sin b)² + (sin b − cos b)² = 2 = 1² + 1², so the converse of Pythagoras makes the corner at the origin square.)',
   'Now push P(a) through R using step 3: P(a + b) = cos a·(cos b, sin b) + sin a·(−sin b, cos b) = (cos a cos b − sin a sin b, sin a cos b + cos a sin b). Reading off the x-coordinate gives the cosine identity, the y-coordinate the sine identity — and the minus is simply the −sin b in the rotated vertical direction.'],
 m: 'The four numbers cos b, −sin b, sin b, cos b are the 2×2 rotation matrix, and this argument is the proof that multiplying two rotation matrices adds their angles — the fact graphics, robotics and complex-number arithmetic all run on. It also hands you the rest of the identity table free: b = a gives the double-angle formulas, and b = −a (with cos(−a) = cos a, sin(−a) = −sin a) gives cos²a + sin²a = cos 0 = 1, the Pythagorean identity.'
},

waves: {
 q: 'Why does adding two waves of the same frequency always give another wave of that same frequency, just shifted?',
 a: 'A wave at a fixed frequency has only two dials worth of freedom: how tall and how shifted. So the family of all waves at that frequency ought to behave like the plane — two numbers, added the way arrows add. The argument below shows the correspondence exactly: every such wave is a pair (a, b) of coefficients, adding waves adds the pairs, and converting the pair back to amplitude-and-phase is nothing but reading the point (b, a) in polar coordinates.',
 s: ['Any wave at frequency ω can be written a cos(ωt) + b sin(ωt): angle addition expands A sin(ωt + C) into (A sin C)cos ωt + (A cos C)sin ωt, so that two-coefficient form is fully general. Adding two such waves plainly gives a third of the same form, with the coefficients added.',
   'So the only thing to prove is that the form is reversible: given a and b, not both zero, find an amplitude R > 0 and a phase φ with a cos ωt + b sin ωt = R sin(ωt + φ) for every t. Expanding the right side by angle addition gives R sin φ·cos ωt + R cos φ·sin ωt.',
   'Test at two instants to see what R and φ must be. At ωt = 0 the left side is a and the right is R sin φ; at ωt = π/2 the left side is b and the right is R cos φ. So (R cos φ, R sin φ) must be the point (b, a).',
   'Every point of the plane other than the origin has polar coordinates, so such an R and φ exist: R = √(a² + b²), and φ the angle of the point (b, a), which is atan2(a, b). Substituting them back, R sin(ωt + φ) = R cos φ·sin ωt + R sin φ·cos ωt = b sin ωt + a cos ωt for every t — so the two functions agree everywhere, not merely at the two instants tested.',
   'Therefore the sum of any two waves at frequency ω is one wave at frequency ω, with amplitude √(a² + b²) and a phase read off as an angle in the plane. No new frequency can appear, and the amplitude combines by Pythagoras rather than by simple addition — which is why two equal waves half a period apart cancel to nothing.'],
 m: 'This is the licence for phasors: represent a wave by the single point (b, a), or the complex number b + ai, and superposition becomes vector addition. It is also why a linear filter can do only two things to a pure tone — scale it and delay it — which is what makes an audio equaliser describable by one gain and one phase per frequency, and what makes Fourier analysis worth doing at all.'
},

'law-sines': {
 q: 'Why is the correction in the law of cosines exactly −2ab cos C, and not some other function of the angle?',
 a: 'Pythagoras is the distance formula applied to two perpendicular sides. Drop the perpendicularity and nothing else changes: it is still the distance formula, but now squaring the difference along one axis throws off a cross-term that no longer vanishes. That cross-term is the whole correction, and computing it takes one line of algebra plus sin² + cos² = 1.',
 s: ['Place the vertex carrying angle C at the origin with side b along the positive x-axis; you may do this because sliding and turning the picture changes no length and no angle. Then the far end of side b is the vertex A = (b, 0).',
   'Vertex B lies at distance a from the origin in the direction C, so by the unit-circle definition of cosine and sine its coordinates are B = (a cos C, a sin C).',
   'Side c is the distance from A to B, so by the distance formula c² = (a cos C − b)² + (a sin C − 0)².',
   'Expand the first bracket: a²cos²C − 2ab cos C + b², and add a²sin²C. Grouping gives c² = a²(cos²C + sin²C) + b² − 2ab cos C.',
   'Since cos²C + sin²C = 1, this is c² = a² + b² − 2ab cos C. The correction is exactly the cross-term thrown off by squaring the difference along the x-axis — so it is −2ab cos C for the same reason (p − q)² carries a −2pq, and it vanishes precisely when cos C = 0, which is to say when C is a right angle and Pythagoras returns.'],
 m: 'That cross-term is the dot product in disguise: the identity is c² = |A|² + |B|² − 2(A·B), and comparing the two forms is precisely how the vectors track later earns u·v = ‖u‖‖v‖cos θ. The same coordinate picture also settles the law of sines in one line — the triangle’s height above side b is a sin C, so its area is ½ab sin C, and by symmetry also ½bc sin A and ½ca sin B; divide all three by ½abc and you get sin A/a = sin B/b = sin C/c.'
},

'inverse-trig': {
 q: 'Why can’t a single arctangent of y/x recover the angle, when tan θ is exactly y/x?',
 a: 'The trouble is not with arctangent but with the ratio it is handed. Forming y/x collapses a whole line through the origin — both halves of it — into one number, and two opposite directions arrive indistinguishable. No function can undo a step that has already destroyed the information, and the proof of that is short enough to be worth doing properly.',
 s: ['The task is: given a nonzero vector (x, y), recover the angle θ in (−π, π] that it points along. The pair (x, y) genuinely determines θ, so the task is possible in principle.',
   'Now suppose some function f of the single number r = y/x returned the correct angle for every vector. Feed it (1, 1), which points at π/4, and feed it (−1, −1), which points at −3π/4 — the exact opposite direction.',
   'Both inputs give r = 1. So f(1) would have to equal π/4 and −3π/4 at once, which no function does. Therefore no single-argument recipe applied to y/x can be correct for all vectors — the impossibility is about the ratio, not about which formula you choose.',
   'tan⁻¹ copes by settling for correctness on half the plane: its output is restricted to (−π/2, π/2), so it always returns the answer in the right-hand half, x > 0. Arcsine makes the same compromise for the same reason — a function can be inverted only on a stretch where it takes each value once, and sine and tangent repeat forever, so every inverse trig function ships with a declared range.',
   'atan2(y, x) takes the two numbers separately and never forms the lossy ratio, so the signs survive: it returns tan⁻¹(y/x) when x > 0, that value plus π when x < 0 and y ≥ 0, minus π when x < 0 and y < 0, and ±π/2 when x = 0 from the sign of y. That covers the full (−π, π], which is what the pair (x, y) always determined.'],
 m: 'This is why sin⁻¹(sin θ) need not be θ, and why every library’s inverse trig documentation states a range rather than leaving it to taste: the range is the branch that was chosen to make the inverse a function at all. Practically, it is the reason to write atan2(y, x) and never atan(y/x) in graphics, robotics or anything that turns a vector into a heading — the second form silently points half your objects backwards, and additionally divides by zero on the vertical axis.'
},

logic: {
 q: 'Why does “if p then q” count as true whenever p is false?',
 a: 'An implication is a promise, and a promise is broken in exactly one situation: the condition came about and the thing promised did not. Every other row of the table leaves the promise intact — including the rows where the condition never arose and the promise was never put to the test. Pinning down that single false row forces the whole truth table, and everything else about implication falls out of it.',
 s: ['Two compound statements are equivalent when they agree on every combination of truth values of their parts. For a connective, the truth table is the whole story — there is nothing else to know about it.',
   'Ask what the rule “every multiple of 4 is even” should say about 7. It says nothing about 7: seven is not a case the rule speaks about, and it would be perverse for an irrelevant number to falsify a true rule. So when the premise fails, the implication cannot be counted false, which leaves only true.',
   'That leaves exactly one way for p → q to fail: p true and q false. In symbols, p → q ≡ ¬(p ∧ ¬q).',
   'Apply De Morgan to the right-hand side: ¬(p ∧ ¬q) ≡ ¬p ∨ ¬(¬q) ≡ ¬p ∨ q. The implication has been rewritten with no arrow left in it.',
   'Now read ¬p ∨ q the other way round: it is ¬(¬q) ∨ ¬p, which is (¬q) → (¬p) — the contrapositive, equivalent because it is literally the same expression. The converse q → p unpacks to ¬q ∨ p instead, which differs in the row p false, q true, and that one row is the entire reason converse and original are not interchangeable.'],
 m: 'Once an implication is just ¬p ∨ q, conditions become things you can manipulate rather than memorise: the guard if (!ready || done) is an implication, negating a condition is De Morgan, and swapping a test for its contrapositive is free and safe. Mistaking an implication for its converse is the same error as concluding from a passing check that its cause must have happened.'
},

sets: {
 q: 'Why does a set with n elements have exactly 2ⁿ subsets?',
 a: 'A set records only membership, so choosing a subset is walking down the list of elements and answering one question at each: in, or out. The answers are independent and there are n of them, so counting subsets is counting answer sheets — and each answer sheet is a string of bits.',
 s: ['A subset of A is completely determined by one decision per element: in, or out. Two subsets that answer every one of those questions the same way contain the same elements, so they are the same subset.',
   'Fix an order for the elements once, and record the answers as a string of n bits: 1 for in, 0 for out, one position per element.',
   'The pairing loses nothing in either direction. Different subsets give different strings, because if two subsets differ then some element is in one and not the other, and that position’s bit differs. Different strings give different subsets, by reading the bits back. So subsets and n-bit strings correspond exactly, one to one.',
   'Counting the strings is the product rule: n positions, 2 independent choices at each, giving 2 × 2 × ⋯ × 2 = 2ⁿ.',
   'Check the extremes to see that nothing is missed or double-counted: all zeros is the empty set, all ones is A, and n = 0 gives 2⁰ = 1, the empty set being the only subset of the empty set. Hence |P(A)| = 2ⁿ.'],
 m: 'The correspondence is not merely a counting trick — it is how subsets are enumerated in code. Looping i from 0 to 2ⁿ − 1 and reading the bits of i visits every subset exactly once, and that same 2ⁿ is why brute force over subsets is instant at n = 20 and hopeless at n = 60.'
},

proofs: {
 q: 'Why does assuming the opposite and reaching nonsense count as a proof?',
 a: 'A statement and its negation cannot both hold, so ruling out the negation is as good as establishing the statement. Correct reasoning cannot manufacture a falsehood out of truths — so when a chain of correct steps starting from “not P” ends somewhere plainly false, the fault has to lie in the one thing that was assumed rather than known.',
 s: ['Every step of a valid argument preserves truth: from true premises you can never correctly derive a false conclusion. Turn that around and it says that an argument ending in something plainly false must have had at least one false premise.',
   'Proof by contradiction engineers exactly that situation. You add ¬P to premises you already accept, reason correctly, and arrive at a falsehood. Since the accepted premises are true, the false premise must be ¬P — so P is true.',
   'Here is the machine running. Suppose √2 were rational: √2 = a/b with a and b integers, b ≠ 0, sharing no common factor, which any fraction can be reduced to. Squaring and clearing the denominator gives a² = 2b², so a² is even.',
   'A small lemma, proved by contrapositive: if a were odd, say a = 2k + 1, then a² = 4k² + 4k + 1, which is odd. So a² even forces a even, and we may write a = 2c. Substituting, 4c² = 2b², so b² = 2c², and the same lemma makes b even too.',
   'Now a and b are both even, contradicting the fact that they share no common factor. Every step after the opening assumption was forced, so the opening assumption is what is false: √2 is not a ratio of integers.'],
 m: 'Contradiction is the standard tool for claims that nothing of a certain kind exists — no algorithm beats this bound, no schedule satisfies these constraints — because it lets you reason about an object you can never exhibit. The cheap direction is worth holding onto too: a single counterexample refutes a universal claim outright, which is exactly what one failing test does to a specification, and exactly why passing tests cannot return the favour.'
},

induction: {
 q: 'Why is the domino argument a proof and not merely a persuasive picture?',
 a: 'The picture says every domino falls; the proof says no domino could be the first one left standing. If the claim failed anywhere there would have to be an earliest place it failed, and the two ingredients of induction between them forbid an earliest failure — the base case rules out the first position, and the inductive step rules out every other one.',
 s: ['Suppose you have the two ingredients: P(1) is true, and for every k ≥ 1, P(k) being true forces P(k+1) to be true. The claim is that P(n) then holds for every n ≥ 1.',
   'Accept one fact about the positive integers, the fact that distinguishes them from the reals: any non-empty collection of positive integers has a least member. You cannot descend through them forever.',
   'Suppose the claim failed. Then the collection of counterexamples — those n for which P(n) is false — is non-empty, so it has a least member. Call it m.',
   'm cannot be 1, because P(1) is true. So m ≥ 2, which makes m − 1 a positive integer smaller than m; being smaller than the least counterexample, m − 1 is not a counterexample, so P(m − 1) is true.',
   'Apply the inductive step at k = m − 1: it forces P(m) to be true. But m was chosen as a case where P fails. The contradiction destroys the supposition, so there are no counterexamples at all and P(n) holds for every n ≥ 1.'],
 m: 'This is why “assume it already works for smaller inputs” is not circular when you argue a recursive function correct — you are not assuming your conclusion, you are ruling out a smallest failing input. The base case is the recursion’s stopping condition, the inductive step is the recursive call, and strong induction, where you assume all of P(1) … P(m−1) at once, costs nothing extra: choosing m least already handed you every earlier case.'
},

quantifiers: {
 q: 'Why is the negation of “every element is positive” one bad element, rather than every element being bad?',
 a: 'A universal claim is a promise about a whole collection, and such a promise is broken the moment a single member breaks it — the rest are under no obligation to join in. Spelled out over a finite domain the for-all is one long chain of ANDs, and the negation rule is De Morgan’s law walked down that chain.',
 s: ['∀x P(x) asserts that P holds at every x of the domain. For that claim to be false is simply for the assertion to fail, and it fails as soon as one x has ¬P(x).',
   'Check both directions. If ∀x P(x) is false there must be at least one offending x, since if no x offended, P would hold everywhere and the claim would be true. Conversely, one x with ¬P(x) makes the claim false. So ¬∀x P(x) ≡ ∃x ¬P(x).',
   'The same reading settles the other rule: ¬∃x P(x) says that no x has P, which is precisely the statement that every x has ¬P — that is, ∀x ¬P(x).',
   'Over a finite domain {x₁, …, xₙ}, ∀x P(x) is P(x₁) ∧ ⋯ ∧ P(xₙ) and ∃x P(x) is P(x₁) ∨ ⋯ ∨ P(xₙ), so the two rules are De Morgan’s laws applied n times over. They hold on the empty domain too, where an empty AND is true and an empty OR false: “every element of the empty array is positive” is true, and “some element is not” is false, exactly as the rules require.',
   'Negation therefore walks inwards, flipping each quantifier it passes and negating the predicate at the end: ¬∀x ∃y P(x,y) ≡ ∃x ¬∃y P(x,y) ≡ ∃x ∀y ¬P(x,y).'],
 m: 'A failure condition is a negated specification, and getting the negation wrong is how an assertion ends up testing something nobody meant: the opposite of “all requests succeeded” is “one failed”, not “all failed”. The rule also explains the asymmetry of testing — a run can refute a for-all with a single case, and can never establish one.'
},

boolean: {
 q: 'Why can any behaviour you can write as a truth table be built out of AND, OR and NOT gates?',
 a: 'A truth table is just a list of the input rows on which the output is supposed to be 1. So if you can build one gate arrangement that fires on exactly one chosen row and stays silent on all the others, you can OR one of those together for each row on your list, and the result fires on exactly the rows listed and nowhere else.',
 s: ['A Boolean function of n inputs is nothing more than its table: 2ⁿ rows, each stamped 0 or 1. Two expressions agreeing on all 2ⁿ rows are the same function, so matching the table is the whole job.',
   'Fix one row and build its minterm: AND together each variable that is 1 in that row, and the complement of each variable that is 0. For the row x = 1, y = 0, z = 1 that is x·ȳ·z.',
   'A minterm outputs 1 on exactly its own row. An AND demands that every factor be 1, and by construction each factor is 1 precisely when that input matches the row, so changing any single input drops some factor to 0.',
   'Now OR together the minterms of every row stamped 1. Feed in any input at all: at most one minterm can be 1, namely the one built for that input’s row, so the OR is 1 exactly when that row was stamped 1 and 0 otherwise. The expression agrees with the table on all 2ⁿ rows, so it is the function. If no row is stamped 1 the function is the constant 0, an empty OR.',
   'So AND, OR and NOT reach every Boolean function whatsoever. De Morgan then shrinks the toolkit to one gate: x̄ = x NAND x, x·y = (x NAND y) NAND (x NAND y), and x + y = (x NAND x) NAND (y NAND y), so NAND alone builds anything a table can describe.'],
 m: 'This is why a chip can be fabricated from a single kind of gate, and why an FPGA implements arbitrary logic out of small lookup tables — the table is the specification and the circuit is a mechanical translation of it. It also fixes what minimisation is: absorption and Karnaugh maps hunt for a cheaper expression with the same table, so a rule like x + xy = x is safe precisely because it changes no row, never because it changes what the circuit means.'
},

relations: {
 q: 'Why does an equivalence relation chop a set into clean, non-overlapping groups?',
 a: 'Group each element with everything it relates to. Reflexivity puts every element inside its own group, so nothing is left out; symmetry and transitivity together mean that two groups sharing even one member must share all of them. Covering everything, with no partial overlaps allowed, is exactly what being a partition means.',
 s: ['Let R be reflexive, symmetric and transitive on a set S, and for each a define its class [a] = {x ∈ S : a R x} — everything that a relates to.',
   'Reflexivity gives a R a, so a ∈ [a]. Every element lies in at least one class, so the classes between them cover S.',
   'Now suppose two classes overlap: some c lies in both [a] and [b], meaning a R c and b R c. Symmetry turns the second into c R b, and transitivity chains a R c with c R b into a R b.',
   'Take any x ∈ [b], so b R x. Combined with a R b, transitivity gives a R x, so x ∈ [a] — that is, [b] ⊆ [a]. Symmetry gives b R a, and running the same argument with a and b swapped gives [a] ⊆ [b]. So the two classes are equal.',
   'Any two classes therefore either share nothing or coincide, and together they cover S: that is a partition. Each property earned its keep, and dropping one breaks it — “differs by less than 1” on the numbers is reflexive and symmetric but not transitive, and its classes overlap without being equal, since 0.5 relates to both 0 and 1.2 while those two do not relate to each other.'],
 m: 'Equality in a program is meant to be an equivalence relation, and this theorem is why it matters: hash sets, deduplication, union–find components and the residue classes mod n all depend on “same group” being well defined. An equals method that is not transitive destroys the partition, and the symptom is a container holding two elements it insists are equal.'
},

recurrence: {
 q: 'Why does guessing aₙ = rⁿ and solving a quadratic give every solution of a two-term recurrence?',
 a: 'Two facts carry the method. Geometric sequences are the ones on which the recurrence collapses to a single equation about r, because every term carries the same factor rⁿ⁻² and it divides straight out. And the recurrence is deterministic, so a solution is completely pinned down by its first two values — which means matching two numbers is enough to match the whole sequence.',
 s: ['Take aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ and try aₙ = rⁿ with r ≠ 0. Substituting gives rⁿ = c₁rⁿ⁻¹ + c₂rⁿ⁻²; divide through by rⁿ⁻² and every n vanishes, leaving r² = c₁r + c₂. A geometric sequence solves the recurrence exactly when r is a root of that quadratic.',
   'The recurrence is linear, so combinations survive it. If sₙ and tₙ each satisfy it, then c₁(Asₙ₋₁ + Btₙ₋₁) + c₂(Asₙ₋₂ + Btₙ₋₂) regroups as A(c₁sₙ₋₁ + c₂sₙ₋₂) + B(c₁tₙ₋₁ + c₂tₙ₋₂) = Asₙ + Btₙ. So with distinct roots r₁ and r₂, every A r₁ⁿ + B r₂ⁿ is a solution.',
   'Why there is nothing else: the recurrence computes each term from the two before it, so once a₀ and a₁ are fixed every later term is forced. Two solutions that agree at n = 0 and n = 1 agree at every n.',
   'So it suffices to hit the starting values. That means solving A + B = a₀ and A r₁ + B r₂ = a₁ — two linear equations in A and B whose determinant is r₂ − r₁, non-zero precisely because the roots are distinct, so exactly one pair (A, B) works.',
   'That pair’s combination agrees with the true sequence at n = 0 and n = 1, and by step 3 it therefore agrees forever. The closed form is not a lucky guess but the unique solution — and when the two roots coincide, that 2×2 system becomes singular, which is the honest reason the repeated-root case needs a second solution of the form n rⁿ.'],
 m: 'Fibonacci’s characteristic equation is r² = r + 1, whose larger root is the golden ratio φ ≈ 1.618, so Fₙ grows like φⁿ and the naive recursive implementation makes about that many calls before returning. In general the root largest in size dictates the growth rate, which is how a recurrence for an algorithm’s cost turns into the exponential base you actually care about.'
},

'advanced-counting': {
 q: 'Why does pigeonhole guarantee a crowded box rather than merely making one likely?',
 a: 'Suppose every box stayed under the claimed load. Adding the boxes up then gives a ceiling on how many items can exist at all — and that ceiling comes out below the number of items you are holding. No assumption about how the items were placed is used anywhere; the arithmetic alone forbids it, which is why the conclusion is a guarantee and not a probability.',
 s: ['The claim: put n items into k boxes, and some box holds at least ⌈n/k⌉ of them, where ⌈·⌉ rounds up to the next whole number.',
   'Suppose otherwise — that every box holds at most ⌈n/k⌉ − 1 items.',
   'Then the total across all k boxes is at most k(⌈n/k⌉ − 1). Rounding up raises a number by less than a whole unit, so ⌈n/k⌉ < n/k + 1, which rearranges to ⌈n/k⌉ − 1 < n/k.',
   'Multiply that by k: the total is strictly less than k · (n/k) = n. But the total is exactly n, and n < n is impossible, so the supposition fails.',
   'Hence some box holds at least ⌈n/k⌉ items. The plain version is the case n > k, where ⌈n/k⌉ ≥ 2: more items than boxes forces a repeat. And notice what is not claimed — not which box, not that the loads are anywhere near even, and nothing at all about how the items were distributed.'],
 m: 'A thousand keys into a hundred buckets forces some bucket to hold ten, however clever the hash function is: collisions are arithmetic, not bad luck. The same counting kills the dream of a lossless compressor that shrinks every input — there are 2ⁿ inputs of n bits but fewer than 2ⁿ strings shorter than n, so two inputs must share an encoding and at least one of them can never be recovered.'
},

automata: {
 q: 'Why can no finite state machine — and so no true regular expression — match balanced parentheses?',
 a: 'A finite machine remembers only which state it is in, so its entire memory is a choice among finitely many labels. Feed it more distinct depths than it has states and two different depths must leave it in the same state — and from that moment it cannot tell them apart, so it will demand the same closing brackets from both.',
 s: ['Suppose some machine with m states accepts exactly the balanced strings. Feed it the m + 1 strings “(”, “((”, and so on up to m + 1 opening brackets.',
   'Each of those leaves the machine in some state. There are m + 1 strings and only m states, so by pigeonhole two different ones — (ⁱ and (ʲ with i < j — end in the same state.',
   'Everything the machine does from then on depends only on the state it is currently in; that is what “finite state” means, since the input read so far is stored nowhere else. So for any continuation w, the machine accepts (ⁱw exactly when it accepts (ʲw.',
   'Choose w to be i closing brackets. Then (ⁱ)ⁱ is balanced and so is accepted, which forces (ʲ)ⁱ to be accepted too. But that string has j > i openers against only i closers, so it is not balanced — and the machine was supposed to accept exactly the balanced strings.',
   'The contradiction rules the machine out. The obstruction is memory rather than cleverness: recognising balance means distinguishing unboundedly many depths, and m states can distinguish at most m things. Give the machine a stack and depth becomes countable, which is precisely the step up from a regular language to a context-free one.'],
 m: 'This is the exact reason you cannot parse HTML, JSON or nested expressions with a regular expression, and why a compiler splits into a lexer — a finite state machine over tokens — and a parser, a stack machine over structure. Engines that advertise backreferences and recursion have left the regular languages behind to do it, and the backtracking blow-ups they are prone to are the receipt.'
},

};
