import { IOptions } from "./settings";
import {
    Color,
    createColor,
    getLetterUsageCounts,
    groupBy,
    Guess,
} from "./utils";

export function generateAll(o: IOptions) {
    if (o.repetition)
        return generateAllWithRepetition(o.colorCount, o.positionCount);
    return generateAllWithoutRepetition(
        enumerateAllColors(o.colorCount),
        o.positionCount
    );
}

function enumerateAllColors(colorCount: number): Color[] {
    return Array.from({ length: colorCount }, (_, i) => createColor(i + 1));
}

function generateAllWithRepetition(
    colorCount: number,
    positionCount: number
): Guess[] {
    if (positionCount === 1) return enumerateAllColors(colorCount);
    const shorter = generateAllWithRepetition(colorCount, positionCount - 1);
    let results: Guess[] = [];
    for (let c = 1; c <= colorCount; c++) {
        results.push(...shorter.map((w) => expandGuess(c, w)));
    }
    return results;
}

function generateAllWithoutRepetition(
    colors: Color[],
    positionCount: number
): Guess[] {
    if (positionCount === 1) return [...colors];
    let results: Guess[] = [];
    for (let c of colors) {
        results.push(
            ...generateAllWithoutRepetition(
                colors.filter((c2) => c != c2),
                positionCount - 1
            ).map((w) => expandGuess(c, w))
        );
    }
    return results;
}

function expandGuess(color: Color | number, partialGuess: Guess): Guess {
    return `${color}${partialGuess}` as Guess;
}

export function getColorGroups(previousTries: Guess[], colorCount: number) {
    const colorUsageCounts = previousTries.map(getLetterUsageCounts);
    const colors = enumerateAllColors(colorCount);
    return Array.from(
        groupBy(colors, (c) =>
            colorUsageCounts.map((ls) => ls.get(c) ?? 0).join("-")
        ).values()
    );
}

export function generateAllSignificantWithRepetition(
    positionCount: number,
    colorGroups: Color[][]
): Guess[] {
    if (positionCount === 1) return colorGroups.map((g) => g[0]);
    let results: Guess[] = [];
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
            ).map((w) => expandGuess(cg[0], w))
        );
    }
    return results;
}
