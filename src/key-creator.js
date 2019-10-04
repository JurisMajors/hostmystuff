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