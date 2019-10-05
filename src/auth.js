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

function getCollection(name) {
    return db.get().db("keys").collection(name)
}

async function getKeyFromDB(apiKey) {
    return getCollection("userKeys").findOne({_id : apiKey});
}

function enoughCapacity(keyInfo, fileSize) {
    return keyInfo.capacityLeft - fileSize >= 0;
}

async function addFileToKey(apiKey, fileName, fileSize) {
    const result = await getKeyFromDB(apiKey);
    result.files.push( {name: fileName, size: fileSize});

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
    )

}

async function validUpload(apiKey, fileSize) {
    const result = await getKeyFromDB(apiKey);
    if (!result) { // no key exist
        return {}
    } else {
        return  {
            keyExists: true,
            enoughCapacity: enoughCapacity(result, fileSize)
        }
    }
}

function deleteFile(apiKey, fileName) {
    // TODO
}

module.exports = {
    validUpload : validUpload,
    addFile : addFileToKey
}
