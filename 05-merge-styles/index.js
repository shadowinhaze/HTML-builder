const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const pathToStyles = path.join(__dirname, 'styles');
const pathToDist = path.join(__dirname, 'project-dist');
const bundleCssFile = path.join(pathToDist, 'bundle.css');

(async () => {
    try {
        fs.writeFile(bundleCssFile, '', err => (err) ? console.log(err) : true)
        let bundlerWriteStream = fs.createWriteStream(bundleCssFile, { flags: 'a+' });
        const files = await fsp.readdir(pathToStyles, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const pathToFile = path.join(pathToStyles, file.name)
                const fileExt = await path.parse(pathToFile).ext.slice(1);
                if (fileExt === 'css') {
                    const fileReadStream = fs.createReadStream(pathToFile)
                    fileReadStream.pipe(bundlerWriteStream)
                }
            };
        };
    } catch (err) {
        console.error(err);
    }
})()