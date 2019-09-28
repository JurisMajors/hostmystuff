const fs = require('fs-extra');

const ensureFileDirectory = (FILE_DIR) => {
    fs.pathExists(FILE_DIR, (err, exists) => {
        if (err) {
            console.error(err);
            return;
        }
    
        if (!exists) {
            console.log(`Making directory to store files at ${FILE_DIR}`);
            fs.ensureDir(FILE_DIR)
                .then(() => console.log("Directory created successfully!"))
                .catch(err => console.error(err));
        }
    });
}

const initialize = (FILE_DIR) => {
    // ensure directory for saving files exist
    ensureFileDirectory(FILE_DIR);
}

module.exports = initialize;
