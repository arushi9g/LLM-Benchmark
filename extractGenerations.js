/*const fs = require('fs');

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync('answers.json', 'utf-8'));

// Extract and clean all generation texts
let generations = data.map(item => {
    if (!item.response || !item.response.generation) return '';

    // Clean the generation text:
    return item.response.generation
        .replace(/\n/g, ' ') // Remove prefixes and quotes
        .trim(); // Trim whitespace
});
// Ensure we have exactly 50 lines (pad with empty strings if needed)

if (generations.length > 50) {
    generations = generations.slice(0, 50);
} else if (generations.length < 50) {
    const needed = 50 - generations.length;
    generations = generations.concat(Array(needed).fill(''));
}

// Write to the output file
fs.writeFileSync('generations.txt', generations.join('\n'));

console.log(`Successfully wrote ${generations.length} clean generations to generations.txt`);
*/


/*
const fs = require('fs');

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync('answers.json', 'utf-8'));

// Extract all text content from responses
let textLines = data.map(item => {
    try {
        // Get the text content from the nested structure
        return item.response.output.message.content[0].text
            .replace(/\n/g, ' ')      // Replace newlines with spaces
            .trim();                   // Trim whitespace
    } catch (error) {
        console.error('Error processing item:', error);
        return '';
    }
});

// Ensure we have exactly 50 lines (pad with empty strings if needed)
if (textLines.length > 50) {
    textLines = textLines.slice(0, 50);
} else if (textLines.length < 50) {
    const needed = 50 - textLines.length;
    textLines = textLines.concat(Array(needed).fill(''));
}

// Write to the output file
fs.writeFileSync('text_output.txt', textLines.join('\n'));

console.log(`Successfully wrote ${textLines.length} text lines to text_output.txt`);
*/

const fs = require('fs');

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync('answers.json', 'utf-8'));

// Extract all content from responses
let contentLines = data.map(item => {
    try {
        // Get the content from the nested structure
        if (item.response &&
            item.response.choices &&
            item.response.choices[0] &&
            item.response.choices[0].message &&
            item.response.choices[0].message.content) {

            return item.response.choices[0].message.content
                .replace(/\n/g, ' ')      // Replace newlines with spaces
                .replace(/\s+/g, ' ')     // Collapse multiple spaces
                .trim();                  // Trim whitespace
        }
        return '';
    } catch (error) {
        console.error('Error processing item:', error);
        return '';
    }
});

// Ensure we have exactly 50 lines (pad with empty strings if needed)
if (contentLines.length > 50) {
    contentLines = contentLines.slice(0, 50);
} else if (contentLines.length < 50) {
    const needed = 50 - contentLines.length;
    contentLines = contentLines.concat(Array(needed).fill(''));
}

// Write to the output file
fs.writeFileSync('content_output.txt', contentLines.join('\n'));

console.log(`Successfully wrote ${contentLines.length} content lines to content_output.txt`);