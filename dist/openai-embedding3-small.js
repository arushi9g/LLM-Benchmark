"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const promises_1 = __importDefault(require("fs/promises"));
async function main() {
    var _a;
    try {
        // Initialize OpenAI client
        const openai = new openai_1.default({
            apiKey: "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" // Replace with your actual OpenAI API key
        });
        // Read prompts from prompts.txt
        const promptsText = await promises_1.default.readFile('prompts.txt', 'utf-8');
        const prompts = promptsText.split('\n').filter(prompt => prompt.trim() !== '');
        if (prompts.length === 0) {
            throw new Error('No prompts found in prompts.txt');
        }
        const results = [];
        // Process each prompt individually
        for (const prompt of prompts) {
            try {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-large",
                    input: prompt,
                    encoding_format: "float" // or "base64" if you prefer
                });
                if (!((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.embedding)) {
                    console.warn(`No embedding generated for prompt: ${prompt}`);
                    continue;
                }
                results.push({
                    prompt,
                    embedding: response.data[0].embedding
                });
                console.log(`Processed: ${prompt.substring(0, 50)}...`);
            }
            catch (error) {
                console.error(`Error processing prompt "${prompt.substring(0, 50)}...":`, error instanceof Error ? error.message : error);
            }
        }
        // Write results to embeddings.json
        await promises_1.default.writeFile('embeddings.json', JSON.stringify(results, null, 2));
        console.log(`Successfully saved ${results.length} embeddings to embeddings.json`);
    }
    catch (error) {
        console.error('Fatal error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
main();
