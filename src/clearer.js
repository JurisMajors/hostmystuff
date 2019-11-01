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
const fs = require("fs-extra");
const path = require("path");
const findOwner = require("./auth.js").findOwner;
const deleteFileFromDB = require("./auth.js").deleteFileFromDB;
const constants = require("../constants/index");

const BYTES_IN_MIB = constants.BYTES_IN_MIB;
const MAX_SIZE_IN_MIB = constants.MAX_SIZE_IN_MIB;

function getClearingAge(minAge, maxAge, sizeInBytes) {
    const sizeInMiB = sizeInBytes / BYTES_IN_MIB;
    // see 0x0.st for this formula
    return (minAge + (-maxAge + minAge) * Math.pow((sizeInMiB / MAX_SIZE_IN_MIB - 1), 3));
}

function isFileExpired(pathTo, CLEARING_MIN_AGE, CLEARING_MAX_AGE) {
    const stats = fs.statSync(pathTo);
    const aliveFor = Date.now() - stats.mtime;
    const clearingAge = getClearingAge(CLEARING_MIN_AGE, CLEARING_MAX_AGE, stats.size);

    return aliveFor >= clearingAge;
}

function clearOldFiles(FILE_DIR, CLEARING_MIN_AGE, CLEARING_MAX_AGE, isDev) {
    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file) => {
            const pathTo = path.join(FILE_DIR, file);
            if (isFileExpired(pathTo, CLEARING_MIN_AGE, CLEARING_MAX_AGE)) { // delete if too old
                if (isDev) {
                    findOwner(file)
                        .then((ownerKey) => {
                            if (ownerKey) {
                                deleteFileFromDB(ownerKey, file).catch(console.log);
                            }
                        })
                        .catch(console.log);
                }
                fs.unlinkSync(pathTo);
            }
        });
    });
}

module.exports = clearOldFiles;
