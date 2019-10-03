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
const express = require('express');
const path = require('path');
const clearOldFiles = require('./src/clearer.js');
const createBusboyFileHandler = require('./src/uploader.js');
const serveFileToHtml = require('./src/fileServer.js');
const initialize = require('./src/initializer.js');

const app = express();
const PORT = 8080;
// times specified in ms
const CLEARING_MAX_AGE = 86400000 * 7; // week
const CLEARING_MIN_AGE = 86400000; // day
const CLEARING_FREQUENCY = 30000000;
const ADDRESS = '0.0.0.0';
const FILE_DIR = path.join(__dirname, '/files/');

app.use(express.static('public'));

initialize(FILE_DIR);

// periodically clear old files
setInterval(() => clearOldFiles(FILE_DIR, CLEARING_MIN_AGE, CLEARING_MAX_AGE), CLEARING_FREQUENCY);

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
