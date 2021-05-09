import { match } from "./matcher";
import { createEmptySplit, createMatchResult, Guess, Split } from "./utils";

export function split(question: Guess, possibilities: Guess[]) {
    return possibilities
        .map((c) => ({ c, match: match(c, question) }))
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
