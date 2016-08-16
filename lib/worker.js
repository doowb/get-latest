'use strict';

var utils = require('./utils');
var check = require('./check');

utils.background.ready(function(err, options) {
  if (err) return;
  var opts = utils.extend({}, options);
  var pkg = opts.pkg || {};
  check(pkg, opts);
});
