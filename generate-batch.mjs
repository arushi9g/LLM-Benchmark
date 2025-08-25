import fs from 'fs/promises';
import fetch from 'node-fetch';

const promptsFile = './prompts.txt';
const outputFile = './answers.json';
const endpoint = 'http://localhost:3000/bedrock/generate';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const promptsText = await fs.readFile(promptsFile, 'utf-8');
    const prompts = promptsText.split('\n').filter(Boolean);

    const results = [];

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];

        try {
            const url = `${endpoint}?prompt=${encodeURIComponent(prompt)}`;
            const res = await fetch(url);
            const json = await res.json();

            results.push({ prompt, response: json });
        } catch (err) {
            console.error(`Failed for prompt: ${prompt}`);
            results.push({ prompt, error: err.message });
        }

        if ((i + 1) % 3 === 0 && i !== prompts.length - 1) {
            console.log('Delay...');
            await sleep(30000);
        }
    }

    await fs.writeFile(outputFile, JSON.stringify(results, null, 2));
    console.log(`Results saved to ${outputFile}`);
}

main();
