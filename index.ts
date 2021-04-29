import {
    generateAll,
    generateAllSignificantWithRepetition,
    getColorGroups,
} from "./generator";
import { match } from "./matcher";

const colorCount = 8;
const positionCount = 5;
const repetition = false;

// const colorCount = 6;
// const positionCount = 4;
// const repetition = true;

const all = generateAll({ colorCount, positionCount, repetition });
console.log("all", all.length);

const significant = generateAllSignificantWithRepetition(
    positionCount,
    getColorGroups([], colorCount)
);
console.log("significant", significant.length);

let bestCandidate = "";
let bestValue = all.length + 1;
let bestSplit = new Map<string, string[]>();
significant.forEach((candidate) => {
    const s = split(candidate, all);
    const v = getSplitValue(s);
    console.log("split", candidate, v, s);
    if (v < bestValue) {
        bestValue = v;
        bestSplit = s;
        bestCandidate = candidate;
    }
});
console.log("best", bestCandidate, bestValue, bestSplit);

function split(question: string, possibilities: string[]) {
    return possibilities
        .map((c) => ({ c, match: match(c, question) }))
        .map(({ c, match }) => ({ c, match: `${match.exact}-${match.color}` }))
        .reduce((p, { c, match }) => {
            if (!p.has(match)) p.set(match, []);
            p.get(match)!.push(c);
            return p;
        }, new Map<string, string[]>());
}

function getSplitValue(split: Map<string, string[]>) {
    return Math.max(...Array.from(split.values()).map((v) => v.length));
}
