'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('background-process', 'background');
require('data-store', 'Store');
require('date-store', 'Dates');
require('extend-shallow', 'extend');
require('get-pkg', 'pkg');
require('semver');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
