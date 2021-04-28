import { generateAll } from "./generator";
import { match } from "./matcher";

const all = generateAll({ colorCount: 8, positionCount: 5, repetition: false });
console.log(all.length);
const matched = all
    .map((c) => match(c, "11345"))
    .map(({ exact, color }) => `${exact}-${color}`)
    .reduce((p, c) => p.set(c, (p.get(c) || 0) + 1), new Map<string, number>());
console.log(matched);
