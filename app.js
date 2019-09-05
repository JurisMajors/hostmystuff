const express = require('express');
const fs = require('fs-extra');
const Busboy = require('busboy');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 8080;
const CLEARING_AGE = 5000000;
const CLEARING_FREQUENCY = 300000;
const ADDRESS = 'localhost';
const FILE_DIR = path.join(__dirname, '/files/');

const mimetypeBlacklist = [
    'application/x-dosexec', 
    'application/x-executable', 
    'application/vnd.android.package-archive'
]

app.use(express.static('public'));

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

const getFileName = (realName) => crypto.createHash("sha256")
                                        .update(`${realName}${Date.now()}`)
                                        .digest("hex")
                                        .substring(0, 7);   

const isNotVideoOrImage = (mimetype) => mimetype.indexOf("image") <= -1 && mimetype.indexOf("video") <= -1 && mimetype.indexOf("audio") <= -1;

const writeWithHighlight = (res, data) => {
    res.write('<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>');
    res.write('<pre class="prettyprint">');

    res.write(data);

    res.write('</pre>');
}

const writeToHtml = (shouldHighlight, res, data, mimetype) => {
    if (isNotVideoOrImage(mimetype) && shouldHighlight) {
        console.log(isNotVideoOrImage(mimetype));
        console.log(mimetype);
        console.log(shouldHighlight);
        writeWithHighlight(res, data);
    } else {
        res.write(data);
    }
}


// get uploaded file
app.get('/:hash', (req, res) => {
    const filePath = path.join(FILE_DIR, req.params.hash);
    exec (`file --mime-type ${filePath}`, (err, stdout, stderr) => {
        fs.readFile(filePath, null, (error, data) => {
            if (error) {
                res.writeHead(404);
                res.write("No such link exists");
            } else {
                writeToHtml(!req.query.raw, res, data, stdout);
            }
            res.end();
        });
    });
});

const isAPIKeyValid = (key) => {
    const authorized_keys = fs.readFileSync('authorized.json');
    return authorized_keys.indexOf(key) > -1;
}

const createBusboyFileHandler = (requestHeaders, res) => {
    const busboy = new Busboy({ headers: requestHeaders });
    let name;

    busboy.on('file' ,(fieldname, file, filename, encoding, mimetype) => {
        if (mimetypeBlacklist.indexOf(mimetype) > -1) {
            res.status('403');
            res.end(`${mimetype} 403: Invalid mime-type thats located in the mimetype blacklist`);
        } 
        else {
            name = getFileName(filename);
            const savePath = path.join(FILE_DIR, name);
            file.pipe(fs.createWriteStream(savePath));
        }
    });

    busboy.on('finish', () => {
        // send location of file 
        res.end(`${ADDRESS}:${PORT}/${name}\n`);
    });

    return busboy;
}

// upload
app.post('/', (req, res) => {
    if (!isAPIKeyValid(req.headers.key)) {
        res.status('401');
        res.end('401: Unauthorized. Missing key header or not an authorized key.\n');
    } 

    return req.pipe(createBusboyFileHandler(req.headers, res));
});



app.listen(PORT, ADDRESS, function() {
    console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
});
