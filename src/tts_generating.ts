import fs from 'fs/promises';
import fetch from 'node-fetch';
import dotenv from 'dotenv';


dotenv.config();
const promptsFile = './prompts.txt';
const outputFile = './tts_matthew_outputs.json';
const endpoint = 'http://localhost:3000/bedrock/tts';
const DEFAULT_VOICE = 'Joann';
const DELAY_BETWEEN_REQUESTS = 1000;
const BATCH_SIZE = 5;

interface TtsResponse {
    base64Audio: string;
}

interface TtsResult {
    prompt: string;
    base64Audio?: string;
    voice?: string;
    error?: string;
    timestamp: string;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

async function processPrompts() {
    try {
        const promptsText = await fs.readFile(promptsFile, 'utf-8');
        const prompts = promptsText.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);

        if (prompts.length === 0) {
            throw new Error('No valid prompts found in prompts.txt');
        }
        let results: TtsResult[] = [];
        try {
            const existingData = await fs.readFile(outputFile, 'utf-8');
            results = JSON.parse(existingData);
        } catch {
            console.log('Starting new processing session');
        }

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            const logPrefix = `[${i + 1}/${prompts.length}]`;

            try {
                console.log(`${logPrefix} Processing: "${truncate(prompt, 50)}"`);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: prompt,
                        voiceId: DEFAULT_VOICE
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json() as TtsResponse;

                if (!data?.base64Audio) {
                    throw new Error('Invalid response format');
                }

                results.push({
                    prompt,
                    base64Audio: data.base64Audio,
                    voice: DEFAULT_VOICE,
                    timestamp: new Date().toISOString()
                });

            } catch (err) {
                console.error(`${logPrefix} Failed:`, err instanceof Error ? err.message : 'Unknown error');
                results.push({
                    prompt,
                    error: err instanceof Error ? err.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
            }

            if ((i + 1) % BATCH_SIZE === 0 || i === prompts.length - 1) {
                await fs.writeFile(outputFile, JSON.stringify(results, null, 2));
                console.log(`${logPrefix} Saved progress (${i + 1}/${prompts.length} processed)`);
            }

            if (i < prompts.length - 1) {
                await sleep(DELAY_BETWEEN_REQUESTS);
            }
        }

        console.log(`Results saved to ${outputFile}`);

    } catch (err) {
        console.error('\nFatal error:', err instanceof Error ? err.message : 'Unknown error');
        process.exit(1);
    }
}

processPrompts();