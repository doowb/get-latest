'use strict';

var path = require('path');
var utils = require('./lib/utils');

/**
 * Get the latest `package.json` for the specified package.json and given options.
 *
 * This library will use the given package.json to determine if it's the latest one or if there is a newer version.
 * If the given package.json is the latest, then it is returned.
 *
 * ```js
 * var latest = getLatest(require('./package.json'));
 * ```
 * @param  {Object} `pkg` Current package.json to use for checking for the latest.
 * @param  {Object} `options` Additional options to control how the checking is handled.
 * @param  {String} `options.timespan` String used to determine if the background process should be started to npm for the latest version. Defaults to '1 hour ago'.
 * @param  {Boolean} `options.cache` Set to `false` to ensure that the background process is always started.
 * @return {Object} Latest package.json is returned.
 * @api public
 */

module.exports = function getLatest(pkg, options) {
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
    utils.background.start(path.join(__dirname, 'lib/worker.js'), opts);
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
