const fs = require('fs');

const rawData = fs.readFileSync('transcriptions.json', 'utf-8');
const transcriptions = JSON.parse(rawData);

const transcriptionLines = transcriptions.map(item => {
    if (item.transcription) {
        return item.transcription
            .replace(/\n/g, ' ')
            .trim();
    }
    return '';
}).filter(Boolean);

fs.writeFileSync(
    'transcriptions_only.txt',
    transcriptionLines.join('\n')
);

console.log(`Successfully extracted ${transcriptionLines.length} transcriptions to transcriptions_only.txt`);