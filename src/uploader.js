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

const createSignatureFileHash = (realName) => `${crypto.createHash("sha256")
                                        .update(`${realName}${Date.now()}`)
                                        .digest("hex")
                                        .substring(0, 7)}.gpg`;   

const decryptAndSaveFile = async (signatureFileName, FILE_DIR, res) => {
    const decryptedFileName = signatureFileName.replace('.gpg', '');

    await auth.decryptFile(path.join(FILE_DIR, signatureFileName),
                            path.join(FILE_DIR, decryptedFileName))
        .then(filePath => res.end(`hostmystuff.ml/${decryptedFileName}\n`))
        .catch(err => {
            res.status('401');
            res.end(err);
        });
}

function createBusboyFileHandler(requestHeaders, res, FILE_DIR) {
    const busboy = new Busboy({ headers: requestHeaders });
    let name;

    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
        if (mimetypeBlacklist.indexOf(mimetype) > -1) {
            res.status('403');
            res.end(`${mimetype} 403: Invalid mime-type thats located in the mimetype blacklist`);
        } 
        else {
            name = createSignatureFileHash(filename);
            console.log(`name: ${name}`);
            console.log(`mimetype: ${mimetype}`);
            console.log('}')

            const savePath = path.join(FILE_DIR, name);
            file.pipe(fs.createWriteStream(savePath));
        }
    });

    busboy.on('finish', async () => {
        // TODO: HANDLE MIMETYPE BLACKLISTS HERE
        // send location of file 
        await decryptAndSaveFile(name, FILE_DIR, res);
        // delete signature file
        fs.unlinkSync(path.join(FILE_DIR, name))
    });

    return busboy;
}

module.exports = createBusboyFileHandler;
