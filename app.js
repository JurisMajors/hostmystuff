const express = require('express');
const path = require('path');
const clearOldFiles = require('./src/clearer.js');
const createBusboyFileHandler = require('./src/uploader.js');
const serveFileToHtml = require('./src/fileServer.js');
const initialize = require('./src/initializer.js');

const app = express();
const PORT = 8080;
const CLEARING_AGE = 86400000;
const CLEARING_FREQUENCY = 30000000;
const ADDRESS = 'localhost';
const FILE_DIR = path.join(__dirname, '/files/');

app.use(express.static('public'));

initialize(FILE_DIR);

// periodically clear old files
setInterval(() => clearOldFiles(FILE_DIR, CLEARING_AGE), CLEARING_FREQUENCY);

// get uploaded file
app.get('/:hash', (req, res) => {
    const filePath = path.join(FILE_DIR, req.params.hash);
    serveFileToHtml(filePath, req, res);
});

// upload
app.post('/', (req, res) => {
    return req.pipe(createBusboyFileHandler(req.headers, res, FILE_DIR));
});


app.listen(PORT, ADDRESS, function() {
    console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
});
