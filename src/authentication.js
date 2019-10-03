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
const fs = require('fs-extra')
const gpg = require('gpg')

function decryptSignedFile(signedFilePath, decryptedFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(signedFilePath, function(err, contents) {
            if (err) {
                reject("Could not read your signature file. Contact the administrator");
                return console.warn("Non-readable file");
            }

            gpg.decrypt(contents, (err, contents) => {
                if (err) {
                    reject("Invalid file signature");
                    return console.warn("Unsuccessful decryption");
                }

                fs.writeFile(decryptedFilePath, contents, (err) => {
                    if (err) {
                        reject("Error occurred when saving the decrypted file. Contact the administrator");
                        return console.warn("Could not save the decrypted file");
                    }
                    resolve(decryptedFilePath);
                });
            });
        });
    });
}

module.exports = {
    decryptFile: decryptSignedFile
}
