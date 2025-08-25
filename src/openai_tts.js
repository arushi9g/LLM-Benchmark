const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: ' ' // Insert key here
});

const INPUT_FILE = 'prompts.txt';
const OUTPUT_DIR = 'audio_outputs_alloy_1';
const VOICE = 'alloy';
const MODEL = 'tts-1';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

async function processPrompts() {
    try {
        const data = fs.readFileSync(INPUT_FILE, 'utf-8');
        const prompts = data.split('\n').filter(prompt => prompt.trim() !== '');


        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            if (!prompt) continue;

            try {
                const speechFile = path.join(OUTPUT_DIR, `output_${i + 1}.mp3`);

                const response = await openai.audio.speech.create({
                    model: MODEL,
                    voice: VOICE,
                    input: prompt,
                    response_format: 'mp3'
                });

                const buffer = Buffer.from(await response.arrayBuffer());
                fs.writeFileSync(speechFile, buffer);

                console.log(`Saved output for prompt ${i + 1} to ${speechFile}`);
            } catch (error) {
                console.error(`Error processing prompt ${i + 1}:`, error.message);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('Prompts processed.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

processPrompts();