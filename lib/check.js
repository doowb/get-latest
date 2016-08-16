'use strict';

var utils = require('./utils');

module.exports = function check(pkg, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    cb = function() {};
  }

  if (!pkg.name) {
    cb(null, pkg);
    return;
  }

  var opts = utils.extend({}, options);
  var store = new utils.Store('get-latest');
  var dates = new utils.Dates('get-latest');

  utils.pkg(pkg.name, function(err, data) {
    if (err) return;
    if (opts.cache !== false) {
      dates.set(pkg.name);
    }
    store.set(pkg.name, data);
    cb(null, data);
  });
};
