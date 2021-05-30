import {
    generateAll,
    generateAllSignificantWithRepetition,
    getColorGroups,
} from "./generator";
import { getSuccessResult, IOptions } from "./settings";
import {
    getCurrentPath,
    GetLetterUsageCounts,
    Guess,
    MatchResult,
    Split,
} from "./utils";

export interface IBestSplit {
    bestCandidate: Guess;
    bestSplit: Split;
}

interface IResult {
    max: number;
    avg: number;
    count: number;
}

export function solve(
    options: IOptions,
    getBestSplit: (candidates: Guess[], problemSpace: Guess[]) => IBestSplit,
    getLetterUsageCounts: GetLetterUsageCounts
) {
    const all = generateAll(options);
    console.log("all", all.length);

    const significant = generateAllSignificantWithRepetition(
        options.positionCount,
        getColorGroups([], options.colorCount, getLetterUsageCounts)
    );
    console.log("significant", significant.length);

    return minMax(
        all,
        [],
        significant,
        options,
        getBestSplit,
        getLetterUsageCounts
    );
}

function minMax(
    problemSpace: Guess[],
    previous: { guess: Guess; result: MatchResult; size: number }[],
    significantCandidates: Guess[],
    options: IOptions,
    getBestSplit: (candidates: Guess[], problemSpace: Guess[]) => IBestSplit,
    getLetterUsageCounts: GetLetterUsageCounts
): IResult {
    if (problemSpace.length === 1) {
        const successResult = getSuccessResult(options);
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
        options.colorCount,
        getLetterUsageCounts
    );
    const newSignificantCandidates = generateAllSignificantWithRepetition(
        options.positionCount,
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
            options,
            getBestSplit,
            getLetterUsageCounts
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
