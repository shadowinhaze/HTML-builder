module.exports = async function copyDir(local, src, dist) {
    const fsp = require('fs/promises');
    const path = require('path');
    
    const pathToSrc = path.join(local, src);
    const pathToDest = path.join(local, dist);
    
    fsp.mkdir(pathToDest, { recursive: true });

    try {
        const elemsSrc = await fsp.readdir(pathToSrc);
        const elemsDest = await fsp.readdir(pathToDest);

        for (const copiedElem of elemsDest) {
            const copiedElemStats = await fsp.stat(path.join(pathToDest, copiedElem))
            if (!elemsSrc.includes(copiedElem)) {
                if (copiedElemStats.isFile()) {
                    fsp.rm(path.join(pathToDest, copiedElem))
                } else if (copiedElemStats.isDirectory()) {
                    fsp.rmdir(path.join(pathToDest, copiedElem), { recursive: true })
                }
            }
        }

        for (const elem of elemsSrc) {
            const elemStats = await fsp.stat(path.join(pathToSrc, elem));
            if (elemStats.isFile()) {
                await fsp.copyFile(path.join(pathToSrc, elem), path.join(pathToDest, elem));
            } else if (elemStats.isDirectory()) {
                await copyDir(local, `${src}/${elem}`, `${dist}/${elem}`)
            }
        }

    } catch (err) {
        console.log(err)
    }
}