const express = require('express');
const fs = require('fs-extra');
const Busboy = require('busboy');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const app = express();

const PORT = 8080;
const ADDRESS = 'localhost';
const FILE_DIR = path.join(__dirname, '/files/');


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
            exec(`file --mime-type ${path.join(FILE_DIR,fileHash)}`, (err, stdout) => {
                if (!err) {
                    const mime_type = stdout.split(': ')[1].replace(/(\r\n|\n|\r)/gm, "");;
                    console.log(mime_type);
                    res.set('Content-Type', mime_type);
                }
                res.write(data);
                res.end();
            });
        }
    });
});

// upload
app.post('/', (req, res) => {
    const busboy = new Busboy({ headers: req.headers });

    const authorized_keys = fs.readFileSync('authorized.json');
    if (!req.headers.key || authorized_keys.indexOf(req.headers.key) <= -1) {
        res.status('401');
        res.send('Unauthorized. Missing key header or not an authorized key.\n');
    } 

    let name;
    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
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
