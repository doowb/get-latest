'use strict';

require('mocha');
var assert = require('assert');
var utils = require('./lib/utils');
var getLatest = require('./');

describe('get-latest', function() {
  it('should export a function', function() {
    assert.equal(typeof getLatest, 'function');
  });

  it('should throw an error when no parameters are passed', function(cb) {
    try {
      getLatest();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected "pkg" to be an object');
      cb();
    }
  });

  it('should throw an error when the package version is invalid', function(cb) {
    try {
      getLatest({});
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'invalid "pkg.version" (undefined)');
      cb();
    }
  });

  it('should return the latest version', function() {
    var pkg = getLatest(require('./package.json'));
    assert(pkg);
  });
});
