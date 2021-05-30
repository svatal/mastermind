import { ResultsCache } from "./resultsCache";

type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Color = `${Digit}`;

export function createColor(c: number): Color {
    if (c <= 0 || c >= 10)
        throw "Broken contract - we represent colors as digits and there are too many!";
    return `${c}` as Color;
}

export type Guess = `${number}`;
export type MatchResult = `${number}-${number}`;

// export class Split extends Map<MatchResult, Guess[]> {}
// ^ wont work till switch to es6 - and bb does not support it yet
export type Split = Map<MatchResult, Guess[]>;
export function createEmptySplit() {
    return new Map<MatchResult, Guess[]>();
}

export interface IMatch {
    exact: number;
    color: number;
}

export function createMatchResult(match: IMatch): MatchResult {
    return `${match.exact}-${match.color}` as MatchResult;
}

export function groupBy<T, TKey>(as: T[], keyGetter: (a: T) => TKey) {
    return as.reduce((p, a) => {
        const key = keyGetter(a);
        return p.set(key, [...(p.get(key) ?? []), a]);
    }, new Map<TKey, T[]>());
}

function getLetterUsageCounts(word: string) {
    return word
        .split("")
        .reduce(
            (p, c) => p.set(c, (p.get(c) || 0) + 1),
            new Map<string, number>()
        );
}

export type GetLetterUsageCounts = typeof getLetterUsageCounts;
export function getCachedGetLetterUsageCounts() {
    const cache = new ResultsCache(getLetterUsageCounts, (w) => w);
    return cache.process;
}

export function getCurrentPath(
    path: { guess: string; result: string; size: number }[]
) {
    return path
        .map((p) => `${p.guess} -> ${p.result} (${p.size}x)`)
        .join(" -> ");
}
