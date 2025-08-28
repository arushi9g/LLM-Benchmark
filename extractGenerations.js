const fs = require('fs');
const data = JSON.parse(fs.readFileSync('textanswers.json', 'utf-8'));

let textLines = data.map(item => {
    try {
        return item.response.output.message.content[0].text
            .replace(/\n/g, ' ')
            .trim();
    } catch (error) {
        console.error('Error processing item:', error);
        return '';
    }
});

if (textLines.length > 50) {
    textLines = textLines.slice(0, 50);
} else if (textLines.length < 50) {
    const needed = 50 - textLines.length;
    textLines = textLines.concat(Array(needed).fill(''));
}


fs.writeFileSync('text_output.txt', textLines.join('\n'));
console.log(`Successfully wrote ${textLines.length} text lines to text_output.txt`);


/* const fs = require('fs');

const data = JSON.parse(fs.readFileSync('answers.json', 'utf-8'));

let generations = data.map(item => {
    if (!item.response || !item.response.generation) return '';

    return item.response.generation
        .replace(/\n/g, ' ')
        .trim();
});

if (generations.length > 50) {
    generations = generations.slice(0, 50);
} else if (generations.length < 50) {
    const needed = 50 - generations.length;
    generations = generations.concat(Array(needed).fill(''));
}

fs.writeFileSync('generations.txt', generations.join('\n'));

console.log(`Successfully wrote ${generations.length} clean generations to generations.txt`);
*/


/*
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('answers.json', 'utf-8'));

let contentLines = data.map(item => {
    try {
        if (item.response &&
            item.response.choices &&
            item.response.choices[0] &&
            item.response.choices[0].message &&
            item.response.choices[0].message.content) {

            return item.response.choices[0].message.content
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
        return '';
    } catch (error) {
        console.error('Error processing item:', error);
        return '';
    }
});

if (contentLines.length > 50) {
    contentLines = contentLines.slice(0, 50);
} else if (contentLines.length < 50) {
    const needed = 50 - contentLines.length;
    contentLines = contentLines.concat(Array(needed).fill(''));
}

fs.writeFileSync('content_output.txt', contentLines.join('\n'));

console.log(`Successfully wrote ${contentLines.length} content lines to content_output.txt`);
*/