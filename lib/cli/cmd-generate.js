var path = require('path');
var generate = require('../utils').generate;
var debug = require('debug')('donejs-cli:generate');

module.exports = function(root, type, options) {
  debug('Generating', 'generator-donejs', type, options);

  return generate(
    path.join(root, 'node_modules'),
    'generator-donejs',
    [[type].concat(options)]
  );
};
