import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const inputFile = "prompts.txt";
const outputFile = "answers.txt";

const prompts = fs
    .readFileSync(inputFile, "utf-8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

async function run() {
    const output = [];

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];

        try {
            const response = await client.responses.create({
                model: "gpt-4.1",
                input: prompt,
            });

            const answer = response.output_text.trim();

            output.push(`Prompt ${i + 1}: ${prompt}`);
            output.push(`Answer ${i + 1}: ${answer}`);
            output.push("=".repeat(50));
        } catch (err) {
            output.push(`Prompt ${i + 1}: ${prompt}`);
            output.push(`Error: ${err.message}`);
            output.push("=".repeat(50));
        }
    }

    fs.writeFileSync(outputFile, output.join("\n"), "utf-8");
    console.log(`All answers saved to ${outputFile}`);
}

run();
