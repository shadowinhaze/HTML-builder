const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const bundler = require('../07-universal-func/bundler.js');
const copyier = require('../07-universal-func/copier')

const fileTemplateHtml = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToDist = path.join(__dirname, 'project-dist');

copyier(__dirname, 'assets', 'project-dist/assets');
bundler(__dirname, 'styles', 'project-dist', 'style.css');

const fileResultIndexHtml = path.join(pathToDist, 'index.html');

const reBirth = (filePath, replacer) => (replacer) ? fs.writeFile(filePath, replacer, err => (err) ? console.log(err) : true) : fs.writeFile(filePath, '', err => (err) ? console.log(err) : true);
async function getContent(filePath) {
    const fileSource = await fsp.open(filePath);
    const fileData = await fileSource.readFile({ encoding: 'utf-8' });
    fileSource.close();
    return fileData;
}

(async () => {
    try {
        reBirth(fileResultIndexHtml, await getContent(fileTemplateHtml));
        const componentsChunks = await fsp.readdir(pathToComponents, { withFileTypes: true });
        for (const componentsChunk of componentsChunks) {
            if (componentsChunk.isFile()) {
                const pathToChunk = path.join(pathToComponents, componentsChunk.name);
                const chunkExt = await path.parse(pathToChunk).ext.slice(1);
                const chunkName = await path.parse(pathToChunk).name;
                if (chunkExt === 'html') {
                    const chunkContent = await getContent(pathToChunk);
                    const chunkPlace = new RegExp(`{{${chunkName}}}`, 'g');
                    fs.readFile(fileResultIndexHtml, 'utf-8', (err, data) => {
                        if (err) throw err;
                        const replacer = data.replace(chunkPlace, chunkContent);
                        fs.writeFile(fileResultIndexHtml, replacer, 'utf-8', err => {
                            if (err) throw err;
                        });
                    })
                }
            };
        };
    } catch (err) {
        console.error(err);
    }
})();







