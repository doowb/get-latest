'use strict';

var get = require('get-pkg');
var background = require('background-process');
var DataStore = require('data-store');
var DateStore = require('date-store');
var extend = require('extend-shallow');

background.ready(function(err, options) {
  if (err) return;
  var opts = extend({}, options);
  var pkg = options.pkg || {};
  if (!pkg.name) return;

  var store = new DataStore('get-latest');
  var dates = new DateStore('get-latest');

  get(pkg.name, function(err, data) {
    if (err) return;
    if (options.cache !== false) {
      dates.set(pkg.name);
    }
    store.set(pkg.name, data);
  });
});
