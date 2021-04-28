interface IOptions {
    colors: number;
    positions: number;
    repetition: boolean;
}

export function generateAll(o: IOptions) {
    if (o.repetition) return generateAllWithRepetition(o.colors, o.positions);
    return generateAllWithoutRepetition(
        enumerateAllColors(o.colors),
        o.positions
    );
}

function enumerateAllColors(colorCount: number) {
    return Array.from({ length: colorCount }, (_, i) => `${i + 1}`);
}

function generateAllWithRepetition(colors: number, positions: number) {
    if (positions === 0) return [""];
    const shorter = generateAllWithRepetition(colors, positions - 1);
    let results = [] as string[];
    for (let c = 1; c <= colors; c++) {
        results.push(...shorter.map((w) => `${c}${w}`));
    }
    return results;
}

function generateAllWithoutRepetition(colors: string[], positions: number) {
    if (positions === 0) return [""];
    let results = [] as string[];
    for (let c of colors) {
        results.push(
            ...generateAllWithoutRepetition(
                colors.filter((c2) => c != c2),
                positions - 1
            ).map((w) => `${c}${w}`)
        );
    }
    return results;
}
