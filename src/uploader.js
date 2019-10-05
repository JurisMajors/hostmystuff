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
const Busboy = require('busboy');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs-extra');
const conn = require('./auth.js');

const createFileNameHash = (realName, extension) => `${crypto.createHash("sha256")
                                        .update(`${realName}${Date.now()}`)
                                        .digest("hex")
                                        .substring(0, 7)}${(extension) ? extension : ""}`;   


function createBusboyFileHandler(requestHeaders, res, FILE_DIR, devMode) {
    const busboy = new Busboy({ headers: requestHeaders });
    let name;
    let filePath;

    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
            name = createFileNameHash(filename);
            filePath = path.join(FILE_DIR, name);
            file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('finish', () => {
        const fileSize = fs.statSync(filePath).size;
        conn.validUpload(requestHeaders.key, fileSize)
            .then((uploadReport) => {
                // check for validity and report accordingly
                if (!uploadReport.keyExists) {
                    res.end("Invalid api-key")
                    fs.unlinkSync(filePath)
                } else if (!uploadReport.enoughCapacity) {
                    res.end("Not enough capacity left for this api-key")
                    fs.unlinkSync(filePath)
                } else {
                    // add info to database
                    res.end("Success!");
                    conn.addFile(requestHeaders.key, name, fileSize);
                }
            });
    });

    return busboy;
}

module.exports = createBusboyFileHandler;
