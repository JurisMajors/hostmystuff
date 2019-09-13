const fs = require("fs");
const path = require("path");

function clearOldFiles(FILE_DIR, CLEARING_AGE) {
    let count = 0;

    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file) => {
            const pathTo = path.join(FILE_DIR, file);
            const aliveFor = Date.now() - fs.statSync(pathTo).mtime;

            if (aliveFor >= CLEARING_AGE) { // delete if too old
		        count = count + 1;
                fs.unlinkSync(pathTo);
            }
        });
    });
}

module.exports = clearOldFiles;
