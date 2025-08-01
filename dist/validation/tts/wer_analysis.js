"use strict";
function calculateWER(ref, hyp) {
    const refWords = ref.split(' ');
    const hypWords = hyp.split(' ');
    const d = Array(refWords.length + 1)
        .fill(null)
        .map(() => Array(hypWords.length + 1).fill(0));
    for (let i = 0; i <= refWords.length; i++)
        d[i][0] = i;
    for (let j = 0; j <= hypWords.length; j++)
        d[0][j] = j;
    for (let i = 1; i <= refWords.length; i++) {
        for (let j = 1; j <= hypWords.length; j++) {
            const cost = refWords[i - 1] === hypWords[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[refWords.length][hypWords.length] / refWords.length;
}
