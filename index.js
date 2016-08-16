'use strict';

var path = require('path');
var utils = require('./lib/utils');

module.exports = function(pkg, options) {
  if (typeof pkg !== 'object') {
    throw TypeError('expected "pkg" to be an object');
  }

  if (!utils.semver.valid(pkg.version)) {
    throw Error(`invalid "pkg.version" (${pkg.version})`);
  }

  var opts = utils.extend({
    timespan: '1 hour ago',
    pkg: pkg
  }, options);

  var store = new utils.Store('get-latest');
  var dates = new utils.Dates('get-latest');
  var latest = store.get(pkg.name) || {};

  if (!cached(dates, pkg, opts)) {
    utils.background.start(path.join(__dirname, 'lib/check.js'), opts);
  }

  if (!utils.semver.valid(latest.version)) {
    return pkg;
  }

  if (utils.semver.lt(pkg.version, latest.version)) {
    return latest;
  }

  return pkg;
};

function cached(store, pkg, options) {
  return store.has(pkg.name)
    && store.lastSaved(pkg.name).lessThan(options.timespan)
    && options.cache !== false;
}
