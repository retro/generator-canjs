var path = require('path');
var generators = require('yeoman-generator');
var fs = require('fs');
var semver = require('semver');
var cp = require('child_process');

var Q = require('q');
var spawn = require('cross-spawn-async');



/* local CLI Part */
exports.addImport = function(filename, module, name) {
  if(fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();
    var statement = 'import \'' + module + '\';';

    if (name) {
      statement = 'import ' + name + ' from \'' + module + '\';';
    }

    if (content.lastIndexOf('\n') !== content.length - 1) {
      statement = '\n' + statement;
    }

    // Also add if it is not already there
    if(content.indexOf(statement) === -1) {
      // Use filesystem directly because Yeoman would ask to overwrite the file
      fs.writeFileSync(filename, content + '\n' + statement);
    }
  }
};

// Gets a package.json or ends the asynchronous operation.
exports.getPkgOrBail = function(env, done){
  var pkgFile = env.destinationPath('package.json');
  var pkg = env.fs.readJSON(pkgFile, false);

  if(pkg === false) {
    var error = new Error('Expected to find a package.json file at ' + pkgFile +
                            ' but did not');
    done(error);
    return false;
  }
  return pkg;
};

exports.npmVersion = function(cb) {
  cp.exec('npm -v', function(err, stdout) {
    cb(err, semver(stdout || ''));
  });
};

exports.templatePath = function(subPath) {
  return function(target) {
    var override = path.join(this.destinationPath(), subPath, target);
    if(fs.existsSync(override)) {
      return override;
    }

    return generators.Base.prototype.templatePath.apply(this, arguments);
  };
};

// turn an map of package to version ranges to an array of the same
exports.toNpmInstallStrings = function(deps){
  return Object.keys(deps).map(function(packageName){
    var versionRange = deps[packageName];

    return packageName + '@' + versionRange;
  });
};



/* Global CLI Part */
// Recursively make a directory
exports.mkdirp = function(folder) {
  if(!folder) {
    return Q(process.cwd());
  }

  var parts = folder.split(path.sep);
  var dfd = Q();
  var current = '';

  parts.forEach(function(part) {
    var myPath = path.join(current, part);

    current = myPath;

    var resolve = function() {
      return myPath;
    };

    dfd = dfd.then(function() {
      return Q.nfcall(fs.mkdir, myPath).then(resolve, resolve);
    });
  });

  return dfd.then(function(myPath) {
    return path.join(process.cwd(), myPath);
  });
};

// Run a command and pipe the output.
// The returned promise will reject if there is a non-zero exist status
exports.spawn = function(cmd, args, options) {
  options = options || {};

  options.stdio = 'inherit';

  if (!options.cwd) {
    options.cwd = process.cwd();
  }

  var child = spawn(cmd, args, options);
  var deferred = Q.defer();

  child.on('exit', function(status) {
    if(status) {
      deferred.reject(new Error('Command `' + cmd +
        '` did not complete successfully'));
    } else {
      deferred.resolve(child);
    }
  });

  return deferred.promise;
};

// Returns the NPM root
exports.projectRoot = function() {
  var root = process.cwd();
  var current = root;

  while(current && !fs.existsSync(path.join(current, 'node_modules')) ) {
    if(current === path.dirname(current)) {
      return Q(root);
    }

    current = path.dirname(current);
  }

  return Q(current || root);
};

// Log error messages and exit application
exports.log = function(promise) {
  return promise
    .then(function() {
      process.exit(0);
    })
    .catch(function(error) {
      console.log();
      console.error(error.stack || error.message || error);
      console.log();

      process.exit(1);
    });
};

var preExp = /-pre|-alpha/;

// Takes an exact version like 0.5.7 and turns into a range like ^0.5.0
exports.versionRange = function(exactVersion) {
  var lastDotPos = exactVersion.lastIndexOf('.');
  var prefix = exactVersion.substr(0, lastDotPos);

  if(preExp.test(prefix)) {
    return '^' + prefix + '.0';
  } else {
    return prefix + '.x';
  }
};
