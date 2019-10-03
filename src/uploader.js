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
const auth = require('./authentication.js');

const mimetypeBlacklist = [
    'application/x-dosexec', 
    'application/x-executable', 
    'application/x-pie-executable', 
    'application/x-sharedlib', 
    'application/x-application', 
    'application/vnd.android.package-archive'
]

const createFileNameHash = (realName, extension) => `${crypto.createHash("sha256")
                                        .update(`${realName}${Date.now()}`)
                                        .digest("hex")
                                        .substring(0, 7)}${(extension) ? extension : ""}`;   

const decryptAndSaveFile = async (signatureFileName, FILE_DIR, res) => {
    const decryptedFileName = signatureFileName.replace('.gpg', '');

    await auth.decryptFile(path.join(FILE_DIR, signatureFileName),
                            path.join(FILE_DIR, decryptedFileName))
        .then(filePath => res.end(`https://hostmystuff.xyz/${decryptedFileName}\n`))
        .catch(err => {
            res.status('401');
            res.end(err);
        });
}

function createBusboyFileHandler(requestHeaders, res, FILE_DIR, devMode) {
    const busboy = new Busboy({ headers: requestHeaders });
    let name;

    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
        if (mimetypeBlacklist.indexOf(mimetype) > -1) {
            res.status('403');
            res.end(`${mimetype} 403: Invalid mime-type thats located in the mimetype blacklist`);
        } 
        else {
            if (devMode) {
                name = createFileNameHash(filename);
            } else {
                name = createFileNameHash(filename,'.gpg');
            }

            console.log(`name: ${name}`);
            console.log(`mimetype: ${mimetype}`);
            console.log('}')

            const savePath = path.join(FILE_DIR, name);
            file.pipe(fs.createWriteStream(savePath));
        }
    });

    busboy.on('finish', async () => {
        // TODO: HANDLE MIMETYPE BLACKLISTS HERE
        if (!devMode) {
            // send location of file 
            await decryptAndSaveFile(name, FILE_DIR, res);
            // delete signature file
            fs.unlinkSync(path.join(FILE_DIR, name))
        } else {
            res.end(`localhost:8080/${name}\n`);
        }

    });

    return busboy;
}

module.exports = createBusboyFileHandler;
