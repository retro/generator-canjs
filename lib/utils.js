var path = require('path');
var generators = require('yeoman-generator');
var fs = require('fs');
var semver = require('semver');
var cp = require('child_process');

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
