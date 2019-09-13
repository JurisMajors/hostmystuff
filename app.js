const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const clearOldFiles = require('./clearer.js');
const createBusboyFileHandler = require('./uploader.js');

const app = express();
const PORT = 8080;
const CLEARING_AGE = 86400000;
const CLEARING_FREQUENCY = 30000000;
const ADDRESS = 'localhost';
const FILE_DIR = path.join(__dirname, '/files/');

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
    clearOldFiles(FILE_DIR, CLEARING_AGE);
}, CLEARING_FREQUENCY);


const isText = (mimetype) => mimetype.indexOf("text") > -1;

const writeWithHighlight = (res, data) => {
    res.write('<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>');
    res.write('<pre class="prettyprint">');

    res.write(data);

    res.write('</pre>');
}

const writeToHtml = (shouldHighlight, res, data, mimetype) => {
    if (isText(mimetype) && shouldHighlight) {
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

// upload
app.post('/', (req, res) => {
    return req.pipe(createBusboyFileHandler(req.headers, res, FILE_DIR));
});



app.listen(PORT, ADDRESS, function() {
    console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
});
