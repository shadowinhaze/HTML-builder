const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

(async () => {
    try {
        const files = await fs.readdir(pathToFolder, {withFileTypes: true});
        for (const file of files) {
            if (file.isFile()) {
                const fileStats = await fs.stat(path.join(pathToFolder, file.name));
                const fileName = await path.parse(path.join(pathToFolder, file.name)).name;
                const fileExt = await path.parse(path.join(pathToFolder, file.name)).ext.slice(1);
                const fileSize = await fileStats.size;
                console.log(`${fileName} - ${fileExt} - ${fileSize / 1000}kb`)
            };
        };
      } catch (err) {
        console.error(err);
      }
})()

