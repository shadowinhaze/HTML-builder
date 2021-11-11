const path = require('path');
const fs = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

(async () => {
    try {
        const files = await fs.readdir(pathToFolder, {withFileTypes: true});
        for (const file of files) {
          if (file.isFile()) {
            const filePath = path.join(pathToFolder, file.name);
            const fileStats = await fs.stat(filePath);
            const fileName = await path.parse(filePath).name;
            const fileExt = await path.parse(filePath).ext.slice(1);
            const fileSize = await fileStats.size;
            console.log(`${fileName} - ${fileExt} - ${fileSize / 1024}kb`)
          };
        };
      } catch (err) {
        console.error(err);
      }
})()

