'use strict';
var extend = require('extend-shallow');
var args = require('yargs-parser')(process.argv.slice(2));

// use args to mock a package.json object for another module
var pkg = require('./package.json');
if (args._.length) {
  pkg = extend(pkg, {
    name: args._[0] || pkg.name,
    version: args._[1] || pkg.version
  });
}

var getLatest = require('./');
var latest = getLatest(pkg);
console.log('current', pkg.version);
console.log('latest', latest.version);
