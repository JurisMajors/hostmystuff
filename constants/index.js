const path = require('path');

const DAY_IN_MS = 86400000;
module.exports = Object.freeze({
  CLEARING_MAX_AGE: DAY_IN_MS * 7,
  CLEARING_MIN_AGE: DAY_IN_MS,
  CLEARING_FREQUENCY: DAY_IN_MS / 3,
  FILE_DIR: path.join(__dirname, '/files/'),
  ADDRESS: '127.0.0.1', // server address,
  MONGO_URI_LOCAL: 'mongodb://127.0.0.1:27017/keys', // DB connection string
  BYTES_IN_MIB: 1048576,
  MAX_SIZE_IN_MIB: 512,
  CAPACITY: 1073741824 
});
