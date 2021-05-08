import {
    generateAll,
    generateAllSignificantWithRepetition,
    getColorGroups,
} from "./generator";
import {
    positionCount,
    colorCount,
    repetition,
    successResult,
} from "./settings";
import { getCurrentPath } from "./utils";

export interface IBestSplit {
    bestCandidate: string;
    bestSplit: Map<string, string[]>;
}

interface IResult {
    max: number;
    avg: number;
    count: number;
}

export function solve(
    getBestSplit: (candidates: string[], problemSpace: string[]) => IBestSplit
) {
    const all = generateAll({ colorCount, positionCount, repetition });
    console.log("all", all.length);

    const significant = generateAllSignificantWithRepetition(
        positionCount,
        getColorGroups([], colorCount)
    );
    console.log("significant", significant.length);

    return minMax(all, [], significant, getBestSplit);
}

function minMax(
    problemSpace: string[],
    previous: { guess: string; result: string; size: number }[],
    significantCandidates: string[],
    getBestSplit: (candidates: string[], problemSpace: string[]) => IBestSplit
): IResult {
    if (problemSpace.length === 1) {
        const current =
            previous.length > 0 &&
            previous[previous.length - 1].result !== successResult
                ? [
                      ...previous,
                      {
                          guess: problemSpace[0],
                          result: successResult,
                          size: 1,
                      },
                  ]
                : previous;
        console.log(getCurrentPath(current));
        return { max: current.length, avg: current.length, count: 1 };
    }
    // console.log(
    //     "examining",
    //     getCurrentPath(previous),
    //     `(${problemSpace.length} entries)`
    // );
    const split = getBestSplit(significantCandidates, problemSpace);
    const colorGroups = getColorGroups(
        [...previous.map((p) => p.guess), split.bestCandidate],
        colorCount
    );
    const newSignificantCandidates = generateAllSignificantWithRepetition(
        positionCount,
        colorGroups
    );
    const results = Array.from(
        split.bestSplit.entries()
    ).map(([result, candidates]) =>
        minMax(
            candidates,
            [
                ...previous,
                { guess: split.bestCandidate, result, size: candidates.length },
            ],
            newSignificantCandidates,
            getBestSplit
        )
    );
    return {
        max: Math.max(...results.map((r) => r.max)),
        avg:
            results.reduce((p, r) => p + r.avg * r.count, 0) /
            problemSpace.length,
        count: problemSpace.length,
    };
}
