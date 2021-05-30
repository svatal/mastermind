import { GetLetterUsageCounts, Guess, IMatch } from "./utils";

export function match(
    a: Guess,
    b: Guess,
    getLetterUsageCounts: GetLetterUsageCounts
): IMatch {
    const len = a.length;
    let exact = 0;
    for (let i = 0; i < len; i++) {
        if (a[i] === b[i]) exact++;
    }
    let color = -exact; // exact matches are also color, skip these
    const ua = getLetterUsageCounts(a);
    const ub = getLetterUsageCounts(b);
    for (let letter of ua.keys()) {
        color += Math.min(ua.get(letter)!, ub.get(letter) ?? 0);
    }
    return { exact, color };
}
