import { readFile, writeFile } from 'fs/promises';

async function extractCosineSimilarities() {
    try {
        const { comparisons } = JSON.parse(
            await readFile('./adjacent-similarity.json', 'utf-8')
        );
        const cosineValues = comparisons.map((comp: any) => comp.cosineSimilarity);
        const output = cosineValues.join('\n');
        await writeFile('./cosine-values.txt', output);

        console.log('Cosine similarities saved to cosine-values.txt:');
        console.log('\n' + output);

    } catch (error) {
        console.error('Extraction failed:', error);
    }
}

extractCosineSimilarities();