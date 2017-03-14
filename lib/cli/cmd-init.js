var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var runBinary = require('./run-binary');
var mypkg = require(path.join(__dirname, '..', '..', 'package.json'));

module.exports = function(folder, opts) {
  return utils.mkdirp(folder)
    .then(function(folderPath) {
      var folderModules = path.join(folderPath, 'node_modules');

      // create an empty node_modules inside the target `folder`, this
      // will prevent npm to install the dependencies in any node_modules
      // folder but the one inside `folder`.
      if (!fs.existsSync(folderModules)) {
        fs.mkdirSync(folderModules);
      }

      console.log('Initializing new DoneJS application at', folderPath);
      console.log('Installing donejs-cli');

      return installCli(mypkg.version, { cwd: folderPath })
        .then(function() {
          return runCliInit(folderPath, opts);
        });
    });
};

// install donejs-cli
function installCli(version, options) {
  var pkg = 'donejs-cli@' + utils.versionRange(version);
  var npmArgs = [ 'install', pkg, '--loglevel', 'error' ];
  return utils.spawn('npm', npmArgs, options);
}

// run donejs-cli init
function runCliInit(folderPath, options) {
  var initArgs = ['init'];

  // cd into the newly created folder, this way runBinary
  // gets the root folder correctly.
  process.chdir(folderPath);

  if (options.skipInstall) {
    initArgs.push('--skip-install');
  }

  if (options.type) {
    initArgs.push('--type', options.type);
  }

  options.cwd = folderPath;
  return runBinary(initArgs, options);
}


/* local version

var Q = require('q');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var debug = require('debug')('donejs-cli:init');

var utils = require('../utils');
var generate = utils.generate;
var installIfMissing = utils.installIfMissing;

module.exports = function(root, mypkg, folder, options) {
  debug('Initializing new application', folder);

  if (folder) {
    var appDir = path.join(process.cwd(), folder);

    if (fs.existsSync(appDir)) {
      return Q.reject(new Error('Folder `' + folder + '` already exists.'));
    }

    console.log('Creating folder ' + folder);
    mkdirp.sync(appDir);
    process.chdir(appDir);
  }

  var nodeModules = path.join(process.cwd(), 'node_modules');

  if(!fs.existsSync(nodeModules)) {
    nodeModules = path.join(root, 'node_modules');
  }

  debug('Generating application in folder', process.cwd());

  var type = options.type || 'app';
  var genVersion = mypkg.donejs.dependencies['generator-donejs'];

  return installIfMissing(nodeModules, 'generator-donejs', genVersion)()
    .then(function() {
      return generate(nodeModules, 'generator-donejs', [type, {
        version: mypkg.version,
        packages: mypkg.donejs,
        skipInstall: options.skipInstall
      }]);
    });
};


*/
