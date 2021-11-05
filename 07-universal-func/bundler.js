module.exports = async function bundle(local, src, dist, bundler) {
    const path = require('path');
    const fs = require('fs');
    const fsp = require('fs/promises');
    
    const pathToSrc = path.join(local, src);
    const pathToDist = path.join(local, dist);
    const bundlerFile = path.join(pathToDist, bundler);
    const desireExt = bundler.match(/(html|css|js)/g)[0];

    try {
        fs.writeFile(bundlerFile, '', err => (err) ? console.log(err) : true)
        let bundlerWriteStream = fs.createWriteStream(bundlerFile, { flags: 'a+' });
        const files = await fsp.readdir(pathToSrc, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const pathToFile = path.join(pathToSrc, file.name)
                const fileExt = await path.parse(pathToFile).ext.slice(1);
                if (fileExt === desireExt) {
                    const fileReadStream = fs.createReadStream(pathToFile)
                    fileReadStream.pipe(bundlerWriteStream)
                }
            };
        };
    } catch(err) {
        console.error(err);
    }
}