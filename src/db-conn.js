const client = require('mongodb').MongoClient;
const connURL = "mongodb://localhost:27017/keys";

function establishConnection(callback) {
    // TODO: error handling s.t. server doesn't crash..
    client.connect(connURL,
        { useNewUrlParser: true, useUnifiedTopology: true}, 
        (err, db) => {
            if (err) throw err;
            callback(db);
        }
    );
}

function initializeDB() {
    establishConnection(
        (db) => {
            console.log("Connected to database");
            const dbo = db.db("keys");
            dbo.createCollection("userKeys", 
                (err) => {
                    if (err) throw err;
                    console.log("Initialized the userKeys collection");
                }
            );
            db.close();
        }
    );
}


function existsAPIKey(uuid) {
    if (getKeyFromDB(uuid)) {
        return true;
    }
    return false;
}

function getKeyFromDB(apiKey) {
    let keyInfo;

    establishConnection(
        (db) => {
            const keyCollection = db.db("keys").collection("userKeys");
            keyCollection.find({_id : uuid}).toArray(
                (err, items) => {
                    console.log(keyInfo);
                    keyInfo = items[0];
                }
            );
        }
    );
    return keyInfo;
}

// assumes existsAPIKey(apiKey) == true
function enoughCapacity(apiKey, fileSize) {
    const keyInfo = getKeyFromDB(apiKey);
    return keyInfo.capacityLeft - fileSize >= 0;
}

function addFileToKey(apiKey, fileName, fileSize) {
    const keyInfo = getKeyFromDB(apiKey);
    const curFiles = keyInfo.files;
    const newCapacity = keyInfo.capacityLeft - fileSize;
    curFiles.push(fileName);

    establishConnection(
        (db) => {
            const keyCollection = db.db("keys").collection("userKeys");
            keyCollection.update(
                { _id : apiKey },
                { $set : 
                    {
                        files : curFiles,
                        capacityLeft : newCapacity 
                    }
                },
                (err, res) => {
                    if (err) throw err
                }
            )
        }
    );
}

function deleteFile(apiKey, fileName) {

}

module.exports = {
    initialConn : initializeDB,
    dbConn : establishConnection
}
