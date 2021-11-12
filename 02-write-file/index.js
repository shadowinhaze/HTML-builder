const process = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const checkIt = (str) => {
    if (str.trim() === 'exit') {
        return rl.close()
    }
}

const filePath = path.join(__dirname, 'input.txt');
fs.writeFile(filePath, '', e => { if (e) console.log(e) });
let writableStream = fs.createWriteStream(filePath, {flags: 'a+'});

rl.question('Hi, write some text... \n', userInput => {
    checkIt(userInput);
    writableStream.write(userInput);
    rl.on('line', userInput => {
        checkIt(userInput);
        writableStream.write(`\n${userInput}`);
    })
});

rl.on('close', function() {
    console.log('\nThank you, you can find your text in a file!');
    process.exit(0);
});