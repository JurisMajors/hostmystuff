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

const createFileNameHash = (realName) => `${crypto.createHash("sha256")
                                        .update(`${realName}${Date.now()}`)
                                        .digest("hex")
                                        .substring(0, 7)}${path.extname(realName)}`;   


function createBusboyFileHandler(requestHeaders, res, FILE_DIR, devMode) {
    const busboy = new Busboy({ headers: requestHeaders });
    let name, filePath;
    let fileSize = 0;

    busboy.on('file' , (fieldname, file, filename) => {
            name = createFileNameHash(filename);
            filePath = path.join(FILE_DIR, name);
            const writeStream = fs.createWriteStream(filePath);
            file.pipe(writeStream);
            // TODO: NEED LESS HACKY  SOLUTION FOR GETTING FILE SIZE
            file.on('readable', () => {
                let data;
                while (data = file.read()) {
                    fileSize += data.length; // count number of bytes
                }
            });
    });

    busboy.on('finish', () => {
        if (devMode) { // check validity only on production mode
            res.end(`http://localhost:8080/${name}`);
        } else {
            conn.validUpload(requestHeaders.key, fileSize)
                .then((uploadReport) => {
                    // check for validity and report accordingly
                    if (!uploadReport.keyExists) {
                        fs.unlinkSync(filePath);
                        res.end("Invalid api-key");
                    } else if (!uploadReport.enoughCapacity) {
                        fs.unlinkSync(filePath);
                        res.end("Not enough capacity left for this api-key");
                    } else {
                        // add info to database
                        conn.addFile(requestHeaders.key, name, fileSize);
                        res.end(`https://hostmystuff.xyz/${name}`);
                    }
                })
                .catch((err) => {
                    res.end("Something went wrong processing your request." +
                    `Please contact the host with the erorr message ${err}`);
                });
        }
    });

    return busboy;
}

module.exports = createBusboyFileHandler;
