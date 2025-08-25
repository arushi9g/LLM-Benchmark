import { promises as fs } from 'fs';
import * as path from 'path';

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function pcmToWav(pcmData: Int16Array, sampleRate: number): Blob {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);

    const dataSize = pcmData.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    let offset = 0;

    view.setUint32(offset, 0x52494646, false);
    offset += 4;
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    view.setUint32(offset, 0x57415645, false);
    offset += 4;

    view.setUint32(offset, 0x666d7420, false);
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitsPerSample, true);
    offset += 2;
    view.setUint32(offset, 0x64617461, false);
    offset += 4;
    view.setUint32(offset, dataSize, true);
    offset += 4;

    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(offset, pcmData[i], true);
        offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
}

async function textToSpeech(text: string, voiceName: string) {
    const payload = {
        contents: [{
            parts: [{ text: text }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName }
                }
            }
        },
        model: "gemini-2.5-pro-preview-tts"
    };

    const apiKey = " "; //Insert Key here
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-tts:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!audioData || !mimeType || !mimeType.startsWith("audio/")) {
        throw new Error('Failed to get audio data from API response.');
    }

    const match = mimeType.match(/rate=(\d+)/);
    if (!match) {
        throw new Error('Could not determine sample rate from mime type.');
    }
    const sampleRate = parseInt(match[1], 10);

    const pcmData = base64ToArrayBuffer(audioData);
    const pcm16 = new Int16Array(pcmData);

    const wavBlob = pcmToWav(pcm16, sampleRate);
    const audioBuffer = await wavBlob.arrayBuffer();

    return Buffer.from(audioBuffer);
}

async function runPromptsToTTS() {
    const promptsFile = 'prompts.txt';
    const outputDir = 'audio_output_puck_pro';

    try {
        const fileContent = await fs.readFile(promptsFile, 'utf-8');
        const prompts = fileContent.split('\n').filter(line => line.trim() !== '');

        if (prompts.length === 0) {
            console.error(`Error: "${promptsFile}" is empty.`);
            return;
        }

        await fs.mkdir(outputDir, { recursive: true });

        for (const [index, prompt] of prompts.entries()) {
            try {
                const audioBuffer = await textToSpeech(prompt, 'Puck');
                const fileName = path.join(outputDir, `prompt-${index + 1}.wav`);
                await fs.writeFile(fileName, audioBuffer);
                console.log(`Saved audio to "${fileName}"`);
            } catch (error) {
                console.error(`Failed to generate audio for prompt #${index + 37}:`, error);
            }

            if ((index + 1) % 1 === 0 && (index + 1) < prompts.length) {
                console.log(`Pausing for 1 minute...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }


    } catch (error) {
        if (error instanceof Error && (error as any).code === 'ENOENT') {
            console.error(`Error: The file "${promptsFile}" was not found.`);
        } else {
            console.error('An error occurred:', error);
        }
    }
}

runPromptsToTTS();
