import { match } from "./matcher";

export function split(question: string, possibilities: string[]) {
    return possibilities
        .map((c) => ({ c, match: match(c, question) }))
        .map(({ c, match }) => ({ c, match: `${match.exact}-${match.color}` }))
        .reduce((p, { c, match }) => {
            if (!p.has(match)) p.set(match, []);
            p.get(match)!.push(c);
            return p;
        }, new Map<string, string[]>());
}
