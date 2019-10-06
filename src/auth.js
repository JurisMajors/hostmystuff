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

const db = require('./db-conn.js');
const path = require('path');
const fs = require('fs-extra');

function getCollection(name) {
    return db.get().db("keys").collection(name);
}

async function getKeyFromDB(apiKey) {
    return getCollection("userKeys").findOne({_id : apiKey});
}

function enoughCapacity(keyInfo, fileSize) {
    return keyInfo.capacityLeft - fileSize >= 0;
}

// assumes that apiKey is valid, see uploader.js
async function addFileToKey(apiKey, fileName, fileSize) {
    const result = await getKeyFromDB(apiKey);
    result.files.push( { name: fileName, size: fileSize });

    getCollection("userKeys").updateOne(
        { _id : apiKey },
        { $set :
            {
                files : result.files,
                capacityLeft : result.capacityLeft - fileSize
            }
        },
        (err) => {
            if (err) throw err;
        }
    );

}

async function validUpload(apiKey, fileSize) {
    if (!apiKey) return {};

    const result = await getKeyFromDB(apiKey);
    if (!result) { // no key exist
        return {};
    } else {
        return  {
            keyExists: true,
            enoughCapacity: enoughCapacity(result, fileSize)
        };
    }
}

async function deleteFileFromDB(apiKey, fileName) {
    const keyInfo = await getKeyFromDB(apiKey);
    if (!keyInfo) {
        throw 'Invalid API key';
    }
    const fileNameInfo = { index : -1 };
    for (let index in keyInfo.files) {
        if (keyInfo.files[index].name === fileName) {
            fileNameInfo.index = index;
            fileNameInfo.info = keyInfo.files[index];
            break;
        }
    }
    if (fileNameInfo.index === -1) {
        throw 'This API Key does not own this file';
    }

    keyInfo.files.splice(fileNameInfo.index, 1);

    getCollection("userKeys").updateOne(
        { _id : apiKey },
        { $set :
            {
                files : keyInfo.files,
                capacityLeft : keyInfo.capacityLeft + fileNameInfo.info.fileSize
            } 
        },
    );
}

function deleteFile(fileDir, fileName, req, res) {
    if (!req.headers.key) {
        res.status(401).end('No API Key provided');
    }
    console.log(fileName);
    deleteFileFromDB(req.headers.key, fileName)
        .then(() => {
            fs.unlink(path.join(fileDir, fileName), (err) => {
                if (err) {
                    res.status(500).end(`HostMyStuff encountered an error trying to delete your file: ${err}`);
                } else {
                    res.status(200).end(`${fileName} successfully deleted`);
                }
            });
        })
        .catch((err) => res.status(401).end(err.toString()));
}

function listFiles(apiKey) {
    // TODO
}

module.exports = {
    validUpload : validUpload,
    addFile : addFileToKey,
    deleteFile : deleteFile
};
