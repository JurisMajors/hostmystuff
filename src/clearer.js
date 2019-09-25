const fs = require('fs-extra');
const path = require('path');

const BYTES_IN_MIB = 1048576;
const MAX_SIZE_IN_MIB = 512;


const getClearingAge = (minAge, maxAge, sizeInBytes) => {
    const sizeInMiB = sizeInBytes * BYTES_IN_MIB;
    // see 0x0.st for this formula
    return minAge + (-maxAge + minAge) * Math.pow((sizeInMiB / MAX_SIZE_IN_MIB - 1), 3)
}

function clearOldFiles(FILE_DIR, CLEARING_MIN_AGE, CLEARING_MAX_AGE) {
    let count = 0;

    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file) => {
            const pathTo = path.join(FILE_DIR, file);
            const stats = fs.statSync(pathTo);
            const aliveFor = Date.now() - stats.mtime;

            const clearingAge = getClearingAge(CLEARING_MIN_AGE, CLEARING_MAX_AGE,
                                                                stats.size);

            if (aliveFor >= clearingAge) { // delete if too old
		        count = count + 1;
                fs.unlinkSync(pathTo);
            }
        });
    });
}

module.exports = clearOldFiles;
