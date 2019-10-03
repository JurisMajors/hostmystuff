/* HostMyStuff is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

HostMyStuff is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with HostMyStuff.  If not, see <https://www.gnu.org/licenses/>. */
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
