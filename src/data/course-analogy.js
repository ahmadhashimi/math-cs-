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

};
