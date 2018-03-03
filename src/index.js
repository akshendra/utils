
const fs = require('fs');
const is = require('is_js');
const moment = require('moment');
const mongoose = require('mongoose');

exports.is = is;
exports.moment = moment;
exports.mongoose = mongoose;

/**
 * ------------------------------------------------------------------------ *
 * ObjectIds
 * ------------------------------------------------------------------------ *
 */

const ObjectId = mongoose.Types.ObjectId;
exports.ObjectId = ObjectId;

// -- check if value is valid ObjectId --
exports.isValidObjectId = (value) => {
  const regex = /[0-9a-f]{24}/;
  const matched = String(value).match(regex);
  if (!matched) {
    return false;
  }

  return mongoose.Types.ObjectId.isValid(value);
};

// -- check if value if valid instance of objectId --
exports.isValidObjectIdInstance = (value) => {
  if (typeof value !== 'object') {
    return false;
  }

  if (value.constructor.name !== 'ObjectID') {
    return false;
  }

  return exports.isValidObjectId(value);
};

// -- covert a sting into ObjectId instance --
exports.castToObjectId = (value) => {
  if (exports.isValidObjectId(value) === false) {
    throw new TypeError(`Value passed is not valid objectId, is [ ${value} ]`);
  }
  return new ObjectId(value);
};


/**
 * ------------------------------------------------------------------------ *
 * Date and Time
 * ------------------------------------------------------------------------ *
 */

// -- is value a valid time string --
exports.isValidTime = (value) => {
  return moment(value).isValid();
};

// -- get ISO string --
exports.getIsoTime = () => {
  return new Date();
};

// -- get epoc time --
exports.getEpocTime = () => {
  return moment().valueOf();
};

// -- convert into date --
exports.castToDate = (value) => {
  if (is.existy(value) === false || exports.isValidTime(value) === false) {
    throw new TypeError(`Valid passed is not valid date is [ ${value} ]`);
  }
  return new Date(value);
};

exports.addSeconds = (time, seconds) => {
  return moment(time).add(Number(seconds), 'seconds').valueOf();
};

exports.addWeeks = (date, week = 1) => {
  return moment(date.valueOf()).add(week, 'weeks').valueOf();
};


/**
 * ------------------------------------------------------------------------ *
 * Objects and arrays
 * ------------------------------------------------------------------------ *
 */

// -- return the values --
exports.values = (obj) => {
  return Object.keys(obj).map(key => {
    return obj[key];
  });
};

// -- map of pair of [key,values] --
exports.pairs = (obj) => {
  return Object.keys(obj).map(key => {
    return [key, obj[key]];
  });
};

// -- covert array into objects based on key --
exports.arrayToObject = (array, key) => {
  return array.reduce((start, item) => {
    return Object.assign({}, start, {
      [item[key]]: item,
    });
  }, {});
};

// -- update an object, immutability --
exports.updateObject = (object, update) => {
  return Object.assign({}, object, update);
};

// -- random item from array --
exports.randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

// -- get the base object --
exports.plain = (obj) => {
  if (is.existy(obj.toObject)) {
    return obj.toObject({
      virtuals: true,
    });
  }
  return obj;
};


/**
 * ------------------------------------------------------------------------ *
 * Parsing things
 * ------------------------------------------------------------------------ *
 */

// -- safely parse json --
exports.safeJSON = (data) => {
  if (is.not.string(data)) {
    return data;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

// -- stringify json but pretty --
exports.prettyJSON = (json) => {
  return JSON.stringify(json, null, 2);
};

// -- parse object values, helpful for redis maps --
exports.parseObject = (obj, except = {}) => {
  const result = {};
  exports.pair(obj).forEach(([key, value]) => {
    try {
      if (except[key] === true) {
        throw new Error(`${key} was not parsed`);
      }
      result[key] = JSON.parse(value);
    } catch (err) {
      result[key] = value;
    }
  });
  return result;
};


/**
 * ------------------------------------------------------------------------ *
 * files and directories
 * ------------------------------------------------------------------------ *
 */

// -- check if directory exists --
exports.doesDirExists = (dpath) => {
  if (is.not.existy(dpath)) {
    return false;
  }

  try {
    return fs.statSync(dpath).isDirectory();
  } catch (err) {
    // Check exception. If ENOENT - no such file or directory ok, file doesn't exist.
    // Otherwise something else went wrong, we don't have rights to access the file, ...
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return false;
  }
};

// -- check if file exists --
exports.doesFileExists = (fpath) => {
  if (is.not.exisyt(fpath)) {
    return false;
  }

  try {
    return fs.statSync(fpath).isFile();
  } catch (err) {
    // Check exception. If ENOENT - no such file or directory ok, file doesn't exist.
    // Otherwise something else went wrong, we don't have rights to access the file, ...
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return false;
  }
};
