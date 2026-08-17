// The extended analogy layer: one everyday picture per lesson, mapped piece by
// piece onto the mathematics, and then honestly broken.
//
// The one-line `an` in course-depth.js is a glance. This is the sustained
// version — enough to carry the whole topic — and it always ends by saying
// where it stops being true. An analogy nobody has bounded is a future
// misconception with a friendly face.
//
// scene = the everyday situation · map = [everyday thing, the mathematics]
// breaks = where the picture stops telling the truth
export const ANALOGY = {

signed: {
 scene: 'A lift in a building that has floors above ground and car parks below it. The ground floor is zero, and every journey is “start somewhere, travel some number of floors in some direction”.',
 map: [['Which floor you are on', 'the number itself, sign and all'],
   ['Going up three floors', 'adding a positive number'],
   ['Going down three floors', 'adding a negative number'],
   ['The ground floor', 'zero — not a floor you own, just where counting starts'],
   ['How far you are from the ground, ignoring up or down', 'absolute value'],
   ['Cancelling a planned descent', 'subtracting a negative, which sends you up'],
   ['Turning around, twice', '(−a)(−b) = ab']],
 breaks: 'Lifts stop at whole floors. Numbers do not: there is a number halfway between floor 2 and floor 3, and arithmetic is perfectly happy there. Take the direction from the lift and leave the steps behind.'
},

'order-ops': {
 scene: 'A shop receipt. Three coffees at £4 and two cakes at £3. Nobody adds 3 + 4 + 2 + 3 — you total each line first, then add the lines.',
 map: [['Working out one line: quantity × price', 'multiplication'],
   ['Adding the line totals at the bottom', 'addition'],
   ['Multiplication happening before addition, always', 'the precedence rule'],
   ['A meal deal rung up as a single item', 'brackets — “treat this as one thing”'],
   ['A bulk discount applied to a line before the line joins the total', 'a nested bracket']],
 breaks: 'A receipt never has exponents, and it never nests more than a level or two deep. Real expressions nest as far as you like, which is why the rule has to be stated in full rather than left to common sense.'
},

fractions: {
 scene: 'Two people measuring the same shelf with different rulers — one marked in eighths, the other in twelfths. Neither is wrong, and neither can add their number to the other’s without a conversion.',
 map: [['The size of the marks on your ruler', 'the denominator'],
   ['How many marks you counted', 'the numerator'],
   ['Re-measuring both with one shared ruler', 'finding a common denominator'],
   ['A ruler fine enough for both, in twenty-fourths', 'the least common denominator'],
   ['Reporting the same length on a coarser ruler that still lands exactly', 'simplifying the fraction'],
   ['Asking how many of your marks fit in their length', 'dividing one fraction by another']],
 breaks: 'Real rulers have a finest mark, so measurement is always a bit of a lie. Fractions are exact — 1/3 is not “about 0.333”, it is precisely one third, and that difference is exactly what floating point later gets wrong.'
},

exponents: {
 scene: 'Folding a sheet of paper in half over and over. Each fold doubles the thickness, and the pile gets out of hand far faster than anyone expects.',
 map: [['The number of folds', 'the exponent'],
   ['The thickness of the pile', 'the result'],
   ['The unfolded sheet, before any folding', 'a⁰ = 1 — one thickness, not zero'],
   ['Two folds then three more folds', 'a² · a³ = a⁵ — folds add'],
   ['Unfolding, undoing a fold', 'a negative exponent'],
   ['Asking how many folds got me to this thickness', 'the logarithm'],
   ['Asking what thickness folds to this one', 'the root']],
 breaks: 'You cannot fold a sheet half a time, but a fractional exponent is completely respectable — x^(1/2) is the square root. The picture explains why exponents add; it has nothing to say about why they can be fractions.'
},

factors: {
 scene: 'You have some number of square tiles and you want to lay them out in a perfect rectangle, no gaps and none left over. Some counts give you lots of choices; some give you almost none.',
 map: [['The side lengths of a rectangle you can build', 'a pair of factors'],
   ['Twelve tiles: 1×12, 2×6, 3×4', 'the factors of 12'],
   ['A count that only makes the boring 1×n strip', 'a prime number'],
   ['Tiles fitting with none left over', 'divisibility'],
   ['The near-square rectangle', 'why trial division stops at √n'],
   ['Breaking every rectangle down until only strips remain', 'prime factorisation']],
 breaks: 'Rectangles show factors in pairs, which hides the deeper fact: the prime decomposition is unique. Tiles will happily show you 12 = 2×6 and 12 = 3×4 without ever hinting that 12 = 2²×3 and nothing else.'
},

decimals: {
 scene: 'A ruler where, whenever you need more precision, you subdivide the last gap into ten. Then ten again. Each new decimal place is one more level of zoom.',
 map: [['Each subdivision into ten', 'one more decimal place'],
   ['Reading to the finest mark you trust', 'rounding'],
   ['A length landing exactly on a mark', 'a terminating decimal, like 0.25'],
   ['A length that never lands, however far you zoom', 'a recurring decimal, like 1/3'],
   ['Two different readings of the same length', '0.999… and 1 naming one number'],
   ['Per hundred marks', 'a percentage']],
 breaks: 'A real ruler runs out of marks; the decimal expansion never does. And zooming suggests you are getting closer to the number — you are not. The number was always exactly where it is; only your description of it improves.'
},

ratios: {
 scene: 'Scaling a recipe. Two eggs to three hundred grams of flour makes one cake; you want four cakes, and everything must grow together or you get something inedible.',
 map: [['Two eggs to three hundred grams', 'the ratio 2 : 300'],
   ['Making four times as much', 'multiplying both parts by 4'],
   ['The taste staying the same at any size', 'proportionality'],
   ['Eggs per hundred grams of flour', 'a rate — one number instead of two'],
   ['Scaling both sides of the recipe to compare', 'cross-multiplication'],
   ['A recipe written per person', 'a unit rate']],
 breaks: 'This is the most useful failure in the course: the baking time does not scale. Double the cake and it does not take double the minutes. Plenty of quantities are proportional and plenty are not, and assuming the wrong one is behind a lot of bad capacity planning.'
},

expressions: {
 scene: 'A warehouse of labelled boxes. The label on the outside tells you what kind of thing is inside, and you can reason about the boxes long before anyone tells you what is in them.',
 map: [['A label reading “x”', 'a variable'],
   ['Whatever is actually inside', 'its value'],
   ['Three x-boxes and two more x-boxes', '3x + 2x = 5x — same label, so they combine'],
   ['Three x-boxes and two y-boxes', '3x + 2y — different labels, nothing to combine'],
   ['Being told at last that x is 7', 'substitution'],
   ['A pallet holding several boxes, moved as one', 'a bracketed sub-expression']],
 breaks: 'A box holds one thing at a time. A variable in an identity like (a+b)² = a² + 2ab + b² is standing for every value at once — the statement is not about one particular a, it is about all of them simultaneously.'
},

inequalities: {
 scene: 'Two runners on a straight track. One is ahead of the other, and the question is what you can do to the race without changing who is winning.',
 map: [['A is behind B', 'a < b'],
   ['Both runners advance ten metres', 'adding the same number to both sides — order survives'],
   ['Measuring the track in feet instead of metres', 'multiplying both sides by a positive — order survives'],
   ['Re-measuring the track from the opposite end', 'multiplying by a negative — “ahead” becomes “behind”, so the sign flips'],
   ['The whole stretch of track where a runner could be', 'the solution set, shaded on a line'],
   ['Whether the finish line itself counts as finishing', 'the difference between < and ≤']],
 breaks: 'A race is one-dimensional. An inequality in two variables, like y > 2x + 1, describes a whole region of the plane, and there is no runner and no track any more — just a side of a line.'
},

coordinates: {
 scene: 'A city laid out as a grid, with a central square. Every address is “so many blocks east, so many blocks north”, and negatives just mean west and south.',
 map: [['Blocks east or west of the square', 'the x-coordinate'],
   ['Blocks north or south', 'the y-coordinate'],
   ['The central square itself', 'the origin, (0, 0)'],
   ['Which quarter of the city you are in', 'the quadrant — and it is only the two signs'],
   ['One address naming exactly one place', 'a coordinate pair determining a point'],
   ['The crow-flies distance between two addresses', 'the distance formula']],
 breaks: 'You cannot walk crow-flies — you have to follow the streets, which is a different distance entirely (blocks east plus blocks north). Both are real notions of distance, and machine learning uses each of them under the names L2 and L1.'
},

'word-problems': {
 scene: 'Translating a sentence into a language you are still learning. The hard part is never the grammar — it is deciding exactly what the original sentence meant before you commit to words.',
 map: [['Writing down what each word will stand for', '“let x = the number of hours”'],
   ['“is”, “was”, “gives”', 'the equals sign'],
   ['“five more than”', '+ 5'],
   ['“twice”, “per”, “each”', 'multiplication'],
   ['Keeping nouns and units straight through the sentence', 'checking that both sides carry the same units'],
   ['Re-reading the original to see if you answered the actual question', 'checking what was asked for, not just solving for x']],
 breaks: 'Human languages tolerate ambiguity and mostly survive it — “I saw the man with the telescope” is fine in conversation. Algebra has no tolerance at all: one reading is right and the rest give wrong answers, which is why the definition line is not optional.'
},

linear: {
 scene: 'A taxi meter: a flag-fall fee ticks up the moment you get in, then the fare climbs steadily for every mile travelled.',
 map: [['The flag-fall you owe before a single mile is driven', 'b, the y-intercept'],
   ['The fare climbing by a fixed amount per mile', 'm, the slope'],
   ['Reading the total fare after a known distance', 'evaluating y = mx + b'],
   ['Working out the distance from a total fare on the receipt', 'solving for x — undo the flag-fall first, then undo the rate'],
   ['Two fares logged at two different distances', 'finding slope from two points, m = (y₂ − y₁)/(x₂ − x₁)'],
   ['Knowing the per-mile rate and one logged fare', 'point-slope form, building the whole meter from a single reading'],
   ['A rival firm charging the same per-mile rate but a different flag-fall', 'two lines sharing slope m with different intercepts b — parallel, so the two fares never agree at any distance']],
 breaks: 'A taxi meter only ever climbs — it has no picture for a negative slope, a fare that falls as the miles rack up, or a flag-fall paid below zero. It is also only defined for miles ≥ 0, while a line in algebra keeps going through negative x as if the taxi could drive before it existed.'
},

quadratics: {
 scene: 'Throwing a ball straight up from the ground and tracking its height each second: it climbs, slows, hangs for an instant, then falls back down along one smooth arc.',
 map: [['The ball’s height at each moment', 'y = ax² + bx + c'],
   ['The instant it is motionless at the top of its arc', 'the vertex, at x = −b/(2a)'],
   ['The moment it leaves your hand and the moment it lands', 'the two roots of the equation'],
   ['Only one rise and one fall — never a second hump', 'a quadratic bends once, crossing zero at most twice'],
   ['The throw and the catch sitting equally spaced either side of the peak', 'the ± in the quadratic formula, symmetric about the vertex'],
   ['Timing the throw from the peak instead of from the ground', 'completing the square — isolating (x + b/2a)²'],
   ['The height of your hand at the instant of release', 'c, the constant term — zero here because the toss starts at the ground, which is exactly why the two roots line up with leaving your hand and landing']],
 breaks: 'Gravity only ever pulls down, so a thrown ball can only trace a parabola that opens downward (a < 0) with a maximum — it has nothing to show you for a > 0 and a minimum. And a ball thrown from the ground always lands again, so this scene silently assumes a positive discriminant; it has no picture at all for the case where the parabola never reaches zero.'
},

systems: {
 scene: 'Two searchlights on distant hillsides, each swept along a fixed straight beam across the night sky, hunting for the one patch where both beams touch.',
 map: [['Each searchlight’s fixed beam', 'one equation’s line — every point that satisfies it'],
   ['The single patch of sky where both beams cross', 'the unique solution of the system'],
   ['The beams aimed at clearly different angles', 'ad − bc ≠ 0 — a unique intersection exists'],
   ['The beams held running exactly parallel', 'ad − bc = 0 with no shared point — no solution'],
   ['Both beams, by coincidence, tracing the very same path', 'ad − bc = 0 with a solution — every point on it works, infinitely many'],
   ['Rewriting one beam’s equation in different units so a coefficient matches the other’s — the beam itself does not move', 'scaling an equation by a constant, which keeps the same line but lines up a coefficient for elimination']],
 breaks: 'Real searchlight beams are rays, not full lines — light only travels outward from the tower, never back through it. Two rays at different angles can easily point away from each other and never cross, even though ad − bc ≠ 0 guarantees the two full lines meet somewhere; algebra’s line runs both ways through every point, including the ones behind the searchlight no beam ever reaches. And real beams have width, so even a genuine crossing is a smudge with room for error — which is exactly why two beams held almost parallel are the dangerous case: a tiny change in angle swings the crossing point wildly, the same instability a nearly-zero determinant causes in a real solver.'
},

functions: {
 scene: 'A theatre cloakroom: hand over your coat, receive a numbered ticket, and later trade the ticket back for that exact coat.',
 map: [['Handing over a coat and receiving a ticket', 'applying the function, f: input → output'],
   ['Presenting the ticket and receiving the coat back', 'applying the inverse, f⁻¹: output → input'],
   ['One ticket number pointing to exactly one coat on the rack', 'no two inputs sharing an output'],
   ['Two different coats accidentally tagged with the same number', 'f(x₁) = f(x₂) with x₁ ≠ x₂ — not one-to-one, no inverse'],
   ['The attendant refusing to hang a second coat under a number already in use', 'restricting the domain to force invertibility, as x² becomes invertible once you require x ≥ 0'],
   ['Coat in, ticket out, ticket in, the very same coat out', 'f⁻¹(f(x)) = x and f(f⁻¹(y)) = y']],
 breaks: 'A real cloakroom attendant could recognise your face and hand back your coat without ever checking the ticket — memory can paper over a clash that a genuine function cannot. f⁻¹ has to be a rule that works for every output with nothing memorised case by case, which is exactly why the no-collision condition must hold for every pair of inputs, not just the ones a person happens to remember.'
},

polynomials: {
 scene: 'An old mechanical register with several number wheels wired so their readings multiply together into one final total, rather than add.',
 map: [['The final total on the register', 'the value of the polynomial, p(x)'],
   ['Rebuilding the register as several separate wheels multiplied together', 'factoring, p(x) = (x − r₁)(x − r₂)⋯'],
   ['Turning one wheel to read zero', 'setting one factor, (x − r), to zero'],
   ['The total collapsing to zero the instant any single wheel hits zero, whatever the rest show', 'the zero product property'],
   ['The register having exactly as many wheels as its degree, no more', 'a degree-n polynomial has at most n roots'],
   ['Unbolting one wheel and being left with a smaller, still-working register', 'dividing out a factor — the factor theorem, degree drops by one']],
 breaks: 'Real wheels can jam, lose a tooth, or drift out of calibration, but the zero product property is not approximate in that way at all — it rests on ordinary numbers having no zero divisors, a fact about the number system rather than the machine. It even fails in other number systems: modulo 12, a wheel reading 3 and a wheel reading 4 multiply to a total of 0 with neither wheel at zero. The register can show you that the rule holds; it cannot show you why.'
},

rational: {
 scene: 'Splitting a fixed set-up cost across however many units you decide to produce, then adding a steady cost of materials for each one.',
 map: [['The number of units produced', 'x'],
   ['The one-off set-up cost, spread thinner as x grows', 'the term with x in the denominator'],
   ['The steady per-unit cost of materials, which does not shrink no matter how large production gets', 'the constant term outside the denominator — what the average cost is converging toward'],
   ['Average cost per unit once production is very large', 'the horizontal asymptote — leading coefficients only, everything else outvoted'],
   ['Trying to divide the set-up cost among zero units', 'the vertical asymptote — undefined where the denominator is zero'],
   ['Asking what the cost curve says at −4 units, a production run that cannot happen', 'the rational expression still returns a number there — the algebra has no idea x must be a whole, non-negative count']],
 breaks: 'The picture quietly conflates two different questions at x = 0: “what does it cost to make nothing”, a perfectly sensible zero, and “what is the cost per unit when there are no units”, a question with no answer because there is nothing to divide by. A factory manager can tell those apart instantly; the rational expression cannot — it is undefined either way, and that is exactly the distinction between a genuine gap in the world and a division that was never askable in the first place.'
},

transformations: {
 scene: 'A DJ has a song loaded on a turntable. Cueing the needle to drop later delays the whole song; turning the volume knob up doesn’t touch the needle at all, it only changes how loud what’s already playing sounds.',
 map: [['Delaying the needle-drop by h seconds', 'f(x − h) — a shift right, because subtracting from the input delays it'],
   ['Cueing the needle to drop h seconds early instead', 'f(x + h) — a shift left'],
   ['Turning the volume knob up by k once the needle has dropped', 'f(x) + k — a shift up, acting on the output, forwards as expected'],
   ['Playing the record at double speed', 'f(2x) — horizontal compression, the whole song races past twice as fast'],
   ['Playing the record at half speed', 'f(x/2) — horizontal stretch'],
   ['Turning up the amp gain, multiplying the loudness at every instant', 'a·f(x) — a vertical stretch']],
 breaks: 'Speeding up a record changes its pitch as a side effect — playing at double speed doesn’t just compress the timeline, it raises every note by an octave. f(2x) does no such thing: it only compresses the x-axis, the y-values are exactly the values f already had, just visited sooner. The needle-drop story also only makes sense looking forward; f(x + h) is defined for every h, including ones that would mean “the song started before it existed”, which has no turntable equivalent but is perfectly good algebra.'
},

exponential: {
 scene: 'A pond has a single lily pad that doubles in area every day. Left alone it looks like nothing is happening for weeks — then it covers the whole pond in the final day or two.',
 map: [['Area covered on day n', 'y = a·bⁿ, with b = 2'],
   ['The single starting pad’s area', 'the initial value a'],
   ['Each day’s doubling', 'the growth factor b > 1'],
   ['A pad that instead covered half as much each day', '0 < b < 1, decay'],
   ['Growth measured continuously rather than once a day', 'A = Pe^(rt)'],
   ['The pond looking untouched for weeks, then suddenly full', 'the far-right blow-up of exponential growth, and why it always arrives later than expected']],
 breaks: 'Real lily pads cannot cover more than the pond — growth stops dead at the edge. y = a·bⁿ has no such ceiling built in; it keeps doubling forever. That missing ceiling is exactly the difference between exponential and logistic growth, and why every real population eventually bends over into an S-curve that the pure exponential model refuses to show.'
},

logarithms: {
 scene: 'A photo viewer where each click of the zoom button doubles the magnification. You start at 1× and click repeatedly to reach whatever zoom level you want.',
 map: [['The zoom level reached', 'x, the argument of the logarithm'],
   ['Clicks needed to reach zoom level x', 'log₂(x)'],
   ['Clicking on from x× up to xy×, after already reaching x×', 'log(xy) = log x + log y — the extra stretch of clicking is exactly log y clicks, wherever you started'],
   ['Doubling the target zoom, x → 2x', 'always exactly one more click — log(2x) = log x + 1'],
   ['Raising the target to the nth power, x → xⁿ', 'log(xⁿ) = n log x — n copies of the same stretch of clicking'],
   ['A friend’s zoom button triples instead of doubles', 'a different base — the same clicks, counted in different units, related by change of base'],
   ['Being handed a zoom level and asked how many clicks reached it', 'the defining question of a logarithm']],
 breaks: 'Real zoom buttons only land on whole clicks — 1×, 2×, 4×, 8× — but log₂(x) is defined for every positive x, including fractional click-counts like log₂ 3 ≈ 1.585 that no button press can produce. The click count on the real gadget is also always zero or positive; the mathematical logarithm is perfectly happy to come out negative, for zooming out to x < 1.'
},

sequences: {
 scene: 'A rubber ball dropped from a height, bouncing over and over, each bounce reaching a fixed fraction of the height of the one before.',
 map: [['The height of each successive bounce', 'a term of the sequence, aₙ'],
   ['Each bounce reaching, say, ⅔ of the previous height', 'the common ratio r'],
   ['A ball that instead lost the same fixed height on every bounce', 'an arithmetic sequence, constant difference d'],
   ['The total distance travelled up and down over every bounce, added together', 'the series — the sum of the sequence'],
   ['That total settling on a finite height even though the ball bounces forever', 'convergence of Σarⁿ to a/(1 − r) when |r| < 1'],
   ['A ball that somehow bounced back exactly as high each time', 'r = 1 — nothing to converge to, the terms never shrink'],
   ['Adding up just the first ten bounces before you get bored counting', 'a partial sum, Sₙ']],
 breaks: 'A real ball stops bouncing once its height drops below what friction and air resistance can sustain — the sequence effectively terminates. The mathematics has no such floor: Σarⁿ genuinely sums infinitely many nonzero terms, and it is exactly the fact that infinitely many positive numbers can still add to something finite that a falling ball only gestures at, never demonstrates.'
},

piecewise: {
 scene: 'A car’s accelerator pedal has a little travel of slack at the top before the throttle engages — press it partway and nothing happens; past that point the engine responds in proportion to how far you push.',
 map: [['How far you can press before anything happens', 'the piece where f(x) = 0'],
   ['Pushing past that point', 'the piece where the output grows with x — ReLU’s own threshold sits at x = 0'],
   ['The whole rule, told as “if this much pressure, then this response”', 'the piecewise definition of the function'],
   ['The exact pedal position where the throttle first engages', 'the boundary between the two pieces'],
   ['No jolt at the engagement point — speed doesn’t jump, it just starts climbing', 'continuity: the pieces meet in value'],
   ['A kink you can feel through your foot right at engagement, where the pedal’s resistance changes abruptly', 'non-differentiability: the pieces meet in value but not in slope'],
   ['A tax system charging one rate below a threshold and a higher rate above it', 'another everyday piecewise function, defined by if/else rather than one formula']],
 breaks: 'A real pedal’s engagement has some mechanical give — over a tiny range the response ramps up smoothly rather than kinking sharply, so the physical dead zone is actually a rounded curve if you zoom in far enough. ReLU’s kink is genuinely sharp at every scale: max(0, x) has no rounding to find no matter how far into x = 0 you zoom, which is exactly why its derivative there is undefined rather than merely awkward to compute.'
},

binomial: {
 scene: 'Flip a fair coin n times in a row and ask how many of the 2ⁿ possible outcomes land exactly k heads.',
 map: [['One particular sequence of n coin flips', 'one term in the full expansion of (a + b)ⁿ, before collecting'],
   ['Choosing which k of the n flips came up heads', 'C(n,k), the coefficient of a^(n−k)b^k'],
   ['The total number of possible flip sequences', '2ⁿ, the sum of every C(n,k) — matches setting a = b = 1'],
   ['Thinking of n flips as n − 1 flips plus one more at the end', 'Pascal’s rule, C(n,k) = C(n−1,k−1) + C(n−1,k), splitting on the last flip'],
   ['Every possible run of heads and tails, tallied by how many heads each run had', 'Pascal’s triangle, row n'],
   ['Weighting each outcome by how likely heads and tails actually are, instead of counting them equally', 'the binomial distribution, C(n,k)pᵏ(1 − p)ⁿ⁻ᵏ']],
 breaks: 'Coin flips are sequential and irreversible — you flip three, then flip a fourth. But (a + b)ⁿ treats its n brackets as identical and interchangeable; nothing in the algebra remembers which factor came first. Pascal’s rule works because you are free to pretend one flip was “last” — but that is a bookkeeping choice for the proof, not something the coin itself ever knows about.'
},

limits: {
 scene: 'A plane on final approach, watched through binoculars from the control tower. A bank of fog sits permanently over the runway threshold, so you never actually see the wheels touch down — but you can watch the plane closing in from both directions of the glide path and see exactly where it is heading.',
 map: [['Distance still to run along the glide path', 'how close x is to a'],
   ['The plane’s height at each moment of the approach', 'f(x)'],
   ['The height the plane is obviously heading for, seen from both sides', 'the limit L'],
   ['The fogbank sitting over the threshold itself', 'the point a excluded from the test, 0 < |x − a|'],
   ['Watching closer in to pin the height down to any tolerance you like', 'the ε–δ definition'],
   ['A cockpit readout that jumps to some unrelated number only at the instant of touchdown', 'a removable discontinuity, where lim f ≠ f(a)']],
 breaks: 'A real aircraft eventually lands — wheels meet tarmac whether or not fog was in the way. A limit makes no such promise: f(a) can be some wild unrelated number, undefined, or simply missing, and the limit does not care, because a is not merely obscured, it is excluded from the definition by name. Fog suggests a truth hidden from view; 0 < |x − a| is a truth deliberately not asked about.'
},

derivatives: {
 scene: 'A cyclist grinding up a long hill, timed with a stopwatch over a stretch of road — first the whole hill, then a much shorter stretch near the summit, then a stretch shorter still.',
 map: [['Distance covered divided by the time taken, over some stretch', 'the difference quotient [f(x+h) − f(x)]/h'],
   ['Shortening the stretch you time them over', 'shrinking h toward 0'],
   ['The number the readings settle on as the stretch shrinks to nothing', 'f′(x), the instantaneous speed'],
   ['A single exact speedometer reading at one spot on the hill', 'the derivative as a limit, not a small but real interval'],
   ['A pothole edge where the road kinks sharply underneath the wheel', 'a point where f is continuous but f′ does not exist'],
   ['The whole climb divided by the whole distance', 'the average rate of change, which only approximates f′ at any one point']],
 breaks: 'A stopwatch always averages over some nonzero interval, however brief; the derivative is the limit as that interval shrinks to exactly zero, which no instrument can reach. That gap cuts both ways: estimate a derivative numerically with too large an h and you get a bad average, but push h too small instead and rounding error in the subtraction f(x+h) − f(x) swamps the signal, so the estimate gets worse, not better, at the very end.'
},

'chain-rule': {
 scene: 'A bicycle drivetrain: turning the pedals turns the chainring, the chain turns the rear cog, and the rear cog turns the wheel. Each stage has its own ratio, and the ratios stack.',
 map: [['One turn of the pedals', 'a small nudge to x'],
   ['How many times the chainring turns for one turn of the pedals', 'the inner rate, g′(x)'],
   ['How many times the wheel turns for one turn of the chainring you are actually in', 'the outer rate, f′ evaluated at u = g(x)'],
   ['How many times the wheel turns for one turn of the pedals', 'the chain rule product, f′(g(x))·g′(x)'],
   ['Adding a hub gear behind the derailleur, a third stage', 'three composed functions, ratios still multiplying straight through'],
   ['The wheel spinning backward if you pedal backward', 'a negative factor carried through the product unchanged']],
 breaks: 'A bicycle’s gear ratios are fixed by tooth counts — pick a gear and the ratio stays the same at any speed. A derivative is not fixed like that: g′(x) generally changes with x, so the “gear ratio” the chain rule needs has to be recalculated at the actual value g(x) reached, not read off some nameplate. Forget that and you have multiplied by the ratio for the wrong gear entirely.'
},

optimization: {
 scene: 'A hiker crossing hilly ground with their eyes shut, feeling nothing but whether the ground underfoot is tilting up, tilting down, or lying flat, and using that alone to hunt for the highest point on the trail.',
 map: [['Whether the ground tilts up or down under a footstep', 'the sign of f′'],
   ['A patch that feels level underfoot', 'a critical point, f′ = 0'],
   ['Whether that level patch sits on top of a knob or the bottom of a dip', 'the second-derivative test, f″'],
   ['Reaching a fence at the edge of the field without the ground ever going flat', 'an endpoint extremum, missed by the flat-ground test entirely'],
   ['Crossing suddenly from turf onto loose gravel underfoot', 'a point where f′ does not exist, another candidate'],
   ['A ledge that is level but neither the top of a rise nor the bottom of a dip', 'a flat critical point that is not an extremum, like x³ at 0']],
 breaks: 'A hiker calls ground “flat” once it is flat enough to feel through a boot; a critical point is exactly zero slope, a single dimensionless point, not a patch that is merely close enough. And a blind hiker who finds a level, curved-down spot has found a peak — but only a local one. Nothing about the feel of the ground under one pair of feet rules out a taller hill on the far side of the valley, which is exactly why the method only ever certifies local behaviour, and endpoints have to be checked separately by name.'
},

'product-quotient': {
 scene: 'A rectangular vegetable patch being extended on two sides at once — a stake moved out along the length, another moved out along the width, at the same time. The new area comes in three pieces: a strip along the old length, a strip along the old width, and a small corner square where the two strips overlap.',
 map: [['The patch’s length and its width', 'the two factors f and g'],
   ['The total area of the patch', 'the product fg'],
   ['The new strip added along the old length, because the width grew', 'the term f·g′'],
   ['The new strip added along the old width, because the length grew', 'the term g·f′'],
   ['The small corner square where both extensions overlap', 'the second-order term that is discarded in the limit'],
   ['Fixing the width at a single unit row and asking how it shrinks as the length alone changes', 'a quotient reframed as a product with a reciprocal, 1/g'],
   ['That reciprocal row shrinking faster and faster as g grows larger', 'the −g′/g² term in the quotient rule']],
 breaks: 'In the garden the corner square is a real patch of dirt — small, but still there in the final area, however you order the two extensions. In the derivative it is not merely “small”, it is exactly zero in the limit, because it is a growth multiplied by a growth and both are being shrunk to nothing at once. Multiplying the two separate growth rates instead of adding the two strips keeps only the corner and throws away the two strips that actually mattered — which is why (fg)′ ≠ f′g′.'
},

'curve-sketching': {
 scene: 'Filling a bathtub while easing the tap open, then partway through easing it shut again, and finally pulling the plug. You can watch the water level, but you can also feel whether the rate it is climbing is itself speeding up, slowing down, or has reversed into a fall.',
 map: [['The water level in the tub', 'f(x)'],
   ['Whether the level is rising or falling', 'the sign of f′(x)'],
   ['How wide the tap is open, i.e. how fast the level is climbing', 'the size of f′(x)'],
   ['The level climbing more and more slowly as you ease the tap shut', 'f″(x) < 0, concave down'],
   ['The level climbing faster and faster as you open the tap further', 'f″(x) > 0, concave up'],
   ['The exact instant you switch from opening the tap to closing it', 'an inflection point, where f″ changes sign'],
   ['The moment the level stops rising and turns to fall, right as the plug comes out', 'a local maximum, f′ = 0 with f″ < 0']],
 breaks: 'Watching the tap only ever tells you about this instant; concluding that a positive reading at every instant across five minutes means the tub ends fuller than it started feels obvious with water, because water cannot un-happen. For an arbitrary function that pointwise-to-global leap is not automatic — it needs the mean value theorem to license it, and the bathtub’s physical continuity is quietly doing work that an abstract curve does not get for free.'
},

representation: {
 scene: 'A class of pupils deciding how to record who is friends with whom. One way: a giant grid, a row and a column for every pupil, with a tick where two names cross if they are friends. The other way: give each pupil an index card and let them write down only the names of their own friends.',
 map: [['Each pupil', 'a vertex'],
   ['A tick where two names cross', 'an edge'],
   ['The full grid, one cell for every possible pair', 'the adjacency matrix — O(V²) space whatever the tick count'],
   ['One pupil’s index card', 'their adjacency list — as long as their actual number of friends'],
   ['Counting every name on every card', 'the handshake lemma, Σ deg(v) = 2E — each friendship written on two cards'],
   ['A grid that is mostly blank, versus one nearly full of ticks', 'sparse versus dense — the choice between the two representations'],
   ['Checking whether two named pupils are friends: reading one cell, or scanning a whole card', 'O(1) matrix lookup versus O(deg) list lookup']],
 breaks: 'Friendship is symmetric, so the tick at row Amir, column Priya is the same fact as the tick at row Priya, column Amir — every entry in this scene is mirrored across the diagonal. Plenty of real graphs are not: a “follows” link on social media runs one way, so the matrix loses its mirror symmetry and a name can sit on someone’s card without appearing on theirs. And a classroom is far too small to feel why the choice matters at all — the trade-off only bites once V reaches the millions, where the full grid nobody could draw becomes a trillion cells nobody can allocate.'
},

paths: {
 scene: 'A search-and-rescue team at the mouth of a cave system, several tunnels branching from every junction. Two ways to search it: clear every tunnel one step from the entrance before going any further, or send a single team as deep down one tunnel as it goes before turning back.',
 map: [['A tunnel junction', 'a vertex'],
   ['A passage between two junctions', 'an edge'],
   ['The cave entrance where the search begins', 'the start vertex'],
   ['Clearing every junction one step away before any junction two steps away', 'BFS — exploring layer by layer'],
   ['Sending one team down a single tunnel as far as it goes before turning back', 'DFS — exploring depth-first'],
   ['The waiting list of junctions still to visit, oldest first', 'the BFS queue'],
   ['The rope paid out behind the deep team, reeled in to backtrack', 'the DFS stack — recursion unwinding']],
 breaks: 'Rescuers walking a tunnel take time proportional to its length in metres, but BFS and DFS both count junctions, not distance — a one-metre passage and a one-kilometre passage are each just “one edge”. Real tunnels, and real networks, differ in cost from link to link, and the moment they do, layer-by-layer search stops being “fewest tunnels”, and Dijkstra’s search, which weighs each passage rather than merely counting it, has to take over.'
},

trees: {
 scene: 'A handful of remote farmhouses that need connecting by telephone wire. Wire is expensive, so you want the whole cluster joined at the lowest total cost, with nobody paying for a spare loop back to somewhere already reachable.',
 map: [['Each farmhouse', 'a vertex'],
   ['A length of wire that could join two farmhouses, priced by distance', 'a weighted edge'],
   ['The finished network reaching every farmhouse, with no loop left in it', 'a spanning tree'],
   ['Buying the very cheapest wires first, skipping any that would only complete a loop', 'Kruskal’s algorithm'],
   ['Growing outward one connected farmhouse at a time, always adding the cheapest link to the frontier', 'Prim’s algorithm'],
   ['One farmhouse left stranded the instant the single wire feeding it is cut', 'why deleting any tree edge disconnects something'],
   ['A network with one fewer wire than farmhouses, and not one wire more', 'V − 1 edges, exactly']],
 breaks: 'Real wire, once you allow a redundant loop, buys you a backup route if one link fails — a working engineer often wants exactly the redundancy a tree refuses to pay for, since severing any single wire in a true tree strands a farmhouse alone. A minimum spanning tree answers only “cheapest way to connect everyone”, not “most resilient way”, which is why real infrastructure is deliberately built with extra edges a spanning tree would call wasteful.'
},

coloring: {
 scene: 'Timetabling final exams at a university. Two exams that share even a single student cannot sit in the same slot, and the registrar wants the whole sitting finished in as few slots as possible.',
 map: [['An exam', 'a vertex'],
   ['Two exams sharing at least one student', 'an edge'],
   ['A timeslot', 'a colour'],
   ['No two exams that share a student ever landing in the same slot', 'a proper colouring'],
   ['The exam that clashes with the most others', 'the vertex of maximum degree, Δ'],
   ['Scheduling exams one at a time, always into the earliest slot that clashes with none of its already-placed neighbours', 'the greedy procedure that never needs more than Δ + 1 slots'],
   ['Three exams that pairwise share students with each other', 'a clash needing three slots minimum, not two']],
 breaks: 'The greedy method above always finishes within Δ + 1 slots, but which exams get scheduled early changes how many slots it actually spends — the bound is real, but it is an upper bound, not the true minimum, and finding that true minimum is NP-hard. And this scene has no map in it at all: nothing here is drawn flat with borders that never cross, so there is no reason clashes should ever be limited to four groups. The four-colour theorem is a fact about planar graphs specifically; an exam-clash graph can need as many slots as there are exams that all clash with each other.'
},

dags: {
 scene: 'Getting dressed for work. Socks go on before shoes, a shirt before a jacket — some items have a genuine order, and a few, like a watch and a belt, do not care about each other at all.',
 map: [['An item of clothing', 'a vertex'],
   ['“Put this on before that”', 'a directed edge'],
   ['A full outfit that respects every such rule', 'a topological sort'],
   ['“Shoes before socks, and socks before shoes”', 'a cycle — and an impossible request'],
   ['Two items with no rule between them, either order is fine', 'non-uniqueness — more than one valid topological sort can exist'],
   ['Everything with nothing left to put on first', 'the zero in-degree set, where a valid order can start'],
   ['Putting one item on, then crossing it off everyone else’s prerequisite list', 'Kahn’s algorithm — repeatedly removing a zero in-degree vertex']],
 breaks: 'A morning has no real cycles — “shoes before socks, and socks before shoes” is a joke nobody actually writes down as a rule. Real dependency graphs, a tangle of software packages especially, end up with cycles by accident, which is exactly why a checker is needed at all: nobody sat down meaning to require the impossible, so the tool has to catch a mistake nobody intended rather than referee a paradox someone built on purpose.'
},

bipartite: {
 scene: 'A school orchestra needs one player in every chair, and each child has only learned some of the instruments. You are deciding who plays what.',
 map: [['A child', 'a vertex in one camp'],
   ['An instrument', 'a vertex in the other camp'],
   ['A child having learned an instrument', 'an edge, crossing only between the two camps'],
   ['Giving each instrument to a child who has learned it, nobody doubling up', 'a matching'],
   ['Filling every chair this way', 'a perfect matching'],
   ['Two children who happen to be friends, with no instrument-link drawn between them', 'impossible to draw in this graph — edges only ever cross camps, never sit within one'],
   ['Three children who between them have only learned two instruments, so one must go without', 'Hall’s condition failing, |N(S)| < |S|']],
 breaks: 'The scene builds bipartiteness in by construction — a child only ever connects to an instrument, never to another child — so it can never show the other half of the theorem: that a general graph, tangled with no obvious two camps, is two-colourable exactly when it holds no odd cycle. Whether some unfamiliar graph is secretly bipartite is not something you can see by looking for two rooms of people; you find out by running BFS and watching for a clash.'
},

'binary-search': {
 scene: 'A corridor of a thousand numbered lockers along one wall, one item hidden inside a single locker. You may open any locker you like, and after each one you are told only “further along” or “back the other way” — never which locker it actually is.',
 map: [['The stretch of corridor that could still hold the item', 'the window lo … hi'],
   ['Walking to the locker exactly halfway along that stretch and opening it', 'checking a[mid]'],
   ['Being told “further along”', 'a[mid] < target — discard the near half'],
   ['Being told “back the other way”', 'a[mid] > target — discard the far half'],
   ['The lockers being numbered in the order the hints rely on', 'the sortedness precondition'],
   ['Running out of corridor with every opened locker wrong', 'the empty window — NOT_FOUND, proved rather than guessed'],
   ['Counting how many doors you opened before the corridor ran out', 'the ⌊log₂ n⌋ + 1 comparison bound']],
 breaks: 'The corridor makes it look as though what matters is the lockers being numbered in order. What the argument actually needs is weaker and stranger: only that the hint flips from “further along” to “back the other way” exactly once across the whole stretch. Nothing requires the hidden thing to be a number in a sorted array at all, which is why the same halving works on the smallest buffer size that still fits or the highest load a service survives — neither of which was ever a row of lockers.'
},

sorting: {
 scene: 'A shuffled deck of cards, sorted two different ways. One method splits the deck in half, hands a half to a friend, and each of you sorts your own half before merging them back together, always taking whichever face-up pile shows the lower card. The other flips a single card, sends every lower card to its left and every higher card to its right, and repeats the trick on each side.',
 map: [['Splitting the deck in half and handing one half away', 'the recursive split in merge sort'],
   ['Each of you sorting your own smaller half the same way', 'the recursive call, T(n) = 2T(n/2) + n'],
   ['Repeatedly taking the lower of the two face-up piles until both run out', 'the merge step — n comparisons per level'],
   ['Flipping one card and sending the rest left or right of it', 'partitioning around a pivot in quicksort'],
   ['That flipped card never needing to move again once the split is done', 'the pivot landing directly in its sorted position'],
   ['Doing the flip-and-split trick again on each side separately', 'quicksort recursing on the two partitions'],
   ['Counting how many times the deck can be halved before every pile is one card', 'the log₂ n levels behind both algorithms’ n log n cost']],
 breaks: 'Handing half the deck to a friend makes merge sort look free of quicksort’s problem, but the friend is doing real, counted work — the picture only hides it because two people work at once, not because the algorithm did less. Quicksort’s picture hides a sharper trap: flipping “a” card as pivot looks harmless, but if the deck is already in order, flipping the top card sends every other card into a single pile and the split does nothing. The scene never shows you an unlucky pivot, which is exactly why real implementations pick the pivot at random rather than always flipping the top card.'
},

hashing: {
 scene: 'A valet team at a car park with numbered stalls. Instead of remembering which car went where, the valet computes a stall number straight from the car’s number plate and drives there directly — no touring the rows, no asking around.',
 map: [['The formula turning a plate into a stall number', 'h(key) mod m'],
   ['Driving straight to that stall instead of searching the whole lot', 'O(1) lookup, skipping the search entirely'],
   ['A second car assigned the same stall, parking directly behind the first', 'a collision, resolved by chaining'],
   ['How many cars are parked per stall on average', 'the load factor α = n/m'],
   ['Building a bigger lot and reassigning every car once it passes three-quarters full', 'resizing when α exceeds ~0.75'],
   ['A rival who has watched the valet’s formula and buys a fleet of plates that all compute to stall 12', 'a hash-flooding attack against a fixed hash function']],
 breaks: 'The car park makes a collision look like the valet’s mistake — pick a cleverer formula and it would stop happening. It cannot: once more cars are parked than there are stalls, pigeonhole guarantees some stall holds more than one car regardless of how good the formula is, so chaining is a structural cost, not a bug to engineer away. And the scene hides where the real defence lives — this valet’s formula is fixed and, given enough watching, learnable, which is exactly the vulnerability; a production hash table reseeds its formula at random for every run, so watching one run tells you nothing about the next one’s stall numbers.'
},

'graph-algos': {
 scene: 'A rescue team searching a building for a missing person, starting at the entrance and moving room to room through connected doorways, some locked and slower to force than others.',
 map: [['Rooms and the doorways connecting them', 'vertices and edges of the graph'],
   ['Clearing every room one doorway from the entrance before any room two doorways away', 'BFS with a queue — fewest-doorway path'],
   ['One team charging down a single corridor as deep as it goes, backing out only at a dead end', 'DFS with a stack'],
   ['A locked fire door costing more forcing-time than a door standing open', 'a weighted edge'],
   ['Always sending the next team through whichever reachable, unopened doorway has the lowest total time spent so far', 'Dijkstra with a priority queue'],
   ['Marking a room “cleared” the instant it is reached at its lowest recorded time, and never sending a team back', 'settling a vertex, finalising d[v]'],
   ['A door that refunds time already spent once it is forced', 'the negative edge that breaks the argument']],
 breaks: 'The scene lets several teams work at once, clearing a whole ring of rooms together, which is a fine way to picture the outcome but not how the correctness argument runs — the proof needs rooms settled one at a time, in strictly increasing order of total time, and it leans on the fact that once a room is settled no team still searching can reach it faster. Real doors also cannot refund time, which is exactly why this scene has no honest way to depict a negative edge: Dijkstra’s guarantee and the impossibility of a refunding door are the same fact wearing two different costumes, and Bellman-Ford is what you need on the day a door really can pay you back.'
},

dp: {
 scene: 'A grandmother who holds the whole family tree in her head. Grandchildren keep running up asking things like “how am I related to Great-uncle Tom?”, and the first time she hears a particular question she works it out from scratch by combining her answers to two smaller questions about the generation above — then tapes an index card to the fridge, so the next child who asks gets pointed straight at the card.',
 map: [['A specific question, like exactly how one child relates to Tom', 'a subproblem, keyed by exactly what is being asked'],
   ['Working out this generation’s answer from two answers about the generation above', 'the recurrence, e.g. fib(n) = fib(n−1) + fib(n−2)'],
   ['The same great-great-grandparent link getting asked about from every branch of the family', 'overlapping subproblems, recomputed exponentially often without memory'],
   ['The card taped to the fridge the first time a question is answered', 'the memo table entry'],
   ['A later grandchild asking the same question and just reading the card', 'a memoised call returning in O(1)'],
   ['Filling the fridge youngest generation first, before anyone has even asked', 'bottom-up tabulation instead of top-down recursion plus memo']],
 breaks: 'This is where the picture can actively mislead: a card on the fridge is only trustworthy if the question on it is complete — “how is X related to Tom” has exactly one right answer no matter who asks it or when. Plenty of real dynamic programs get this wrong by taping up a card that secretly depends on more than its label admits, such as recording “shortest time to this junction” when the true cost also depends on which road you arrived by — reading that card back later hands you confident nonsense, because the thing memoised was never enough to determine the answer in the first place.'
},

greedy: {
 scene: 'A front desk with one meeting room and a stack of booking requests, each with a start and an end time. You approve as many non-overlapping bookings as you can by always approving, among the requests still compatible with what’s booked, whichever one ends soonest.',
 map: [['The empty diary before any request is approved', 'the initial interval-scheduling instance'],
   ['Approving whichever pending request finishes soonest', 'the greedy rule — earliest finish time first'],
   ['That approval blocking only the requests it overlaps, leaving every later-starting request exactly as free as before', 'the exchange lemma the whole proof rests on'],
   ['Swapping an imagined perfect day’s first booking for your earliest-finishing one, without losing a single booking', 'the exchange argument that makes the first greedy choice safe'],
   ['Treating what’s left of the day after a booking as a brand-new front desk with the identical rule', 'the inductive step onto a smaller instance'],
   ['A coin machine trained to always hand back the single largest coin it can', 'the same “take the best thing now” idea, applied to coin change'],
   ['That machine giving three coins for 6p from a till stocked only with 1p, 3p and 4p pieces, when two would do', 'greedy failing exactly where no exchange lemma can be built']],
 breaks: 'The front desk works because approving the earliest-finishing request never closes off an option a later-finishing one would have kept open — that is a fact about interval scheduling, proved by the exchange lemma, not a law of greed in general. The coin machine looks like the same idea in different clothes, and that is exactly the trap: “take the biggest thing available right now” is not inherently safe, and whether it is has to be checked problem by problem with its own exchange argument, not assumed because it worked at the front desk.'
},

'right-triangles': {
 scene: 'A ladder propped against a wall at a fixed pitch, checked with a spirit level clipped to a rung. However long the ladder, keeping that same pitch keeps the climb proportional to the ladder\'s own length.',
 map: [['The angle the ladder makes with the ground', 'θ'],
   ['How high up the wall the ladder reaches, as a fraction of the ladder\'s own length', 'sin θ = opposite / hypotenuse'],
   ['How far the ladder\'s foot sits from the wall, as a fraction of its length', 'cos θ = adjacent / hypotenuse'],
   ['Height reached divided by the foot\'s distance from the wall — how steep the ladder looks', 'tan θ = opposite / adjacent'],
   ['Swapping a 3 m ladder for a 6 m one at the same pitch', 'the ratios are unchanged; only the lengths double'],
   ['The ladder itself, foot to top', 'the hypotenuse'],
   ['Wall height and foot distance combine to fix the ladder\'s length', 'a² + b² = c²']],
 breaks: 'Ladders exist only for practical pitches — too shallow and the foot slides, too steep and it tips backwards — so a real ladder never usefully models θ near 0° or 90°. The ratios themselves have no such limit: sin and cos are defined at every angle, including the ones no ladder could ever stand at.'
},

'unit-circle': {
 scene: 'A surveyor\'s trundle wheel, rolled along a path to measure distance by counting how far the rim has turned.',
 map: [['One full turn of the wheel', '2π radians, a full circle'],
   ['The angle of turn that rolls out an arc exactly as long as the wheel\'s own radius', 'the definition of one radian'],
   ['Distance rolled, given the wheel\'s radius and how far it has turned', 'arc length s = rθ, θ in radians'],
   ['Shrinking the wheel down to a radius of exactly one unit', 'the unit circle'],
   ['Where the painted mark on the rim sits, right/left and up/down from the axle, after turning through θ', '(cos θ, sin θ)'],
   ['The mark passing its start position again', 'θ has reached 2π']],
 breaks: 'A trundle wheel only ever turns forward, rolling out positive distance. The unit circle has no such restriction — negative θ spins the point the other way with no contradiction, and angles run past 2π indefinitely, lapping the same circle again. A real wheel\'s radius is measured in centimetres; setting it to exactly 1 is what strips the units off cos θ and sin θ and leaves them as plain numbers.'
},

identities: {
 scene: 'A figure skater spins through angle a, then immediately spins again through angle b, starting the second spin exactly wherever the first one left off.',
 map: [['Facing straight ahead, before any spin', 'angle 0, the reference direction'],
   ['Where the tip of the skater\'s outstretched arm sits, sideways and upward from the centre, after turning through θ', '(cos θ, sin θ)'],
   ['Spinning a, then spinning b', 'composing two rotations — a total turn of a + b'],
   ['Working out the arm\'s new sideways position after both spins, two different ways', 'cos(a + b) = cos a cos b − sin a sin b'],
   ['Working out the arm\'s new upward position the same way', 'sin(a + b) = sin a cos b + cos a sin b'],
   ['Spinning twice by the same angle θ', 'the double-angle case, sin 2θ = 2 sin θ cos θ'],
   ['The arm\'s tip staying exactly one arm\'s-length from the centre, however many spins are stacked', 'sin²θ + cos²θ = 1']],
 breaks: 'A skater\'s spin costs time, momentum and ice, and only makes sense for one rotation happening after another in sequence. The identities hold instantaneously for any a and b at all — negative angles, angles bigger than a full turn, angles never actually spun through in that order — because they are statements about numbers, not about a body that has to physically get from one facing to the next.'
},

waves: {
 scene: 'A Ferris wheel turning at a steady rate. Ignore where the cabin sits on the rim and just plot one cabin\'s height above the ground as time passes.',
 map: [['Height of the wheel\'s axle above the ground', 'the vertical shift D'],
   ['How far the cabin swings above and below that axle height', 'the amplitude A'],
   ['Time for the wheel to complete one full turn', 'the period T = 2π/B'],
   ['Loading the cabin part-way round instead of at the very bottom', 'the phase shift C'],
   ['How many turns the wheel makes per minute', 'the frequency f = 1/T'],
   ['Running the same ride twice as fast', 'compresses the graph horizontally — a larger B'],
   ['The cabin\'s height plotted against time', 'y = A sin(Bx + C) + D']],
 breaks: 'A Ferris wheel traces exactly one frequency. Real signals — a recorded voice, a struck piano string, the compressed air a speaker pushes — are sums of many sine waves layered at once, and no single wheel, however tuned, can trace that combined shape. The ride also switches on and off; the sine function it approximates keeps running in both directions forever, with no opening time and no closing time.'
},

'law-sines': {
 scene: 'Two fire-lookout towers a known distance apart both spot the same wisp of smoke and radio in the compass bearing to it. Fires rarely sit at a convenient right angle from either tower, so plain SOH-CAH-TOA has nothing to grab onto.',
 map: [['The known distance between the two towers', 'one known side, c, opposite the fire\'s angle C'],
   ['Each tower\'s bearing angle to the smoke', 'the two known angles A and B'],
   ['Where the two sighting lines cross', 'the third vertex of the triangle — the fire'],
   ['The rule that a longer side always sits opposite a larger angle, in one fixed proportion', 'law of sines, a/sin A = b/sin B = c/sin C'],
   ['Finding the distance between the towers directly from two known distances to the fire and the angle between the sightlines there, when that angle isn\'t 90°', 'law of cosines, c² = a² + b² − 2ab cos C'],
   ['A fire that happens to sit due north of one tower, making its angle a right angle', 'the −2ab cos C term vanishes and Pythagoras returns exactly'],
   ['The area of the triangle the two towers and the fire enclose, with no height to measure', '½ ab sin C']],
 breaks: 'Two fire towers a few kilometres apart sit on ground flat enough that straight-line trigonometry is exact for every practical purpose. Stretch the same two-point sighting to a continent-spanning scale — the triangles a GPS constellation resolves — and the Earth\'s curve is no longer negligible; the law of sines as stated here needs a spherical correction before it can be trusted.'
},

'inverse-trig': {
 scene: 'A cryptic treasure clue gives only a ratio: \'your distance north of the oak, divided by your distance east of it, is 3 to 4.\' Both the spot northeast of the tree and its mirror image southwest of the tree satisfy that same ratio exactly.',
 map: [['The single number the clue gives — north-distance over east-distance', 'tan θ = opposite / adjacent, one ratio, two signs lost'],
   ['Knowing you ended up 3 north and 4 east specifically, not just their ratio', 'knowing the actual signed y and x, not only y/x'],
   ['The two rotationally opposite spots — northeast and southwest — sharing one ratio', 'tan θ = tan(θ + π); tangent repeats every half turn'],
   ['Solving \'which angle has this ratio\' but only ever picking the northeast-style answer', 'arctan(x), range −π/2 to π/2 — two quadrants only'],
   ['Being told the north distance and the east distance separately, sign and all', 'atan2(y, x), range −π to π — all four quadrants recovered'],
   ['Standing due north or due south of the oak, where the east distance is zero and there is no ratio to take', 'atan2 still returns an angle, because it never divides — it reads the two signs directly']],
 breaks: 'A treasure hunter facing an ambiguous ratio can simply walk out and check all four candidate spots. atan2 in code has no spots to walk to — it must return one deterministic angle from y and x alone every single time, including the one point, y = 0 and x = 0 together, where no direction is actually defined at all; the function still has to hand back some value there (conventionally 0), a convention standing in for a question the mathematics does not answer.'
},

integrals: {
 scene: 'Downloading a large file over a connection whose speed keeps changing — sometimes crawling, sometimes maxed out — while a network monitor shows the live transfer rate, not the running total downloaded.',
 map: [['The live transfer-rate reading on the monitor at each instant', 'f(x), the integrand'],
   ['One instant of transfer speed times an instant of time', 'f(x) dx, one infinitely thin slice'],
   ['Adding up every one of those slices from the moment the download starts to the moment it finishes', '∫ₐᵇ f(x) dx, the integral'],
   ['How many bytes have actually landed on disk at a given moment', 'the accumulation function A(x)'],
   ['The monitor\'s reading right now, which is exactly how fast the byte count is climbing right now', 'A′(x) = f(x) — the fundamental theorem'],
   ['Reading the final file size and subtracting the size already on disk when you started watching', 'F(b) − F(a)'],
   ['A monitor that only refreshes once a second, giving a stepped average rather than the true total', 'a Riemann sum, before the slices shrink to nothing']],
 breaks: 'A real monitor cannot see a true instant either — it always reports an average over its refresh interval, which is precisely the coarse, stepped estimate the calculus is designed to outgrow, not the exact answer. And a download counter cannot run backwards: the byte count it shows is never negative. A function being integrated can dip below zero, and that region counts as negative area, subtracting from the total the way no ordinary download ever could — the closest real device that manages it is a torrent client\'s net-throughput graph, which happily goes negative the moment your own upload to other peers outpaces what is coming in, a picture a plain progress bar has no way to draw.'
},

techniques: {
 scene: 'Assembling flat-pack furniture from an instruction manual that only shows moves you already recognise — screw type 3 into panel A, clip B onto C — until you hit a joint that looks unfamiliar.',
 map: [['The list of standard moves already in the manual', 'the table of known antiderivatives'],
   ['Realising an odd-looking bracket is really the familiar bracket wearing a different printed cover', 'substitution: an inner expression g(x) hiding inside, renamed u to match a known shape'],
   ['Checking the leftover parts on the sheet actually match what the move needs', 'du = g′(x) dx must genuinely be present as a factor, or the substitution does not apply'],
   ['Two panels joined by a single fitting that will not come apart in one motion', 'a product of two unrelated factors, ∫u dv'],
   ['Screwing one panel firmly into place and being left holding a smaller sub-assembly to finish', 'uv − ∫v du — most of the job done at once, a smaller integral left over'],
   ['Deciding which of the two panels to fix down first, following the manual\'s usual order', 'the LIATE ordering for choosing u'],
   ['Giving the finished piece a shake to check nothing was left loose', 'differentiating the antiderivative back to confirm it equals the original']],
 breaks: 'Flat-pack furniture always finishes — the manual guarantees a finite sequence of moves ends in a standing wardrobe. Plenty of integrals have no such manual: ∫e^(−x²) dx cannot be assembled from any finite chain of substitutions and by-parts, however cleverly you try, because no elementary antiderivative exists for it at all. The technique failing is not a sign you have not looked hard enough; sometimes the piece genuinely is not in the catalogue.'
},

series: {
 scene: 'Walking toward a wall where each step you take covers exactly half of whatever distance is left.',
 map: [['Each step covering half of what remains', 'a geometric term, r = 1/2, times the previous one'],
   ['Total ground covered after n steps', 'the partial sum Sₙ'],
   ['The wall itself, never quite reached, never overshot', 'the limit a/(1 − r)'],
   ['Taking smaller and smaller steps forever without ever stopping', 'infinitely many terms'],
   ['A second walker whose stride shrinks only a little — stepping 1/n of the original distance on step n — who still marches straight through the wall', 'the harmonic series Σ1/n, which diverges despite its terms shrinking to zero'],
   ['Watching whether your distance to the wall keeps closing in, however far you have already walked', 'convergence, decided by how the terms behave in the long run']],
 breaks: 'Nobody actually takes infinitely many steps — real walkers get close enough and simply step the rest of the way. A series is not allowed that shortcut: the sum is genuinely built from every one of the infinitely many terms, with nothing rounded off early. And the second walker is the sting in the tail — his steps shrink too, just as surely as yours, and shrinking steps still feel like they should stop somewhere. They do not. Terms going to zero is necessary for a sum to converge, and nothing like sufficient.'
},

taylor: {
 scene: 'Glancing once at a car\'s dashboard — the position on the map, the speedometer reading, and whether the needle itself is climbing or falling — and trying to predict from that single glance where the car will be a few seconds later.',
 map: [['The car\'s position at the instant you glanced', 'f(a), the constant term, matching the function\'s value at the centre'],
   ['The speedometer reading at that instant', 'f′(a), contributing the linear term'],
   ['How fast the speedometer needle is itself moving', 'f″(a)/2, the curvature term'],
   ['Adding a sense of how the acceleration is changing for an even sharper guess', 'f‴(a)/6, the next term — the /n! clearing away what repeated differentiation piles up'],
   ['Using only that one glance to guess the car\'s position a moment later', 'evaluating the Taylor polynomial at a nearby x'],
   ['Trusting the guess for the next second far more than for ten minutes later', 'Taylor approximations being accurate near the centre and unreliable far from it'],
   ['Taking in more of the dashboard for a sharper short-term guess', 'adding more terms to tighten the approximation near a']],
 breaks: 'A real drive can involve a sudden stop, a sharp turn, a diversion down a street the dashboard gave no hint of — no number of derivatives read off one instant can see a fork in the road. That is not a flaw in the driver\'s attention; some functions genuinely do this. Their Taylor series, built faithfully from every derivative at one point, converges to a completely different answer away from that point, or fails to describe the actual road at all beyond it. Matching every derivative at the glance is not the same as matching the journey.'
},

applications: {
 scene: 'Throwing a vase on a potter\'s wheel: you hold a shaping tool against the spinning clay, and the tool\'s distance from the centre, traced along the height of the piece, decides the whole shape.',
 map: [['The tool\'s distance from the centre at each height x', 'f(x), the radius function'],
   ['One full spin of the wheel at a fixed height, sweeping out a thin flat disc of clay', 'a disc of area πf(x)²'],
   ['Moving the tool up a hair and sweeping another disc, over and over up the piece', 'summing πf(x)² dx into V = π∫f(x)² dx, the volume of revolution'],
   ['Two potters comparing how much clay sits between their two vase outlines, before either spins the wheel', 'the area between two curves, ∫(top − bottom) dx'],
   ['A wobble making the tool drift closer to the centre here, further out there, and asking what single steady reading a laser gauge would settle on if you averaged its distance-from-centre readings all the way up the piece', 'the average value, (1/(b−a))∫f dx'],
   ['The running tally of clay used so far as the wheel head climbs', 'the accumulation function, whose rate of growth at each height is exactly πf(x)²']],
 breaks: 'Real clay resists being swept into infinitely thin discs — a potter\'s tool has real width and the wheel a real speed, so smooth motion only approximates the sum calculus performs exactly in the limit. More seriously, the disc method only describes shapes genuinely spun from a single central axis. A car body or a phone case is not a solid of revolution at all, however you tilt it, and no radius function f(x) exists to feed the formula — a different slicing is needed, not this one pushed harder.'
},

improper: {
 scene: 'An endlessly long fence running off toward the horizon, built a little shorter the further out it goes. You want to know whether painting the whole thing, however far it runs, could ever use a finite amount of paint.',
 map: [['How tall the fence stands at distance x from the start', 'f(x), the integrand'],
   ['The paint used out to some far post at distance b', '∫₁ᵇ f(x) dx, an ordinary integral'],
   ['Walking the marker post b further and further out and watching the running total', 'the limit as b → ∞'],
   ['A fence shrinking like 1/x — thin, but still needing a full drop of paint per metre a mile out, forever', 'the diverging tail ∫1/x dx'],
   ['A fence shrinking like 1/x² — thin enough a mile out that the paint left to use is a teaspoon', 'the converging tail ∫1/x² dx = 1'],
   ['Bounding your fence\'s height against one you already know the total for', 'the tail comparison test'],
   ['The one shrink rate, 1/x, where the running paint total has no ceiling but never actually leaps anywhere', 'the boundary case p = 1, where ∫1/x dx = ln b grows without bound']],
 breaks: 'No fence actually runs forever — there is no job here anyone could finish painting, only a story about what a limit settles on. And the picture quietly assumes decay is the only thing that matters, but a real fence would also run out of daylight, paint, or patience for reasons that have nothing to do with convergence. Mathematically the only question is how fast the height falls, never anything about the difficulty of the job.'
},

logic: {
 scene: 'A parent\'s standing rule to a child: “If you finish your homework, you can watch TV.” Every evening plays out as one of four combinations of homework done or not, TV allowed or not.',
 map: [['The rule itself', 'the implication p → q'],
   ['Homework done, TV refused', 'p true, q false — the only combination that breaks the rule'],
   ['Homework skipped, TV allowed anyway out of leniency', 'p false, q true — no rule was broken, since the rule never spoke to this case'],
   ['“It is not true that you finished your homework and got to watch TV” — meaning at least one of the two didn\'t happen', 'De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q'],
   ['Restating the rule as “no TV means homework wasn\'t done”', 'the contrapositive ¬q → ¬p — the same rule, said backwards'],
   ['Restating it as “TV means homework was done”', 'the converse q → p — a different, stronger rule the parent never actually made']],
 breaks: 'A real parent can bend a rule, get annoyed, or mean something by tone the words don\'t capture — p is either wholly true or wholly false, with nothing held back for context. And the case that trips people up most is baked into the picture: a parent who lets an idle child watch TV anyway looks, to the child, like the rule was broken. Mathematically it stands unbroken — it never promised anything about what happens when homework isn\'t done — and that gap between how it feels and what was actually promised is exactly why vacuous truth catches people out.'
},

sets: {
 scene: 'Two friends throwing a joint party each bring their own contacts list, and they need to work out exactly who to invite.',
 map: [['Everyone on Alex\'s list or Sam\'s list, or both', 'the union A ∪ B'],
   ['People who appear on both lists', 'the intersection A ∩ B'],
   ['Counting invitees without counting shared friends twice', 'inclusion–exclusion: |A ∪ B| = |A| + |B| − |A ∩ B|'],
   ['Every possible guest list you could actually send out, from inviting nobody to inviting the entire combined list', 'the power set P(A ∪ B), with |P(A ∪ B)| = 2ⁿ where n = |A ∪ B|'],
   ['Pairing every guest with every starter on the menu', 'the Cartesian product G × M (guest list × menu), with |G × M| = |G|·|M|']],
 breaks: 'A guest list only ever counts a person once, which is the whole idea of a set — but a real invitation carries an order (who gets asked first, who\'s the plus-one), and {Alex, Sam} is not the same social act as {Sam, Alex} even though they are the same set. Nobody ever actually draws up all 2ⁿ possible guest lists for a real party, either — that number passes a million past twenty friends, which is the same wall brute-force subset search hits.'
},

proofs: {
 scene: 'A biscuit tin that reliably held twelve biscuits whenever you left the house, and this evening it doesn\'t.',
 map: [['“Someone entered the kitchen” and “the tin count dropped”', 'the claim p → q under investigation'],
   ['Watching a hand go into the tin and a biscuit come out', 'a direct proof — walking straight from p to q'],
   ['Assuming nobody came into the kitchen at all, yet finding the tin two biscuits short regardless', 'proof by contradiction: assume ¬p and derive an impossibility from the missing biscuits, so p must hold'],
   ['Checking instead “if the tin is still full, was the kitchen door ever opened?”', 'proof by contrapositive: proving ¬q → ¬p instead of p → q'],
   ['One crumb found on a napkin is enough to sink “nobody in this house eats biscuits”', 'a single counterexample refuting a for-all claim']],
 breaks: 'A kitchen investigation ends the moment you\'re satisfied, and “probably took one” is a perfectly normal verdict to settle on. A mathematical proof has no equivalent of “probably” — every step has to follow with certainty, and contradiction in particular needs exactly one assumption made false, with no “maybe everyone was a little bit guilty” available once the logic is airtight. Real detective work lives entirely in that grey area; proof by contradiction cannot.'
},

induction: {
 scene: 'A snow-day phone tree: the school makes the very first call, and everyone on the list has promised that the instant their phone rings, they immediately call the next name down.',
 map: [['The school makes the very first call', 'the base case P(1)'],
   ['Person k\'s standing promise: the instant I\'m called, I call person k+1', 'the inductive step P(k) ⇒ P(k+1)'],
   ['Every single name on the list eventually getting the call', 'P(n) holding for all n'],
   ['If the tree failed, there\'d have to be an earliest person never reached — but their caller kept their promise, so that can\'t be', 'why induction rules out an earliest failure'],
   ['Before ringing the next name, a caller first double-checking that every name up to and including their own has genuinely been reached, not just the one who rang them', 'strong induction — leaning on every earlier case at once, not only the last one'],
   ['Every caller\'s promise being the identical instruction handed on to the next name down — ring, then repeat this very same promise one person further along', 'recursion: the same self-referential structure, implemented as a function that calls itself']],
 breaks: 'A real phone tree can break silently — a phone on silent, a wrong number — and nobody notices until the next snow day arrives unannounced. A genuine inductive step is not allowed even one silent failure: P(k) ⇒ P(k+1) has to hold for every k with no exceptions, or the whole argument collapses from that point on. And the picture hides why the base case matters at all — an unbroken chain of “I\'ll call the next person” promises rings nobody if the very first call is never placed.'
},

quantifiers: {
 scene: 'A hotel where every room has its own key, and the manager also keeps a single master key that opens every door in the building — two claims that sound alike but say very different things.',
 map: [['For every room, there is some key that opens it', '∀room ∃key: opens(key, room)'],
   ['There is some one key that opens every room, the master key', '∃key ∀room: opens(key, room) — a far stronger claim'],
   ['Swapping the order turns “each room has its own key” into “one key for every room”', 'why ∀x∃y and ∃y∀x are not the same statement'],
   ['“Not every room has a working key” becomes true the moment one room\'s lock jams', '¬∀x P(x) ≡ ∃x ¬P(x)'],
   ['“No room is unlockable” is only true if every single room\'s key works', '¬∃x P(x) ≡ ∀x ¬P(x)'],
   ['Settling the claim by trying every room\'s key in turn', 'evaluating a quantified statement over a finite domain']],
 breaks: 'A hotel has finitely many rooms, so in principle you could check every lock and settle the claim for certain by lunchtime. Most quantified statements this course actually cares about — “every even number greater than two is a sum of two primes” — range over infinitely many rooms, and trying them one at a time never finishes. The hotel teaches the grammar perfectly; it is the wrong model for why quantifiers are needed in the first place.'
},

boolean: {
 scene: 'Wiring a porch light with a switch by the front door and a second by the back door, so the light comes on if either person flips their switch — then adding a master switch that has to be on before either one works at all.',
 map: [['Two switches wired in parallel — either one lights the bulb', 'OR: x + y'],
   ['Two switches wired in series — both must be on', 'AND: x · y'],
   ['A relay switch that\'s on exactly when its partner is off', 'NOT: x̄'],
   ['A switch jammed permanently on, so the bulb lights whatever the other switch does', 'domination: x + 1 = 1'],
   ['A switch you could physically remove because the one beside it in series already makes it pointless', 'absorption: x + xy = x'],
   ['Rewiring “on if (front or back) and master” as “on if (front and master) or (back and master)” without changing when the bulb lights', 'distribution: x(y + z) = xy + xz'],
   ['Rebuilding “off exactly when both switches are on” using only relay components that fire on OFF, wired in parallel', 'De Morgan: (xy)‾ = x̄ + ȳ — a NAND built from an OR of the inverted switches']],
 breaks: 'Real switches wear out, bounce, and take a fraction of a second before the bulb responds; a Boolean value is exactly x, instantly and forever, with none of that mess. A porch light circuit also rarely nests more than two or three switches deep, while an actual chip nests millions of gates — which is exactly why a saving like absorption matters industrially, and not just for one bulb over one door.'
},

relations: {
 scene: 'A university course catalogue where some courses list another as a required prerequisite — you can\'t take Databases before Intro to Programming.',
 map: [['Course A listed as a prerequisite of course B', 'an ordered pair (A, B) in the relation R'],
   ['No course is ever its own prerequisite', 'irreflexive here — (a, a) ∉ R'],
   ['If A is a prerequisite of B, B is never listed as a prerequisite of A', 'antisymmetric'],
   ['A must come before B, and B before C, so A must come before C', 'transitive'],
   ['“Worth the same credit value as”, which points both ways between two courses', 'symmetric — paired with reflexive and transitive, this makes an equivalence relation'],
   ['Grouping every course into interchangeable credit-value clusters', 'the equivalence classes that partition the catalogue'],
   ['Laying every course out in one valid teaching order, prerequisites always first', 'a partial order enabling a topological sort']],
 breaks: 'A course catalogue is small enough for a human advisor to eyeball the whole prerequisite chart. A relation on even a modest set of n courses can already hold up to n² possible pairs, and checking transitivity by hand means testing every A, B, C triple — on the order of n³ of them — which stops being remotely practical long before a real degree plan does. That gap is exactly why software takes over: it computes the transitive closure instead of eyeballing it.'
},

recurrence: {
 scene: 'A staircase you can climb one stair or two stairs at a time, and you want to know how many distinct ways there are to reach the top.',
 map: [['The number of ways to reach stair n', 'the term aₙ'],
   ['Reaching stair n via a final single stride from n−1, or a final double stride from n−2', 'aₙ = aₙ₋₁ + aₙ₋₂'],
   ['Standing at the bottom, or having just reached stair one', 'the base cases a₀ = 1, a₁ = 1'],
   ['Guessing the count grows by a constant multiple each stair and solving for which multiple actually works', 'the characteristic equation r² = r + 1'],
   ['A staircase with one enchanted step that must be crossed twice — doubling a shorter climb\'s count and adding one for the extra crossing', 'the shape of Hₙ = 2Hₙ₋₁ + 1'],
   ['Splitting the whole flight into two smaller flights, solving each, then combining the results', 'the divide-and-conquer form T(n) = aT(n/b) + f(n)']],
 breaks: 'The staircase is a picture for “how many ways”, and it happens that counting ways is additive — which is exactly why it matches Fibonacci so cleanly. But not every recurrence in this lesson is counting arrangements: the Hanoi recurrence counts moves, and a divide-and-conquer recurrence counts running time, neither of which means “ways to combine strides”. The staircase explains why you add two earlier terms; it has nothing to say about what those terms mean once the recurrence is about something other than counting.'
},

'advanced-counting': {
 scene: 'An office wall of labelled pigeon-hole mail slots, fewer slots than staff, with the day\'s post dropped in by department rather than by person.',
 map: [['More letters arrive than there are slots', 'n items placed into k boxes, n > k'],
   ['Some slot is guaranteed to end up with at least two letters', 'pigeonhole: some box holds ≥ 2'],
   ['A hundred letters into twelve slots forces some slot to hold at least nine', 'generalised pigeonhole: some box holds ≥ ⌈n/k⌉'],
   ['Counting staff who get a parcel or a letter, without double-counting those who get both', 'two-set inclusion–exclusion: |A ∪ B| = |A| + |B| − |A ∩ B|'],
   ['Counting staff who get a parcel, letter or magazine — correcting for every pair, then correcting back for the triple', 'three-set inclusion–exclusion, alternating signs'],
   ['Handing twenty identical stress balls out to eight departments, some getting none', 'stars and bars: C(n + k − 1, k − 1)']],
 breaks: 'Real mail only proves a slot is crowded once someone has actually sorted it — you could picture a diligent clerk redistributing letters evenly if there\'s room, and there almost always is. The mathematics makes a stronger claim than any clerk could: pigeonhole holds for every possible placement, including the most careful one anyone could devise, which is exactly why it proves hash collisions are unavoidable rather than merely likely.'
},

automata: {
 scene: 'A subway turnstile that only ever remembers one of two conditions, Locked or Unlocked — a coin makes it Unlocked, and a push through makes it Locked again.',
 map: [['The turnstile\'s current condition, Locked or Unlocked', 'a state'],
   ['A coin dropped in, or a person pushing through', 'an input symbol'],
   ['A coin flips Locked to Unlocked; a push flips Unlocked to Locked', 'a transition'],
   ['Unlocked being the one condition that lets someone through', 'the accept state'],
   ['The whole mechanism — every condition, and what every input does to it', 'the finite state machine itself'],
   ['Asking the turnstile to let through exactly as many people as coins fed in, all day, no more and no less', 'a requirement no turnstile with finitely many conditions can enforce'],
   ['Bolting on a mechanical counter dial that tracks a running tally of net entries', 'an unbounded counter — the minimal step up from finite state, short of the full stack that genuine nesting would need']],
 breaks: 'A real turnstile is built to forget on purpose — that\'s what makes it cheap and reliable. The breaking point is the whole lesson in miniature: no finite number of extra conditions welded onto it (Locked, Unlocked, Locked-with-one-credit-owed, …) can count an unbounded number of coins, because “unbounded” always outgrows any fixed number of states you\'re willing to add — the same pigeonhole argument as the previous lesson, aimed at machine memory instead of mail slots.'
},

counting: {
 scene: 'Getting dressed each morning from a wardrobe: a shirt off the rail, trousers from the drawer, shoes from the rack, each chosen freely of the others — except on gym days, when you reach for an entirely separate kit rather than mixing the two together.',
 map: [['The number of shirts on the rail', 'n₁, the size of one choice'],
   ['Picking a shirt, then independently a pair of trousers, then independently shoes', 'a sequence of independent choices'],
   ['Every shirt paired with every trouser paired with every shoe', 'the product rule, n₁ × n₂ × n₃'],
   ['Wearing either the office outfit or the separate gym kit, never assembled from both at once', 'the sum rule — disjoint alternatives add, n_office + n_gym'],
   ['A five-day rota where the same shirt is allowed to come back round on a later day', 'counting with repetition, nʳ for r slots each drawn from the same n options'],
   ['A belt picked from the rack, independently of the shirt, trousers and shoes already chosen', 'the product rule extending to a fourth factor, n₁ × n₂ × n₃ × n₄']],
 breaks: 'The product rule assumes every shirt genuinely goes with every pair of trousers, but real wardrobes have clashes — picking the checked shirt quietly rules out the checked trousers. The moment choices constrain each other like that, n₁ × n₂ overcounts, and the outfits you would actually wear are fewer than the raw product. The rule is only exact when the choices are truly independent, and that is a claim about the wardrobe the arithmetic cannot verify for you.'
},

permutations: {
 scene: 'A raffle drum holding n numbered tickets. Three are drawn without replacement: the prize version hands out a car, a bike and a voucher strictly in the order drawn; the stage version just calls three names up together, with no ranking at all.',
 map: [['Drawing three tickets from the drum one at a time, none returned', 'r selections from n without replacement'],
   ['Assigning car, bike, voucher strictly by the order drawn', 'order mattering, P(n,r) = n!/(n−r)!'],
   ['The n−r tickets left in the drum, whose own order nobody ever records', 'the (n−r)! divided out of n! to build P(n,r)'],
   ['The same three ticket-holders called on stage together, with no prize order attached', 'order discarded — a combination'],
   ['Every ordered triple of the same three names collapsing onto one unordered trio once order is forgotten', 'dividing by r!, giving C(n,r) = n!/(r!(n−r)!)'],
   ['Naming who gets called up is the same act as naming who stays in their seat', 'C(n,r) = C(n, n−r)']],
 breaks: 'A raffle drum never gives the same ticket twice — every draw without replacement uses a ticket up for good, which is exactly why this scene has nothing to say about a 4-digit PIN or a password, where the same digit or letter can reappear in different positions. That is counted with repetition, nʳ, not with the falling factorial these formulas use; the two counting problems look alike and answer completely different questions.'
},

probability: {
 scene: 'A fairground wheel of fortune, its rim divided into coloured sectors, spun so the pointer settles on one at random.',
 map: [['The sectors painted red, out of the whole rim', 'P(A) = favourable / total'],
   ['Every sector that is not red', 'the complement, P(¬A) = 1 − P(A)'],
   ['Spinning the wheel a second time, with no memory of where the first spin landed', 'independent events, P(A ∧ B) = P(A)P(B)'],
   ['Being told only that the pointer stopped somewhere on the near half of the wheel, then asking about red within just that arc', 'conditional probability, P(A|B) = P(A ∧ B)/P(B)'],
   ['The sectors covering the whole rim with no gaps and no overlaps', 'the probabilities of all outcomes summing to 1']],
 breaks: 'The wheel\'s sectors only give honest probabilities if the wheel is perfectly balanced — every sector physically equal in the pointer\'s chance of stopping there. A wheel with a hidden weight favours one side no matter how the sectors are painted, and nothing about looking at the arcs tells you it is rigged. \'Favourable over total\' silently assumes the outcomes are equally likely to begin with; the wheel can show you the counting, never guarantee the assumption underneath it.'
},

'expected-value': {
 scene: 'Waiting for a bus timetabled every ten minutes that sometimes glides in on time and sometimes runs late, then a connecting train whose own wait tends to be worse whenever the bus was. Months of the same commute build up a record of how long, in total, the mornings actually take.',
 map: [['How long any one particular morning\'s wait turns out to be', 'one outcome, a value xᵢ the random variable can take'],
   ['How often a wait of that length shows up across months of mornings', 'its probability, P(xᵢ)'],
   ['The average wait once the whole logbook is totalled and divided by the number of mornings', 'E[X] = Σ xᵢP(xᵢ)'],
   ['Adding the bus wait to the connecting train\'s wait, for the same morning', 'X + Y, the total commute delay'],
   ['The average total delay still equal to the average bus wait plus the average train wait, even though a late bus tends to mean a rushed, unpredictable dash for the train', 'E[X+Y] = E[X] + E[Y], true even when the two are tangled together'],
   ['If every wait from 0 to 10 minutes were equally likely', 'the uniform case — the average sitting at the midpoint, the same reasoning as (n+1)/2 for a die']],
 breaks: 'It is tempting to think a late bus dragging the train down with it must break the addition rule — surely tangled delays cannot just add up cleanly. But E[X+Y] = E[X]+E[Y] holds regardless of the tangle; what the correlation actually widens is the spread of the total delay, not its average. The scene\'s most persuasive-looking objection is exactly the claim the algebra rules out — dependence changes how the numbers scatter, never what they average to.'
},

conditional: {
 scene: 'A building site\'s sieve stack: a coarse screen first, which only lets stones above a certain size fall through, and a second screen beneath it that sorts by colour. Colour is only ever checked among stones that already made it through the first screen.',
 map: [['All the gravel tipped onto the stack before any sieving', 'the whole sample space'],
   ['Only the stones that fall through the coarse screen', 'the event B — everything else discarded'],
   ['Among the stones already on B\'s tray, the fraction that are also the right colour', 'P(A|B), renormalised to B\'s world'],
   ['That colour fraction staying exactly the same whether or not a stone made the size cut', 'independence, P(A|B) = P(A)'],
   ['Multiplying the fraction that clears the coarse screen by the fraction of those also the right colour', 'the chain rule, P(A ∩ B) = P(A|B)P(B)'],
   ['The two screens bolted to the same rickety scaffold, so a storm loosening one tends to loosen the other', 'correlated failure — the independence the maths assumed quietly stops holding']],
 breaks: 'Sieve screens are honest witnesses: gravel is exactly as large or as coloured as it looks, and one screen finishing its work never changes what the stone underneath is made of. Most conditioning in practice is not so clean — a support ticket\'s priority is entangled with a dozen things at once, with no single screen you can hold still while you check the rest one at a time. The scene sieves in a fixed order; a real joint distribution of many entangled variables has no queue to stand in.'
},

distributions: {
 scene: 'A street of n identical streetlights, each one independently burnt out on any given night with the same fixed chance p, walked end to end while counting how many are dark.',
 map: [['Walking the whole street and counting the dark lights', 'the count k, out of n trials'],
   ['One particular list of exactly which lights are out — say the 3rd, 7th and 12th', 'one string of n independent outcomes, probability pᵏ(1−p)ⁿ⁻ᵏ'],
   ['All the different lists that also have exactly three lights out', 'C(n,k), how many strings share that count'],
   ['Multiplying how many such lists exist by how likely any one of them is', 'the PMF, P(k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ'],
   ['The number of dark lights you would bet on seeing on an ordinary night', 'the mean, np'],
   ['Some nights closer to that number, some nights further off, and how far the count typically strays', 'the variance, np(1−p)'],
   ['A very long street of bulbs that almost never fail individually', 'the Poisson approximation, reached for when np stays modest even as n grows large']],
 breaks: 'Streetlights only fail independently if nothing links them, but real ones share a grid, an installation date and a supplier\'s bad batch — one cold snap or one faulty delivery can take out a cluster at once. The moment failures bunch up like that, the binomial\'s whole premise of clean independent coin flips is gone, and the real spread of dark nights on the street runs wider than np(1−p) predicts. It is the same correlated-failure trap as conditional probability, resurfacing here as a broken modelling assumption rather than a wrong calculation.'
},

modular: {
 scene: 'An old case clock in a hallway has only an hour hand and no date window. After a long shift you glance at it and see what hour it reads, with no way of telling how many full days you were away.',
 map: [['The hour the hand is resting on', 'the remainder, a mod n'],
   ['Winding the hand forward by counting hours', 'addition mod n'],
   ['The hand completing a full lap and landing back where it started', 'n ≡ 0 (mod n) — a whole circuit vanishes'],
   ['Two people back from shifts of very different lengths, hand resting on the same hour', 'a ≡ b (mod n)'],
   ['Reading the hand after each hour instead of totting up the whole shift first', '(a + b) mod n = ((a mod n) + (b mod n)) mod n — reducing early'],
   ['Running the hand forward by the same shift length, several days running', 'multiplication mod n, reduced after every day rather than only at the end']],
 breaks: 'The clock only ever winds forward — there is no lever for winding it back — while congruence works just as well with negative numbers, so −1 ≡ n − 1 (mod n) needs no special machinery at all. And the one thing the hand can never show you is how to undo a wind: given where it landed, no dial tells you which single wind, run at a different rate, would return it to noon. That missing operation is division — the mod-inverse lesson has to build it separately, because nothing about a clock face hands it to you for free.'
},

gcd: {
 scene: 'Two coils of garden hose sit in the shed, different lengths, and you want the longest measuring stick that divides both exactly. You lay the shorter hose against the longer one, mark off as many whole copies as fit, and set aside only what\'s left over.',
 map: [['The longer hose', 'a'],
   ['The shorter hose', 'b'],
   ['Laying the short hose against the long one as many times as it fits', 'the division a = qb + r'],
   ['What\'s left over, always shorter than the piece you were laying down', 'the remainder, r = a mod b'],
   ['Repeating the whole process on (short hose, leftover) instead of (long hose, short hose)', 'gcd(a, b) = gcd(b, a mod b)'],
   ['Reaching a leftover that measures the previous piece with nothing left over', 'a remainder of 0 — the process halts'],
   ['The last leftover length that measured cleanly', 'the gcd itself']],
 breaks: 'Try the same process on the diagonal and the side of a square instead of two hose lengths, and it never bottoms out — however many times you lay one against the other, there\'s always something left over, because the diagonal is an irrational multiple of the side. Integer hoses always finish, because each leftover is a whole number strictly smaller than the last, and a strictly decreasing sequence of whole numbers cannot run forever; real lengths carry no such guarantee. This is essentially how incommensurable lengths were first discovered — a gcd the process is fishing for that provably does not exist.'
},

primes: {
 scene: 'A chemist takes a pure compound and runs reaction after reaction, each one splitting whatever\'s in the flask into two simpler substances, stopping only when something won\'t split any further. A second chemist starts from the same compound but picks a completely different sequence of reactions.',
 map: [['The compound in the flask at the start', 'n, the number being factorised'],
   ['A substance no reaction can split any further', 'a prime factor'],
   ['Running one reaction to split a substance into two simpler ones', 'writing n = uv'],
   ['Two chemists choosing different reaction sequences on the same starting compound', 'two candidate factorisations of the same n'],
   ['Both ending up with the same substances on the shelf in the same amounts, whichever route they took', 'the fundamental theorem of arithmetic — factorisation is unique'],
   ['Checking whether a fragment can split further by testing only the lighter possible reagents', 'trial division only needs divisors up to √n']],
 breaks: 'Real chemistry hands you a catalogue of known reactions to try on a given compound. Arithmetic gives no such shortcut: finding even one reaction that splits a several-hundred-digit number — any nontrivial factor at all — is not a matter of looking it up, it is the unsolved problem RSA\'s security is staked on. The analogy quietly assumes the hard step is already done, and only shows you the easy part: deciding, once you have a split, whether it\'s the last one.'
},

rsa: {
 scene: 'A print-shop assistant needs exactly b copies of a single page. Instead of pressing \'copy\' b times, she copies the page once, then each round dials the machine\'s copy-count to match however many pages are already in her stack and runs the whole stack through at that setting — so the stack squares in size every round, not merely doubles — and whenever the count of copies still wanted is odd, she peels one extra copy off by hand before continuing.',
 map: [['One original page', 'a, the base'],
   ['The size of the stack at any moment', 'the running power a^k'],
   ['Dialling the copy-count to match the stack\'s own size and running the whole stack through', 'squaring — a^k becomes a^(2k)'],
   ['The number of copies still wanted, checked bit by bit', 'the exponent b in binary'],
   ['Peeling one extra copy off by hand when the remaining count is odd', 'the extra multiply-by-a step for a 1-bit'],
   ['Rounds through the machine, not individual button presses', 'about log₂ b operations instead of b'],
   ['Only ever keeping the last few digits of the running total in her head', 'reducing mod n after every squaring, so numbers never grow unmanageable']],
 breaks: 'The hand-peel is a visibly different, slower action than a squaring round through the machine — and that difference is exactly the danger. If a real implementation took measurably longer on the rounds where the extra multiply happens, anyone timing the machine could read off which bits of a secret exponent were 1 without ever seeing the number itself. Production RSA code goes out of its way to make every round take identical time regardless of the bit, a discipline this convenient print-shop picture has no reason to bother with.'
},

'mod-inverse': {
 scene: 'A piano tuner starts on middle C and repeatedly jumps up by a fixed number of semitones, wrapping around after the twelfth note back to C. Jump by 7 semitones each time and the tour visits all twelve notes before landing back on C — the circle of fifths. Jump by 4 semitones instead, and the tour only ever finds three notes before it repeats.',
 map: [['The twelve notes on the keyboard, wrapping at the octave', 'the residues 0 to 11 mod 12'],
   ['Jumping by 7 semitones, over and over', 'repeatedly adding a value a with gcd(a, 12) = 1'],
   ['The tour reaching every one of the twelve notes before returning to C', 'a generates the whole system — some number of jumps lands on any target, including 1'],
   ['The exact number of 7-semitone jumps that first lands one semitone past C', 'the inverse of 7 mod 12'],
   ['Jumping by 4 semitones and only ever reaching {0, 4, 8}', 'gcd(4, 12) = 4 ≠ 1, so 1 is unreachable — no inverse exists'],
   ['Jumping by 5 semitones instead, another value coprime to 12', 'a different generator, its own separate inverse']],
 breaks: 'A tuner can find the right jump count by ear, or just by trying all twelve possibilities since there are so few. At cryptographic scale, with a modulus hundreds of digits long, \'try every jump count\' stops being an option — there are more candidates than anyone could ever check. Extended Euclid finds the exact jump count directly, in about log n steps, without ever taking the tour; the keyboard shows you that an inverse exists, but showing existence and handing you the number are two different jobs, and only one of them is expensive.'
},

'fermat-euler': {
 scene: 'A gym locker room has lockers numbered 1 to p − 1, no locker 0. Every night the caretaker relabels every locker by one fixed rule: locker i\'s new number is a·i, taken mod p. Nobody ever finds their locker gone, and nobody ever finds two lockers wearing the same new number.',
 map: [['The lockers numbered 1 to p − 1', 'the nonzero residues mod p'],
   ['One night\'s relabelling, i → a·i mod p', 'multiplication by a, mod p'],
   ['No locker ever getting relabelled 0', 'a is coprime to p, so a·i is never ≡ 0'],
   ['No two lockers ever landing on the same new number', 'the relabelling is a permutation of the same p − 1 numbers'],
   ['Multiplying together every locker\'s new number and comparing it to the product of all the old numbers', 'the shuffle argument, (a·1)(a·2)⋯(a·(p−1)) ≡ 1·2⋯(p−1) (mod p)'],
   ['Cancelling the shared product of all lockers from both sides', 'a^(p−1) ≡ 1 (mod p)'],
   ['Restricting the scheme to only the lockers coprime to some non-prime n', 'Euler\'s generalisation, a^φ(n) ≡ 1 (mod n)']],
 breaks: 'A real caretaker could mislabel one locker by hand and nobody would notice for a while — the shuffle argument allows no such slack, since injectivity here is guaranteed in advance by a being invertible mod p, not observed afterwards by checking each locker one by one. And the relabelling can look exactly this clean for some composite numbers too: 561 = 3 × 11 × 17 passes a^560 ≡ 1 (mod 561) for every a coprime to it despite not being prime, which is exactly why this theorem alone is not a reliable way to tell primes from impostors, and real tests use a strengthened version instead.'
},

bigo: {
 scene: 'A firm getting removal quotes for a house move that keeps growing. Every removal company quotes a flat call‑out fee plus a rate that depends on how many boxes there are, and the quotes only start to tell you anything once the move gets large.',
 map: [['The number of boxes being moved', 'n'],
   ['A firm\'s complete price formula for the move', 'f(n)'],
   ['The flat call‑out fee, the same on a ten‑box move as a ten‑thousand‑box one', 'the constant and lower‑order terms — dropped once bigger terms swamp them, not because they are zero'],
   ['A firm charging per box', 'O(n), linear growth'],
   ['A firm charging per pair of boxes it must carry together', 'O(n²), quadratic growth'],
   ['Ignoring the flat fee once the move is big enough that it stops deciding anything', 'the threshold n₀ built into the definition of Big‑O — the point past which the comparison is trusted to hold'],
   ['The per‑box firm eventually beating the per‑pair firm regardless of how low the per‑pair firm\'s call‑out fee was', 'no constant can make an O(n²) firm win against an O(n) firm for all sufficiently large n']],
 breaks: 'The call‑out fee never actually vanishes from the bill — it is real money on every invoice, for every move, forever. Big‑O only says it stops being the deciding factor once n passes some threshold; it never says the constant disappears, and on a single small house move the flat fee can easily be the largest line on the receipt. That threshold, n₀, is exactly why an unglamorous O(n²) sort still ships inside real libraries for short lists, where the crossover point simply has not been reached yet.'
},

loops: {
 scene: 'A chess club with n members runs three different events across a season: a simultaneous exhibition, a round‑robin league, and a knockout tournament.',
 map: [['One member playing through the queue of n opponents in a simultaneous exhibition, one game each', 'a single loop, O(n)'],
   ['Scheduling the round‑robin league, where every member is paired against every other member', 'a nested loop over pairs, shape O(n²)'],
   ['Listing each league match once — Alice v Bob, never also Bob v Alice — instead of twice', 'the triangular sum 1 + 2 + ⋯ + (n−1) = n(n−1)/2, half the full n² grid but still O(n²)'],
   ['A knockout bracket, half the players eliminated each round', 'a halving loop, O(log₂ n) rounds'],
   ['Running the league and the knockout the same season', 'costs from separate loops add rather than multiply: O(n²) + O(log₂ n) = O(n²)'],
   ['Doubling the club\'s membership and watching the league schedule roughly quadruple while the knockout gains only one extra round', 'why the growth classes feel so different once n is large']],
 breaks: 'A real knockout bracket only halves cleanly when membership is an exact power of two; any other count needs a bye to patch the uneven round. The mathematics has no such awkwardness — ⌈log₂ n⌉ counts the halvings correctly for any n at all, no bye required, because it is only ever asking how many times n must be halved before reaching 1. The season framing also flatters the addition rule for free: the league and the knockout add their costs only because they are genuinely two separate events, one after the other. A nested loop is not two events at all — the inner loop is not something that happens after the outer one finishes, it is the outer loop\'s own body, executed again on every single pass, which is exactly why nesting multiplies while running separate tournaments back to back only adds.'
},

recurrences: {
 scene: 'A stack of n exam scripts needs marking by a deadline. You keep half and hand the other half to a colleague; each of you does the same again with your half, delegating downward until every remaining stack is a single script, marked directly.',
 map: [['The whole stack of n scripts at the top', 'the input of size n'],
   ['Splitting a stack in two and delegating each half onward', 'the two recursive calls, T(n/2) each'],
   ['A single script, marked directly with no further delegation', 'the base case, T(1)'],
   ['Collating two marked half‑piles back into one ranked pile as they return up the chain', 'the O(n) combining work done at every level'],
   ['How many times the original stack gets halved before reaching single scripts', 'log₂ n levels of delegation'],
   ['The same collating work — n scripts\' worth — repeated at every one of those levels', 'the total cost n·log₂ n, level cost times number of levels']],
 breaks: 'A real stack of, say, 37 scripts cannot be split into two identical halves — someone\'s pile gets one extra script. The recurrence as drawn quietly assumes perfect halving all the way to a single script, which only happens when the starting count is an exact power of two; real division just rounds at each level, off by at most one, and the formal argument has to show that rounding never changes the final class rather than simply asserting it does not. And a real colleague handed a pile of three or four scripts would probably just mark them directly instead of subdividing again — which is not laziness, it is exactly what production merge sorts do too, switching to a simpler method once a subproblem is small enough that delegating costs more than it saves. The pure recurrence has no such threshold built in.'
},

develop: {
 scene: 'A carpenter is asked to fit a staircase into an oddly shaped attic conversion.',
 map: [['Walking the space with the client and writing down exact rise, run, headroom and code limits before cutting anything', 'Step 1, restating the problem in plain terms'],
   ['Knocking together a rough plywood staircase just to prove one can physically fit and hold weight at all', 'Step 2, the brute force — correct and slow first'],
   ['Noticing that, unusually, the two attic walls run perfectly parallel', 'Step 3, finding the structural property a shortcut can be built on'],
   ['Switching to the standard method for a straight staircase — cut one stringer as a template, repeat it — instead of improvising joinery from scratch', 'Step 4, applying a known paradigm once the structure licenses it'],
   ['Checking the finished staircase against the building code\'s load rating and timing how long the build actually took', 'Step 5, proving correctness and measuring cost'],
   ['Breaking up the rough plywood version once the real staircase is in', 'the brute force was scaffolding for confidence, never the deliverable']],
 breaks: 'A staircase that passes inspection once stays correct forever — timber does not stop obeying gravity between visits. An algorithm\'s proof of correctness is not a one‑off sign‑off like that: it has to hold for every input the code will ever meet, not just the attic in front of you, which is why step 5 needs a general invariant argument, of the kind the loop‑invariant reasoning in this very lesson builds, rather than a single satisfied inspector.'
},

amortized: {
 scene: 'A startup keeps growing. Every time it runs out of desks, it leases an office exactly double the size of the last one and moves every existing desk into it before hiring resumes.',
 map: [['Hiring into a desk that is already free', 'a cheap append, cost 1'],
   ['The office filling up completely and the whole company moving into a space exactly twice the size', 'a resize, which copies every current desk'],
   ['The cost of that move being proportional to how many staff already work there', 'a resize at capacity c costing c'],
   ['The moves landing at company sizes 1, 2, 4, 8, …', 'resizes at exactly the powers of two'],
   ['Totalling the cost of every move across the company\'s whole history and dividing by total hires', 'the amortised cost per hire'],
   ['A rival firm that instead bolts on five fixed extra desks every time it runs out', 'arithmetic growth, whose cost per hire climbs without bound as the firm grows']],
 breaks: 'This is not a claim about typical growth, the way an HR forecast smooths a hiring plan into an expected quarterly cost. Amortised analysis is a guarantee about the total across any sequence of hires whatsoever, including one deliberately timed to make every single move as disruptive as possible — and the individual expensive move is still exactly as sudden and exactly as costly as it looks on the day. Nothing about the average makes that one office move any calmer to live through, which is precisely the gap between an amortised bound and an average‑case one.'
},

pnp: {
 scene: 'A locked‑room escape game. Handed a candidate exit code, the game master can test it against the door in seconds. Finding that code yourself, with no hint, means working through the plausible combinations one by one.',
 map: [['Being handed a candidate code and checking whether it opens the door', 'a certificate check in polynomial time — the defining feature of NP'],
   ['Hunting down that code from nothing, with no hint', 'solving from scratch, the direction with no known shortcut'],
   ['A locksmith who could open any such door instantly, whatever the code', 'a hypothetical fast solver — an algorithm placing the problem in P'],
   ['A rulebook that turns any jigsaw challenge into an equivalent escape‑room challenge, solvable exactly when the jigsaw is', 'a polynomial‑time reduction from one problem to the other'],
   ['One universal skeleton key, once found, opening every room built on that same design principle', 'a fast algorithm for one NP‑hard problem collapsing every problem that reduces to it'],
   ['Generations of professional locksmiths never finding a general shortcut, though none has proved one impossible either', 'P vs NP remaining open']],
 breaks: 'A real escape room is finite and built to be beatable inside an hour for paying customers — its difficulty is fixed the day it opens. NP‑hardness is not about any one room; it is a claim about how the difficulty grows as the room gets larger without limit, which no physical puzzle designer ever actually tests. And a real locksmith who defeats one lock design has exploited an actual manufacturing flaw in that lock — a working master key really does turn up sometimes. Nobody has ever found the mathematical equivalent for an NP‑hard problem, nor proved that none exists, which is the one place the analogy has to stop gesturing and admit the question is still open.'
},

vectors: {
 scene: 'A weather app\'s live dashboard: temperature, humidity, wind speed, air pressure and UV index, each shown as a single number and refreshed every minute. Read every panel at once and you are not looking at five separate facts — you are looking at one snapshot, one point in a space with five readings.',
 map: [['Each panel on the dashboard', 'one dimension of the vector'],
   ['The full snapshot of every panel at once', 'the vector v = [v₁, v₂, …, vₙ]'],
   ['Comparing today\'s snapshot to yesterday\'s, reading by reading', 'componentwise addition or subtraction, u ± v'],
   ['Doubling every reading, as if rerunning the same weather at twice the intensity', 'scalar multiply cv — stretches the snapshot, does not turn it into a different kind of day'],
   ['How far today\'s whole snapshot sits from a calm, all-zero baseline, combining every panel into one number', 'the magnitude ‖v‖ = √(Σvᵢ²), Pythagoras applied repeatedly, one panel folded in at a time'],
   ['Rescaling the whole snapshot to a single unit of \'distance from calm\', keeping every panel\'s relative share', 'the unit vector v/‖v‖ — direction only, length divided out']],
 breaks: 'Dashboard panels come from wildly different units and scales — degrees, per cent, km/h, hectopascals, an index from 0 to 11 — so squaring and adding them to get one \'distance\' quietly treats a 1° change as exactly as significant as a 1 km/h change. That is a modelling choice hiding inside an innocent-looking formula, not a fact about the weather. Real embedding coordinates have the identical problem with no natural units at all, which is why they are normalised before any distance between them is trusted.'
},

dotproduct: {
 scene: 'Walking a dog on a lead while it lunges off after a squirrel at its own angle. Only the part of its pull that lines up with the direction you\'re walking actually drags you forward; the rest just tugs you sideways.',
 map: [['The direction you are walking', 'one vector, v'],
   ['The direction and force of the dog\'s lunge', 'the other vector, u'],
   ['The forward part of the pull, along your direction of travel', 'the projection built from u · v'],
   ['The dog lunging exactly along your path, every bit of its pull helping', 'cos θ = 1, the angle form u · v = ‖u‖‖v‖cos θ at its maximum'],
   ['The dog lunging straight sideways, perpendicular to your path', 'u · v = 0 — orthogonal, no forward contribution at all'],
   ['The dog bolting back toward you, fighting the direction you want to go', 'a negative dot product, cos θ near −1'],
   ['Comparing two dogs purely by which way they\'re pulling, ignoring how hard', 'cosine similarity, (u · v)/(‖u‖‖v‖), dividing the strengths out']],
 breaks: '\'Contributes nothing to forward motion\' is not the same as \'contributes nothing at all\': a lunge with zero dot product against your path can still yank you off your feet, because orthogonality only ever answers how aligned two things are along one chosen direction, never whether it matters. And cosine similarity throws away exactly how hard the dog pulled — a dog straining at full force and one barely tugging, in the same direction, score identically, even though only one of them is about to take your arm off.'
},

matrices: {
 scene: 'A recording studio\'s mixing desk. Every input channel — vocals, guitar, drums, bass — feeds into both output channels, left speaker and right speaker, each at its own fader level, so every output is a blend of all the inputs at settings only the desk knows.',
 map: [['One input channel\'s signal level', 'one entry of the input vector x'],
   ['The whole grid of fader settings, one per input–output pair', 'the matrix W'],
   ['The left speaker\'s actual sound, built from every input at its own fader level', 'one entry of Wx — row i of W dotted with x'],
   ['The desk needing exactly as many fader columns as there are input channels', 'the shape rule — inner dimensions must match, (m×n)(n×p) = (m×p)'],
   ['Routing this desk\'s outputs into a second desk\'s inputs one way, versus the other way around', 'AB ≠ BA — order changes the mix'],
   ['A desk wired straight through, each input\'s fader at 1 to its matching output and 0 everywhere else', 'the identity matrix I'],
   ['Adding a fixed background hum to every channel after mixing, the same regardless of the inputs', 'the bias term b in y = Wx + b']],
 breaks: 'A real fader has a floor and a ceiling: turn it up as far as it goes and the signal simply cannot get any louder. The entries of W are ordinary numbers with no such ceiling, and neither is the weighted sum they build — an output can grow without bound as its inputs do. A real neural layer stacks something with a ceiling, an activation function, right after Wx + b for exactly this reason, and the mixing desk on its own has no equivalent of it.'
},

'gradient-descent': {
 scene: 'Adjusting an old shower with two unmarked taps, hot and cold, until the water is exactly the temperature and pressure you want. After every twist you feel how far off it still is and turn each tap a bit further the way that helps most.',
 map: [['The current position of both taps', 'the parameters θ'],
   ['How far the water feels from ideal right now', 'the loss L'],
   ['Which way to nudge each tap, and how strongly, to improve fastest', 'the gradient ∇L'],
   ['Turning both taps a modest, deliberate amount in the improving direction', 'the update rule θ ← θ − η∇L'],
   ['How bold each twist is', 'the learning rate η'],
   ['Jerking the taps too hard, swinging between scalding and freezing', 'η too large — oscillation or divergence'],
   ['Barely nudging the taps, taking forever to feel right', 'η too small — slow convergence']],
 breaks: 'A shower has one true best setting you can feel directly and confirm the instant you touch the water. A real loss surface has thousands of taps, not two, and there is no felt sense of \'getting warmer\' — the gradient has to be computed by the chain rule, not sensed. Worse, it can point you confidently toward a setting that is merely locally comfortable, a lukewarm compromise nowhere near the best the plumbing could actually give, and nothing about the feel of one tap under your hand can warn you a better combination exists elsewhere.'
},

bayes: {
 scene: 'A detective\'s evidence board, before any clues, holds only a rough hunch about how likely a suspect is guilty. Each new clue — a fingerprint, a gap in an alibi — updates that hunch, and for speed the detective treats every clue as multiplying independently into the running odds.',
 map: [['The rough hunch about guilt before any evidence', 'the prior, P(guilty)'],
   ['How likely this particular clue would turn up, whether the suspect is guilty or innocent', 'the two likelihoods, P(clue|guilty) and P(clue|innocent)'],
   ['The updated belief once the clue is factored in', 'the posterior, P(guilty|clue)'],
   ['How common this kind of clue is across every suspect, guilty or not', 'the denominator P(clue) — the base rate of the evidence itself'],
   ['Treating each new clue as independently multiplying into the running odds', 'naive Bayes\' independence assumption'],
   ['A common clue, like living near the scene, nearly as true of the innocent as the guilty', 'a likelihood ratio close to 1 — why generic evidence barely moves the posterior']],
 breaks: 'A real detective — or a jury — instinctively discounts two clues that turn out to share a source: two witnesses who compared notes beforehand corroborate each other far less than two who never spoke. Multiplying likelihoods together the naive way has no such judgement built in; it treats correlated clues as independent confirmations and comes out far more confident than the evidence actually earns. That gap between the arithmetic and good judgement is exactly what \'naive\' in naive Bayes is naming, not a minor caveat.'
},

entropy: {
 scene: 'A telegraph operator wiring up a code book before a shift: the most frequent letters get the shortest tap sequences, the rarest ones get the longest, so that an average message takes as few taps as possible to send.',
 map: [['How rare a given letter is', 'its probability pᵢ'],
   ['The length of tap sequence assigned to that letter', 'roughly log₂(1/pᵢ) bits'],
   ['The average number of taps sent per letter over a long message', 'the entropy, H = −Σ pᵢ log₂ pᵢ'],
   ['A letter that always appears, needing no code at all', 'p = 1 ⇒ H = 0 — no surprise, no bits'],
   ['Every letter equally likely, so none can be favoured with a shorter code', 'the uniform case maximises H = log₂ n'],
   ['Sending a message using a code book built for a different, wrongly guessed letter frequency', 'cross-entropy, −Σ yᵢ log₂ ŷᵢ — paying for the code you built, not the one that fit'],
   ['A letter assumed to never appear, given an extremely long code, that then turns out to be the one sent', 'confident and wrong — ŷᵢ near 0 for the true class means a huge penalty']],
 breaks: 'A physical code has to hand out whole taps — you cannot send 1.585 of a tap sequence — but a letter with probability 1/3 wants exactly log₂3 ≈ 1.585 bits, and no single-letter code can hit that. The mathematical entropy is the exact continuous floor regardless; only by bundling many letters into one long block and coding the block as a whole does the achievable length per letter creep down toward it, which is why compression only pays off on long messages, never on a single character.'
},

};
