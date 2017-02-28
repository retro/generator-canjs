var path = require('path');
var Generator = require('yeoman-generator');
var fs = require('fs');
var semver = require('semver');
var cp = require('child_process');
var isValidElementName = require('is-valid-element-name');

exports.addImport = function(filename, module, name) {
  if(fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();
    var statement = name ?
      'import ' + name + ' from \'' + module + '\';' :
      'import \'' + module + '\';';
    var newContent = '';

    // only add import if it is not already there
    if(content.indexOf(statement) === -1) {
      newContent = content.split('\n');
      debugger;

      for (var i=0; i<newContent.length; i++) {
        // put new import statement before first line that is not
        // an import statement or an empty line
        if (newContent[i].trim().length && !newContent[i].startsWith('import')) {
          break;
        }
      }

      if (newContent.length === 1 && i === 1) {
        // if there was only one line and it was a newline, remove it
        newContent.splice(0, 1, statement, '');
      } else {
        newContent.splice(i, 0, statement, '');
      }

      // Use filesystem directly because Yeoman would ask to overwrite the file
      fs.writeFileSync(filename, newContent.join('\n'));
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

    return Generator.prototype.templatePath.apply(this, arguments);
  };
};

// turn an map of package to version ranges to an array of the same
exports.toNpmInstallStrings = function(deps){
  return Object.keys(deps).map(function(packageName){
    var versionRange = deps[packageName];

    return packageName + "@" + versionRange;
  });
};

// makes sure a value is supplied
exports.validateRequired = function(value) {
  return !!value;
};

exports.removeSlash = function(url) {
  var char = url[url.length - 1];
  if(char === '/') {
    return url.substr(0, url.length - 1);
  }
  return url;
};

exports.validateTagName = function(name) {
  return isValidElementName(name) ? true : name + ' is not a valid tag name (did you include a hyphen?).\n   See https://www.w3.org/TR/custom-elements/#valid-custom-element-name for details.';
};
