'use strict';

var utils = require('./utils');

background.ready(function(err, options) {
  if (err) return;
  var opts = utils.extend({}, options);
  var pkg = options.pkg || {};
  if (!pkg.name) return;

  var store = new utils.Store('get-latest');
  var dates = new utils.Dates('get-latest');

  utils.pkg(pkg.name, function(err, data) {
    if (err) return;
    if (options.cache !== false) {
      dates.set(pkg.name);
    }
    store.set(pkg.name, data);
  });
});
