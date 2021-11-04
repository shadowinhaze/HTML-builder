async function copyDir() {
    const fs = require('fs/promises');
    const path = require('path');
    
    const pathToSrc = path.join(__dirname, 'files');
    const pathToDest = path.join(__dirname, 'files-copy');
    
    try {
        fs.mkdir(pathToDest, { recursive: true });
    } catch (err) {
        console.log(err)
    }

    try {
        const filesSrc = await fs.readdir(pathToSrc);
        const filesDest = await fs.readdir(pathToDest);
        
        if (filesDest.length > 0) {
            for (const copyiedFile of filesDest) {
                if (!filesSrc.includes(copyiedFile)) {
                    fs.rm(path.join(pathToDest, copyiedFile))
                }
            }
        }
        
        for (const file of filesSrc) {
            await fs.copyFile(path.join(pathToSrc, file), path.join(pathToDest, file));
        }
    } catch (err) {
        console.log(err)
    }
}
copyDir()



