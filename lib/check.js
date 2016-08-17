'use strict';

var utils = require('./utils');

module.exports = function check(current, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    cb = function() {};
  }

  if (!current.name) {
    cb(null, current);
    return;
  }

  var opts = utils.extend({}, options);
  var store = new utils.Store('get-latest');
  var dates = new utils.Dates('get-latest');

  utils.pkg(current.name, function(err, latest) {
    if (err) return;
    if (opts.cache !== false) {
      dates.set(latest.name);
    }
    store.set(latest.name, latest);
    cb(null, latest);
  });
};
