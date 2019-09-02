const express = require('express');
const fs = require('fs-extra');
const Busboy = require('busboy');
const path = require('path');
const crypto = require('crypto');
const app = express();

const PORT = 8080;
const CLEARING_AGE = 500;
const CLEARING_FREQUENCY = 3000;
const ADDRESS = 'localhost';
const FILE_DIR = path.join(__dirname, '/files/');

const blacklist = [
    'application/x-dosexec', 
    'application/x-executable', 
    'application/vnd.android.package-archive'
]


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

setInterval(() => {
    fs.readdir(FILE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach((file) => {
            const pathTo = `${FILE_DIR}${file}`;
            const aliveFor = Date.now() - fs.statSync(pathTo).mtime;
            if (aliveFor >= CLEARING_AGE) { // delete if too old
                fs.unlinkSync(pathTo);
            }
        });

    });
}, CLEARING_FREQUENCY);

const getFileName = (realName) => {
    return crypto.createHash("sha256")
             .update(`${realName}${Date.now()}`)
             .digest("hex")
             .substring(0, 7);   
}

// get uploaded file
app.get('/:hash', (req, res) => {
    const fileHash = req.params.hash;
    fs.readFile(path.join(FILE_DIR,fileHash), null, (error, data) => {
        if (error) {
            res.writeHead(404);
            res.write("No such link exists");
        } else {
            res.write(data);
            res.end();
        }
    });
});

// upload
app.post('/', (req, res) => {
    const busboy = new Busboy({ headers: req.headers });

    const authorized_keys = fs.readFileSync('authorized.json');
    if (!req.headers.key || authorized_keys.indexOf(req.headers.key) <= -1) {
        res.status('401');
        res.send('401: Unauthorized. Missing key header or not an authorized key.\n');
    } 

    let name;
    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
        if (blacklist.indexOf(mimetype) <= -1) {
            res.status('403');
            res.send(`403: Invalid mime-type thats located in blacklist`);
        }
        name = getFileName(filename);
        const savePath = path.join(FILE_DIR, name);
        file.pipe(fs.createWriteStream(savePath));
    });

    busboy.on('finish', () => {
        res.end(`${ADDRESS}:${PORT}/${name}\n`);
    });

    return req.pipe(busboy);
});



app.listen(PORT, ADDRESS, function() {
    console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
});
