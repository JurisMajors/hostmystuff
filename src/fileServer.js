const fs = require('fs-extra');
const { exec } = require('child_process');

const isText = (mimetype) => mimetype.startsWith("text");

const writeWithHighlight = (res, data) => {
    res.write('<pre class="prettyprint">');
    res.write(data);
    res.write('</pre>');
    res.write('<script src="stylizer.js"></script>');
}

const writeToHtml = (shouldBeRaw, res, data, mimetype) => {
    if (isText(mimetype) && !shouldBeRaw) {
        writeWithHighlight(res, data);
    } else {
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
