import { getColorUsageCounts } from "./matcher";

interface IOptions {
    colorCount: number;
    positionCount: number;
    repetition: boolean;
}

export function generateAll(o: IOptions) {
    if (o.repetition)
        return generateAllWithRepetition(o.colorCount, o.positionCount);
    return generateAllWithoutRepetition(
        enumerateAllColors(o.colorCount),
        o.positionCount
    );
}

function enumerateAllColors(colorCount: number) {
    return Array.from({ length: colorCount }, (_, i) => `${i + 1}`);
}

function generateAllWithRepetition(colorCount: number, positionCount: number) {
    if (positionCount === 0) return [""];
    const shorter = generateAllWithRepetition(colorCount, positionCount - 1);
    let results = [] as string[];
    for (let c = 1; c <= colorCount; c++) {
        results.push(...shorter.map((w) => `${c}${w}`));
    }
    return results;
}

function generateAllWithoutRepetition(colors: string[], positionCount: number) {
    if (positionCount === 0) return [""];
    let results = [] as string[];
    for (let c of colors) {
        results.push(
            ...generateAllWithoutRepetition(
                colors.filter((c2) => c != c2),
                positionCount - 1
            ).map((w) => `${c}${w}`)
        );
    }
    return results;
}

export function getColorGroups(previousTries: string[], colorCount: number) {
    const colorUsageCounts = previousTries.map(getColorUsageCounts);
    const colors = enumerateAllColors(colorCount);
    return Array.from(
        groupBy(colors, (c) =>
            colorUsageCounts.map((ls) => ls.get(c) ?? 0).join("-")
        ).values()
    );
}

function groupBy<T, TKey>(as: T[], keyGetter: (a: T) => TKey) {
    return as.reduce((p, a) => {
        const key = keyGetter(a);
        return p.set(key, [...(p.get(key) ?? []), a]);
    }, new Map<TKey, T[]>());
}

export function generateAllSignificantWithRepetition(
    positionCount: number,
    colorGroups: string[][]
) {
    if (positionCount === 0) return [""];
    let results = [] as string[];
    for (let cg of colorGroups) {
        results.push(
            ...generateAllSignificantWithRepetition(
                positionCount - 1,
                cg.length === 1
                    ? colorGroups
                    : [
                          [cg[0]],
                          ...colorGroups.map((cg2) =>
                              cg !== cg2 ? cg2 : cg2.slice(1)
                          ),
                      ]
            ).map((w) => `${cg[0]}${w}`)
        );
    }
    return results;
}
