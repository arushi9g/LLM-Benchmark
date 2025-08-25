import { readFile, writeFile } from 'fs/promises';


const TEXTS_FILE = './prompts.txt';
const OUTPUT_FILE = './embeddings.json';
const ENDPOINT = 'http://localhost:3000/bedrock/embed';
const RATE_LIMIT_DELAY = 1000;

async function benchmarkEmbeddings() {
    try {
        const texts = (await readFile(TEXTS_FILE, 'utf-8'))
            .split('\n')
            .filter(text => text.trim());

        const results = [];
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            const displayText = text.length > 30 ? `${text.substring(0, 30)}...` : text;

            try {
                const start = Date.now();
                const response = await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                results.push({
                    text,
                    embedding: data.embedding || data,
                    tokenCount: text.split(/\s+/).length,
                    latencyMs: Date.now() - start
                });

            } catch (error) {
                console.error(`Error on text "${displayText}":`, error.message);
                results.push({ text, error: error.message });
            }

            if ((i + 1) % 5 === 0 && i !== texts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
            }
        }

        await writeFile(OUTPUT_FILE, JSON.stringify({
            modelUsed: 'amazon.titan-embed-text-v2:0',
            totalTexts: texts.length,
            successful: results.filter(r => !r.error).length,
            results
        }, null, 2));

        console.log(`Benchmark complete. Results saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Benchmark failed:', error);
    }
}

benchmarkEmbeddings();