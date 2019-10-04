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

function initialzeDB() {
    establishConnection((db) => {
        console.log("Connected to database");
        const dbo = db.db("keys");
        dbo.createCollection("userKeys", function(err) {
            if (err) throw err;
            console.log("Initialized the userKeys collection");
        });
        db.close();
    })
}

function existsAPIKey(uuid) {
    return true;
}

function canUpload(apiKey, fileSize) {
    return true;
}

function addFileToKey(apiKey, fileName) {

}

function deleteFile(apiKey, fileName) {

}

module.exports = {
    initialConn : initialzeDB,
    dbConn : establishConnection
}
