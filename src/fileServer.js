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
const fs = require("fs-extra");
const { exec } = require("child_process");

const isText = (mimetype) => mimetype.startsWith("text");

const writeWithHighlight = (res, data) => {
    res.write("<script src=\"highlight.pack.js\"></script>");
    res.write("<script>hljs.initHighlightingOnLoad();</script>");
    res.write("<div id=\"selector\"></div>");
    res.write("<pre>");
    res.write("<code>");
    res.write(data);
    res.write("</code>");
    res.write("</pre>");
    res.write("<script src=\"stylizer.js\"></script>");
};

const writeToHtml = (shouldBeRaw, res, data, mimetype, filePath) => {
    if (isText(mimetype) && !shouldBeRaw) {
        writeWithHighlight(res, data);
    } else {
        mimetype = mimetype.replace(/(\r\n|\n|\r)/gm, "");
        res.writeHead(200, {
            "Content-Type": mimetype,
            "Content-Length": fs.statSync(filePath).size,
        });
        res.write(data);
    }
};

const serveFileToHtml = (filePath, req, res) => {
    exec (`file --mime-type ${filePath}`, (err, stdout) => {
        fs.readFile(filePath, null, (error, data) => {
            if (error) {
                res.writeHead(404);
                res.write("No such link exists");
            } else {
                writeToHtml(req.query.raw, res, data, stdout.split(": ")[1], filePath);
            }
            res.end();
        });
    });
};

module.exports = serveFileToHtml;
