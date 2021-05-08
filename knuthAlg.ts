import { IBestSplit } from "./solutionEnumerator";
import { successResult } from "./settings";
import { split } from "./split";

export function getBest(
    candidates: string[],
    problemSpace: string[]
): IBestSplit {
    let bestCandidate = "";
    let bestValue = problemSpace.length + 1;
    let bestSplit = new Map<string, string[]>();
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

function getSplitValue(split: Map<string, string[]>) {
    return Math.max(...Array.from(split.values()).map((v) => v.length));
}
