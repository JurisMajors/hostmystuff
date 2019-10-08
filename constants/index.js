const path = require('path');

const DAY_IN_MS = 86400000;
module.exports = Object.freeze({
  CLEARING_MAX_AGE: DAY_IN_MS * 7, // files stay up to a week
  CLEARING_MIN_AGE: DAY_IN_MS, // files stay at least a day
  CLEARING_FREQUENCY: DAY_IN_MS / 3,
  FILE_DIR: path.join(path.resolve(__dirname,'..'), '/files/'),
  ADDRESS: '127.0.0.1', // server address,
  MONGO_URI_LOCAL: 'mongodb://127.0.0.1:27017/keys', // DB connection string
  BYTES_IN_MIB: 1048576,
  MAX_SIZE_IN_MIB: 512, // 512 mb is max uploadable file size
  CAPACITY: 1073741824 // 1gb capacity per api key
});
