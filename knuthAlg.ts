import { IBestSplit } from "./solutionEnumerator";
import { successResult } from "./settings";
import { split } from "./split";
import { createEmptySplit, Guess, Split } from "./utils";

export function getBest(
    candidates: Guess[],
    problemSpace: Guess[]
): IBestSplit {
    let bestCandidate: Guess = "1";
    let bestValue = problemSpace.length + 1;
    let bestSplit = createEmptySplit();
    candidates.forEach((candidate) => {
        const s = split(candidate, problemSpace);
        const v = getSplitValue(s);
        // console.log("split", candidate, v, s);
        if (
            v < bestValue ||
            (v === bestValue &&
                !bestSplit.has(successResult) &&
                s.has(successResult))
        ) {
            bestValue = v;
            bestSplit = s;
            bestCandidate = candidate;
        }
    });
    // console.log("best", bestCandidate, bestValue, bestSplit);
    return { bestCandidate, bestSplit };
}

function getSplitValue(split: Split) {
    return Math.max(...Array.from(split.values()).map((v) => v.length));
}