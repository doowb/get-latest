'use strict';

var path = require('path');
var background = require('background-process');
var DataStore = require('data-store');
var DateStore = require('date-store');
var extend = require('extend-shallow');
var semver = require('semver');

module.exports = function(pkg, options) {
  if (typeof pkg !== 'object') {
    throw TypeError('expected "pkg" to be an object');
  }

  if (!semver.valid(pkg.version)) {
    throw Error(`invalid "pkg.version" (${pkg.version})`);
  }

  var opts = extend({
    timespan: '1 hour ago',
    pkg: pkg
  }, options);
  var store = new DataStore('get-latest');
  var dates = new DateStore('get-latest');
  var latest = store.get(pkg.name) || {};

  if (!cached(dates, pkg, opts)) {
    background.start(path.join(__dirname, 'check.js'), opts);
  }

  if (!semver.valid(latest.version)) {
    return pkg;
  }

  if (semver.lt(pkg.version, latest.version)) {
    return latest;
  }

  return pkg;
};

function cached(store, pkg, options) {
  return store.has(pkg.name)
    && store.lastSaved(pkg.name).lessThan(options.timespan)
    && options.cache !== false;
}
