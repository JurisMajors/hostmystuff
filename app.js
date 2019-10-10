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
const express = require("express");
const path = require("path");
const argv = require("minimist")(process.argv.slice(2));

const clearOldFiles = require("./src/clearer.js");
const createBusboyFileHandler = require("./src/uploader.js");
const serveFileToHtml = require("./src/fileServer.js");
const initialize = require("./src/initializer.js");
const db = require("./src/db-conn.js");
const dbInteract = require("./src/auth.js");
const constants = require("./constants/index");

const app = express();
const PORT = argv.port || 8080;
const ADDRESS = argv.address || constants.ADDRESS;
const connURL = argv.mongo || constants.MONGO_URI_LOCAL;

//const DAY_IN_MS = constants.DAY_IN_MS;
// times specified in ms
const CLEARING_MAX_AGE = constants.CLEARING_MAX_AGE; // week
const CLEARING_MIN_AGE = constants.CLEARING_MIN_AGE; // day
const CLEARING_FREQUENCY = constants.CLEARING_FREQUENCY;
const FILE_DIR = constants.FILE_DIR;

// whether to apply development mode
const isDev = argv.mode && argv.mode === "dev";
if (isDev) {
    console.log("Running in development mode");
}

app.use(express.static("public"));

initialize(FILE_DIR);

// periodically clear old files
setInterval(() => clearOldFiles(FILE_DIR, CLEARING_MIN_AGE, CLEARING_MAX_AGE, isDev), CLEARING_FREQUENCY);

// delete file
app.delete("/:hash", (req, res) => {
    dbInteract.deleteFile(FILE_DIR, req.params.hash, req, res);
});

// get all owned files
app.get("/allfiles", (req, res) => {
    dbInteract.listFiles(req, res);
});

// get all information stored in db
app.get("/allinfo", (req, res) => {
    dbInteract.allInfo(req, res);
});

// get uploaded file
app.get("/:hash", (req, res) => {
    const filePath = path.join(FILE_DIR, req.params.hash);
    serveFileToHtml(filePath, req, res);
});

// upload
app.post("/", (req, res) => {
    return req.pipe(createBusboyFileHandler(req.headers, res, FILE_DIR, isDev));
});

function connect() {
    if (isDev) {
        app.listen(PORT, ADDRESS, () => {
            console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
        });
    } else {
        db.connect(connURL, (err) => {
            if (err) {
                console.log("Unable to connect to MongoDB");
                console.log(err);
                setTimeout(connect, 1000); // reconnect
            } else {
                app.listen(PORT, ADDRESS, () => {
                    console.log(`Listening on port ${PORT} at address ${ADDRESS}`);
                });
            }
        });
    }
}

connect();
