import { match } from "./matcher";
import {
    createEmptySplit,
    createMatchResult,
    Guess,
    GetLetterUsageCounts,
} from "./utils";

export function split(
    question: Guess,
    possibilities: Guess[],
    getLetterUsageCounts: GetLetterUsageCounts
) {
    return possibilities
        .map((c) => ({ c, match: match(c, question, getLetterUsageCounts) }))
        .map(({ c, match }) => ({
            c,
            match: createMatchResult(match),
        }))
        .reduce((p, { c, match }) => {
            if (!p.has(match)) p.set(match, []);
            p.get(match)!.push(c);
            return p;
        }, createEmptySplit());
}
