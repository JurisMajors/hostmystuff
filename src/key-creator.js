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
const uuidv4 = require('uuid/v4');
const argv = require('minimist')(process.argv.slice(2));
const constants = require('../constants/index');

function createKey() {
    return { 
        _id : uuidv4(),
        files: [],
        capacityLeft: constants.CAPACITY // 1gb
    };
}

const MONGO_URI = argv.mongo || constants.MONGO_URI_LOCAL;
db.connect(MONGO_URI, (err) => {
    if (err) throw err;
    const newKey = createKey();
    db.get().db("keys").collection("userKeys")
        .insertOne(newKey, 
            (err) => {
                if (err) throw err;
                console.log(newKey._id);
                db.close();
            }
        );
});
