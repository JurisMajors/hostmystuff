const fs = require('fs');
const { exec } = require('child_process');

const isText = (mimetype) => mimetype.startsWith("text");

const writeWithHighlight = (res, data) => {
    res.write('<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>');
    res.write('<pre class="prettyprint">');

    res.write(data);

    res.write('</pre>');
}

const writeToHtml = (shouldHighlight, res, data, mimetype) => {
    if (isText(mimetype) && shouldHighlight) {
        console.log("HIGHLIGHT");
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
                writeToHtml(!req.query.raw, res, data, stdout.split(": ")[1]);
            }
            res.end();
        });
    });
}

module.exports = serveFileToHtml;
