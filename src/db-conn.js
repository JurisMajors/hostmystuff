let MongoClient = require('mongodb').MongoClient

let state = {
  db: null,
};

exports.connect = (url, done) => {
  if (state.db) return done();

  MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
      if (err) return done(err);
      state.db = db;
      done();
  });
};

exports.get = function() {
  return state.db;
};

exports.close = function() {
  if (state.db) {
    state.db.close((err) => {
      state.db = null;
      state.mode = null;
      if (err) throw err;
    });
  }
};