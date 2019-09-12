const fs = require('fs')
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
