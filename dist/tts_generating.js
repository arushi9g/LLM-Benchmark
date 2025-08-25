"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
// Configuration
dotenv_1.default.config();
const promptsFile = './prompts.txt';
const outputFile = './tts_matthew_outputs.json';
const endpoint = 'http://localhost:3000/bedrock/tts';
const DEFAULT_VOICE = 'Joann';
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second between requests
const BATCH_SIZE = 5; // Number of requests before writing intermediate results
const BACKUP_FILE = './tts_outputs_backup.json'; // For crash recovery
// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function truncate(text, maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
async function processPrompts() {
    try {
        // Read prompts
        const promptsText = await promises_1.default.readFile(promptsFile, 'utf-8');
        const prompts = promptsText.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        if (prompts.length === 0) {
            throw new Error('No valid prompts found in prompts.txt');
        }
        // Load existing results if resuming
        let results = [];
        try {
            const existingData = await promises_1.default.readFile(outputFile, 'utf-8');
            results = JSON.parse(existingData);
            console.log(`Resuming from existing file with ${results.length} processed prompts`);
        }
        catch (_a) {
            console.log('Starting new processing session');
        }
        // Process remaining prompts
        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            const logPrefix = `[${i + 1}/${prompts.length}]`;
            try {
                console.log(`${logPrefix} Processing: "${truncate(prompt, 50)}"`);
                const response = await (0, node_fetch_1.default)(endpoint, {
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
                const data = await response.json();
                if (!(data === null || data === void 0 ? void 0 : data.base64Audio)) {
                    throw new Error('Invalid response format');
                }
                results.push({
                    prompt,
                    base64Audio: data.base64Audio,
                    voice: DEFAULT_VOICE,
                    timestamp: new Date().toISOString()
                });
            }
            catch (err) {
                console.error(`${logPrefix} Failed:`, err instanceof Error ? err.message : 'Unknown error');
                results.push({
                    prompt,
                    error: err instanceof Error ? err.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
            }
            // Save progress periodically
            if ((i + 1) % BATCH_SIZE === 0 || i === prompts.length - 1) {
                await promises_1.default.writeFile(outputFile, JSON.stringify(results, null, 2));
                await promises_1.default.writeFile(BACKUP_FILE, JSON.stringify(results, null, 2));
                console.log(`${logPrefix} Saved progress (${i + 1}/${prompts.length} processed)`);
            }
            // Rate limiting (except after last request)
            if (i < prompts.length - 1) {
                await sleep(DELAY_BETWEEN_REQUESTS);
            }
        }
        console.log(`\nProcessing complete. Successfully processed ${results.filter(r => r.base64Audio).length}/${prompts.length} prompts`);
        console.log(`Results saved to ${outputFile}`);
    }
    catch (err) {
        console.error('\nFatal error:', err instanceof Error ? err.message : 'Unknown error');
        process.exit(1);
    }
}
// Run the program
processPrompts();
