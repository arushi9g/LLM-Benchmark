const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || " "
});

async function transcribeAudioFiles() {
    try {
        const audioDir = "audio_output_rachel";
        const files = fs.readdirSync(audioDir)
            .filter(file => file.endsWith('.mp3'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

        if (files.length === 0) {
            console.log("No MP3 files found in the audio_outputs directory");
            return;
        }

        console.log(`Found ${files.length} MP3 files to transcribe`);
        const transcriptions = [];

        for (const [index, file] of files.entries()) {
            const filePath = path.join(audioDir, file);

            console.log(`Processing file ${index + 1}/${files.length}: ${file}`);

            try {
                const audioData = fs.readFileSync(filePath);
                const base64Audio = audioData.toString('base64');

                const contents = [
                    {
                        text: "Transcribe this audio exactly as spoken. Include filler words. Return only the raw text."
                    },
                    {
                        inlineData: {
                            mimeType: "audio/mp3",
                            data: base64Audio
                        }
                    }
                ];

                const result = await genAI.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: contents
                });

                transcriptions.push({
                    audioFile: file,
                    transcription: result.text,
                    timestamp: new Date().toISOString()
                });

                console.log(`Transcription: ${result.text.substring(0, 50)}...`);

            } catch (error) {
                console.error(`Error processing file ${file}:`, error.message);
                transcriptions.push({
                    audioFile: file,
                    error: error.message
                });
            }

            await new Promise(resolve => setTimeout(resolve, 500));

        }

        fs.writeFileSync(
            "transcriptions.json",
            JSON.stringify(transcriptions, null, 2)
        );

        console.log("Transcription complete. Saved to transcriptions.json");

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

transcribeAudioFiles();

/*const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");


const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || "" //Put key here
});

async function transcribeBase64Audio() {
    try {
       
        const rawData = fs.readFileSync("tts_outputs.json", "utf-8");
        const ttsOutputs = JSON.parse(rawData);
        const transcriptions = [];

        for (const [index, entry] of ttsOutputs.entries()) {
            if (!entry.base64Audio) continue;

            console.log(`Processing entry ${index + 1}/${ttsOutputs.length}`);

            try {

                const contents = [
                    {
                        text: "Transcribe this audio exactly as spoken. Include filler words. Return only the raw text."
                    },
                    {
                        inlineData: {
                            mimeType: "audio/mp3",
                            data: entry.base64Audio
                        }
                    }
                ];

                const result = await genAI.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: contents
                });

                transcriptions.push({
                    originalPrompt: entry.prompt,
                    transcription: result.text,
                    timestamp: entry.timestamp || new Date().toISOString()
                });

            } catch (error) {
                console.error(`Error on entry ${index + 1}:`, error.message);
                transcriptions.push({
                    originalPrompt: entry.prompt,
                    error: error.message
                });
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        fs.writeFileSync(
            "transcriptions.json",
            JSON.stringify(transcriptions, null, 2)
        );

        console.log("Transcription complete. Saved to transcriptions.json");

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

transcribeBase64Audio();

*/

/*

const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || " " //Insert key here
});

async function transcribeWavFiles() {
    try {
        const audioDir = "audio_output_kore_pro";
        const files = fs.readdirSync(audioDir)
            .filter(file => file.toLowerCase().endsWith('.wav'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

        if (files.length === 0) {
            console.log("No WAV files found in the audio_outputs directory");
            return;
        }

        console.log(`Found ${files.length} WAV files to transcribe`);

        const transcriptions = [];

        for (const [index, file] of files.entries()) {
            const filePath = path.join(audioDir, file);

            console.log(`Processing file ${index + 1}/${files.length}: ${file}`);

            try {
                const audioData = fs.readFileSync(filePath);
                const base64Audio = audioData.toString('base64');

                const contents = [
                    {
                        text: "Transcribe this audio exactly as spoken. Include filler words. Return only the raw text."
                    },
                    {
                        inlineData: {
                            mimeType: "audio/wav",
                            data: base64Audio
                        }
                    }
                ];

                const result = await genAI.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: contents
                });

                transcriptions.push({
                    audioFile: file,
                    transcription: result.text,
                    timestamp: new Date().toISOString()
                });

                console.log(`Transcription: ${result.text.substring(0, 50)}...`);

            } catch (error) {
                console.error(`Error processing file ${file}:`, error.message);
                transcriptions.push({
                    audioFile: file,
                    error: error.message
                });
            }

            await new Promise(resolve => setTimeout(resolve, 500));

        }

        fs.writeFileSync(
            "transcriptions.json",
            JSON.stringify(transcriptions, null, 2)
        );

        console.log("Transcription complete. Saved to transcriptions.json");

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

transcribeWavFiles();
*/