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

        const openai = new openai_1.default({
            apiKey: "" //put key here
        });

        const promptsText = await promises_1.default.readFile('prompts.txt', 'utf-8');
        const prompts = promptsText.split('\n').filter(prompt => prompt.trim() !== '');
        if (prompts.length === 0) {
            throw new Error('No prompts found in prompts.txt');
        }
        const results = [];

        for (const prompt of prompts) {
            try {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-large",
                    input: prompt,
                    encoding_format: "float"
                });
                if (!((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.embedding)) {
                    console.warn(`No embedding generated for prompt: ${prompt}`);
                    continue;
                }
                results.push({
                    prompt,
                    embedding: response.data[0].embedding
                });

            }
            catch (error) {
                console.error(`Error processing prompt "${prompt.substring(0, 50)}...":`, error instanceof Error ? error.message : error);
            }
        }

        await promises_1.default.writeFile('embeddings.json', JSON.stringify(results, null, 2));
        console.log(`Successfully saved ${results.length} embeddings to embeddings.json`);
    }
    catch (error) {
        console.error('Fatal error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
main();
