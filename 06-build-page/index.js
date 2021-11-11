const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const bundler = require('../07-universal-func/bundler');
const copyier = require('../07-universal-func/copier')

const fileTemplateHtml = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToDist = path.join(__dirname, 'project-dist');
const fileResultIndexHtml = path.join(pathToDist, 'index.html');

fsp.mkdir(pathToDist, { recursive: true });
fsp.mkdir(path.join(pathToDist, 'assets'), { recursive: true });

copyier(__dirname, 'assets', 'project-dist/assets');
bundler(__dirname, 'styles', 'project-dist', 'style.css');

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
          let fileResultIndexHtmlContent = await getContent(fileResultIndexHtml);
          const replacer = fileResultIndexHtmlContent.replace(chunkPlace, chunkContent);
          fs.writeFile(fileResultIndexHtml, replacer, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      };
    };
  } catch (err) {
    console.error(err);
  }
})();