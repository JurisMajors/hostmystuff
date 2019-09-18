const fs = require('fs-extra');
const { exec } = require('child_process');

const isText = (mimetype) => mimetype.startsWith("text");

const writeWithHighlight = (res, data) => {
    res.write('<script src="prettify.js"></script>');
    res.write('<pre class="prettyprint linenums:1" style="white-space: pre-wrap;">');
    res.write(data);
    res.write('</pre>');
    res.write('<link rel="stylesheet" type="text/css" href="prettify.css">');
    res.write('<script src="stylizer.js"></script>');
}

const writeToHtml = (shouldBeRaw, res, data, mimetype) => {
    if (isText(mimetype) && !shouldBeRaw) {
        writeWithHighlight(res, data);
    } else {
        mimetype = mimetype.replace(/(\r\n|\n|\r)/gm, "");
        res.writeHead(200, {
            'Content-Type': mimetype,
            'Content-Length': fs.statSync(filePath).size,
        });
        res.write(data);
    }
}

const serveFileToHtml = (filePath, req, res) => {
    exec (`file --mime-type ${filePath}`, (err, stdout, stderr) => {
        fs.readFile(filePath, null, (error, data) => {
            if (error) {
                res.writeHead(404);
                res.write("No such link exists");
            } else {
                writeToHtml(req.query.raw, res, data, stdout.split(": ")[1]);
            }
            res.end();
        });
    });
}

module.exports = serveFileToHtml;
