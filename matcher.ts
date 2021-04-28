export function match(a: string, b: string) {
    const len = a.length;
    let exact = 0;
    for (let i = 0; i < len; i++) {
        if (a[i] === b[i]) exact++;
    }
    let color = -exact; // exact matches are also color, skip these
    const da = toDict(a);
    const db = toDict(b);
    for (let letter in da) {
        color += Math.min(da[letter], db[letter] | 0);
    }
    return { exact, color };
}

function toDict(word: string) {
    return word.split("").reduce((p, c) => {
        p[c] = (p[c] || 0) + 1;
        return p;
    }, {} as { [letter: string]: number });
}
