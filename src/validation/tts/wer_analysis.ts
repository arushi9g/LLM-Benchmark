import * as fs from 'fs';

function calculateWER(ref: string, hyp: string): number {
    const normalize = (str: string) => {
        const substitutions: Record<string, string> = {
            '&': 'and',
            '1': 'one',
            '2': 'two',
            '3': 'three',
            '4': 'four',
            '5': 'five',
            '6': 'six',
            '7': 'seven',
            '8': 'eight',
            '9': 'nine',
            '0': 'zero',
            '$': 'dollar',
            '%': 'percent',
            '€': 'euro',
            '£': 'pound',
            '¥': 'yen',
            '+': 'plus',
            '=': 'equals',
            '@': 'at',
            '#': 'hash',
            'x': 'times',
            '×': 'times',
            'w/': 'with',
            'w/o': 'without'
        };

        return str.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .split(' ')
            .map(word => substitutions[word] || word)
            .join(' ')
            .trim();
    };

    const refNorm = normalize(ref);
    const hypNorm = normalize(hyp);

    const refWords = refNorm.split(' ').filter(word => word.length > 0);
    const hypWords = hypNorm.split(' ').filter(word => word.length > 0);

    if (refWords.length === 0) {
        return hypWords.length === 0 ? 0 : 1;
    }

    const d = Array(refWords.length + 1)
        .fill(null)
        .map(() => Array(hypWords.length + 1).fill(0));


    for (let i = 0; i <= refWords.length; i++) d[i][0] = i;
    for (let j = 0; j <= hypWords.length; j++) d[0][j] = j;

    for (let i = 1; i <= refWords.length; i++) {
        for (let j = 1; j <= hypWords.length; j++) {
            const cost = refWords[i - 1] === hypWords[j - 1] ? 0 : 1;
            d[i][j] = Math.min(
                d[i - 1][j] + 1,
                d[i][j - 1] + 1,
                d[i - 1][j - 1] + cost
            );
        }
    }

    return d[refWords.length][hypWords.length] / refWords.length;
}

function processFiles() {
    try {
        const prompts = fs.readFileSync('prompts.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        const transcriptions = fs.readFileSync('transcriptions_only.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line);

        if (prompts.length !== transcriptions.length) {
            console.error(`Mismatched line counts.`);
            return;
        }

        const maxLines = Math.min(prompts.length, 50);
        for (let i = 0; i < maxLines; i++) {
            const wer = calculateWER(prompts[i], transcriptions[i]);
            console.log(wer.toFixed(4));
        }

    } catch (error) {
        console.error('Error processing files:', error);
    }
}

processFiles();