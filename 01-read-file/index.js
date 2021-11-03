const fs = require('fs')
const path = require('path');

const filePath = path.join(__dirname, 'text.txt')
const stream = fs.createReadStream(filePath);

stream.on('data', data => {
    console.log(data.toString())
})
