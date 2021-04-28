export function match(a: string, b: string) {
    const len = a.length;
    let exact = 0;
    for (let i = 0; i < len; i++) {
        if (a[i] === b[i]) exact++;
    }
    let color = -exact; // exact matches are also color, skip these
    const ua = getColorUsageCounts(a);
    const ub = getColorUsageCounts(b);
    for (let letter of ua.keys()) {
        color += Math.min(ua.get(letter)!, ub.get(letter) ?? 0);
    }
    return { exact, color };
}

export function getColorUsageCounts(word: string) {
    return word
        .split("")
        .reduce(
            (p, c) => p.set(c, (p.get(c) || 0) + 1),
            new Map<string, number>()
        );
}
