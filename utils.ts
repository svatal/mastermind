export function groupBy<T, TKey>(as: T[], keyGetter: (a: T) => TKey) {
    return as.reduce((p, a) => {
        const key = keyGetter(a);
        return p.set(key, [...(p.get(key) ?? []), a]);
    }, new Map<TKey, T[]>());
}

export function getLetterUsageCounts(word: string) {
    return word
        .split("")
        .reduce(
            (p, c) => p.set(c, (p.get(c) || 0) + 1),
            new Map<string, number>()
        );
}

export function getCurrentPath(
    path: { guess: string; result: string; size: number }[]
) {
    return path
        .map((p) => `${p.guess} -> ${p.result} (${p.size}x)`)
        .join(" -> ");
}
