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

const conn = require('./db-conn.js').dbConn;
const uuidv4 = require('uuid/v4');

function createKey() {
    return { 
        _id : uuidv4(),
        files: [],
        capacityLeft: "1073741824" 
    };
}

conn((db) => {
    const dbo = db.db("keys");
    const newKey = createKey();
    dbo.collection("userKeys").insertOne(newKey, 
        (err, res) => {
            if (err) throw err;
            console.log(`key added with id ${newKey._id}`);
            db.close();
        }
    );
})