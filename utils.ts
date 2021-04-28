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
