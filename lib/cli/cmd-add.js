var cmdInit = require('./cmd-init');
var runBinary = require('./run-binary');
var types = ['app', 'plugin', 'generator'];

// `donejs add app [folder]`       => `donejs-cli init [folder]`
// `donejs add plugin [folder]`    => `donejs-cli init [folder] --type=plugin`
// `donejs add generator [name]`   => `donejs-cli init [folder] --type=generator`
// `donejs add <name> [params...]` => `donejs-cli add <name> [params...]`
module.exports = function(type, params, options) {

  // handles commands with the following shape `donejs add <type> [folder]`
  if (types.indexOf(type) !== -1) {
    var folder = params[0];

    if (type !== 'app') {
      options.type = type;
    }

    return cmdInit(folder, options);
  }
  // handles commands with the following shape `donejs add <name> [params...]`
  else {
    var args = ['add', type].concat(params);
    return runBinary(args, options, types);
  }
};




var path = require('path');
var add = require('../utils').add;
var generate = require('./cmd-generate');
var debug = require('debug')('donejs-cli:add');

/* local version
module.exports = function(root, name, params) {
  var generators = require(path.join(root, 'node_modules', 'generator-donejs'));

  if (generators[name]) {
    debug('add called but running generate instead', name, params);
    return generate(root, name, params);
  }

  debug('add', name, params);
  return add(path.join(root, 'node_modules'), name, params);
}
*/
